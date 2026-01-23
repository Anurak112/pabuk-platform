"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProvinceById, REGIONS } from "@/lib/thai-provinces";

interface RoadReport {
    id: string;
    location: string;
    latitude: number;
    longitude: number;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    damageType: string;
    status: string;
    createdAt: string;
}

const SEVERITY_COLORS = {
    LOW: "#22c55e",
    MEDIUM: "#eab308",
    HIGH: "#f97316",
    CRITICAL: "#ef4444",
};

const SEVERITY_LABELS = {
    LOW: "เล็กน้อย",
    MEDIUM: "ปานกลาง",
    HIGH: "รุนแรง",
    CRITICAL: "วิกฤต",
};

export default function ProvinceMapPage() {
    const params = useParams();
    const provinceId = params.province as string;
    const province = getProvinceById(provinceId);

    const [reports, setReports] = useState<RoadReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<RoadReport | null>(null);
    const [filter, setFilter] = useState<string>("ALL");

    if (!province) {
        notFound();
    }

    const regionData = REGIONS.find(r => r.value === province.region);

    useEffect(() => {
        // TODO: Fetch real data from API filtered by province
        // For now, simulate with demo data
        const demoReports: RoadReport[] = [
            {
                id: "1",
                location: `ถนนสาย ${provinceId} กม. 15`,
                latitude: 15.8 + Math.random() * 0.5,
                longitude: 102 + Math.random() * 0.5,
                severity: "CRITICAL",
                damageType: "POTHOLE",
                status: "PENDING",
                createdAt: new Date().toISOString(),
            },
            {
                id: "2",
                location: `ถนนอำเภอ ${provinceId} กม. 8`,
                latitude: 15.7 + Math.random() * 0.5,
                longitude: 101.9 + Math.random() * 0.5,
                severity: "HIGH",
                damageType: "CRACK",
                status: "VERIFIED",
                createdAt: new Date().toISOString(),
            },
            {
                id: "3",
                location: `ทางหลวง ${Math.floor(Math.random() * 300 + 100)}`,
                latitude: 15.9 + Math.random() * 0.5,
                longitude: 102.1 + Math.random() * 0.5,
                severity: "MEDIUM",
                damageType: "SURFACE_WEAR",
                status: "IN_PROGRESS",
                createdAt: new Date().toISOString(),
            },
        ];

        setTimeout(() => {
            setReports(demoReports);
            setLoading(false);
        }, 500);
    }, [provinceId]);

    const filteredReports = filter === "ALL"
        ? reports
        : reports.filter(r => r.severity === filter);

    const stats = {
        total: reports.length,
        critical: reports.filter(r => r.severity === "CRITICAL").length,
        pending: reports.filter(r => r.status === "PENDING").length,
        repaired: reports.filter(r => r.status === "REPAIRED").length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-yellow-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href={`/${provinceId}`} className="text-xl font-bold flex items-center gap-2">
                            <span className="text-2xl">🗺️</span>
                            <span className="text-yellow-400">{province.nameTh}</span>
                            <span className="text-white text-sm">Map</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href={`/${provinceId}/report`} className="px-4 py-2 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transition-all">
                                + รายงานปัญหา
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-blue-300 hover:text-yellow-400">หน้าแรก</Link>
                    <span className="text-slate-500">/</span>
                    <Link href={`/${provinceId}`} className="text-blue-300 hover:text-yellow-400">{province.nameTh}</Link>
                    <span className="text-slate-500">/</span>
                    <span className="text-yellow-400">แผนที่</span>
                </div>

                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-black mb-1">🗺️ แผนที่ถนนชำรุด</h1>
                    <p className="text-blue-200">จังหวัด{province.nameTh} • {regionData?.labelTh}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700 text-center">
                        <div className="text-2xl font-bold text-yellow-400">{stats.total}</div>
                        <div className="text-xs text-slate-400">รายงาน</div>
                    </div>
                    <div className="bg-slate-800/60 rounded-xl p-3 border border-red-500/30 text-center">
                        <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
                        <div className="text-xs text-slate-400">วิกฤต</div>
                    </div>
                    <div className="bg-slate-800/60 rounded-xl p-3 border border-yellow-500/30 text-center">
                        <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                        <div className="text-xs text-slate-400">รอตรวจสอบ</div>
                    </div>
                    <div className="bg-slate-800/60 rounded-xl p-3 border border-green-500/30 text-center">
                        <div className="text-2xl font-bold text-green-500">{stats.repaired}</div>
                        <div className="text-xs text-slate-400">ซ่อมแล้ว</div>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
                        <button
                            key={sev}
                            onClick={() => setFilter(sev)}
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${filter === sev ? "bg-yellow-400 text-slate-900" : "bg-slate-800 text-white hover:bg-slate-700"
                                }`}
                        >
                            {sev === "ALL" ? "ทั้งหมด" : SEVERITY_LABELS[sev as keyof typeof SEVERITY_LABELS]}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Map Placeholder */}
                    <div className="lg:col-span-2 bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden">
                        <div className="aspect-video lg:aspect-[16/10] relative bg-slate-900 flex items-center justify-center">
                            <div className="absolute inset-4 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🗺️</div>
                                    <p className="text-xl font-bold text-yellow-400">{province.nameTh}</p>
                                    <p className="text-slate-400">{filteredReports.length} จุดที่รายงาน</p>
                                </div>
                            </div>

                            {/* Simulated pins */}
                            {filteredReports.map((report, i) => (
                                <button
                                    key={report.id}
                                    onClick={() => setSelectedReport(report)}
                                    className="absolute hover:scale-125 transition-transform"
                                    style={{ left: `${25 + i * 20}%`, top: `${35 + i * 10}%` }}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                                        style={{ backgroundColor: SEVERITY_COLORS[report.severity] }}
                                    ></div>
                                </button>
                            ))}

                            {/* Legend */}
                            <div className="absolute bottom-4 left-4 bg-slate-900/90 rounded-lg p-3 text-xs">
                                <div className="font-bold mb-2">ระดับความรุนแรง</div>
                                {Object.entries(SEVERITY_COLORS).map(([key, color]) => (
                                    <div key={key} className="flex items-center gap-2 mb-1">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                                        <span>{SEVERITY_LABELS[key as keyof typeof SEVERITY_LABELS]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reports List */}
                    <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-4 max-h-[500px] overflow-y-auto">
                        <h3 className="font-bold mb-4">รายงานล่าสุด</h3>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                            </div>
                        ) : filteredReports.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <p>ไม่พบรายงาน</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredReports.map((report) => (
                                    <button
                                        key={report.id}
                                        onClick={() => setSelectedReport(report)}
                                        className={`w-full text-left p-3 rounded-xl border transition-all ${selectedReport?.id === report.id
                                                ? "border-yellow-400 bg-yellow-400/10"
                                                : "border-slate-600 hover:border-slate-500"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full mt-1.5"
                                                style={{ backgroundColor: SEVERITY_COLORS[report.severity] }}
                                            ></div>
                                            <div>
                                                <p className="font-medium">{report.location}</p>
                                                <p className="text-xs text-slate-400">
                                                    {SEVERITY_LABELS[report.severity]} • {new Date(report.createdAt).toLocaleDateString("th-TH")}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Report Modal */}
                {selectedReport && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
                        <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-600" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold">รายละเอียด</h3>
                                <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white">✕</button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="text-slate-400 text-sm">ตำแหน่ง</span>
                                    <p className="font-medium">{selectedReport.location}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <span className="text-slate-400 text-sm">ความรุนแรง</span>
                                        <p className="font-medium flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[selectedReport.severity] }}></span>
                                            {SEVERITY_LABELS[selectedReport.severity]}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href={`https://www.google.com/maps?q=${selectedReport.latitude},${selectedReport.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                            >
                                🗺️ เปิดใน Google Maps
                            </a>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
