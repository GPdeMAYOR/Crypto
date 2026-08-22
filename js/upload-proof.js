// ========================================
// UPLOAD PROOF PAGE
// Handles image upload to Supabase, saves submission, redirects to verification
// ========================================

let selectedFile = null;
let cryptoData = null;
let amountSent = null;
let walletAddress = null;

// Load transaction data from sessionStorage
function loadTransactionData() {
    const cryptoId = sessionStorage.getItem('selectedCrypto');
    if (!cryptoId) {
        showToast('Missing crypto data. Redirecting...', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return false;
    }
    cryptoData = CRYPTO_DATA[cryptoId];
    if (!cryptoData) {
        showToast('Invalid crypto data', 'error');
        return false;
    }
    amountSent = parseFloat(sessionStorage.getItem('selectedAmount')) || cryptoData.min;
    walletAddress = sessionStorage.getItem('walletAddress') || cryptoData.address;
    return true;
}

// Render transaction info
function renderTransactionInfo() {
    const container = document.getElementById('transaction-info');
    if (!container) return;
    const receiveAmount = amountSent * 2;
    container.innerHTML = `
        <div class="info-item"><span class="info-label">Cryptocurrency</span><span class="info-value"><i class="${cryptoData.icon}"></i> ${cryptoData.name} (${cryptoData.ticker})</span></div>
        <div class="info-item"><span class="info-label">Amount Sent</span><span class="info-value">${amountSent.toLocaleString()} ${cryptoData.ticker}</span></div>
        <div class="info-item"><span class="info-label">You Will Receive</span><span class="info-value gold">${receiveAmount.toLocaleString()} ${cryptoData.ticker}</span></div>
        <div class="info-item"><span class="info-label">Wallet Address</span><span class="info-value">${cryptoData.addressShort}</span></div>
    `;
    const shortSpan = document.getElementById('wallet-address-short');
    if (shortSpan) shortSpan.textContent = cryptoData.addressShort;
}

// File selection handling
function initFileUpload() {
    const selectBtn = document.getElementById('select-file-btn');
    const fileInput = document.getElementById('proof-image');
    const fileNameSpan = document.getElementById('file-name');
    const uploadArea = document.getElementById('upload-area');
    const previewArea = document.getElementById('preview-area');
    const imagePreview = document.getElementById('image-preview');
    const removeBtn = document.getElementById('remove-file-btn');
    const submitBtn = document.getElementById('submit-proof-btn');

    selectBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            selectedFile = e.target.files[0];
            fileNameSpan.textContent = selectedFile.name;
            // Preview
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                uploadArea.style.display = 'none';
                previewArea.style.display = 'block';
                submitBtn.disabled = false;
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    removeBtn.addEventListener('click', () => {
        selectedFile = null;
        fileInput.value = '';
        fileNameSpan.textContent = 'No file selected';
        uploadArea.style.display = 'block';
        previewArea.style.display = 'none';
        submitBtn.disabled = true;
    });
}

// Upload to Supabase and save submission
async function uploadProof() {
    if (!selectedFile) {
        showToast('Please select a file first', 'warning');
        return;
    }

    const submitBtn = document.getElementById('submit-proof-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    try {
        // 1. Get current user
        let user = null;
        if (typeof getCurrentUser === 'function') user = await getCurrentUser();
        if (!user && typeof supabaseClient !== 'undefined') user = await supabaseClient.getCurrentUser();
        if (!user) {
            showToast('You must be logged in to submit proof', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        // 2. Upload image to Supabase Storage
        let imageUrl = null;
        if (typeof supabase !== 'undefined' && supabase) {
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const { error: uploadError, data } = await supabase.storage
                .from('proof-images')
                .upload(fileName, selectedFile);
            if (uploadError) throw uploadError;
            const { data: publicUrlData } = supabase.storage.from('proof-images').getPublicUrl(fileName);
            imageUrl = publicUrlData.publicUrl;
        } else {
            // Offline demo: simulate URL
            imageUrl = 'https://via.placeholder.com/400?text=Demo+Proof';
            console.warn('Supabase not configured, using placeholder');
        }

        // 3. Save submission to database
        const submissionRecord = {
            user_id: user.id,
            crypto_type: cryptoData.ticker,
            amount_sent: amountSent,
            amount_to_receive: amountSent * 2,
            status: 'pending',
            proof_image_url: imageUrl,
            created_at: new Date().toISOString()
        };

        let saved = false;
        if (typeof supabase !== 'undefined' && supabase) {
            const { error: insertError } = await supabase
                .from('submissions')
                .insert(submissionRecord);
            if (insertError) throw insertError;
            saved = true;
        } else {
            // Store in localStorage for demo
            let offlineSubmissions = JSON.parse(localStorage.getItem('offline_submissions') || '[]');
            submissionRecord.id = Date.now();
            offlineSubmissions.push(submissionRecord);
            localStorage.setItem('offline_submissions', JSON.stringify(offlineSubmissions));
            saved = true;
        }

        if (saved) {
            // Store in sessionStorage for next page (verification)
            sessionStorage.setItem('submission_status', 'pending');
            sessionStorage.setItem('submission_amount', amountSent);
            sessionStorage.setItem('submission_crypto', cryptoData.ticker);
            sessionStorage.setItem('submission_receive', amountSent * 2);
            showToast('Proof uploaded! Redirecting to verification...', 'success');
            setTimeout(() => {
                window.location.href = 'verification.html';
            }, 1500);
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Upload failed. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload & Verify';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Upload proof page initializing...');
    if (!loadTransactionData()) return;
    renderTransactionInfo();
    initFileUpload();

    const submitBtn = document.getElementById('submit-proof-btn');
    if (submitBtn) submitBtn.addEventListener('click', uploadProof);

    // Setup mobile menu & theme (reuse functions from global or define)
    setupMobileMenu();
    setupThemeToggle();
    if (typeof updateAuthUI === 'function') await updateAuthUI();
    else if (typeof supabaseClient !== 'undefined' && supabaseClient.updateAuthUI) await supabaseClient.updateAuthUI();
});

// Mobile menu and theme functions (copied from landing.js to ensure self-contained)
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

let currentThemeUpload = 'dark';
function setupThemeToggle() {
    const toggleDesktop = document.getElementById('theme-toggle-desktop');
    const toggleMobile = document.getElementById('theme-toggle-mobile');
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.removeAttribute('data-theme');
        currentThemeUpload = 'light';
        updateThemeIconsUpload(false);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        currentThemeUpload = 'dark';
        updateThemeIconsUpload(true);
        if (!saved) localStorage.setItem('theme', 'dark');
    }
    const toggle = () => {
        if (currentThemeUpload === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            currentThemeUpload = 'light';
            localStorage.setItem('theme', 'light');
            updateThemeIconsUpload(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            currentThemeUpload = 'dark';
            localStorage.setItem('theme', 'dark');
            updateThemeIconsUpload(true);
        }
    };
    if (toggleDesktop) toggleDesktop.addEventListener('click', toggle);
    if (toggleMobile) toggleMobile.addEventListener('click', toggle);
}
function updateThemeIconsUpload(isDark) {
    document.querySelectorAll('.theme-toggle i, .theme-toggle-mobile i').forEach(icon => {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
}
function showToast(message, type) {
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