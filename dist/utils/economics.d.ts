import { ISettings } from '../models/Settings';
export interface BudgetCalculation {
    revenueToday: number;
    payoutBudgetToday: number;
    remainingBudget: number;
    payoutsToday: number;
    canPayout: boolean;
}
/**
 * Calculate daily budget based on ad revenue and safety margin
 */
export declare function calculateDailyBudget(settings: ISettings): BudgetCalculation;
/**
 * Convert coins to USD based on current rate
 */
export declare function coinsToUsd(coins: number, coinToUsdRate: number): number;
/**
 * Convert USD to coins based on current rate
 */
export declare function usdToCoins(usd: number, coinToUsdRate: number): number;
/**
 * Calculate coin rewards for different earning sources
 * Based on eCPM scenarios: $0.8, $1.5, $3.0
 */
export declare function calculateCoinRewards(source: 'lesson' | 'quiz' | 'streak' | 'daily-bonus' | 'ad-reward', eCPM_USD: number, coinToUsdRate: number): number;
/**
 * Check if payout amount meets minimum requirements
 */
export declare function validatePayoutAmount(amountUsd: number, minPayoutUsd: number): {
    valid: boolean;
    reason?: string;
};
/**
 * Check if user has exceeded daily earning cap
 */
export declare function checkDailyEarningCap(earningsToday: number, maxDailyEarnUsd: number): {
    exceeded: boolean;
    remaining: number;
};
//# sourceMappingURL=economics.d.ts.map