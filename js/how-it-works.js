// ========================================
// HOW IT WORKS PAGE JAVASCRIPT
// Shares theme with landing page
// ========================================

// ========================================
// MOBILE MENU (SAME AS LANDING PAGE)
// ========================================
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (!hamburger) {
        console.error('Hamburger button not found!');
        return;
    }
    if (!mobileMenu) {
        console.error('Mobile menu not found!');
        return;
    }
    
    const openMenu = () => {
        mobileMenu.classList.add('open');
        if (menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeMenuFunc = () => {
        mobileMenu.classList.remove('open');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    hamburger.addEventListener('click', openMenu);
    if (closeMenu) closeMenu.addEventListener('click', closeMenuFunc);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenuFunc);
    
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenuFunc);
    });
}

// ========================================
// THEME TOGGLE (SHARED WITH LANDING PAGE)
// ========================================
let currentTheme = 'dark';

function setupThemeToggle() {
    const toggleDesktop = document.getElementById('theme-toggle-desktop');
    const toggleMobile = document.getElementById('theme-toggle-mobile');
    
    // Check for saved theme (sync with landing page)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        currentTheme = 'light';
        updateThemeIcons(false);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        currentTheme = 'dark';
        updateThemeIcons(true);
        if (!savedTheme) localStorage.setItem('theme', 'dark');
    }
    
    const toggleTheme = () => {
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            currentTheme = 'light';
            localStorage.setItem('theme', 'light');
            updateThemeIcons(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            currentTheme = 'dark';
            localStorage.setItem('theme', 'dark');
            updateThemeIcons(true);
        }
    };
    
    if (toggleDesktop) toggleDesktop.addEventListener('click', toggleTheme);
    if (toggleMobile) toggleMobile.addEventListener('click', toggleTheme);
}

function updateThemeIcons(isDark) {
    const moonIcons = document.querySelectorAll('.theme-toggle i, .theme-toggle-mobile i');
    moonIcons.forEach(icon => {
        if (isDark) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

// ========================================
// COPY ADDRESS FUNCTIONALITY
// ========================================
function initCopyAddresses() {
    const copyButtons = document.querySelectorAll('.copy-address');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const address = button.dataset.address;
            if (address) {
                try {
                    await navigator.clipboard.writeText(address);
                    
                    // Save original icon
                    const originalIcon = button.innerHTML;
                    
                    // Change to checkmark
                    button.innerHTML = '<i class="fas fa-check" style="color: #10b981;"></i>';
                    showToast('Address copied to clipboard!', 'success');
                    
                    // Revert after 2 seconds
                    setTimeout(() => {
                        button.innerHTML = originalIcon;
                    }, 2000);
                } catch (err) {
                    showToast('Failed to copy address', 'error');
                }
            }
        });
    });
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================
function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = 'payout-toast';
    
    let icon = '🔔';
    let borderColor = 'var(--gold-primary)';
    
    switch(type) {
        case 'success':
            icon = '✅';
            borderColor = '#10b981';
            break;
        case 'warning':
            icon = '⚠️';
            borderColor = '#f59e0b';
            break;
        case 'error':
            icon = '❌';
            borderColor = '#ef4444';
            break;
        default:
            icon = 'ℹ️';
            borderColor = 'var(--gold-primary)';
    }
    
    toast.style.borderLeftColor = borderColor;
    toast.innerHTML = `
        <div class="payout-toast-icon">${icon}</div>
        <div class="payout-toast-content">
            <div class="payout-toast-name">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// UPDATE AUTH UI (Login Button to Avatar)
// ========================================
async function updateHowItWorksAuthUI() {
    if (typeof getCurrentUser !== 'function') return;
    
    const user = await getCurrentUser();
    const desktopAuthContainer = document.querySelector('.auth-link-container');
    const mobileAuthLink = document.querySelector('.mobile-auth-link');
    
    if (user) {
        const email = user.email;
        const displayName = email.split('@')[0];
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
            if (logoutBtn && typeof logout === 'function') {
                logoutBtn.addEventListener('click', logout);
            }
        }
        
        if (mobileAuthLink) {
            mobileAuthLink.innerHTML = `
                <div class="user-avatar-mobile" style="display: flex; align-items: center; gap: 10px; padding: 10px 20px;">
                    <div class="avatar-initials" style="width: 36px; height: 36px; background: var(--gradient-red); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">${initials}</div>
                    <span class="user-name">${displayName}</span>
                    <i class="fas fa-sign-out-alt logout-icon" id="logout-mobile" style="color: var(--red-primary); cursor: pointer;"></i>
                </div>
            `;
            const logoutBtn = document.getElementById('logout-mobile');
            if (logoutBtn && typeof logout === 'function') {
                logoutBtn.addEventListener('click', logout);
            }
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
// INITIALIZE EVERYTHING
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('How It Works page initializing...');
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup theme toggle (syncs with landing page)
    setupThemeToggle();
    
    // Setup copy address buttons
    initCopyAddresses();
    
    // Update auth UI
    await updateHowItWorksAuthUI();
    
    console.log('How It Works page initialized');
});