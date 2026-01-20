"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { THAI_PROVINCES, REGIONS } from "@/lib/thai-provinces";

const DATA_TYPES = [
    { value: "", label: "ทั้งหมด", icon: "📂" },
    { value: "TEXT", label: "ข้อความ", icon: "📝" },
    { value: "AUDIO", label: "เสียง", icon: "🎵" },
    { value: "IMAGE", label: "รูปภาพ", icon: "📸" },
    { value: "SYNTHETIC", label: "สังเคราะห์", icon: "🤖" },
];

interface Contribution {
    id: string;
    type: string;
    title: string;
    titleTh: string | null;
    category: string;
    createdAt: string;
    province: {
        nameTh: string;
        nameEn: string;
    };
    user: {
        name: string | null;
        image: string | null;
    };
}

export default function CataloguePage() {
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: "",
        provinceId: "",
        search: "",
    });

    useEffect(() => {
        fetchContributions();
    }, [filters.type, filters.provinceId]);

    const fetchContributions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.type) params.set("type", filters.type);
            if (filters.provinceId) params.set("provinceId", filters.provinceId);
            params.set("status", "APPROVED");

            const res = await fetch(`/api/contributions?${params}`);
            const data = await res.json();
            setContributions(data.contributions || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type: string) => {
        const typeData = DATA_TYPES.find((t) => t.value === type);
        return typeData?.icon || "📄";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-lg border-b border-yellow-400/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold">
                        <span className="text-yellow-400">Pabuk</span>
                        <span className="text-white">.ai</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/submit" className="text-blue-200 hover:text-white transition-all">
                            ส่งข้อมูล
                        </Link>
                        <Link href="/auth/signin" className="px-4 py-2 bg-yellow-400 text-slate-900 font-bold rounded-lg">
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-white mb-4">
                        คลังข้อมูล<span className="text-yellow-400">วัฒนธรรมไทย</span>
                    </h1>
                    <p className="text-blue-200">
                        สำรวจข้อมูลที่รวบรวมจากทั่วประเทศไทย 77 จังหวัด
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 mb-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">ประเภทข้อมูล</label>
                            <div className="flex flex-wrap gap-2">
                                {DATA_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setFilters({ ...filters, type: type.value })}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filters.type === type.value
                                                ? "bg-yellow-400 text-slate-900"
                                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                            }`}
                                    >
                                        {type.icon} {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Province Filter */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">จังหวัด</label>
                            <select
                                value={filters.provinceId}
                                onChange={(e) => setFilters({ ...filters, provinceId: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                            >
                                <option value="">ทุกจังหวัด (77)</option>
                                {REGIONS.map((region) => (
                                    <optgroup key={region.value} label={region.labelTh}>
                                        {THAI_PROVINCES.filter((p) => p.region === region.value).map((province) => (
                                            <option key={province.id} value={province.id}>
                                                {province.nameTh}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">ค้นหา</label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                placeholder="ค้นหาข้อมูล..."
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 text-slate-400">
                    พบ <span className="text-yellow-400 font-bold">{total}</span> รายการ
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
                    </div>
                ) : contributions.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-white mb-2">ยังไม่มีข้อมูล</h3>
                        <p className="text-slate-400 mb-6">
                            เป็นคนแรกที่แบ่งปันข้อมูลวัฒนธรรมของจังหวัดคุณ!
                        </p>
                        <Link
                            href="/submit"
                            className="inline-block px-6 py-3 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transition-all"
                        >
                            ส่งข้อมูลแรก
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contributions.map((item) => (
                            <div
                                key={item.id}
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all group"
                            >
                                {/* Type Badge */}
                                <div className="p-4 border-b border-slate-700">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl">{getTypeIcon(item.type)}</span>
                                        <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                                            {item.province.nameTh}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                                        {item.titleTh || item.title}
                                    </h3>
                                    <p className="text-sm text-slate-400 mb-4">
                                        หมวดหมู่: {item.category.replace("_", " ")}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">
                                            โดย {item.user.name || "ไม่ระบุชื่อ"}
                                        </span>
                                        <span className="text-slate-500">
                                            {new Date(item.createdAt).toLocaleDateString("th-TH")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 py-8 border-t border-yellow-400/20 mt-12">
                <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
                    © 2026 Pabuk.ai - Empowering Thailand's Digital Future
                </div>
            </footer>
        </div>
    );
}
