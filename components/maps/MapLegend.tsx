"use client";

const SEVERITY_ITEMS = [
    { key: "CRITICAL", color: "#ef4444", label: "วิกฤต" },
    { key: "HIGH", color: "#f97316", label: "รุนแรง" },
    { key: "MEDIUM", color: "#eab308", label: "ปานกลาง" },
    { key: "LOW", color: "#22c55e", label: "เล็กน้อย" },
];

const STATUS_ITEMS = [
    { key: "PENDING", icon: "⏳", label: "รอตรวจสอบ" },
    { key: "VERIFIED", icon: "✓", label: "ยืนยันแล้ว" },
    { key: "IN_PROGRESS", icon: "🔧", label: "กำลังซ่อม" },
    { key: "REPAIRED", icon: "✅", label: "ซ่อมแล้ว" },
];

interface MapLegendProps {
    className?: string;
    compact?: boolean;
}

export default function MapLegend({ className = "", compact = false }: MapLegendProps) {
    if (compact) {
        return (
            <div className={`flex flex-wrap gap-3 ${className}`}>
                {SEVERITY_ITEMS.map((item) => (
                    <div key={item.key} className="flex items-center gap-1.5">
                        <div
                            className="w-3 h-3 rounded-full border border-white/30"
                            style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-xs text-slate-400">{item.label}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={`bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700 ${className}`}>
            <h4 className="font-semibold text-white mb-3 text-sm">สัญลักษณ์แผนที่</h4>

            {/* Severity Legend */}
            <div className="mb-4">
                <p className="text-xs text-slate-400 mb-2">ระดับความรุนแรง</p>
                <div className="space-y-2">
                    {SEVERITY_ITEMS.map((item) => (
                        <div key={item.key} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full border-2 border-white"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm text-slate-300">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Legend */}
            <div>
                <p className="text-xs text-slate-400 mb-2">สถานะรายงาน</p>
                <div className="space-y-2">
                    {STATUS_ITEMS.map((item) => (
                        <div key={item.key} className="flex items-center gap-2">
                            <span className="w-4 text-center">{item.icon}</span>
                            <span className="text-sm text-slate-300">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
