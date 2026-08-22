// ========================================
// LIVE PAYOUT NOTIFICATIONS
// Trump Meme Giveaway - Real-time Payout Feed
// Shows random payouts every X seconds from top-left
// No duplicate names in recent notifications (last 15)
// ========================================

// ========================================
// 50+ UNIQUE USERS WITH NAMES, COUNTRIES, AND FLAGS
// ========================================

const payoutUsers = [
    { name: "Musa D.", country: "Tanzania", flag: "🇹🇿", fullName: "Musa D." },
    { name: "Erik L.", country: "Sweden", flag: "🇸🇪", fullName: "Erik L." },
    { name: "Anya M.", country: "Russia", flag: "🇷🇺", fullName: "Anya M." },
    { name: "Omar A.", country: "Saudi Arabia", flag: "🇸🇦", fullName: "Omar A." },
    { name: "John S.", country: "United States", flag: "🇺🇸", fullName: "John S." },
    { name: "Sarah K.", country: "United Kingdom", flag: "🇬🇧", fullName: "Sarah K." },
    { name: "Carlos R.", country: "Mexico", flag: "🇲🇽", fullName: "Carlos R." },
    { name: "Wei L.", country: "China", flag: "🇨🇳", fullName: "Wei L." },
    { name: "Yuki T.", country: "Japan", flag: "🇯🇵", fullName: "Yuki T." },
    { name: "Pierre D.", country: "France", flag: "🇫🇷", fullName: "Pierre D." },
    { name: "Hans S.", country: "Germany", flag: "🇩🇪", fullName: "Hans S." },
    { name: "Marco B.", country: "Italy", flag: "🇮🇹", fullName: "Marco B." },
    { name: "Liam O.", country: "Ireland", flag: "🇮🇪", fullName: "Liam O." },
    { name: "David C.", country: "Australia", flag: "🇦🇺", fullName: "David C." },
    { name: "Sophia M.", country: "Greece", flag: "🇬🇷", fullName: "Sophia M." },
    { name: "Lucas N.", country: "Netherlands", flag: "🇳🇱", fullName: "Lucas N." },
    { name: "Emma V.", country: "Belgium", flag: "🇧🇪", fullName: "Emma V." },
    { name: "Oliver P.", country: "Portugal", flag: "🇵🇹", fullName: "Oliver P." },
    { name: "Isabella S.", country: "Spain", flag: "🇪🇸", fullName: "Isabella S." },
    { name: "Elias N.", country: "Norway", flag: "🇳🇴", fullName: "Elias N." },
    { name: "Mia J.", country: "Denmark", flag: "🇩🇰", fullName: "Mia J." },
    { name: "Noah K.", country: "Finland", flag: "🇫🇮", fullName: "Noah K." },
    { name: "Liam H.", country: "Canada", flag: "🇨🇦", fullName: "Liam H." },
    { name: "Olivia W.", country: "New Zealand", flag: "🇳🇿", fullName: "Olivia W." },
    { name: "James B.", country: "South Africa", flag: "🇿🇦", fullName: "James B." },
    { name: "Amara O.", country: "Nigeria", flag: "🇳🇬", fullName: "Amara O." },
    { name: "Raj P.", country: "India", flag: "🇮🇳", fullName: "Raj P." },
    { name: "Kim S.", country: "South Korea", flag: "🇰🇷", fullName: "Kim S." },
    { name: "Ahmad R.", country: "UAE", flag: "🇦🇪", fullName: "Ahmad R." },
    { name: "Fatima Z.", country: "Morocco", flag: "🇲🇦", fullName: "Fatima Z." },
    { name: "Ivan K.", country: "Ukraine", flag: "🇺🇦", fullName: "Ivan K." },
    { name: "Anna W.", country: "Poland", flag: "🇵🇱", fullName: "Anna W." },
    { name: "Tom B.", country: "Brazil", flag: "🇧🇷", fullName: "Tom B." },
    { name: "Luis M.", country: "Argentina", flag: "🇦🇷", fullName: "Luis M." },
    { name: "Sofia G.", country: "Chile", flag: "🇨🇱", fullName: "Sofia G." },
    { name: "Mateo R.", country: "Colombia", flag: "🇨🇴", fullName: "Mateo R." },
    { name: "Valentina T.", country: "Peru", flag: "🇵🇪", fullName: "Valentina T." },
    { name: "Diego L.", country: "Ecuador", flag: "🇪🇨", fullName: "Diego L." },
    { name: "Camila P.", country: "Venezuela", flag: "🇻🇪", fullName: "Camila P." },
    { name: "Alexander G.", country: "Costa Rica", flag: "🇨🇷", fullName: "Alexander G." },
    { name: "Natalia F.", country: "Panama", flag: "🇵🇦", fullName: "Natalia F." },
    { name: "Andres S.", country: "Uruguay", flag: "🇺🇾", fullName: "Andres S." },
    { name: "Daniela H.", country: "Paraguay", flag: "🇵🇾", fullName: "Daniela H." },
    { name: "Sebastian M.", country: "Bolivia", flag: "🇧🇴", fullName: "Sebastian M." },
    { name: "Gabriela C.", country: "El Salvador", flag: "🇸🇻", fullName: "Gabriela C." },
    { name: "Martin L.", country: "Guatemala", flag: "🇬🇹", fullName: "Martin L." },
    { name: "Fernanda R.", country: "Honduras", flag: "🇭🇳", fullName: "Fernanda R." },
    { name: "Jorge V.", country: "Nicaragua", flag: "🇳🇮", fullName: "Jorge V." },
    { name: "Laura M.", country: "Cuba", flag: "🇨🇺", fullName: "Laura M." },
    { name: "Rafael D.", country: "Dominican Republic", flag: "🇩🇴", fullName: "Rafael D." },
    { name: "Carmen T.", country: "Puerto Rico", flag: "🇵🇷", fullName: "Carmen T." },
    { name: "Ahmed B.", country: "Egypt", flag: "🇪🇬", fullName: "Ahmed B." },
    { name: "Hassan K.", country: "Jordan", flag: "🇯🇴", fullName: "Hassan K." },
    { name: "Layla M.", country: "Lebanon", flag: "🇱🇧", fullName: "Layla M." },
    { name: "Omar F.", country: "Palestine", flag: "🇵🇸", fullName: "Omar F." },
    { name: "Zainab A.", country: "Bahrain", flag: "🇧🇭", fullName: "Zainab A." },
    { name: "Khalid S.", country: "Kuwait", flag: "🇰🇼", fullName: "Khalid S." },
    { name: "Noor A.", country: "Qatar", flag: "🇶🇦", fullName: "Noor A." },
    { name: "Faisal R.", country: "Oman", flag: "🇴🇲", fullName: "Faisal R." },
    { name: "Ibrahim M.", country: "Turkey", flag: "🇹🇷", fullName: "Ibrahim M." },
    { name: "Mohamed A.", country: "Algeria", flag: "🇩🇿", fullName: "Mohamed A." },
    { name: "Youssef B.", country: "Tunisia", flag: "🇹🇳", fullName: "Youssef B." },
    { name: "Nadia S.", country: "Libya", flag: "🇱🇾", fullName: "Nadia S." },
    { name: "Hussein A.", country: "Iraq", flag: "🇮🇶", fullName: "Hussein A." },
    { name: "Ali R.", country: "Iran", flag: "🇮🇷", fullName: "Ali R." },
    { name: "Viktor P.", country: "Belarus", flag: "🇧🇾", fullName: "Viktor P." },
    { name: "Olga S.", country: "Kazakhstan", flag: "🇰🇿", fullName: "Olga S." },
    { name: "Dmitry K.", country: "Uzbekistan", flag: "🇺🇿", fullName: "Dmitry K." },
    { name: "Elena V.", country: "Romania", flag: "🇷🇴", fullName: "Elena V." },
    { name: "George T.", country: "Bulgaria", flag: "🇧🇬", fullName: "George T." },
    { name: "Maria L.", country: "Serbia", flag: "🇷🇸", fullName: "Maria L." },
    { name: "Jan K.", country: "Czech Republic", flag: "🇨🇿", fullName: "Jan K." },
    { name: "Peter N.", country: "Slovakia", flag: "🇸🇰", fullName: "Peter N." },
    { name: "Andras S.", country: "Hungary", flag: "🇭🇺", fullName: "Andras S." }
];

