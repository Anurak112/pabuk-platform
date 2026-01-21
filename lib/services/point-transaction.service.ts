/**
 * Point Transaction Service
 * Handles creating, tracking, and managing point transactions
 */

import prisma from "@/lib/prisma";
import {
    TransactionType,
    type User,
    type Contribution,
    type PointTransaction,
    type Prisma,
} from "@/app/generated/prisma";

import { getLevelFromPoints } from "@/lib/utils/point-constants";
import { PointCalculator, type CalculationOptions } from "./point-calculator";

// ============================================
// TYPES
// ============================================

export interface CreateTransactionInput {
    userId: string;
    type: TransactionType;
    amount: number;
    reason: string;
    contributionId?: string;
    metadata?: Record<string, unknown>;
}

export interface PointSummary {
    totalPoints: number;
    level: string;
    rank?: number;
    recentTransactions: PointTransaction[];
    breakdown: {
        contributions: number;
        bonuses: number;
        milestones: number;
        penalties: number;
    };
}

// ============================================
// POINT TRANSACTION SERVICE
// ============================================

export class PointTransactionService {
    /**
     * Create a point transaction and update user totals
     */
    static async createTransaction(input: CreateTransactionInput): Promise<PointTransaction> {
        const { userId, type, amount, reason, contributionId, metadata } = input;

        // Get current points to calculate new level
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { points: true }
        });
        const newPoints = (currentUser?.points ?? 0) + amount;
        const newLevel = getLevelFromPoints(newPoints);

        // Create transaction and update user points atomically
        const [transaction] = await prisma.$transaction([
            prisma.pointTransaction.create({
                data: {
                    userId,
                    type,
                    amount,
                    reason,
                    contributionId,
                    metadata: metadata as Prisma.InputJsonValue | undefined,
                },
            }),
            prisma.user.update({
                where: { id: userId },
                data: {
                    points: { increment: amount },
                    level: newLevel,
                },
            }),
        ]);

        return transaction;
    }

    /**
     * Award points for a new contribution
     */
    static async awardContributionPoints(
        contribution: Contribution,
        options: CalculationOptions = {}
    ): Promise<PointTransaction> {
        const result = PointCalculator.calculate(contribution, options);

        const typeMap: Record<string, TransactionType> = {
            TEXT: TransactionType.CONTRIBUTION_TEXT,
            AUDIO: TransactionType.CONTRIBUTION_AUDIO,
            IMAGE: TransactionType.CONTRIBUTION_IMAGE,
            SYNTHETIC: TransactionType.CONTRIBUTION_SYNTHETIC,
        };

        const transaction = await this.createTransaction({
            userId: contribution.userId,
            type: typeMap[contribution.type] || TransactionType.CONTRIBUTION_TEXT,
            amount: result.totalPoints,
            reason: `Contribution: ${contribution.title}`,
            contributionId: contribution.id,
            metadata: {
                breakdown: result.breakdown,
                category: contribution.category,
                status: contribution.status,
            },
        });

        // Update contribution with points awarded
        await prisma.contribution.update({
            where: { id: contribution.id },
            data: {
                pointsAwarded: result.totalPoints,
                calculatedAt: new Date(),
            },
        });

        return transaction;
    }

    /**
     * Update points when contribution status changes
     */
    static async updateStatusChange(
        contribution: Contribution,
        oldStatus: string,
        newStatus: string,
        options: CalculationOptions = {}
    ): Promise<PointTransaction | null> {
        const diff = PointCalculator.calculateStatusChange(
            contribution,
            oldStatus as any,
            newStatus as any,
            options
        );

        if (diff === 0) return null;

        const transactionType = diff > 0
            ? TransactionType.QUALITY_MULTIPLIER
            : TransactionType.PENALTY_LOW_QUALITY;

        const transaction = await this.createTransaction({
            userId: contribution.userId,
            type: transactionType,
            amount: diff,
            reason: `Status change: ${oldStatus} → ${newStatus}`,
            contributionId: contribution.id,
        });

        // Update contribution points
        await prisma.contribution.update({
            where: { id: contribution.id },
            data: {
                pointsAwarded: { increment: diff },
                calculatedAt: new Date(),
            },
        });

        return transaction;
    }

    /**
     * Get user's point summary
     */
    static async getUserSummary(userId: string): Promise<PointSummary> {
        const [user, recentTransactions, breakdown] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                select: { points: true, level: true },
            }),
            prisma.pointTransaction.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                take: 10,
            }),
            this.getBreakdown(userId),
        ]);

        return {
            totalPoints: user?.points ?? 0,
            level: user?.level ?? "Bronze",
            recentTransactions,
            breakdown,
        };
    }

    /**
     * Get point breakdown by category
     */
    static async getBreakdown(userId: string): Promise<{
        contributions: number;
        bonuses: number;
        milestones: number;
        penalties: number;
    }> {
        const transactions = await prisma.pointTransaction.groupBy({
            by: ["type"],
            where: { userId },
            _sum: { amount: true },
        });

        const contributionTypes: TransactionType[] = [
            TransactionType.CONTRIBUTION_TEXT,
            TransactionType.CONTRIBUTION_AUDIO,
            TransactionType.CONTRIBUTION_IMAGE,
            TransactionType.CONTRIBUTION_SYNTHETIC,
        ];

        const milestoneTypes: TransactionType[] = [
            TransactionType.MILESTONE_BRONZE,
            TransactionType.MILESTONE_SILVER,
            TransactionType.MILESTONE_GOLD,
            TransactionType.MILESTONE_PLATINUM,
            TransactionType.MILESTONE_DIAMOND,
            TransactionType.MILESTONE_LEGEND,
        ];

        const penaltyTypes: TransactionType[] = [
            TransactionType.PENALTY_SPAM,
            TransactionType.PENALTY_DUPLICATE,
            TransactionType.PENALTY_LOW_QUALITY,
        ];

        let contributions = 0;
        let milestones = 0;
        let penalties = 0;
        let bonuses = 0;

        for (const t of transactions) {
            const amount = t._sum.amount ?? 0;
            if (contributionTypes.includes(t.type)) {
                contributions += amount;
            } else if (milestoneTypes.includes(t.type)) {
                milestones += amount;
            } else if (penaltyTypes.includes(t.type)) {
                penalties += amount;
            } else {
                bonuses += amount;
            }
        }

        return { contributions, bonuses, milestones, penalties };
    }

    /**
     * Get user's transaction history with pagination
     */
    static async getHistory(
        userId: string,
        options: { limit?: number; offset?: number; type?: TransactionType } = {}
    ): Promise<{ transactions: PointTransaction[]; total: number }> {
        const { limit = 20, offset = 0, type } = options;

        const where: Record<string, unknown> = { userId };
        if (type) where.type = type;

        const [transactions, total] = await Promise.all([
            prisma.pointTransaction.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit,
                skip: offset,
                include: {
                    contribution: {
                        select: { title: true, type: true },
                    },
                },
            }),
            prisma.pointTransaction.count({ where }),
        ]);

        return { transactions, total };
    }

    /**
     * Apply penalty to user
     */
    static async applyPenalty(
        userId: string,
        type: TransactionType,
        amount: number,
        reason: string,
        contributionId?: string
    ): Promise<PointTransaction> {
        // Penalties should be negative
        const penaltyAmount = amount > 0 ? -amount : amount;

        return this.createTransaction({
            userId,
            type,
            amount: penaltyAmount,
            reason,
            contributionId,
        });
    }

    /**
     * Admin: Manual point adjustment
     */
    static async adminAdjust(
        userId: string,
        amount: number,
        reason: string,
        adminId: string
    ): Promise<PointTransaction> {
        return this.createTransaction({
            userId,
            type: TransactionType.ADMIN_ADJUSTMENT,
            amount,
            reason: `[Admin: ${adminId}] ${reason}`,
            metadata: { adminId, adjustedAt: new Date().toISOString() },
        });
    }
}

export default PointTransactionService;
