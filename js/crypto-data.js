// ========================================
// CRYPTO DATA - CENTRALIZED
// Shared between landing.js, send.js, and other pages
// ========================================

const CRYPTO_DATA = {
    BTC: {
        id: 'BTC',
        name: 'Bitcoin',
        ticker: 'BTC',
        icon: 'fab fa-bitcoin',
        iconClass: 'fa-bitcoin',
        iconColor: '#f7931a',
        min: 0.1,
        max: 20,
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        addressShort: 'bc1qxy...x0wlh',
        usdPrice: 50000,
        description: 'Bitcoin (BTC) - The original cryptocurrency',
        quickAmounts: [0.1, 0.5, 1, 2, 5, 10, 20],
        networkFee: '~0.0001 BTC',
        confirmations: 3,
        estimatedTime: '10-30 minutes'
    },
    ETH: {
        id: 'ETH',
        name: 'Ethereum',
        ticker: 'ETH',
        icon: 'fab fa-ethereum',
        iconClass: 'fa-ethereum',
        iconColor: '#627eea',
        min: 1,
        max: 500,
        address: '0x5336ff633160a71570e6084f14110412765cF66F',
        addressShort: '0x5336...cF66F',
        usdPrice: 2000,
        description: 'Ethereum (ETH) - Smart contract platform',
        quickAmounts: [1, 5, 10, 25, 50, 100, 250, 500],
        networkFee: '~0.001 ETH',
        confirmations: 12,
        estimatedTime: '5-15 minutes'
    },
    SOL: {
        id: 'SOL',
        name: 'Solana',
        ticker: 'SOL',
        icon: 'fas fa-bolt',
        iconClass: 'fa-bolt',
        iconColor: '#00ffbd',
        min: 10,
        max: 10000,
        address: 'oSv1p7gEiKkGVg6AEqZ291bx9kuNEiwxRxZfgMVHabs',
        addressShort: 'oSv1p7...Habs',
        usdPrice: 15,
        description: 'Solana (SOL) - High-speed blockchain',
        quickAmounts: [10, 25, 50, 100, 500, 1000, 5000, 10000],
        networkFee: '~0.000005 SOL',
        confirmations: 1,
        estimatedTime: '2-5 minutes'
    },
    TRUMP: {
        id: 'TRUMP',
        name: 'TRUMP Meme',
        ticker: 'TRUMP',
        icon: 'fas fa-crown',
        iconClass: 'fa-crown',
        iconColor: 'var(--gold-primary)',
        min: 1000,
        max: 1000000,
        address: '0xTrumpMemeOfficialGiveawayAddress',
        addressShort: '0xTrump...ess',
        usdPrice: 0.1,
        description: 'TRUMP Meme Token - The People\'s Meme',
        quickAmounts: [1000, 5000, 10000, 50000, 100000, 250000, 500000, 1000000],
        networkFee: '~0.001 ETH',
        confirmations: 6,
        estimatedTime: '5-10 minutes'
    }
};

// Helper function to get crypto data by ID
function getCryptoData(cryptoId) {
    return CRYPTO_DATA[cryptoId] || null;
}

// Helper function to get all crypto IDs
function getAllCryptoIds() {
    return Object.keys(CRYPTO_DATA);
}

// Helper function to format amount with crypto symbol
function formatCryptoAmount(amount, cryptoId) {
    const crypto = CRYPTO_DATA[cryptoId];
    if (!crypto) return `${amount}`;
    return `${amount.toLocaleString()} ${crypto.ticker}`;
}

// Helper function to calculate 2x return
function calculateReturn(amount, cryptoId) {
    const crypto = CRYPTO_DATA[cryptoId];
    if (!crypto) return amount * 2;
    return {
        sendAmount: amount,
        sendFormatted: formatCryptoAmount(amount, cryptoId),
        receiveAmount: amount * 2,
        receiveFormatted: formatCryptoAmount(amount * 2, cryptoId),
        usdValue: amount * crypto.usdPrice,
        usdReceiveValue: (amount * 2) * crypto.usdPrice
    };
}

// Helper function to validate amount
function validateAmount(amount, cryptoId) {
    const crypto = CRYPTO_DATA[cryptoId];
    if (!crypto) return { valid: false, message: 'Invalid cryptocurrency' };
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return { valid: false, message: 'Please enter a valid number' };
    if (numAmount < crypto.min) return { valid: false, message: `Minimum amount is ${crypto.min} ${crypto.ticker}` };
    if (numAmount > crypto.max) return { valid: false, message: `Maximum amount is ${crypto.max.toLocaleString()} ${crypto.ticker}` };
    
    return { valid: true, message: '', amount: numAmount };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CRYPTO_DATA, getCryptoData, getAllCryptoIds, formatCryptoAmount, calculateReturn, validateAmount };
}