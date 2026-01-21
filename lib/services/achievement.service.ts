/**
 * Achievement Service
 * Handles milestone badges, diversity achievements, and geographic awards
 */

import prisma from "@/lib/prisma";
import { BadgeType, TransactionType } from "@/app/generated/prisma";
import {
    MILESTONES,
    DIVERSITY_BONUSES,
    GEOGRAPHIC_BONUSES,
    type MilestoneKey,
} from "@/lib/utils/point-constants";
import PointTransactionService from "./point-transaction.service";

// ============================================
// TYPES
// ============================================

export interface AchievementCheck {
    achieved: boolean;
    badgeName: string;
    badgeType: BadgeType;
    bonus: number;
    description: string;
}

export interface UserAchievements {
    earned: Array<{
        badgeName: string;
        badgeType: BadgeType;
        earnedAt: Date;
        description: string | null;
    }>;
    available: Array<{
        badgeName: string;
        badgeType: BadgeType;
        description: string;
        progress: number;
        target: number;
    }>;
}

// ============================================
// ACHIEVEMENT SERVICE
// ============================================

export class AchievementService {
    /**
     * Check and award any new achievements for a user
     */
    static async checkAndAward(userId: string): Promise<AchievementCheck[]> {
        const achievements: AchievementCheck[] = [];

        // Check milestone achievements
        const milestoneResults = await this.checkMilestones(userId);
        achievements.push(...milestoneResults);

        // Check diversity achievements
        const diversityResults = await this.checkDiversity(userId);
        achievements.push(...diversityResults);

        // Check geographic achievements
        const geoResults = await this.checkGeographic(userId);
        achievements.push(...geoResults);

        return achievements.filter((a) => a.achieved);
    }

