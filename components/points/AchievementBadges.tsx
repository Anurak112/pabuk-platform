"use client";

import { useEffect, useState } from "react";

interface Achievement {
    badgeName: string;
    badgeType: string;
    earnedAt: string;
    description: string | null;
}

interface AvailableAchievement {
    badgeName: string;
    badgeType: string;
    description: string;
    progress: number;
    target: number;
}

interface AchievementData {
    earned: Achievement[];
    available: AvailableAchievement[];
}

const badgeIcons: Record<string, string> = {
    MILESTONE: "🏆",
    STREAK: "🔥",
    GEOGRAPHIC: "🗺️",
    QUALITY: "⭐",
    SPECIAL: "💎",
};

export function AchievementBadges() {
    const [data, setData] = useState<AchievementData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const res = await fetch("/api/achievements/user");
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch achievements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-800/50 rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-20 bg-slate-700 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-slate-800/50 rounded-2xl p-6 text-center text-slate-400">
                <p>เข้าสู่ระบบเพื่อดูรางวัล</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 backdrop-blur-lg border border-yellow-400/20 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">🎖️ รางวัลและความสำเร็จ</h2>
                <p className="text-slate-400 text-sm mt-1">
                    ได้รับแล้ว {data.earned.length} รางวัล
                </p>
            </div>

            {/* Earned badges */}
            {data.earned.length > 0 && (
                <div className="p-4">
                    <h3 className="text-sm font-semibold text-yellow-400 mb-3">🏅 รางวัลที่ได้รับ</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {data.earned.map((achievement, i) => (
                            <div
                                key={i}
                                className="bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border border-yellow-400/30 rounded-xl p-4 text-center hover:scale-105 transition-transform"
                            >
                                <span className="text-3xl block mb-2">
                                    {badgeIcons[achievement.badgeType] || "🎖️"}
                                </span>
                                <p className="text-white font-semibold text-sm truncate">
                                    {achievement.badgeName}
                                </p>
                                {achievement.description && (
                                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                                        {achievement.description}
                                    </p>
                                )}
                                <p className="text-slate-500 text-xs mt-2">
                                    {new Date(achievement.earnedAt).toLocaleDateString("th-TH", {
                                        day: "numeric",
                                        month: "short",
                                        year: "2-digit",
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Available/In-progress badges */}
            {data.available.length > 0 && (
                <div className="p-4 border-t border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-400 mb-3">🎯 กำลังดำเนินการ</h3>
                    <div className="space-y-3">
                        {data.available.map((achievement, i) => (
                            <div
                                key={i}
                                className="bg-slate-900/50 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl opacity-50">
                                        {badgeIcons[achievement.badgeType] || "🎖️"}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-white font-semibold text-sm">
                                            {achievement.badgeName}
                                        </p>
                                        <p className="text-slate-500 text-xs">
                                            {achievement.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-yellow-400 font-bold text-sm">
                                            {achievement.progress}/{achievement.target}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all"
                                        style={{
                                            width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {data.earned.length === 0 && data.available.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                    <span className="text-4xl block mb-2">🎖️</span>
                    <p>ส่งผลงานเพื่อรับรางวัลแรกของคุณ!</p>
                </div>
            )}
        </div>
    );
}

export default AchievementBadges;
