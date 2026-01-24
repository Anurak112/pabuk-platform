"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Severity color mapping
const SEVERITY_COLORS = {
    LOW: "#22c55e",      // Green
    MEDIUM: "#eab308",   // Yellow
    HIGH: "#f97316",     // Orange
    CRITICAL: "#ef4444", // Red
};

const STATUS_LABELS: Record<string, string> = {
    PENDING: "รอตรวจสอบ",
    VERIFIED: "ยืนยันแล้ว",
    IN_PROGRESS: "กำลังซ่อม",
    REPAIRED: "ซ่อมแล้ว",
};

const DAMAGE_TYPE_LABELS: Record<string, string> = {
    POTHOLE: "หลุม",
    CRACK: "รอยแตก",
    COLLAPSE: "ถนนทรุด",
    EROSION: "การกัดเซาะ",
    FLOODING: "น้ำท่วมขัง",
    SURFACE_WEAR: "ผิวถนนสึกหรอ",
    BRIDGE_DAMAGE: "สะพานชำรุด",
    SHOULDER_DAMAGE: "ไหล่ทางชำรุด",
    OTHER: "อื่นๆ",
};

interface RoadReportData {
    id: string;
    location: string;
    latitude: number;
    longitude: number;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    status: string;
    damageType: string;
    description?: string;
    createdAt: string;
    user?: {
        name?: string;
    };
}

interface RealTimeMapProps {
    provinceId?: string;
    centerLat?: number;
    centerLng?: number;
    zoom?: number;
    refreshInterval?: number; // in milliseconds
    onReportSelect?: (report: RoadReportData) => void;
}

// Create custom marker icons based on severity
function createMarkerIcon(severity: keyof typeof SEVERITY_COLORS, isPulsing = false) {
    const color = SEVERITY_COLORS[severity];
    const pulseClass = isPulsing ? "marker-pulse" : "";

    return L.divIcon({
        className: `custom-marker ${pulseClass}`,
        html: `
            <div style="
                width: 24px;
                height: 24px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
}

// Map bounds updater component
function MapBoundsUpdater({ reports }: { reports: RoadReportData[] }) {
    const map = useMap();

    useEffect(() => {
        if (reports.length > 0) {
            const bounds = L.latLngBounds(
                reports.map(r => [r.latitude, r.longitude])
            );
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
    }, [reports, map]);

    return null;
}

export default function RealTimeMap({
    provinceId,
    centerLat = 15.87,
    centerLng = 100.99,
    zoom = 8,
    refreshInterval = 30000,
    onReportSelect,
}: RealTimeMapProps) {
    const [reports, setReports] = useState<RoadReportData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [selectedReport, setSelectedReport] = useState<RoadReportData | null>(null);

    const fetchReports = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (provinceId) {
                params.set("province", provinceId);
            }
            params.set("limit", "500");

            const response = await fetch(`/api/reports?${params}`);
            if (!response.ok) throw new Error("Failed to fetch reports");

            const data = await response.json();
            setReports(data.data || []);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [provinceId]);

    // Initial fetch and refresh interval
    useEffect(() => {
        fetchReports();

        const interval = setInterval(fetchReports, refreshInterval);
        return () => clearInterval(interval);
    }, [fetchReports, refreshInterval]);

    const handleMarkerClick = (report: RoadReportData) => {
        setSelectedReport(report);
        onReportSelect?.(report);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="w-full h-full min-h-[400px] bg-slate-800/60 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">กำลังโหลดแผนที่...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full min-h-[400px] bg-slate-800/60 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">⚠️</div>
                    <p className="text-red-400 mb-2">เกิดข้อผิดพลาด</p>
                    <p className="text-slate-500 text-sm">{error}</p>
                    <button
                        onClick={fetchReports}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-all"
                    >
                        ลองใหม่
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full min-h-[400px]">
            {/* Last updated indicator */}
            <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-400">
                        อัปเดต: {lastUpdated?.toLocaleTimeString("th-TH")}
                    </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                    {reports.length} รายงาน • รีเฟรชทุก {refreshInterval / 1000} วินาที
                </div>
            </div>

            <MapContainer
                center={[centerLat, centerLng]}
                zoom={zoom}
                className="w-full h-full min-h-[400px] rounded-2xl z-0"
                style={{ background: "#1e293b" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {reports.length > 0 && <MapBoundsUpdater reports={reports} />}

                {reports.map((report) => (
                    <Marker
                        key={report.id}
                        position={[report.latitude, report.longitude]}
                        icon={createMarkerIcon(report.severity, report.status === "PENDING")}
                        eventHandlers={{
                            click: () => handleMarkerClick(report),
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="min-w-[250px] p-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: SEVERITY_COLORS[report.severity] }}
                                    ></div>
                                    <span className="font-bold text-slate-800">
                                        {DAMAGE_TYPE_LABELS[report.damageType] || report.damageType}
                                    </span>
                                </div>

                                <p className="text-sm text-slate-600 mb-2">📍 {report.location}</p>

                                {report.description && (
                                    <p className="text-sm text-slate-500 mb-2 line-clamp-2">
                                        {report.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-xs border-t pt-2 mt-2">
                                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">
                                        {STATUS_LABELS[report.status] || report.status}
                                    </span>
                                    <span className="text-slate-400">
                                        {formatDate(report.createdAt)}
                                    </span>
                                </div>

                                {report.user?.name && (
                                    <p className="text-xs text-slate-400 mt-2">
                                        รายงานโดย: {report.user.name}
                                    </p>
                                )}

                                <a
                                    href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full mt-3 py-2 bg-blue-600 text-white text-center text-sm rounded-lg hover:bg-blue-500 transition-all"
                                >
                                    🗺️ เปิดใน Google Maps
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Selected report detail panel (mobile) */}
            {selectedReport && (
                <div className="absolute bottom-0 left-0 right-0 z-[1000] lg:hidden bg-slate-800/95 backdrop-blur-lg p-4 rounded-t-2xl border-t border-slate-600">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: SEVERITY_COLORS[selectedReport.severity] }}
                            ></div>
                            <span className="font-bold text-white">
                                {DAMAGE_TYPE_LABELS[selectedReport.damageType]}
                            </span>
                        </div>
                        <button
                            onClick={() => setSelectedReport(null)}
                            className="text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">📍 {selectedReport.location}</p>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                            {STATUS_LABELS[selectedReport.status]}
                        </span>
                        <span className="text-xs text-slate-400">
                            {formatDate(selectedReport.createdAt)}
                        </span>
                    </div>
                </div>
            )}

            {/* Custom styles */}
            <style jsx global>{`
                .leaflet-container {
                    font-family: inherit;
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                .custom-popup .leaflet-popup-tip {
                    background: white;
                }
                .marker-pulse div {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
}
