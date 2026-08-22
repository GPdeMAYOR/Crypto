// ========================================
// SUPABASE CLIENT - COMPLETE
// Authentication, Database, Storage
// ========================================

// ========================================
// SUPABASE CONFIGURATION
// REPLACE WITH YOUR ACTUAL SUPABASE CREDENTIALS
// ========================================
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

// Initialize Supabase client
let supabase = null;

// Initialize Supabase only if credentials are set
if (SUPABASE_URL !== 'https://YOUR_PROJECT.supabase.co' && SUPABASE_ANON_KEY !== 'YOUR_ANON_KEY') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase initialized');
} else {
    console.warn('Supabase credentials not configured. Using demo mode.');
    // Create a mock supabase for demo when credentials not set
    supabase = {
        auth: {
            getUser: async () => ({ data: { user: null }, error: null }),
            signOut: async () => ({ error: null })
        },
        from: () => ({
            select: () => ({
                order: () => ({
                    limit: async () => ({ data: [], error: null })
                }),
                single: async () => ({ data: null, error: null })
            }),
            insert: async () => ({ error: null }),
            upsert: async () => ({ error: null })
        })
    };
}

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

// Get current logged in user
async function getCurrentUser() {
    if (!supabase) return null;
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return null;
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

// Check if user is logged in
async function isUserLoggedIn() {
    const user = await getCurrentUser();
    return user !== null;
}

// Login with email and password
async function loginWithEmail(email, password) {
    if (!supabase) return { success: false, error: 'Supabase not configured' };
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) throw error;
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

// Register with email and password
async function registerWithEmail(email, password, fullName = '') {
    if (!supabase) return { success: false, error: 'Supabase not configured' };
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    email: email
                }
            }
        });
        if (error) throw error;
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
    }
}

// Login with Google
async function loginWithGoogle() {
    if (!supabase) return { success: false, error: 'Supabase not configured' };
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/dashboard.html'
            }
        });
        if (error) throw error;
        return { success: true, url: data.url };
    } catch (error) {
        console.error('Google login error:', error);
        return { success: false, error: error.message };
    }
}

// Logout
async function logout() {
    if (!supabase) return { success: false };
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = 'index.html';
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}

// Reset password
async function resetPassword(email) {
    if (!supabase) return { success: false, error: 'Supabase not configured' };
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html'
        });
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
    }
}

// Update user profile
async function updateUserProfile(updates) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Not logged in' };
    if (!supabase) return { success: false, error: 'Supabase not configured' };
    
    try {
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                email: user.email,
                ...updates,
                updated_at: new Date().toISOString()
            });
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, error: error.message };
    }
}

// ========================================
// DATABASE FUNCTIONS
// ========================================

// Save a new submission (payment proof)
async function saveSubmission(submissionData) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Not logged in' };
    if (!supabase) return { success: false, error: 'Supabase not configured' };
    
    try {
        const { data, error } = await supabase
            .from('submissions')
            .insert({
                user_id: user.id,
                crypto_type: submissionData.cryptoType,
                amount_sent: submissionData.amountSent,
                amount_to_receive: submissionData.amountSent * 2,
                status: 'pending',
                proof_image_url: submissionData.proofImageUrl,
                transaction_hash: submissionData.transactionHash || null,
                created_at: new Date().toISOString()
            })
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Save submission error:', error);
        return { success: false, error: error.message };
    }
}

