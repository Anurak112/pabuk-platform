/**
 * Streak Service
 * Handles daily streak tracking, bonuses, and history
 */

import prisma from "@/lib/prisma";
import { StreakType, TransactionType } from "@/app/generated/prisma";
import {
    STREAK_BONUSES,
    STREAK_GRACE_PERIOD_HOURS,
} from "@/lib/utils/point-constants";
import PointTransactionService from "./point-transaction.service";

// ============================================
// TYPES
// ============================================

export interface StreakStatus {
    currentStreak: number;
    streakType: StreakType;
    lastContributionAt: Date | null;
    isActive: boolean;
    nextMilestone: { days: number; bonus: number } | null;
    bonusEarnedToday: boolean;
}

// ============================================
// STREAK SERVICE
// ============================================

export class StreakService {
    /**
     * Check and update user streak on new approved contribution
     */
    static async updateStreak(userId: string): Promise<{
        newStreak: number;
        bonusAwarded: number;
        milestoneReached: string | null;
    }> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                streak: true,
                lastContributionAt: true,
                approvedContributions: true,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const now = new Date();
        const lastContribution = user.lastContributionAt;

        let newStreak = 1;
        let bonusAwarded = 0;
        let milestoneReached: string | null = null;

        if (lastContribution) {
            const hoursSinceLastContribution =
                (now.getTime() - lastContribution.getTime()) / (1000 * 60 * 60);

            if (hoursSinceLastContribution <= STREAK_GRACE_PERIOD_HOURS) {
                // Continue streak
                newStreak = user.streak + 1;
            } else {
                // Streak broken, start fresh
                newStreak = 1;

                // Record the broken streak if it was significant
                if (user.streak >= 7) {
                    await this.recordStreakEnd(userId, user.streak);
                }
            }
        }

        // Award daily bonus
        bonusAwarded = STREAK_BONUSES.DAILY;
        await PointTransactionService.createTransaction({
            userId,
            type: TransactionType.STREAK_DAILY,
            amount: STREAK_BONUSES.DAILY,
            reason: `Daily streak bonus (Day ${newStreak})`,
            metadata: { streak: newStreak },
        });

        // Check for milestone bonuses
        const milestoneBonus = await this.checkMilestones(userId, newStreak);
        if (milestoneBonus) {
            bonusAwarded += milestoneBonus.amount;
            milestoneReached = milestoneBonus.milestone;
        }

        // Update user streak
        await prisma.user.update({
            where: { id: userId },
            data: {
                streak: newStreak,
                lastContributionAt: now,
                approvedContributions: { increment: 1 },
            },
        });

        return { newStreak, bonusAwarded, milestoneReached };
    }

    /**
     * Check for streak milestones and award bonus
     */
    private static async checkMilestones(
        userId: string,
        streak: number
    ): Promise<{ milestone: string; amount: number } | null> {
        const milestones: [number, string, TransactionType, number][] = [
            [7, "Week Warrior", TransactionType.STREAK_WEEKLY, STREAK_BONUSES.WEEKLY],
            [30, "Monthly Master", TransactionType.STREAK_MONTHLY, STREAK_BONUSES.MONTHLY],
            [90, "Quarterly Champion", TransactionType.STREAK_MONTHLY, STREAK_BONUSES.QUARTERLY],
            [365, "Yearly Legend", TransactionType.STREAK_YEARLY, STREAK_BONUSES.YEARLY],
        ];

        for (const [days, name, type, bonus] of milestones) {
            if (streak === days) {
                // Award milestone bonus
                await PointTransactionService.createTransaction({
                    userId,
                    type,
                    amount: bonus,
                    reason: `${name} - ${days} day streak!`,
                    metadata: { milestone: name, days },
                });

                // Record streak history
                await this.recordStreakMilestone(userId, days, bonus);

                return { milestone: name, amount: bonus };
            }
        }

        return null;
    }

    /**
     * Record streak milestone in history
     */
    private static async recordStreakMilestone(
        userId: string,
        days: number,
        bonus: number
    ): Promise<void> {
        const streakType = this.getStreakType(days);

        await prisma.streakHistory.create({
            data: {
                userId,
                streakType,
                startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                length: days,
                bonusAwarded: bonus,
            },
        });
    }

    /**
     * Record when a streak ends
     */
    private static async recordStreakEnd(
        userId: string,
        streakLength: number
    ): Promise<void> {
        const streakType = this.getStreakType(streakLength);

        await prisma.streakHistory.create({
            data: {
                userId,
                streakType,
                startDate: new Date(Date.now() - streakLength * 24 * 60 * 60 * 1000),
                endDate: new Date(),
                length: streakLength,
                bonusAwarded: 0, // Already awarded during streak
            },
        });
    }

    /**
     * Get streak type based on length
     */
    private static getStreakType(days: number): StreakType {
        if (days >= 365) return StreakType.YEARLY;
        if (days >= 30) return StreakType.MONTHLY;
        if (days >= 7) return StreakType.WEEKLY;
        return StreakType.DAILY;
    }

    /**
     * Get current streak status for user
     */
    static async getStreakStatus(userId: string): Promise<StreakStatus> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                streak: true,
                lastContributionAt: true,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const now = new Date();
        const lastContribution = user.lastContributionAt;
        let isActive = false;
        let bonusEarnedToday = false;

        if (lastContribution) {
            const hoursSinceLastContribution =
                (now.getTime() - lastContribution.getTime()) / (1000 * 60 * 60);

            isActive = hoursSinceLastContribution <= STREAK_GRACE_PERIOD_HOURS;

            // Check if already contributed today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            bonusEarnedToday = lastContribution >= today;
        }

        // Calculate next milestone
        const milestoneThresholds = [7, 30, 90, 365];
        const milestoneBonus = [
            STREAK_BONUSES.WEEKLY,
            STREAK_BONUSES.MONTHLY,
            STREAK_BONUSES.QUARTERLY,
            STREAK_BONUSES.YEARLY,
        ];

        let nextMilestone: { days: number; bonus: number } | null = null;
        for (let i = 0; i < milestoneThresholds.length; i++) {
            if (user.streak < milestoneThresholds[i]) {
                nextMilestone = {
                    days: milestoneThresholds[i] - user.streak,
                    bonus: milestoneBonus[i],
                };
                break;
            }
        }

        return {
            currentStreak: isActive ? user.streak : 0,
            streakType: this.getStreakType(user.streak),
            lastContributionAt: lastContribution,
            isActive,
            nextMilestone,
            bonusEarnedToday,
        };
    }

    /**
     * Get user's streak history
     */
    static async getStreakHistory(userId: string, limit = 10) {
        return prisma.streakHistory.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }
}

export default StreakService;