// ========================================
// CRYPTO PAYOUT OPTIONS WITH REALISTIC AMOUNTS
// ========================================

const cryptoOptions = [
    { 
        type: "BTC", 
        icon: "₿",
        iconClass: "fab fa-bitcoin",
        iconColor: "#f7931a",
        amounts: ["0.1", "0.25", "0.5", "1", "1.5", "2", "2.5", "3", "5", "10"],
        usdValue: (a) => `$${Math.round(parseFloat(a) * 50000).toLocaleString()}`
    },
    { 
        type: "ETH", 
        icon: "Ξ",
        iconClass: "fab fa-ethereum",
        iconColor: "#627eea",
        amounts: ["1", "2", "5", "10", "15", "20", "25", "30", "50", "100"],
        usdValue: (a) => `$${Math.round(parseFloat(a) * 2000).toLocaleString()}`
    },
    { 
        type: "SOL", 
        icon: "◎",
        iconClass: "fas fa-bolt",
        iconColor: "#00ffbd",
        amounts: ["10", "25", "50", "75", "100", "150", "200", "300", "500", "800", "1000", "2500", "5000"],
        usdValue: (a) => `$${Math.round(parseFloat(a) * 15).toLocaleString()}`
    },
    { 
        type: "TRUMP", 
        icon: "₮",
        iconClass: "fas fa-crown",
        iconColor: "#fbbf24",
        amounts: ["1000", "2500", "5000", "7500", "10000", "15000", "20000", "25000", "50000", "100000", "250000", "500000"],
        usdValue: (a) => `$${Math.round(parseFloat(a) * 0.1).toLocaleString()}`
    },
    { 
        type: "USDT", 
        icon: "₮",
        iconClass: "fas fa-dollar-sign",
        iconColor: "#26a17b",
        amounts: ["100", "250", "500", "750", "1000", "1500", "2000", "2500", "5000", "10000", "25000", "50000"],
        usdValue: (a) => `$${parseFloat(a).toLocaleString()}`
    }
];

