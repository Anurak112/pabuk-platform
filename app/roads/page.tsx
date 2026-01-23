"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { THAI_PROVINCES, REGIONS, getProvincesByRegion } from "@/lib/thai-provinces";

export default function RoadsHomePage() {
    const router = useRouter();
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedRegion, setSelectedRegion] = useState<string>("");

    const filteredProvinces = selectedRegion
        ? getProvincesByRegion(selectedRegion as "NORTH" | "NORTHEAST" | "CENTRAL" | "EAST" | "WEST" | "SOUTH")
        : THAI_PROVINCES;

    const handleConfirm = () => {
        if (selectedProvince) {
            router.push(`/roads/${selectedProvince}`);
        }
    };

    const selectedProvinceData = THAI_PROVINCES.find(p => p.id === selectedProvince);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-orange-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-blue-300 hover:text-yellow-400 text-sm">
                                ← กลับ Pabuk.ai
                            </Link>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                <span className="text-3xl">🛣️</span>
                                <span className="text-orange-400">Thailand</span>
                                <span className="text-white">Road Monitor</span>
                            </div>
                        </div>
                        <Link href="/auth/signin" className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-400 transition-all">
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20"></div>

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-block px-6 py-2 bg-orange-400/10 border border-orange-400/30 rounded-full text-orange-400 font-semibold text-sm uppercase tracking-wider mb-8">
                        🇹🇭 ครอบคลุมทั้ง 77 จังหวัด
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                        <span className="text-orange-400">ถนนพัง?</span>
                        <br />
                        <span className="text-white">รายงานเลย!</span>
                    </h1>

                    <p className="text-xl text-orange-200 max-w-2xl mx-auto mb-8">
                        ช่วยกันแจ้งปัญหาถนนชำรุดในจังหวัดของคุณ • เลือกจังหวัดเพื่อเริ่มต้น
                    </p>
                </div>
            </section>

            {/* Province Selector */}
            <section className="py-12 px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 border border-orange-500/30 shadow-2xl">
                        <h2 className="text-2xl font-bold text-center mb-8">
                            เลือกจังหวัดของคุณ
                        </h2>

                        {/* Region Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-orange-200 mb-3">
                                กรองตามภาค
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedRegion("")}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedRegion === ""
                                            ? "bg-orange-500 text-white"
                                            : "bg-slate-700 text-white hover:bg-slate-600"
                                        }`}
                                >
                                    ทั้งหมด
                                </button>
                                {REGIONS.map((region) => (
                                    <button
                                        key={region.value}
                                        onClick={() => setSelectedRegion(region.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedRegion === region.value
                                                ? "bg-orange-500 text-white"
                                                : "bg-slate-700 text-white hover:bg-slate-600"
                                            }`}
                                    >
                                        {region.labelTh}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Province Dropdown */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-orange-200 mb-3">
                                เลือกจังหวัด *
                            </label>
                            <select
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                                className="w-full px-4 py-4 bg-slate-900 border-2 border-slate-600 rounded-xl text-white text-lg focus:border-orange-400 focus:outline-none transition-all cursor-pointer"
                            >
                                <option value="">-- เลือกจังหวัด --</option>
                                {filteredProvinces.map((province) => (
                                    <option key={province.id} value={province.id}>
                                        {province.nameTh} ({province.nameEn})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selected Province Preview */}
                        {selectedProvinceData && (
                            <div className="mb-8 p-4 bg-orange-400/10 border border-orange-400/30 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="text-4xl">📍</div>
                                    <div>
                                        <div className="text-xl font-bold text-orange-400">
                                            {selectedProvinceData.nameTh}
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            {selectedProvinceData.nameEn} • {REGIONS.find(r => r.value === selectedProvinceData.region)?.labelTh}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedProvince}
                            className="w-full py-4 bg-orange-500 text-white font-bold text-xl rounded-xl hover:bg-orange-400 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-orange-500/30"
                        >
                            {selectedProvince ? "✅ ยืนยันการเลือก" : "กรุณาเลือกจังหวัด"}
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900/50 py-8 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-slate-500 text-sm">
                        © 2026 Thailand Road Monitor • Part of <Link href="/" className="text-yellow-400 hover:underline">Pabuk.ai</Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}
