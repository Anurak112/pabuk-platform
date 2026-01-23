"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { REGIONS, getProvinceById } from "@/lib/thai-provinces";

export default function ProvinceDashboard() {
    const params = useParams();
    const provinceId = params.province as string;
    const province = getProvinceById(provinceId);

    const [stats, setStats] = useState({ totalReports: 0, criticalReports: 0, pendingReports: 0, repairedReports: 0 });

    if (!province) {
        notFound();
    }

    const regionData = REGIONS.find(r => r.value === province.region);

    useEffect(() => {
        setStats({
            totalReports: Math.floor(Math.random() * 100) + 10,
            criticalReports: Math.floor(Math.random() * 10),
            pendingReports: Math.floor(Math.random() * 30) + 5,
            repairedReports: Math.floor(Math.random() * 50),
        });
    }, [provinceId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-orange-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href={`/roads/${provinceId}`} className="text-xl font-bold flex items-center gap-2">
                            <span className="text-2xl">🛣️</span>
                            <span className="text-orange-400">{province.nameTh}</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href={`/roads/${provinceId}/map`} className="text-white hover:text-orange-400 transition-all font-semibold">แผนที่</Link>
                            <Link href={`/roads/${provinceId}/report`} className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-400 transition-all">+ รายงาน</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="pt-12 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-4 text-sm">
                        <Link href="/" className="text-blue-300 hover:text-yellow-400">Pabuk.ai</Link>
                        <span className="text-slate-500">/</span>
                        <Link href="/roads" className="text-blue-300 hover:text-orange-400">Road Monitor</Link>
                        <span className="text-slate-500">/</span>
                        <span className="text-orange-400">{province.nameTh}</span>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="inline-block px-4 py-1 bg-orange-400/10 border border-orange-400/30 rounded-full text-orange-400 font-semibold text-sm">
                            {regionData?.labelTh} • {province.nameEn}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black">
                            <span className="text-orange-400">{province.nameTh}</span>
                            <span className="text-white text-2xl block mt-2">Road Monitor</span>
                        </h1>
                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                            <Link href={`/roads/${provinceId}/report`} className="px-8 py-4 bg-orange-500 text-white font-bold text-lg rounded-xl hover:bg-orange-400 transition-all shadow-lg">
                                📸 รายงานถนนพัง
                            </Link>
                            <Link href={`/roads/${provinceId}/map`} className="px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all border-2 border-white/30">
                                🗺️ ดูแผนที่
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 text-center">
                            <div className="text-3xl font-black text-orange-400">{stats.totalReports}</div>
                            <div className="text-sm text-slate-400">รายงานทั้งหมด</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-4 border border-red-500/30 text-center">
                            <div className="text-3xl font-black text-red-500">{stats.criticalReports}</div>
                            <div className="text-sm text-slate-400">จุดวิกฤต</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-4 border border-yellow-500/30 text-center">
                            <div className="text-3xl font-black text-yellow-500">{stats.pendingReports}</div>
                            <div className="text-sm text-slate-400">รอตรวจสอบ</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-4 border border-green-500/30 text-center">
                            <div className="text-3xl font-black text-green-500">{stats.repairedReports}</div>
                            <div className="text-sm text-slate-400">ซ่อมแล้ว</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
                    <Link href={`/roads/${provinceId}/report`} className="p-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl border-2 border-orange-400/30 hover:border-orange-400 transition-all group">
                        <div className="text-5xl mb-4">📸</div>
                        <h3 className="text-xl font-bold text-orange-400 mb-2">รายงานถนนพัง</h3>
                        <p className="text-slate-400">พบปัญหาถนนชำรุด? ถ่ายรูปและแจ้งให้เราทราบ</p>
                    </Link>
                    <Link href={`/roads/${provinceId}/map`} className="p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border-2 border-blue-400/30 hover:border-blue-400 transition-all group">
                        <div className="text-5xl mb-4">🗺️</div>
                        <h3 className="text-xl font-bold text-blue-400 mb-2">ดูแผนที่</h3>
                        <p className="text-slate-400">ดูตำแหน่งถนนชำรุดและสถานะการซ่อมแซม</p>
                    </Link>
                </div>
            </section>

            <section className="py-8 text-center">
                <Link href="/roads" className="text-slate-400 hover:text-orange-400">← เปลี่ยนจังหวัด</Link>
            </section>
        </div>
    );
}
