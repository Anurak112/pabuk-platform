"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getProvinceById, REGIONS } from "@/lib/thai-provinces";
import MapLegend from "@/components/maps/MapLegend";

// Dynamically import RealTimeMap to avoid SSR issues with Leaflet
const RealTimeMap = dynamic(() => import("@/components/maps/RealTimeMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-slate-800/60 rounded-2xl flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-400">กำลังโหลดแผนที่...</p>
            </div>
        </div>
    ),
});

export default function ProvinceMapPage() {
    const params = useParams();
    const provinceId = params.province as string;
    const province = getProvinceById(provinceId);

    if (!province) notFound();
    const regionData = REGIONS.find(r => r.value === province.region);

    // Province center coordinates (approximate) - can be enhanced with actual coordinates
    const provinceCenters: Record<string, { lat: number; lng: number }> = {
        chaiyaphum: { lat: 15.8068, lng: 102.0316 },
        bangkok: { lat: 13.7563, lng: 100.5018 },
        "chiang-mai": { lat: 18.7883, lng: 98.9853 },
        "khon-kaen": { lat: 16.4419, lng: 102.8360 },
    };

    const center = provinceCenters[provinceId] || { lat: 15.87, lng: 100.99 };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-orange-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href={`/roads/${provinceId}`} className="text-xl font-bold flex items-center gap-2">
                        <span>🗺️</span><span className="text-orange-400">{province.nameTh}</span><span className="text-sm">Map</span>
                    </Link>
                    <Link href={`/roads/${provinceId}/report`} className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-400 transition-all">+ รายงาน</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-blue-300 hover:text-yellow-400">Pabuk.ai</Link>
                    <span className="text-slate-500">/</span>
                    <Link href="/roads" className="text-blue-300 hover:text-orange-400">Roads</Link>
                    <span className="text-slate-500">/</span>
                    <Link href={`/roads/${provinceId}`} className="text-blue-300 hover:text-orange-400">{province.nameTh}</Link>
                    <span className="text-slate-500">/</span>
                    <span className="text-orange-400">แผนที่</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <div className="flex-1">
                        <h1 className="text-2xl font-black mb-1">🗺️ แผนที่ถนนชำรุด Real-Time</h1>
                        <p className="text-blue-200">{province.nameTh} • {regionData?.labelTh}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-green-400">Live</span>
                        </div>
                        <Link
                            href={`/roads/${provinceId}/report`}
                            className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-400 transition-all"
                        >
                            📸 รายงานปัญหา
                        </Link>
                    </div>
                </div>

                {/* Main Map Area */}
                <div className="grid lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <div className="bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden h-[500px] lg:h-[600px]">
                            <RealTimeMap
                                provinceId={provinceId}
                                centerLat={center.lat}
                                centerLng={center.lng}
                                zoom={10}
                                refreshInterval={30000}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Legend */}
                        <MapLegend />

                        {/* Quick Stats Info */}
                        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                            <h4 className="font-semibold text-white mb-3 text-sm">วิธีใช้งาน</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="flex items-start gap-2">
                                    <span>👆</span>
                                    <span>คลิกที่จุดบนแผนที่เพื่อดูรายละเอียด</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>🔄</span>
                                    <span>แผนที่อัปเดตอัตโนมัติทุก 30 วินาที</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>📸</span>
                                    <span>กดปุ่ม &quot;รายงานปัญหา&quot; เพื่อแจ้งถนนชำรุด</span>
                                </li>
                            </ul>
                        </div>

                        {/* Report Button (Mobile) */}
                        <Link
                            href={`/roads/${provinceId}/report`}
                            className="block lg:hidden w-full py-4 bg-orange-500 text-white font-bold text-lg rounded-xl hover:bg-orange-400 transition-all text-center shadow-lg shadow-orange-500/30"
                        >
                            📸 รายงานถนนชำรุด
                        </Link>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="text-4xl">💡</div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-white mb-1">ช่วยกันรายงาน = ถนนดีขึ้นเร็วขึ้น</h3>
                            <p className="text-slate-400 text-sm">
                                ทุกรายงานของคุณถูกส่งถึงหน่วยงานที่รับผิดชอบ • รายงานจะแสดงบนแผนที่แบบเรียลไทม์
                            </p>
                        </div>
                        <Link
                            href={`/roads/${provinceId}/report`}
                            className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all"
                        >
                            รายงานตอนนี้ →
                        </Link>
                    </div>
                </div>
            </main>

            {/* Back link */}
            <section className="py-8 text-center">
                <Link href={`/roads/${provinceId}`} className="text-slate-400 hover:text-orange-400">
                    ← กลับไปหน้าจังหวัด
                </Link>
            </section>
        </div>
    );
}
