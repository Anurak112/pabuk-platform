"use client";

import { useEffect, useState } from "react";

interface PointSummary {
    points: number;
    level: string;
    rank: number;
    breakdown: {
        contributions: number;
        bonuses: number;
        milestones: number;
        penalties: number;
    };
}

interface PointsCardProps {
    compact?: boolean;
}

const levelColors: Record<string, string> = {
    Bronze: "from-amber-600 to-amber-800",
    Silver: "from-gray-400 to-gray-600",
    Gold: "from-yellow-400 to-yellow-600",
    Platinum: "from-cyan-300 to-cyan-500",
    Diamond: "from-blue-400 to-purple-500",
};

const levelIcons: Record<string, string> = {
    Bronze: "🥉",
    Silver: "🥈",
    Gold: "🥇",
    Platinum: "💎",
    Diamond: "👑",
};

export function PointsCard({ compact = false }: PointsCardProps) {
    const [data, setData] = useState<PointSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const res = await fetch("/api/points/user");
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch points:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPoints();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-800/50 rounded-2xl p-6 animate-pulse">
                <div className="h-8 bg-slate-700 rounded w-1/2 mb-4"></div>
                <div className="h-12 bg-slate-700 rounded w-3/4"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-slate-800/50 rounded-2xl p-6 text-center text-slate-400">
                <p>เข้าสู่ระบบเพื่อดูแต้มสะสม</p>
            </div>
        );
    }

    const gradient = levelColors[data.level] || levelColors.Bronze;
    const icon = levelIcons[data.level] || "🏆";

    if (compact) {
        return (
            <div className={`bg-gradient-to-r ${gradient} rounded-xl px-4 py-2 flex items-center gap-3`}>
                <span className="text-2xl">{icon}</span>
                <div>
                    <p className="text-white font-bold text-lg">{data.points.toLocaleString()}</p>
                    <p className="text-white/80 text-xs">{data.level}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 backdrop-blur-lg border border-yellow-400/20 rounded-2xl overflow-hidden">
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${gradient} p-6`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">{icon}</span>
                        <div>
                            <p className="text-white/80 text-sm">ระดับ</p>
                            <p className="text-white font-bold text-2xl">{data.level}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-white/80 text-sm">อันดับ</p>
                        <p className="text-white font-bold text-2xl">#{data.rank}</p>
                    </div>
                </div>
            </div>

            {/* Points display */}
            <div className="p-6">
                <div className="text-center mb-6">
                    <p className="text-slate-400 text-sm mb-1">แต้มสะสมทั้งหมด</p>
                    <p className="text-yellow-400 font-black text-5xl">
                        {data.points.toLocaleString()}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">คะแนน</p>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <p className="text-green-400 font-bold">{data.breakdown.contributions.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs">จากผลงาน</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <p className="text-blue-400 font-bold">{data.breakdown.bonuses.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs">โบนัส</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <p className="text-purple-400 font-bold">{data.breakdown.milestones.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs">ไมล์สโตน</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <p className="text-red-400 font-bold">{data.breakdown.penalties.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs">หักแต้ม</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PointsCard;
