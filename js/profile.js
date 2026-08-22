// ========================================
// PROFILE PAGE - Authentication Check
// Shows data only if logged in, else shows login prompt
// ========================================

let currentUser = null;
let userSubmissions = [];

// DOM elements
const authContent = document.getElementById('authenticated-content');
const unauthContent = document.getElementById('unauthenticated-content');

// Helper: show toast
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'payout-toast';
    const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
    const colors = { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: 'var(--gold-primary)' };
    toast.style.borderLeftColor = colors[type];
    toast.innerHTML = `<div class="payout-toast-icon">${icons[type]}</div><div class="payout-toast-content"><div class="payout-toast-name">${message}</div></div>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Get current user from Supabase (or global helper)
async function getCurrentUserFromSupabase() {
    if (typeof getCurrentUser === 'function') return await getCurrentUser();
    if (typeof supabaseClient !== 'undefined' && supabaseClient.getCurrentUser) return await supabaseClient.getCurrentUser();
    if (typeof supabase !== 'undefined') {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }
    return null;
}

// Fetch user's submissions
async function fetchUserSubmissions(userId) {
    if (typeof supabase !== 'undefined' && supabase) {
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (!error && data) return data;
    }
    // Fallback: check localStorage for offline submissions
    const offline = JSON.parse(localStorage.getItem('offline_submissions') || '[]');
    return offline.filter(sub => sub.user_id === userId);
}

// Render profile with user data
async function renderProfile(user) {
    if (!user) {
        // Not authenticated
        authContent.style.display = 'none';
        unauthContent.style.display = 'block';
        return;
    }

    currentUser = user;
    authContent.style.display = 'block';
    unauthContent.style.display = 'none';

    // Set profile info
    const email = user.email;
    const displayName = email.split('@')[0];
    const initials = displayName.substring(0, 2).toUpperCase();
    document.getElementById('avatar-initials').textContent = initials;
    document.getElementById('profile-name').textContent = displayName;
    document.getElementById('profile-email').textContent = email;
    const memberDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'May 2026';
    document.getElementById('member-since').textContent = memberDate;

    // Fetch submissions
    userSubmissions = await fetchUserSubmissions(user.id);
    updateStatsAndTable();
}

function updateStatsAndTable() {
    const totalParticipations = userSubmissions.length;
    const totalSent = userSubmissions.reduce((sum, sub) => sum + (sub.amount_sent || 0), 0);
    const totalReceived = userSubmissions.reduce((sum, sub) => sum + (sub.amount_to_receive || 0), 0);
    const pendingCount = userSubmissions.filter(sub => sub.status === 'pending').length;

    document.getElementById('total-participations').textContent = totalParticipations;
    document.getElementById('total-sent').textContent = totalSent.toFixed(4);
    document.getElementById('total-received').textContent = totalReceived.toFixed(4);
    document.getElementById('pending-count').textContent = pendingCount;

    // Render table
    const tbody = document.getElementById('submissions-tbody');
    if (!userSubmissions.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">No submissions yet.</td></tr>';
        return;
    }

    tbody.innerHTML = userSubmissions.map(sub => {
        const date = new Date(sub.created_at).toLocaleDateString();
        let statusClass = 'status-pending';
        if (sub.status === 'verified') statusClass = 'status-verified';
        if (sub.status === 'completed') statusClass = 'status-completed';
        const proofLink = sub.proof_image_url ? `<a href="${sub.proof_image_url}" target="_blank" class="proof-link">View</a>` : '—';
        return `
            <tr>
                <td>${date}</td>
                <td>${sub.crypto_type || '—'}</td>
                <td>${sub.amount_sent || 0}</td>
                <td>${sub.amount_to_receive || 0}</td>
                <td><span class="status-badge ${statusClass}">${sub.status || 'pending'}</span></td>
                <td>${proofLink}</td>
            </tr>
        `;
    }).join('');
}

// Logout function
async function handleLogout() {
    if (typeof logout === 'function') {
        await logout();
    } else if (typeof supabase !== 'undefined') {
        await supabase.auth.signOut();
    }
    window.location.href = 'index.html';
}

// Mobile menu and theme setup (shared with other pages)
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    if (!hamburger) return;
    const open = () => {
        mobileMenu.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        mobileMenu.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    hamburger.addEventListener('click', open);
    if (closeMenu) closeMenu.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
    document.querySelectorAll('.mobile-menu-links a').forEach(link => link.addEventListener('click', close));
}

let currentThemeProfile = 'dark';
function setupThemeToggle() {
    const toggleDesktop = document.getElementById('theme-toggle-desktop');
    const toggleMobile = document.getElementById('theme-toggle-mobile');
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.removeAttribute('data-theme');
        currentThemeProfile = 'light';
        updateThemeIconsProfile(false);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        currentThemeProfile = 'dark';
        updateThemeIconsProfile(true);
        if (!saved) localStorage.setItem('theme', 'dark');
    }
    const toggle = () => {
        if (currentThemeProfile === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            currentThemeProfile = 'light';
            localStorage.setItem('theme', 'light');
            updateThemeIconsProfile(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            currentThemeProfile = 'dark';
            localStorage.setItem('theme', 'dark');
            updateThemeIconsProfile(true);
        }
    };
    if (toggleDesktop) toggleDesktop.addEventListener('click', toggle);
    if (toggleMobile) toggleMobile.addEventListener('click', toggle);
}
function updateThemeIconsProfile(isDark) {
    document.querySelectorAll('.theme-toggle i, .theme-toggle-mobile i').forEach(icon => {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// Update auth UI (login button to avatar in navbar)
async function updateNavbarAuth() {
    const user = await getCurrentUserFromSupabase();
    const desktopContainer = document.querySelector('.auth-link-container');
    const mobileContainer = document.querySelector('.mobile-auth-link');
    if (user) {
        const initials = user.email.split('@')[0].substring(0,2).toUpperCase();
        if (desktopContainer) {
            desktopContainer.innerHTML = `<div class="user-avatar"><div class="avatar-initials">${initials}</div><span class="user-name">${user.email.split('@')[0]}</span><i class="fas fa-sign-out-alt logout-icon" id="navbar-logout"></i></div>`;
            const logoutIcon = document.getElementById('navbar-logout');
            if (logoutIcon) logoutIcon.addEventListener('click', handleLogout);
        }
        if (mobileContainer) {
            mobileContainer.innerHTML = `<div style="display:flex; align-items:center; gap:10px; padding:10px 20px;"><div class="avatar-initials" style="width:36px;height:36px;background:var(--gradient-red);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;">${initials}</div><span>${user.email.split('@')[0]}</span><i class="fas fa-sign-out-alt logout-icon" id="navbar-logout-mobile" style="cursor:pointer;"></i></div>`;
            const logoutIcon = document.getElementById('navbar-logout-mobile');
            if (logoutIcon) logoutIcon.addEventListener('click', handleLogout);
        }
    } else {
        if (desktopContainer) desktopContainer.innerHTML = '<a href="login.html" class="auth-btn"><i class="fas fa-sign-in-alt"></i> Login</a>';
        if (mobileContainer) mobileContainer.innerHTML = '<a href="login.html"><i class="fas fa-sign-in-alt"></i> Login</a>';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    setupMobileMenu();
    setupThemeToggle();
    await updateNavbarAuth();

    const user = await getCurrentUserFromSupabase();
    await renderProfile(user);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
});