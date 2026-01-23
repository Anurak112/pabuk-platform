"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RoadReport {
    id: string;
    location: string;
    latitude: number;
    longitude: number;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    damageType: string;
    status: string;
    createdAt: string;
    user?: {
        name: string | null;
    };
}

const SEVERITY_COLORS = {
    LOW: "#22c55e",      // green
    MEDIUM: "#eab308",   // yellow
    HIGH: "#f97316",     // orange
    CRITICAL: "#ef4444", // red
};

const SEVERITY_LABELS = {
    LOW: "เล็กน้อย",
    MEDIUM: "ปานกลาง",
    HIGH: "รุนแรง",
    CRITICAL: "วิกฤต",
};

export default function MapPage() {
    const [reports, setReports] = useState<RoadReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<RoadReport | null>(null);
    const [filter, setFilter] = useState<string>("ALL");

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch("/api/reports");
            const data = await response.json();
            if (data.success) {
                setReports(data.data);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

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
                        <Link href="/" className="text-2xl font-bold">
                            <span className="text-yellow-400">🛣️ Chaiyaphum</span>
                            <span className="text-white"> Road Monitor</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/report" className="px-4 py-2 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transition-all">
                                + รายงานปัญหา
                            </Link>
                            <Link href="/dashboard" className="text-blue-200 hover:text-yellow-400 transition-all">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">🗺️ แผนที่ถนนชำรุด</h1>
                    <p className="text-blue-200">ดูตำแหน่งถนนชำรุดในจังหวัดชัยภูมิ</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                        <div className="text-3xl font-black text-yellow-400">{stats.total}</div>
                        <div className="text-sm text-slate-400">รายงานทั้งหมด</div>
                    </div>
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-red-500/30">
                        <div className="text-3xl font-black text-red-500">{stats.critical}</div>
                        <div className="text-sm text-slate-400">จุดวิกฤต</div>
                    </div>
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
                        <div className="text-3xl font-black text-yellow-500">{stats.pending}</div>
                        <div className="text-sm text-slate-400">รอตรวจสอบ</div>
                    </div>
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
                        <div className="text-3xl font-black text-green-500">{stats.repaired}</div>
                        <div className="text-sm text-slate-400">ซ่อมแล้ว</div>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((severity) => (
                        <button
                            key={severity}
                            onClick={() => setFilter(severity)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === severity
                                    ? "bg-yellow-400 text-slate-900"
                                    : "bg-slate-800 text-white hover:bg-slate-700"
                                }`}
                        >
                            {severity === "ALL" ? "ทั้งหมด" : SEVERITY_LABELS[severity as keyof typeof SEVERITY_LABELS]}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Map Placeholder */}
                    <div className="lg:col-span-2 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
                        <div className="aspect-video lg:aspect-[16/10] relative bg-slate-900 flex items-center justify-center">
                            {/* Map will be integrated here - for now showing placeholder with pins */}
                            <div className="absolute inset-0 p-4">
                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-green-900/30 to-blue-900/30 relative overflow-hidden">
                                    {/* Chaiyaphum province rough shape */}
                                    <div className="absolute inset-4 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-6xl mb-4">🗺️</div>
                                            <p className="text-slate-400 mb-2">จังหวัดชัยภูมิ</p>
                                            <p className="text-xs text-slate-500">
                                                {filteredReports.length} จุดที่รายงาน
                                            </p>
                                        </div>
                                    </div>

                                    {/* Simulated pins */}
                                    {filteredReports.slice(0, 10).map((report, index) => (
                                        <button
                                            key={report.id}
                                            onClick={() => setSelectedReport(report)}
                                            className="absolute transform -translate-x-1/2 -translate-y-full hover:scale-125 transition-transform cursor-pointer"
                                            style={{
                                                left: `${20 + (index * 7) % 60}%`,
                                                top: `${30 + (index * 11) % 50}%`,
                                            }}
                                            title={report.location}
                                        >
                                            <div
                                                className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold"
                                                style={{ backgroundColor: SEVERITY_COLORS[report.severity] }}
                                            >
                                                {index + 1}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Map Legend */}
                            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 text-xs">
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
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 p-4 max-h-[600px] overflow-y-auto">
                        <h3 className="font-bold text-lg mb-4">รายงานล่าสุด</h3>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                            </div>
                        ) : filteredReports.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <div className="text-4xl mb-2">📭</div>
                                <p>ยังไม่มีรายงาน</p>
                                <Link href="/report" className="text-yellow-400 hover:underline text-sm mt-2 inline-block">
                                    เป็นคนแรกที่รายงาน →
                                </Link>
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
                                                className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                                                style={{ backgroundColor: SEVERITY_COLORS[report.severity] }}
                                            ></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{report.location}</p>
                                                <p className="text-xs text-slate-400 mt-1">
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

                {/* Selected Report Detail Modal */}
                {selectedReport && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
                        <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-600" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold">รายละเอียดรายงาน</h3>
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
                                    <div>
                                        <span className="text-slate-400 text-sm">ประเภท</span>
                                        <p className="font-medium">{selectedReport.damageType}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-sm">พิกัด</span>
                                    <p className="font-mono text-sm">{selectedReport.latitude.toFixed(6)}, {selectedReport.longitude.toFixed(6)}</p>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-sm">รายงานเมื่อ</span>
                                    <p>{new Date(selectedReport.createdAt).toLocaleString("th-TH")}</p>
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
