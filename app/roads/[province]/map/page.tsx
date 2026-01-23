"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProvinceById, REGIONS } from "@/lib/thai-provinces";

const SEVERITY_COLORS = { LOW: "#22c55e", MEDIUM: "#eab308", HIGH: "#f97316", CRITICAL: "#ef4444" };
const SEVERITY_LABELS = { LOW: "เล็กน้อย", MEDIUM: "ปานกลาง", HIGH: "รุนแรง", CRITICAL: "วิกฤต" };

interface RoadReport { id: string; location: string; latitude: number; longitude: number; severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; status: string; createdAt: string; }

export default function ProvinceMapPage() {
    const params = useParams();
    const provinceId = params.province as string;
    const province = getProvinceById(provinceId);
    const [reports, setReports] = useState<RoadReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<RoadReport | null>(null);
    const [filter, setFilter] = useState("ALL");

    if (!province) notFound();
    const regionData = REGIONS.find(r => r.value === province.region);

    useEffect(() => {
        const demo: RoadReport[] = [
            { id: "1", location: `ถนนสาย ${provinceId} กม. 15`, latitude: 15.8, longitude: 102, severity: "CRITICAL", status: "PENDING", createdAt: new Date().toISOString() },
            { id: "2", location: `ทางหลวง ${Math.floor(Math.random() * 300 + 100)}`, latitude: 15.9, longitude: 102.1, severity: "HIGH", status: "VERIFIED", createdAt: new Date().toISOString() },
            { id: "3", location: `ถนนอำเภอ กม. 8`, latitude: 15.7, longitude: 101.9, severity: "MEDIUM", status: "IN_PROGRESS", createdAt: new Date().toISOString() },
        ];
        setTimeout(() => { setReports(demo); setLoading(false); }, 500);
    }, [provinceId]);

    const filtered = filter === "ALL" ? reports : reports.filter(r => r.severity === filter);
    const stats = { total: reports.length, critical: reports.filter(r => r.severity === "CRITICAL").length };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-orange-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href={`/roads/${provinceId}`} className="text-xl font-bold flex items-center gap-2">
                        <span>🗺️</span><span className="text-orange-400">{province.nameTh}</span><span className="text-sm">Map</span>
                    </Link>
                    <Link href={`/roads/${provinceId}/report`} className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg">+ รายงาน</Link>
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

                <h1 className="text-2xl font-black mb-1">🗺️ แผนที่ถนนชำรุด</h1>
                <p className="text-blue-200 mb-6">{province.nameTh} • {regionData?.labelTh}</p>

                <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-slate-800/60 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-orange-400">{stats.total}</div><div className="text-xs text-slate-400">รายงาน</div></div>
                    <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-red-500/30"><div className="text-2xl font-bold text-red-500">{stats.critical}</div><div className="text-xs text-slate-400">วิกฤต</div></div>
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                    {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map(s => (
                        <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-sm font-semibold ${filter === s ? "bg-orange-500 text-white" : "bg-slate-800 text-white"}`}>
                            {s === "ALL" ? "ทั้งหมด" : SEVERITY_LABELS[s as keyof typeof SEVERITY_LABELS]}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden">
                        <div className="aspect-video relative bg-slate-900 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🗺️</div>
                                <p className="text-xl font-bold text-orange-400">{province.nameTh}</p>
                                <p className="text-slate-400">{filtered.length} จุดรายงาน</p>
                            </div>
                            {filtered.map((r, i) => (
                                <button key={r.id} onClick={() => setSelectedReport(r)} className="absolute hover:scale-125 transition-transform" style={{ left: `${25 + i * 20}%`, top: `${35 + i * 10}%` }}>
                                    <div className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: SEVERITY_COLORS[r.severity] }}></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-4 max-h-[400px] overflow-y-auto">
                        <h3 className="font-bold mb-4">รายงานล่าสุด</h3>
                        {loading ? <div className="text-center py-12"><div className="animate-spin h-8 w-8 border-b-2 border-orange-400 rounded-full mx-auto"></div></div> :
                            filtered.length === 0 ? <p className="text-center py-12 text-slate-400">ไม่พบรายงาน</p> :
                                <div className="space-y-3">
                                    {filtered.map(r => (
                                        <button key={r.id} onClick={() => setSelectedReport(r)} className={`w-full text-left p-3 rounded-xl border ${selectedReport?.id === r.id ? "border-orange-400 bg-orange-400/10" : "border-slate-600"}`}>
                                            <div className="flex items-start gap-3">
                                                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: SEVERITY_COLORS[r.severity] }}></div>
                                                <div><p className="font-medium">{r.location}</p><p className="text-xs text-slate-400">{SEVERITY_LABELS[r.severity]}</p></div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                        }
                    </div>
                </div>

                {selectedReport && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
                        <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-600" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between mb-4"><h3 className="text-xl font-bold">รายละเอียด</h3><button onClick={() => setSelectedReport(null)}>✕</button></div>
                            <p className="font-medium mb-2">{selectedReport.location}</p>
                            <p className="text-sm text-slate-400 mb-4">{SEVERITY_LABELS[selectedReport.severity]}</p>
                            <a href={`https://www.google.com/maps?q=${selectedReport.latitude},${selectedReport.longitude}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl flex items-center justify-center">🗺️ เปิดใน Google Maps</a>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
