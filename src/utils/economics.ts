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
export function calculateDailyBudget(settings: ISettings): BudgetCalculation {
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
export function coinsToUsd(coins: number, coinToUsdRate: number): number {
  return Math.round(coins * coinToUsdRate * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert USD to coins based on current rate
 */
export function usdToCoins(usd: number, coinToUsdRate: number): number {
  return Math.floor(usd / coinToUsdRate);
}

/**
 * Calculate coin rewards for different earning sources
 * Based on eCPM scenarios: $0.8, $1.5, $3.0
 */
export function calculateCoinRewards(
  source: 'lesson' | 'quiz' | 'streak' | 'daily-bonus' | 'ad-reward',
  eCPM_USD: number,
  coinToUsdRate: number
): number {
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
export function validatePayoutAmount(
  amountUsd: number,
  minPayoutUsd: number
): { valid: boolean; reason?: string } {
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
export function checkDailyEarningCap(
  earningsToday: number,
  maxDailyEarnUsd: number
): { exceeded: boolean; remaining: number } {
  const remaining = Math.max(0, maxDailyEarnUsd - earningsToday);
  return {
    exceeded: earningsToday >= maxDailyEarnUsd,
    remaining
  };
}