    /**
     * Check milestone achievements (contribution count)
     */
    private static async checkMilestones(userId: string): Promise<AchievementCheck[]> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { approvedContributions: true },
        });

        if (!user) return [];

        const results: AchievementCheck[] = [];
        const milestoneEntries = Object.entries(MILESTONES) as [MilestoneKey, typeof MILESTONES[MilestoneKey]][];

        for (const [name, data] of milestoneEntries) {
            if (user.approvedContributions >= data.threshold) {
                const achieved = await this.awardIfNotExists(
                    userId,
                    `${data.level} Contributor`,
                    BadgeType.MILESTONE,
                    data.bonus,
                    `Reached ${data.threshold} approved contributions`,
                    this.getMilestoneTransactionType(name)
                );

                results.push({
                    achieved,
                    badgeName: `${data.level} Contributor`,
                    badgeType: BadgeType.MILESTONE,
                    bonus: data.bonus,
                    description: `Reached ${data.threshold} approved contributions`,
                });
            }
        }

        return results;
    }

    /**
     * Check diversity achievements (multiple data types)
     */
    private static async checkDiversity(userId: string): Promise<AchievementCheck[]> {
        const stats = await prisma.contribution.groupBy({
            by: ["type"],
            where: { userId, status: "APPROVED" },
            _count: true,
        });

        const results: AchievementCheck[] = [];
        const typeCounts: Record<string, number> = {};

        for (const s of stats) {
            typeCounts[s.type] = s._count;
        }

        const typesWithTen = Object.values(typeCounts).filter((c) => c >= 10).length;
        const allTypes = ["TEXT", "AUDIO", "IMAGE", "SYNTHETIC"];

        // Multi-Talented: 10+ in 2 types
        if (typesWithTen >= 2) {
            const achieved = await this.awardIfNotExists(
                userId,
                "Multi-Talented",
                BadgeType.QUALITY,
                DIVERSITY_BONUSES.MULTI_TALENTED,
                "10+ contributions in 2 different data types"
            );
            results.push({
                achieved,
                badgeName: "Multi-Talented",
                badgeType: BadgeType.QUALITY,
                bonus: DIVERSITY_BONUSES.MULTI_TALENTED,
                description: "10+ contributions in 2 different data types",
            });
        }

        // Polymath: 10+ in all 4 types
        if (typesWithTen >= 4) {
            const achieved = await this.awardIfNotExists(
                userId,
                "Polymath",
                BadgeType.QUALITY,
                DIVERSITY_BONUSES.POLYMATH,
                "10+ contributions in all 4 data types"
            );
            results.push({
                achieved,
                badgeName: "Polymath",
                badgeType: BadgeType.QUALITY,
                bonus: DIVERSITY_BONUSES.POLYMATH,
                description: "10+ contributions in all 4 data types",
            });
        }

        // Storyteller: 100 text
        if ((typeCounts["TEXT"] || 0) >= 100) {
            const achieved = await this.awardIfNotExists(
                userId,
                "Storyteller",
                BadgeType.QUALITY,
                DIVERSITY_BONUSES.STORYTELLER,
                "100 approved text contributions"
            );
            results.push({
                achieved,
                badgeName: "Storyteller",
                badgeType: BadgeType.QUALITY,
                bonus: DIVERSITY_BONUSES.STORYTELLER,
                description: "100 approved text contributions",
            });
        }

        // Sound Archivist: 50 audio
        if ((typeCounts["AUDIO"] || 0) >= 50) {
            const achieved = await this.awardIfNotExists(
                userId,
                "Sound Archivist",
                BadgeType.QUALITY,
                DIVERSITY_BONUSES.SOUND_ARCHIVIST,
                "50 approved audio contributions"
            );
            results.push({
                achieved,
                badgeName: "Sound Archivist",
                badgeType: BadgeType.QUALITY,
                bonus: DIVERSITY_BONUSES.SOUND_ARCHIVIST,
                description: "50 approved audio contributions",
            });
        }

        // Visual Artist: 50 images
        if ((typeCounts["IMAGE"] || 0) >= 50) {
            const achieved = await this.awardIfNotExists(
                userId,
                "Visual Artist",
                BadgeType.QUALITY,
                DIVERSITY_BONUSES.VISUAL_ARTIST,
                "50 approved image contributions"
            );
            results.push({
                achieved,
                badgeName: "Visual Artist",
                badgeType: BadgeType.QUALITY,
                bonus: DIVERSITY_BONUSES.VISUAL_ARTIST,
                description: "50 approved image contributions",
            });
        }

        return results;
    }

    /**
     * Check geographic achievements
     */
    private static async checkGeographic(userId: string): Promise<AchievementCheck[]> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { provincesCovered: true },
        });

        if (!user) return [];

        const results: AchievementCheck[] = [];
        const thresholds: [number, string, number][] = [
            [10, "Explorer (10 Provinces)", GEOGRAPHIC_BONUSES.COMPLETE_10_PROVINCES],
            [25, "Adventurer (25 Provinces)", GEOGRAPHIC_BONUSES.COMPLETE_25_PROVINCES],
            [50, "Voyager (50 Provinces)", GEOGRAPHIC_BONUSES.COMPLETE_50_PROVINCES],
            [77, "Ultimate Explorer (All 77 Provinces)", GEOGRAPHIC_BONUSES.COMPLETE_77_PROVINCES],
        ];

        for (const [count, name, bonus] of thresholds) {
            if (user.provincesCovered >= count) {
                const achieved = await this.awardIfNotExists(
                    userId,
                    name,
                    BadgeType.GEOGRAPHIC,
                    bonus,
                    `Contributed to ${count} provinces`
                );
                results.push({
                    achieved,
                    badgeName: name,
                    badgeType: BadgeType.GEOGRAPHIC,
                    bonus,
                    description: `Contributed to ${count} provinces`,
                });
            }
        }

        return results;
    }

    /**
     * Award achievement if not already earned
     */
    private static async awardIfNotExists(
        userId: string,
        badgeName: string,
        badgeType: BadgeType,
        bonus: number,
        description: string,
        transactionType?: TransactionType
    ): Promise<boolean> {
        // Check if already earned
        const existing = await prisma.achievement.findUnique({
            where: { userId_badgeName: { userId, badgeName } },
        });

        if (existing) return false;

        // Create achievement
        await prisma.achievement.create({
            data: {
                userId,
                badgeName,
                badgeType,
                description,
                badgeIcon: this.getBadgeIcon(badgeType),
            },
        });

        // Award bonus points
        if (bonus > 0) {
            await PointTransactionService.createTransaction({
                userId,
                type: transactionType || TransactionType.QUALITY_MULTIPLIER,
                amount: bonus,
                reason: `Achievement unlocked: ${badgeName}`,
                metadata: { achievement: badgeName, type: badgeType },
            });
        }

        return true;
    }

    /**
     * Get badge icon based on type
     */
    private static getBadgeIcon(type: BadgeType): string {
        const icons: Record<BadgeType, string> = {
            MILESTONE: "🏆",
            STREAK: "🔥",
            GEOGRAPHIC: "🗺️",
            QUALITY: "⭐",
            SPECIAL: "💎",
        };
        return icons[type] || "🎖️";
    }

    /**
     * Get milestone transaction type
     */
    private static getMilestoneTransactionType(milestone: MilestoneKey): TransactionType {
        const map: Record<MilestoneKey, TransactionType> = {
            BRONZE: TransactionType.MILESTONE_BRONZE,
            SILVER: TransactionType.MILESTONE_SILVER,
            GOLD: TransactionType.MILESTONE_GOLD,
            PLATINUM: TransactionType.MILESTONE_PLATINUM,
            DIAMOND: TransactionType.MILESTONE_DIAMOND,
            LEGEND: TransactionType.MILESTONE_LEGEND,
            MASTER: TransactionType.MILESTONE_LEGEND, // Use legend for master
        };
        return map[milestone];
    }

    /**
     * Get user's achievements
     */
    static async getUserAchievements(userId: string): Promise<UserAchievements> {
        const [earned, user] = await Promise.all([
            prisma.achievement.findMany({
                where: { userId },
                orderBy: { earnedAt: "desc" },
            }),
            prisma.user.findUnique({
                where: { id: userId },
                select: { approvedContributions: true, provincesCovered: true },
            }),
        ]);

        const earnedBadges = earned.map((a) => ({
            badgeName: a.badgeName,
            badgeType: a.badgeType,
            earnedAt: a.earnedAt,
            description: a.description,
        }));

        // Calculate progress for unearned achievements
        const available = this.getAvailableAchievements(
            earnedBadges.map((e) => e.badgeName),
            user?.approvedContributions || 0,
            user?.provincesCovered || 0
        );

        return { earned: earnedBadges, available };
    }

    /**
     * Get available (unearned) achievements with progress
     */
    private static getAvailableAchievements(
        earnedNames: string[],
        contributions: number,
        provinces: number
    ) {
        const available: UserAchievements["available"] = [];

        // Milestone achievements
        const milestoneEntries = Object.entries(MILESTONES) as [MilestoneKey, typeof MILESTONES[MilestoneKey]][];
        for (const [, data] of milestoneEntries) {
            const name = `${data.level} Contributor`;
            if (!earnedNames.includes(name)) {
                available.push({
                    badgeName: name,
                    badgeType: BadgeType.MILESTONE,
                    description: `Reach ${data.threshold} approved contributions`,
                    progress: contributions,
                    target: data.threshold,
                });
                break; // Only show next milestone
            }
        }

        // Geographic achievements
        const geoThresholds = [10, 25, 50, 77];
        const geoNames = [
            "Explorer (10 Provinces)",
            "Adventurer (25 Provinces)",
            "Voyager (50 Provinces)",
            "Ultimate Explorer (All 77 Provinces)",
        ];
        for (let i = 0; i < geoThresholds.length; i++) {
            if (!earnedNames.includes(geoNames[i])) {
                available.push({
                    badgeName: geoNames[i],
                    badgeType: BadgeType.GEOGRAPHIC,
                    description: `Contribute to ${geoThresholds[i]} provinces`,
                    progress: provinces,
                    target: geoThresholds[i],
                });
                break; // Only show next
            }
        }

        return available;
    }

    /**
     * Get all badge definitions
     */
    static async getAllBadges() {
        return {
            milestones: Object.entries(MILESTONES).map(([key, data]) => ({
                name: `${data.level} Contributor`,
                threshold: data.threshold,
                bonus: data.bonus,
                type: BadgeType.MILESTONE,
                icon: "🏆",
            })),
            diversity: [
                { name: "Multi-Talented", description: "10+ in 2 types", bonus: DIVERSITY_BONUSES.MULTI_TALENTED },
                { name: "Polymath", description: "10+ in all 4 types", bonus: DIVERSITY_BONUSES.POLYMATH },
                { name: "Storyteller", description: "100 text", bonus: DIVERSITY_BONUSES.STORYTELLER },
                { name: "Sound Archivist", description: "50 audio", bonus: DIVERSITY_BONUSES.SOUND_ARCHIVIST },
                { name: "Visual Artist", description: "50 images", bonus: DIVERSITY_BONUSES.VISUAL_ARTIST },
            ],
            geographic: [
                { name: "Explorer", threshold: 10, bonus: GEOGRAPHIC_BONUSES.COMPLETE_10_PROVINCES },
                { name: "Adventurer", threshold: 25, bonus: GEOGRAPHIC_BONUSES.COMPLETE_25_PROVINCES },
                { name: "Voyager", threshold: 50, bonus: GEOGRAPHIC_BONUSES.COMPLETE_50_PROVINCES },
                { name: "Ultimate Explorer", threshold: 77, bonus: GEOGRAPHIC_BONUSES.COMPLETE_77_PROVINCES },
            ],
        };
    }
}

export default AchievementService;