// ========================================
// TRACKING FOR NO DUPLICATE NAMES
// ========================================

let recentUserHistory = [];      // Track last 20 users to avoid duplicates
let maxHistorySize = 20;          // Maximum history size

// ========================================
// TOAST CONTAINER
// ========================================

let toastContainer = null;

function getToastContainer() {
    if (!toastContainer) {
        toastContainer = document.getElementById('toast-container');
        // Create if doesn't exist
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }
    }
    return toastContainer;
}

// ========================================
// GENERATE RANDOM PAYOUT
// ========================================

function getRandomPayout() {
    // Get available users (not in recent history)
    let availableUsers = payoutUsers.filter(user => !recentUserHistory.includes(user.name));
    
    // If no available users, reset history (keep last 5 to avoid immediate repeats)
    if (availableUsers.length === 0) {
        const keepLast = recentUserHistory.slice(-5);
        recentUserHistory = [...keepLast];
        availableUsers = payoutUsers.filter(user => !recentUserHistory.includes(user.name));
        
        // If still empty, reset completely
        if (availableUsers.length === 0) {
            recentUserHistory = [];
            availableUsers = payoutUsers;
        }
    }
    
    // Pick random user
    const randomIndex = Math.floor(Math.random() * availableUsers.length);
    const randomUser = { ...availableUsers[randomIndex] };
    
    // Add to history
    recentUserHistory.push(randomUser.name);
    
    // Keep history within limit
    if (recentUserHistory.length > maxHistorySize) {
        recentUserHistory.shift();
    }
    
    // Pick random crypto with weighted probability (BTC less frequent, TRUMP more frequent)
    const randomValue = Math.random();
    let crypto;
    if (randomValue < 0.35) {
        crypto = cryptoOptions[2]; // SOL - 35%
    } else if (randomValue < 0.55) {
        crypto = cryptoOptions[3]; // TRUMP - 20%
    } else if (randomValue < 0.70) {
        crypto = cryptoOptions[4]; // USDT - 15%
    } else if (randomValue < 0.85) {
        crypto = cryptoOptions[1]; // ETH - 15%
    } else {
        crypto = cryptoOptions[0]; // BTC - 15%
    }
    
    // Pick random amount from crypto options
    const amount = crypto.amounts[Math.floor(Math.random() * crypto.amounts.length)];
    const usdValue = crypto.usdValue(amount);
    
    // Random action verbs
    const actions = [
        "just claimed", 
        "just received", 
        "just got", 
        "just won", 
        "just withdrew",
        "just cashed out",
        "just earned"
    ];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    // Random timestamp (just now or X seconds ago)
    const secondsAgo = Math.floor(Math.random() * 60);
    const timeText = secondsAgo < 5 ? "Just now" : `${secondsAgo} seconds ago`;
    
    return {
        name: randomUser.name,
        country: randomUser.country,
        flag: randomUser.flag,
        action: action,
        amount: `${amount} ${crypto.type}`,
        amountValue: parseFloat(amount),
        cryptoType: crypto.type,
        usdValue: usdValue,
        iconClass: crypto.iconClass,
        iconColor: crypto.iconColor,
        timeText: timeText,
        timestamp: new Date()
    };
}

// ========================================
// CREATE AND SHOW TOAST NOTIFICATION
// ========================================