// Get user's submissions
async function getUserSubmissions() {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Not logged in', data: [] };
    if (!supabase) return { success: false, error: 'Supabase not configured', data: [] };
    
    try {
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Get submissions error:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Get all submissions (admin only)
async function getAllSubmissions() {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Not logged in', data: [] };
    if (!supabase) return { success: false, error: 'Supabase not configured', data: [] };
    
    try {
        const { data, error } = await supabase
            .from('submissions')
            .select('*, profiles(email)')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Get all submissions error:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Update submission status (admin only)
async function updateSubmissionStatus(submissionId, status) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Not logged in' };
    if (!supabase) return { success: false, error: 'Supabase not configured' };
    
    try {
        const { error } = await supabase
            .from('submissions')
            .update({ 
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', submissionId);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Update submission error:', error);
        return { success: false, error: error.message };
    }
}

// Add participant (for live counter)
async function addParticipant() {
    const user = await getCurrentUser();
    if (!user) return { success: false };
    if (!supabase) return { success: false };
    
    try {
        const { error } = await supabase
            .from('participants')
            .upsert({ user_id: user.id, joined_at: new Date().toISOString() });
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Add participant error:', error);
        return { success: false };
    }
}

// Get participant count
async function getParticipantCount() {
    if (!supabase) return 12881;
    try {
        const { count, error } = await supabase
            .from('participants')
            .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        return 12881 + (count || 0);
    } catch (error) {
        console.error('Get participant count error:', error);
        return 12881;
    }
}

// ========================================
// STORAGE FUNCTIONS
// ========================================

// Upload payment proof image
async function uploadProofImage(file, userId) {
    if (!supabase) return { success: false, error: 'Supabase not configured', url: null };
    if (!file) return { success: false, error: 'No file provided', url: null };
    
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        const filePath = `proof-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
            .from('proof-images')
            .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
            .from('proof-images')
            .getPublicUrl(filePath);
        
        return { success: true, url: publicUrl };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message, url: null };
    }
}

// ========================================
// UI UPDATE FUNCTIONS
// ========================================

// Update navigation bar with user avatar
async function updateAuthUI() {
    const user = await getCurrentUser();
    const desktopAuthContainer = document.querySelector('.auth-link-container');
    const mobileAuthLink = document.querySelector('.mobile-auth-link');
    
    if (user) {
        const email = user.email;
        const displayName = email ? email.split('@')[0] : 'User';
        const initials = displayName.substring(0, 2).toUpperCase();
        
        if (desktopAuthContainer) {
            desktopAuthContainer.innerHTML = `
                <div class="user-avatar" id="user-avatar-desktop">
                    <div class="avatar-initials">${initials}</div>
                    <span class="user-name">${displayName}</span>
                    <i class="fas fa-sign-out-alt logout-icon" id="logout-desktop"></i>
                </div>
            `;
            const logoutBtn = document.getElementById('logout-desktop');
            if (logoutBtn) logoutBtn.addEventListener('click', () => logout());
        }
        
        if (mobileAuthLink) {
            mobileAuthLink.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px 20px;">
                    <div class="avatar-initials" style="width: 36px; height: 36px; background: var(--gradient-red); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">${initials}</div>
                    <span class="user-name">${displayName}</span>
                    <i class="fas fa-sign-out-alt logout-icon" id="logout-mobile" style="color: var(--red-primary); cursor: pointer;"></i>
                </div>
            `;
            const logoutBtn = document.getElementById('logout-mobile');
            if (logoutBtn) logoutBtn.addEventListener('click', () => logout());
        }
    } else {
        if (desktopAuthContainer) {
            desktopAuthContainer.innerHTML = '<a href="login.html" class="auth-btn"><i class="fas fa-sign-in-alt"></i> Login</a>';
        }
        if (mobileAuthLink) {
            mobileAuthLink.innerHTML = '<a href="login.html"><i class="fas fa-sign-in-alt"></i> Login</a>';
        }
    }
}

// ========================================
// EXPORT FUNCTIONS TO GLOBAL SCOPE
// ========================================
window.supabaseClient = {
    supabase,
    getCurrentUser,
    isUserLoggedIn,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    saveSubmission,
    getUserSubmissions,
    getAllSubmissions,
    updateSubmissionStatus,
    addParticipant,
    getParticipantCount,
    uploadProofImage,
    updateAuthUI
};

// Auto-update auth UI when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});