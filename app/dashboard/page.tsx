"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { PointsCard, StreakIndicator, AchievementBadges, Leaderboard } from "@/components/points";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<"overview" | "contributions" | "settings">("overview");

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-lg border-b border-yellow-400/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold">
                        <span className="text-yellow-400">Pabuk</span>
                        <span className="text-white">.ai</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-blue-200">สวัสดี, {session.user?.name || "ผู้ใช้"}</span>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-all"
                        >
                            ออกจากระบบ
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-slate-700 pb-4">
                    {[
                        { id: "overview", label: "ภาพรวม" },
                        { id: "contributions", label: "ผลงานของฉัน" },
                        { id: "settings", label: "ตั้งค่า" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`px-4 py-2 font-semibold rounded-lg transition-all ${activeTab === tab.id
                                ? "bg-yellow-400 text-slate-900"
                                : "text-slate-300 hover:text-white hover:bg-slate-800"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* Points and Streak Row */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            <PointsCard />
                            <div className="space-y-4">
                                <StreakIndicator />
                                <AchievementBadges />
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                            <h2 className="text-xl font-bold text-white mb-4">การดำเนินการด่วน</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <Link
                                    href="/submit"
                                    className="flex items-center gap-3 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg hover:bg-yellow-400/20 transition-all"
                                >
                                    <span className="text-2xl">📤</span>
                                    <div>
                                        <div className="font-semibold text-yellow-400">ส่งข้อมูลใหม่</div>
                                        <div className="text-sm text-slate-400">แบ่งปันความรู้ท้องถิ่น</div>
                                    </div>
                                </Link>
                                <Link
                                    href="/catalogue"
                                    className="flex items-center gap-3 p-4 bg-blue-400/10 border border-blue-400/30 rounded-lg hover:bg-blue-400/20 transition-all"
                                >
                                    <span className="text-2xl">🔍</span>
                                    <div>
                                        <div className="font-semibold text-blue-400">สำรวจคลังข้อมูล</div>
                                        <div className="text-sm text-slate-400">ดูผลงานทั้งหมด</div>
                                    </div>
                                </Link>
                                <Link
                                    href="/guidelines"
                                    className="flex items-center gap-3 p-4 bg-green-400/10 border border-green-400/30 rounded-lg hover:bg-green-400/20 transition-all"
                                >
                                    <span className="text-2xl">📖</span>
                                    <div>
                                        <div className="font-semibold text-green-400">แนวทางการส่งข้อมูล</div>
                                        <div className="text-sm text-slate-400">เรียนรู้วิธีการ</div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Leaderboard */}
                        <Leaderboard />

                        {/* Welcome Message */}
                        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/30 p-6 rounded-xl">
                            <h2 className="text-xl font-bold text-yellow-400 mb-2">ยินดีต้อนรับสู่ Pabuk.ai! 🎉</h2>
                            <p className="text-blue-100">
                                คุณเป็นส่วนหนึ่งของการสร้างอนาคต AI ไทย เริ่มต้นโดยการส่งข้อมูลแรกของคุณ
                                ไม่ว่าจะเป็นนิทานพื้นบ้าน สุภาษิต หรือภาพถ่ายสถานที่สำคัญในจังหวัดของคุณ
                            </p>
                        </div>
                    </div>
                )}

                {/* Contributions Tab */}
                {activeTab === "contributions" && (
                    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl font-bold text-white mb-2">ยังไม่มีผลงาน</h3>
                            <p className="text-slate-400 mb-6">คุณยังไม่ได้ส่งข้อมูลใดๆ เริ่มต้นสร้างผลงานแรกของคุณ!</p>
                            <Link
                                href="/submit"
                                className="inline-block px-6 py-3 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transition-all"
                            >
                                ส่งข้อมูลแรก
                            </Link>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-6">ตั้งค่าบัญชี</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">อีเมล</label>
                                <div className="text-white">{session.user?.email}</div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">บทบาท</label>
                                <div className="text-white">{session.user?.role || "CONTRIBUTOR"}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
