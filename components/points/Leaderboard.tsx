"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LeaderboardUser {
    rank: number;
    userId: string;
    name: string;
    image: string | null;
    points: number;
    level: string;
    contributions: number;
}

interface LeaderboardData {
    category: string;
    period: string;
    rankings: LeaderboardUser[];
    currentUser: {
        rank: number;
        points: number;
        level: string;
    } | null;
}

type Category = "TOTAL_POINTS" | "QUALITY_AVERAGE" | "GEOGRAPHIC_COVERAGE" | "CONTRIBUTION_COUNT";
type Period = "all-time" | "monthly" | "weekly";

const categoryLabels: Record<Category, string> = {
    TOTAL_POINTS: "แต้มรวม",
    QUALITY_AVERAGE: "คุณภาพ",
    GEOGRAPHIC_COVERAGE: "จังหวัด",
    CONTRIBUTION_COUNT: "จำนวนผลงาน",
};

const periodLabels: Record<Period, string> = {
    "all-time": "ตลอดกาล",
    monthly: "เดือนนี้",
    weekly: "สัปดาห์นี้",
};

export function Leaderboard() {
    const [data, setData] = useState<LeaderboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<Category>("TOTAL_POINTS");
    const [period, setPeriod] = useState<Period>("all-time");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/points/leaderboard?category=${category}&period=${period}&limit=10`);
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [category, period]);

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900";
            case 2:
                return "bg-gradient-to-r from-gray-300 to-gray-400 text-slate-900";
            case 3:
                return "bg-gradient-to-r from-amber-600 to-amber-700 text-white";
            default:
                return "bg-slate-700 text-white";
        }
    };

    const getRankEmoji = (rank: number) => {
        switch (rank) {
            case 1: return "🥇";
            case 2: return "🥈";
            case 3: return "🥉";
            default: return null;
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-lg border border-yellow-400/20 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white mb-4">🏆 กระดานผู้นำ</h2>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    {/* Category tabs */}
                    <div className="flex gap-1 bg-slate-900/50 rounded-lg p-1">
                        {(Object.keys(categoryLabels) as Category[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-3 py-1 text-xs rounded-md transition-all ${category === cat
                                        ? "bg-yellow-400 text-slate-900 font-semibold"
                                        : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                {categoryLabels[cat]}
                            </button>
                        ))}
                    </div>

                    {/* Period tabs */}
                    <div className="flex gap-1 bg-slate-900/50 rounded-lg p-1">
                        {(Object.keys(periodLabels) as Period[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1 text-xs rounded-md transition-all ${period === p
                                        ? "bg-blue-500 text-white font-semibold"
                                        : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                {periodLabels[p]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Rankings list */}
            <div className="divide-y divide-slate-700/50">
                {loading ? (
                    // Loading skeleton
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                            <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                            <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))
                ) : data?.rankings.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                        ยังไม่มีข้อมูลในกระดานผู้นำ
                    </div>
                ) : (
                    data?.rankings.map((user) => (
                        <div key={user.userId} className="p-4 flex items-center gap-4 hover:bg-slate-700/20 transition-colors">
                            {/* Rank badge */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyle(user.rank)}`}>
                                {getRankEmoji(user.rank) || user.rank}
                            </div>

                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg">
                                        {user.name?.charAt(0) || "?"}
                                    </div>
                                )}
                            </div>

                            {/* User info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold truncate">{user.name}</p>
                                <p className="text-slate-500 text-xs">{user.level} • {user.contributions} ผลงาน</p>
                            </div>

                            {/* Points */}
                            <div className="text-right">
                                <p className="text-yellow-400 font-bold">{user.points.toLocaleString()}</p>
                                <p className="text-slate-500 text-xs">คะแนน</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Current user position */}
            {data?.currentUser && (
                <div className="p-4 bg-yellow-400/10 border-t border-yellow-400/30">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-sm text-slate-900">
                            {data.currentUser.rank}
                        </div>
                        <div className="flex-1">
                            <p className="text-yellow-400 font-semibold">ตำแหน่งของคุณ</p>
                            <p className="text-slate-500 text-xs">{data.currentUser.level}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-yellow-400 font-bold">{data.currentUser.points.toLocaleString()}</p>
                            <p className="text-slate-500 text-xs">คะแนน</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Leaderboard;
