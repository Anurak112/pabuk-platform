/**
 * Point System Constants
 * Base points, multipliers, and milestone values for the Pabuk contribution platform
 */

import { DataType, Category, Status, TransactionType } from "@/app/generated/prisma";

// ============================================
// BASE POINTS BY DATA TYPE AND CATEGORY
// ============================================

export const BASE_POINTS: Record<DataType, number> = {
    TEXT: 50,
    AUDIO: 80,
    IMAGE: 40,
    SYNTHETIC: 20,
};

// Category-specific modifiers (multiplied with base points)
export const CATEGORY_MODIFIERS: Record<Category, number> = {
    FOLKTALE: 1.0,       // TEXT: 50
    PROVERB: 0.6,        // TEXT: 30
    HISTORY: 1.2,        // TEXT: 60
    DIALECT: 1.0,        // AUDIO: 80
    FOLK_SONG: 0.875,    // AUDIO: 70
    FESTIVAL_SOUND: 0.75,// AUDIO: 60
    LANDMARK: 1.0,       // IMAGE: 40
    LANDSCAPE: 0.875,    // IMAGE: 35
    CULTURAL_OBJECT: 1.25,// IMAGE: 50
    FOOD: 1.125,         // IMAGE: 45
    OTHER: 0.5,          // Any: 50%
};

// ============================================
// STATUS MULTIPLIERS
// ============================================

export const STATUS_MULTIPLIERS: Record<Status, number> = {
    PENDING: 0.5,
    APPROVED: 1.0,
    REJECTED: 0,
    FEATURED: 2.0,
};

// ============================================
// QUALITY RATING (1-5 STARS)
// ============================================

export const QUALITY_MULTIPLIERS: Record<number, number> = {
    1: 0.8,
    2: 0.9,
    3: 1.0,
    4: 1.2,
    5: 1.5,
};

export const QUALITY_BONUSES: Record<number, number> = {
    1: -10,  // Poor quality penalty
    2: 0,    // Below average
    3: 10,   // Average
    4: 25,   // Good quality
    5: 50,   // Exceptional
};

// ============================================
// GEOGRAPHIC BONUSES
// ============================================

export const GEOGRAPHIC_BONUSES = {
    FIRST_IN_PROVINCE: 20,
    UNDERREPRESENTED_PROVINCE: 50,
    COMPLETE_10_PROVINCES: 500,
    COMPLETE_25_PROVINCES: 1500,
    COMPLETE_50_PROVINCES: 3000,
    COMPLETE_77_PROVINCES: 10000,
    COMPLETE_REGION: 1000,
    COMPLETE_ALL_REGIONS: 5000,
};

// ============================================
// MILESTONE BONUSES
// ============================================

export const MILESTONES = {
    BRONZE: { threshold: 10, bonus: 100, level: "Bronze" },
    SILVER: { threshold: 50, bonus: 500, level: "Silver" },
    GOLD: { threshold: 100, bonus: 1000, level: "Gold" },
    PLATINUM: { threshold: 500, bonus: 5000, level: "Platinum" },
    DIAMOND: { threshold: 1000, bonus: 10000, level: "Diamond" },
    LEGEND: { threshold: 5000, bonus: 50000, level: "Legend" },
    MASTER: { threshold: 10000, bonus: 100000, level: "Master" },
};

export type MilestoneKey = keyof typeof MILESTONES;

// ============================================
// STREAK BONUSES
// ============================================

export const STREAK_BONUSES = {
    DAILY: 10,           // Per day
    WEEKLY: 100,         // 7-day streak
    MONTHLY: 500,        // 30-day streak
    QUARTERLY: 2000,     // 90-day streak
    YEARLY: 10000,       // 365-day streak
};

// Streak grace period in hours
export const STREAK_GRACE_PERIOD_HOURS = 48;

// ============================================
// DIVERSITY BONUSES
// ============================================

export const DIVERSITY_BONUSES = {
    MULTI_TALENTED: 200,    // 10+ contributions in 2 data types
    POLYMATH: 500,          // 10+ contributions in all 4 data types
    STORYTELLER: 300,       // 100 approved text contributions
    SOUND_ARCHIVIST: 400,   // 50 approved audio contributions
    VISUAL_ARTIST: 350,     // 50 approved image contributions
    AI_PIONEER: 200,        // 100 approved synthetic contributions
};

// ============================================
// REVIEWER BONUSES
// ============================================

export const REVIEWER_BONUSES = {
    REVIEW_SUBMISSION: 5,
    QUALITY_RATING: 2,
    TAG_CONTRIBUTION: 3,
    CATCH_DUPLICATE: 20,
    MENTORSHIP: 50,
    TOP_REVIEWER_MONTHLY: 500,
};

// ============================================
// REFERRAL BONUSES
// ============================================

export const REFERRAL_BONUSES = {
    SIGNUP: 50,
    FIRST_CONTRIBUTION: 100,
    REACH_50_CONTRIBUTIONS: 500,
};

// Maximum referrals per user
export const MAX_REFERRALS = 100;

// ============================================
// ANTI-GAMING LIMITS
// ============================================

export const RATE_LIMITS = {
    MAX_DAILY_SUBMISSIONS: 50,
    MAX_HOURLY_SUBMISSIONS: 10,
    MIN_APPROVAL_RATE: 0.5,      // 50% approval required
    LOW_QUALITY_THRESHOLD: 2,    // Average rating below this triggers limits
};

// ============================================
// PENALTIES
// ============================================

export const PENALTIES = {
    SPAM: 50,
    DUPLICATE: 25,
    LOW_QUALITY: 100,
};

// ============================================
// LEVEL THRESHOLDS
// ============================================

export const LEVEL_THRESHOLDS = {
    BRONZE: 0,
    SILVER: 1000,
    GOLD: 5000,
    PLATINUM: 20000,
    DIAMOND: 100000,
};

// ============================================
// HELPER: Get transaction type for contribution
// ============================================

export function getContributionTransactionType(dataType: DataType): TransactionType {
    const typeMap: Record<DataType, TransactionType> = {
        TEXT: TransactionType.CONTRIBUTION_TEXT,
        AUDIO: TransactionType.CONTRIBUTION_AUDIO,
        IMAGE: TransactionType.CONTRIBUTION_IMAGE,
        SYNTHETIC: TransactionType.CONTRIBUTION_SYNTHETIC,
    };
    return typeMap[dataType];
}

// ============================================
// HELPER: Get user level from points
// ============================================

export function getLevelFromPoints(points: number): string {
    if (points >= LEVEL_THRESHOLDS.DIAMOND) return "Diamond";
    if (points >= LEVEL_THRESHOLDS.PLATINUM) return "Platinum";
    if (points >= LEVEL_THRESHOLDS.GOLD) return "Gold";
    if (points >= LEVEL_THRESHOLDS.SILVER) return "Silver";
    return "Bronze";
}

// ============================================
// HELPER: Get next milestone
// ============================================

export function getNextMilestone(approvedCount: number): {
    name: MilestoneKey;
    threshold: number;
    bonus: number;
} | null {
    const milestoneEntries = Object.entries(MILESTONES) as [MilestoneKey, typeof MILESTONES[MilestoneKey]][];

    for (const [name, data] of milestoneEntries) {
        if (approvedCount < data.threshold) {
            return { name, threshold: data.threshold, bonus: data.bonus };
        }
    }
    return null; // Already at max milestone
}
