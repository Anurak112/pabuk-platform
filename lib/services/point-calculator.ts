/**
 * Point Calculator Service
 * Calculates points for contributions based on the Pabuk point system design
 */

import {
    DataType,
    Category,
    Status,
    type Contribution,
    type User,
} from "@/app/generated/prisma";

import {
    BASE_POINTS,
    CATEGORY_MODIFIERS,
    STATUS_MULTIPLIERS,
    QUALITY_MULTIPLIERS,
    QUALITY_BONUSES,
    GEOGRAPHIC_BONUSES,
    getLevelFromPoints,
} from "@/lib/utils/point-constants";

// ============================================
// TYPES
// ============================================

export interface PointCalculationResult {
    basePoints: number;
    categoryModifier: number;
    statusMultiplier: number;
    qualityMultiplier: number;
    qualityBonus: number;
    geographicBonus: number;
    totalPoints: number;
    breakdown: PointBreakdown;
}

export interface PointBreakdown {
    base: number;
    status: number;
    quality: number;
    geographic: number;
    milestone: number;
    streak: number;
}

export interface CalculationOptions {
    isFirstInProvince?: boolean;
    isUnderrepresentedProvince?: boolean;
    qualityRating?: number; // 1-5
    currentStreak?: number;
}

// ============================================
// MAIN CALCULATOR CLASS
// ============================================

export class PointCalculator {
    /**
     * Calculate points for a contribution
     * Formula: (Base × Category × Status × Quality) + Bonuses
     */
    static calculate(
        contribution: Pick<Contribution, "type" | "category" | "status" | "qualityRating">,
        options: CalculationOptions = {}
    ): PointCalculationResult {
        const {
            isFirstInProvince = false,
            isUnderrepresentedProvince = false,
            qualityRating,
        } = options;

        // 1. Base points from data type
        const basePoints = BASE_POINTS[contribution.type];

        // 2. Category modifier
        const categoryModifier = CATEGORY_MODIFIERS[contribution.category] || 1.0;

        // 3. Status multiplier
        const statusMultiplier = STATUS_MULTIPLIERS[contribution.status];

        // 4. Quality multiplier (only if rated)
        const effectiveRating = qualityRating ?? contribution.qualityRating ?? 3;
        const qualityMultiplier = QUALITY_MULTIPLIERS[effectiveRating] || 1.0;
        const qualityBonus = QUALITY_BONUSES[effectiveRating] || 0;

        // 5. Geographic bonus
        let geographicBonus = 0;
        if (isFirstInProvince) {
            geographicBonus += GEOGRAPHIC_BONUSES.FIRST_IN_PROVINCE;
        }
        if (isUnderrepresentedProvince) {
            geographicBonus += GEOGRAPHIC_BONUSES.UNDERREPRESENTED_PROVINCE;
        }

        // Calculate total
        // Formula: (Base × Category × Status × Quality) + QualityBonus + GeographicBonus
        const baseCalc = Math.round(
            basePoints * categoryModifier * statusMultiplier * qualityMultiplier
        );
        const totalPoints = Math.max(0, baseCalc + qualityBonus + geographicBonus);

        return {
            basePoints,
            categoryModifier,
            statusMultiplier,
            qualityMultiplier,
            qualityBonus,
            geographicBonus,
            totalPoints,
            breakdown: {
                base: Math.round(basePoints * categoryModifier),
                status: Math.round(basePoints * categoryModifier * (statusMultiplier - 1)),
                quality: qualityBonus + Math.round(basePoints * categoryModifier * statusMultiplier * (qualityMultiplier - 1)),
                geographic: geographicBonus,
                milestone: 0, // Calculated separately
                streak: 0,    // Calculated separately
            },
        };
    }

    /**
     * Calculate points for a pending contribution (provisional)
     */
    static calculatePending(
        type: DataType,
        category: Category
    ): number {
        const result = this.calculate(
            { type, category, status: Status.PENDING, qualityRating: null },
            {}
        );
        return result.totalPoints;
    }

    /**
     * Calculate the difference when status changes
     */
    static calculateStatusChange(
        contribution: Pick<Contribution, "type" | "category" | "qualityRating">,
        oldStatus: Status,
        newStatus: Status,
        options: CalculationOptions = {}
    ): number {
        const oldResult = this.calculate(
            { ...contribution, status: oldStatus },
            options
        );
        const newResult = this.calculate(
            { ...contribution, status: newStatus },
            options
        );
        return newResult.totalPoints - oldResult.totalPoints;
    }

    /**
     * Calculate the difference when quality rating changes
     */
    static calculateQualityChange(
        contribution: Pick<Contribution, "type" | "category" | "status">,
        oldRating: number | null,
        newRating: number,
        options: CalculationOptions = {}
    ): number {
        const oldResult = this.calculate(
            { ...contribution, qualityRating: oldRating },
            { ...options, qualityRating: oldRating || 3 }
        );
        const newResult = this.calculate(
            { ...contribution, qualityRating: newRating },
            { ...options, qualityRating: newRating }
        );
        return newResult.totalPoints - oldResult.totalPoints;
    }

    /**
     * Get example calculation for a data type/category combo
     */
    static getExamplePoints(type: DataType, category: Category): {
        pending: number;
        approved: number;
        featured: number;
        maxPossible: number;
    } {
        const pendingResult = this.calculate(
            { type, category, status: Status.PENDING, qualityRating: null },
            {}
        );
        const approvedResult = this.calculate(
            { type, category, status: Status.APPROVED, qualityRating: 3 },
            {}
        );
        const featuredResult = this.calculate(
            { type, category, status: Status.FEATURED, qualityRating: 5 },
            { isFirstInProvince: true, isUnderrepresentedProvince: true }
        );

        return {
            pending: pendingResult.totalPoints,
            approved: approvedResult.totalPoints,
            featured: featuredResult.totalPoints,
            maxPossible: featuredResult.totalPoints,
        };
    }

    /**
     * Recalculate user level based on total points
     */
    static calculateUserLevel(totalPoints: number): string {
        return getLevelFromPoints(totalPoints);
    }
}

// ============================================
// STANDALONE HELPER FUNCTIONS
// ============================================

/**
 * Quick calculation for display purposes
 */
export function estimatePoints(
    type: DataType,
    category: Category,
    status: Status = Status.PENDING
): number {
    return PointCalculator.calculate(
        { type, category, status, qualityRating: null },
        {}
    ).totalPoints;
}

/**
 * Get human-readable breakdown
 */
export function getPointsBreakdownText(result: PointCalculationResult): string[] {
    const lines: string[] = [];

    lines.push(`Base: ${result.breakdown.base} pts (${result.basePoints} × ${result.categoryModifier})`);

    if (result.statusMultiplier !== 1) {
        lines.push(`Status: ${result.statusMultiplier}x multiplier`);
    }

    if (result.qualityBonus !== 0) {
        lines.push(`Quality: ${result.qualityBonus > 0 ? '+' : ''}${result.qualityBonus} pts`);
    }

    if (result.geographicBonus > 0) {
        lines.push(`Geographic: +${result.geographicBonus} pts`);
    }

    lines.push(`Total: ${result.totalPoints} pts`);

    return lines;
}
