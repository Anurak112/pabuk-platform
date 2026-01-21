"use client";

import { useEffect, useState } from "react";

interface StreakStatus {
    currentStreak: number;
    streakType: string;
    isActive: boolean;
    bonusEarnedToday: boolean;
    nextMilestone: {
        days: number;
        bonus: number;
    } | null;
}

export function StreakIndicator() {
    const [streak, setStreak] = useState<StreakStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const res = await fetch("/api/streaks/current");
                const json = await res.json();
                if (json.success) {
                    setStreak(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch streak:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStreak();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-800/50 rounded-xl p-4 animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-1/2"></div>
            </div>
        );
    }

    if (!streak) {
        return null;
    }

    const flameSize = streak.currentStreak > 30 ? "text-5xl" :
        streak.currentStreak > 7 ? "text-4xl" : "text-3xl";

    return (
        <div className={`relative overflow-hidden rounded-xl p-4 ${streak.isActive
                ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
                : "bg-slate-800/50 border border-slate-700"
            }`}>
            <div className="flex items-center gap-4">
                {/* Flame icon */}
                <div className={`${flameSize} ${streak.isActive ? "animate-pulse" : "opacity-50"}`}>
                    🔥
                </div>

                {/* Streak info */}
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <span className={`font-black text-3xl ${streak.isActive ? "text-orange-400" : "text-slate-500"}`}>
                            {streak.currentStreak}
                        </span>
                        <span className="text-slate-400 text-sm">วันติดต่อกัน</span>
                    </div>

                    {streak.bonusEarnedToday && (
                        <p className="text-green-400 text-xs mt-1">
                            ✓ ได้รับโบนัสวันนี้แล้ว
                        </p>
                    )}

                    {!streak.bonusEarnedToday && streak.isActive && (
                        <p className="text-yellow-400 text-xs mt-1">
                            ส่งผลงานเพื่อรักษา Streak!
                        </p>
                    )}

                    {!streak.isActive && (
                        <p className="text-slate-500 text-xs mt-1">
                            เริ่ม Streak ใหม่วันนี้!
                        </p>
                    )}
                </div>

                {/* Next milestone */}
                {streak.nextMilestone && streak.isActive && (
                    <div className="text-right">
                        <p className="text-slate-500 text-xs">ถึงโบนัสถัดไป</p>
                        <p className="text-yellow-400 font-bold">
                            อีก {streak.nextMilestone.days} วัน
                        </p>
                        <p className="text-green-400 text-xs">
                            +{streak.nextMilestone.bonus} pts
                        </p>
                    </div>
                )}
            </div>

            {/* Progress bar to next milestone */}
            {streak.nextMilestone && streak.isActive && (
                <div className="mt-3">
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all"
                            style={{
                                width: `${Math.min(100, (streak.currentStreak / (streak.currentStreak + streak.nextMilestone.days)) * 100)}%`
                            }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StreakIndicator;
