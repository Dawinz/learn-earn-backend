"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDailyBudget = calculateDailyBudget;
exports.coinsToUsd = coinsToUsd;
exports.usdToCoins = usdToCoins;
exports.calculateCoinRewards = calculateCoinRewards;
exports.validatePayoutAmount = validatePayoutAmount;
exports.checkDailyEarningCap = checkDailyEarningCap;
/**
 * Calculate daily budget based on ad revenue and safety margin
 */
function calculateDailyBudget(settings) {
    const revenueToday = (settings.eCPM_USD * settings.impressionsToday) / 1000;
    const payoutBudgetToday = revenueToday * settings.safetyMargin;
    return {
        revenueToday,
        payoutBudgetToday,
        remainingBudget: payoutBudgetToday, // Will be updated with actual payouts
        payoutsToday: 0, // Will be calculated from database
        canPayout: payoutBudgetToday > 0
    };
}
/**
 * Convert coins to USD based on current rate
 */
function coinsToUsd(coins, coinToUsdRate) {
    return Math.round(coins * coinToUsdRate * 100) / 100; // Round to 2 decimal places
}
/**
 * Convert USD to coins based on current rate
 */
function usdToCoins(usd, coinToUsdRate) {
    return Math.floor(usd / coinToUsdRate);
}
/**
 * Calculate coin rewards for different earning sources
 * Based on eCPM scenarios: $0.8, $1.5, $3.0
 */
function calculateCoinRewards(source, eCPM_USD, coinToUsdRate) {
    // Base rewards adjusted for eCPM
    const baseRewards = {
        'lesson': 10,
        'quiz': 15,
        'streak': 5,
        'daily-bonus': 20,
        'ad-reward': 25
    };
    // Adjust based on eCPM (higher eCPM = more generous rewards)
    const eCPMMultiplier = Math.min(eCPM_USD / 1.5, 2.0); // Cap at 2x for very high eCPM
    const adjustedReward = Math.floor(baseRewards[source] * eCPMMultiplier);
    return Math.max(adjustedReward, 1); // Minimum 1 coin
}
/**
 * Check if payout amount meets minimum requirements
 */
function validatePayoutAmount(amountUsd, minPayoutUsd) {
    if (amountUsd < minPayoutUsd) {
        return {
            valid: false,
            reason: `Minimum payout amount is $${minPayoutUsd}`
        };
    }
    return { valid: true };
}
/**
 * Check if user has exceeded daily earning cap
 */
function checkDailyEarningCap(earningsToday, maxDailyEarnUsd) {
    const remaining = Math.max(0, maxDailyEarnUsd - earningsToday);
    return {
        exceeded: earningsToday >= maxDailyEarnUsd,
        remaining
    };
}
//# sourceMappingURL=economics.js.map