function createPayoutToast(payout) {
    const container = getToastContainer();
    
    const toast = document.createElement('div');
    toast.className = 'payout-toast';
    
    // Get icon HTML based on crypto type
    let iconHtml = '';
    switch(payout.cryptoType) {
        case 'BTC':
            iconHtml = '<i class="fab fa-bitcoin" style="color: #f7931a; font-size: 1.5rem;"></i>';
            break;
        case 'ETH':
            iconHtml = '<i class="fab fa-ethereum" style="color: #627eea; font-size: 1.5rem;"></i>';
            break;
        case 'SOL':
            iconHtml = '<i class="fas fa-bolt" style="color: #00ffbd; font-size: 1.5rem;"></i>';
            break;
        case 'TRUMP':
            iconHtml = '<i class="fas fa-crown" style="color: #fbbf24; font-size: 1.5rem;"></i>';
            break;
        default:
            iconHtml = '<i class="fas fa-dollar-sign" style="color: #26a17b; font-size: 1.5rem;"></i>';
    }
    
    toast.innerHTML = `
        <div class="payout-toast-icon">${iconHtml}</div>
        <div class="payout-toast-content">
            <div class="payout-toast-name">
                <strong>${payout.name}</strong> ${payout.flag}
                <span style="color: var(--gold-primary);">${payout.action}</span>
            </div>
            <div class="payout-toast-amount">
                ${payout.amount} <span style="color: var(--text-muted);">(${payout.usdValue})</span>
                <span style="color: #10b981; margin-left: 4px;">✓</span>
            </div>
            <div class="payout-toast-time">
                <i class="far fa-clock" style="font-size: 0.65rem;"></i> ${payout.timeText}
            </div>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove after 5 seconds with fade out animation
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 4700);
}

// ========================================
// SAVE PAYOUT TO SUPABASE (for persistence)
// ========================================

async function savePayoutToDatabase(payout) {
    try {
        // Only save if Supabase is configured
        if (typeof supabase !== 'undefined' && supabase) {
            const { error } = await supabase
                .from('payouts_feed')
                .insert({
                    user_name: payout.name,
                    country: payout.country,
                    flag: payout.flag,
                    crypto_type: payout.cryptoType,
                    amount: payout.amount,
                    usd_value: payout.usdValue,
                    created_at: payout.timestamp.toISOString()
                });
            
            if (error) console.error('Error saving payout:', error);
        }
    } catch (error) {
        // Silently fail - payouts still work without database
        console.log('Payout feed saving disabled (Supabase not configured)');
    }
}

// ========================================
// SHOW SINGLE PAYOUT (manual trigger)
// ========================================

function showRandomPayout() {
    const payout = getRandomPayout();
    createPayoutToast(payout);
    savePayoutToDatabase(payout);
    return payout;
}

// ========================================
// START AUTOMATIC PAYOUT FEED
// ========================================

let payoutInterval = null;
let isRunning = false;
let currentIntervalSeconds = 8; // Default 8 seconds

function startLivePayouts(intervalSeconds = 8) {
    // Stop existing interval if running
    if (payoutInterval) {
        clearInterval(payoutInterval);
        payoutInterval = null;
    }
    
    currentIntervalSeconds = intervalSeconds;
    isRunning = true;
    
    // Show first payout immediately
    setTimeout(() => {
        if (isRunning) {
            showRandomPayout();
        }
    }, 500);
    
    // Set up interval for subsequent payouts
    payoutInterval = setInterval(() => {
        if (isRunning) {
            showRandomPayout();
        }
    }, intervalSeconds * 1000);
    
    console.log(`Live payouts started - showing every ${intervalSeconds} seconds`);
}

function stopLivePayouts() {
    if (payoutInterval) {
        clearInterval(payoutInterval);
        payoutInterval = null;
    }
    isRunning = false;
    console.log('Live payouts stopped');
}

function setPayoutInterval(seconds) {
    if (isRunning) {
        startLivePayouts(seconds);
    }
    currentIntervalSeconds = seconds;
}

// ========================================
// BULK SHOW (for testing/demo)
// ========================================

function showMultiplePayouts(count = 5) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            showRandomPayout();
        }, i * 600);
    }
}

// ========================================
// GET STATS
// ========================================

function getPayoutStats() {
    return {
        totalUsers: payoutUsers.length,
        recentHistorySize: recentUserHistory.length,
        recentHistory: [...recentUserHistory],
        isRunning: isRunning,
        intervalSeconds: currentIntervalSeconds
    };
}

function resetUserHistory() {
    recentUserHistory = [];
    console.log('User history reset');
}

// ========================================
// AUTO-START ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Start payouts after a short delay
    setTimeout(() => {
        startLivePayouts(8); // Show every 8 seconds
    }, 1000);
});

// ========================================
// EXPORT FOR USE IN OTHER PAGES
// ========================================

window.payoutSystem = {
    startLivePayouts,
    stopLivePayouts,
    setPayoutInterval,
    showRandomPayout,
    showMultiplePayouts,
    getPayoutStats,
    resetUserHistory,
    getRandomPayout,
    createPayoutToast
};

// For debugging (remove in production)
console.log('Payout.js loaded - Live payout system ready!');
console.log(`Total users available: ${payoutUsers.length}`);