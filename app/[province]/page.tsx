"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { THAI_PROVINCES, REGIONS, getProvinceById } from "@/lib/thai-provinces";

export default function ProvinceDashboard() {
    const params = useParams();
    const provinceId = params.province as string;
    const province = getProvinceById(provinceId);

    const [stats, setStats] = useState({
        totalReports: 0,
        criticalReports: 0,
        pendingReports: 0,
        repairedReports: 0,
    });

    // If province not found, show 404
    if (!province) {
        notFound();
    }

    const regionData = REGIONS.find(r => r.value === province.region);

    // Fetch province-specific stats (simulated for now)
    useEffect(() => {
        // TODO: Fetch actual stats from API
        // For demo, using random numbers
        setStats({
            totalReports: Math.floor(Math.random() * 100) + 10,
            criticalReports: Math.floor(Math.random() * 10),
            pendingReports: Math.floor(Math.random() * 30) + 5,
            repairedReports: Math.floor(Math.random() * 50),
        });
    }, [provinceId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-yellow-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-xl font-bold flex items-center gap-2">
                            <span className="text-2xl">🛣️</span>
                            <span className="text-yellow-400">{province.nameTh}</span>
                            <span className="text-white text-sm">Road Monitor</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href={`/${provinceId}/map`} className="text-white hover:text-yellow-400 transition-all font-semibold">
                                แผนที่
                            </Link>
                            <Link href={`/${provinceId}/report`} className="px-4 py-2 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transition-all">
                                + รายงานปัญหา
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20"></div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Link href="/" className="text-blue-300 hover:text-yellow-400 transition-all text-sm">
                            🏠 หน้าแรก
                        </Link>
                        <span className="text-slate-500">/</span>
                        <span className="text-yellow-400 text-sm">{province.nameTh}</span>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="inline-block px-4 py-1 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 font-semibold text-sm">
                            🚧 {regionData?.labelTh} • {province.nameEn}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black leading-tight">
                            <span className="text-yellow-400">{province.nameTh}</span>
                            <br />
                            <span className="text-white text-2xl md:text-3xl">Road Monitor</span>
                        </h1>

                        <p className="text-lg text-blue-200 max-w-2xl mx-auto">
                            ช่วยกันแจ้งปัญหาถนนชำรุดในจังหวัด{province.nameTh}
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                            <Link href={`/${provinceId}/report`} className="px-8 py-4 bg-yellow-400 text-slate-900 font-bold text-lg rounded-xl hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg shadow-yellow-400/30 flex items-center justify-center gap-2">
                                📸 รายงานถนนพัง
                            </Link>
                            <Link href={`/${provinceId}/map`} className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all border-2 border-white/30 flex items-center justify-center gap-2">
                                🗺️ ดูแผนที่
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-8 bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700 text-center">
                            <div className="text-3xl font-black text-yellow-400">{stats.totalReports}</div>
                            <div className="text-sm text-slate-400">รายงานทั้งหมด</div>
                        </div>
                        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-red-500/30 text-center">
                            <div className="text-3xl font-black text-red-500">{stats.criticalReports}</div>
                            <div className="text-sm text-slate-400">จุดวิกฤต</div>
                        </div>
                        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 text-center">
                            <div className="text-3xl font-black text-yellow-500">{stats.pendingReports}</div>
                            <div className="text-sm text-slate-400">รอตรวจสอบ</div>
                        </div>
                        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 text-center">
                            <div className="text-3xl font-black text-green-500">{stats.repairedReports}</div>
                            <div className="text-sm text-slate-400">ซ่อมแล้ว</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        คุณต้องการทำอะไร?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            href={`/${provinceId}/report`}
                            className="p-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border-2 border-yellow-400/30 hover:border-yellow-400 transition-all group"
                        >
                            <div className="text-5xl mb-4">📸</div>
                            <h3 className="text-xl font-bold text-yellow-400 mb-2">รายงานถนนพัง</h3>
                            <p className="text-slate-400">พบปัญหาถนนชำรุด? ถ่ายรูปและแจ้งให้เราทราบ</p>
                            <div className="mt-4 text-yellow-400 group-hover:translate-x-2 transition-transform">
                                เริ่มรายงาน →
                            </div>
                        </Link>

                        <Link
                            href={`/${provinceId}/map`}
                            className="p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border-2 border-blue-400/30 hover:border-blue-400 transition-all group"
                        >
                            <div className="text-5xl mb-4">🗺️</div>
                            <h3 className="text-xl font-bold text-blue-400 mb-2">ดูแผนที่</h3>
                            <p className="text-slate-400">ดูตำแหน่งถนนชำรุดและสถานะการซ่อมแซม</p>
                            <div className="mt-4 text-blue-400 group-hover:translate-x-2 transition-transform">
                                ดูแผนที่ →
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Change Province */}
            <section className="py-8 px-6">
                <div className="max-w-xl mx-auto text-center">
                    <Link
                        href="/"
                        className="text-slate-400 hover:text-yellow-400 transition-all"
                    >
                        ← เปลี่ยนจังหวัด
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-8 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-slate-500 text-sm">
                        © 2026 Thailand Road Monitor • จังหวัด{province.nameTh}
                    </p>
                </div>
            </footer>
        </div>
    );
}
