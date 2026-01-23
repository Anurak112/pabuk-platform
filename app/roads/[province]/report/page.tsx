"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect, notFound } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getProvinceById } from "@/lib/thai-provinces";

const DAMAGE_TYPES = [
    { value: "POTHOLE", label: "หลุม", icon: "🕳️" },
    { value: "CRACK", label: "รอยแตก", icon: "⚡" },
    { value: "COLLAPSE", label: "ถนนทรุด", icon: "📉" },
    { value: "EROSION", label: "การกัดเซาะ", icon: "🌊" },
    { value: "FLOODING", label: "น้ำท่วมขัง", icon: "💧" },
    { value: "SURFACE_WEAR", label: "ผิวถนนสึกหรอ", icon: "🛣️" },
    { value: "OTHER", label: "อื่นๆ", icon: "❓" },
];

const SEVERITY_LEVELS = [
    { value: "LOW", label: "เล็กน้อย", color: "bg-green-500", desc: "รอยแตกเล็กๆ" },
    { value: "MEDIUM", label: "ปานกลาง", color: "bg-yellow-500", desc: "หลุมขนาดกลาง" },
    { value: "HIGH", label: "รุนแรง", color: "bg-orange-500", desc: "หลุมใหญ่ อันตราย" },
    { value: "CRITICAL", label: "วิกฤต", color: "bg-red-500", desc: "ไม่สามารถสัญจรได้" },
];

export default function ProvinceReportPage() {
    const params = useParams();
    const provinceId = params.province as string;
    const province = getProvinceById(provinceId);
    const { status } = useSession();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState("");
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [severity, setSeverity] = useState("");
    const [damageType, setDamageType] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    if (!province) notFound();

    useEffect(() => { if (status === "unauthenticated") redirect("/auth/signin"); }, [status]);

    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) return;
        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => { setLatitude(pos.coords.latitude); setLongitude(pos.coords.longitude); setGpsLoading(false); },
            () => setGpsLoading(false),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    useEffect(() => { getCurrentLocation(); }, [getCurrentLocation]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newImages = Array.from(files).slice(0, 4 - images.length);
        setImages(prev => [...prev, ...newImages].slice(0, 4));
        newImages.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(prev => [...prev, reader.result as string].slice(0, 4));
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location.trim()) return setError("กรุณาระบุตำแหน่ง");
        if (!severity) return setError("กรุณาเลือกความรุนแรง");
        if (!damageType) return setError("กรุณาเลือกประเภท");
        if (images.length === 0) return setError("กรุณาถ่ายรูป");

        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        setSubmitSuccess(true);
        setIsSubmitting(false);
    };

    if (status === "loading") return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="animate-spin h-12 w-12 border-b-2 border-orange-400 rounded-full"></div></div>;

    if (submitSuccess) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md text-center border border-green-500/30">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-white mb-2">รายงานสำเร็จ!</h2>
                <p className="text-blue-200 mb-6">ขอบคุณที่ช่วยรายงานปัญหาถนนใน{province.nameTh}</p>
                <div className="flex gap-4 justify-center">
                    <Link href={`/roads/${provinceId}/map`} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl">ดูแผนที่</Link>
                    <Link href={`/roads/${provinceId}`} className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl">กลับหน้าหลัก</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-orange-500/20">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href={`/roads/${provinceId}`} className="text-xl font-bold flex items-center gap-2">
                        <span>🛣️</span><span className="text-orange-400">{province.nameTh}</span>
                    </Link>
                    <Link href={`/roads/${provinceId}`} className="text-blue-200 hover:text-orange-400">← กลับ</Link>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-black mb-2">รายงานถนนชำรุด</h1>
                <p className="text-blue-200 mb-8">จังหวัด{province.nameTh}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700">
                        <h3 className="font-bold mb-4">📍 ตำแหน่ง</h3>
                        <button type="button" onClick={getCurrentLocation} disabled={gpsLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4 disabled:opacity-50">
                            {gpsLoading ? "กำลังระบุ..." : "📍 ระบุตำแหน่ง"}
                        </button>
                        {latitude && <p className="text-green-400 text-sm mb-4">✅ พิกัด: {latitude.toFixed(6)}, {longitude?.toFixed(6)}</p>}
                        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="ระบุสถานที่" className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white" />
                    </div>

                    <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700">
                        <h3 className="font-bold mb-4">🔧 ประเภท *</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {DAMAGE_TYPES.map(t => (
                                <button key={t.value} type="button" onClick={() => setDamageType(t.value)} className={`p-3 rounded-xl border-2 text-center ${damageType === t.value ? "border-orange-400 bg-orange-400/10" : "border-slate-600"}`}>
                                    <div className="text-2xl">{t.icon}</div><div className="text-sm">{t.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700">
                        <h3 className="font-bold mb-4">⚠️ ความรุนแรง *</h3>
                        <div className="space-y-3">
                            {SEVERITY_LEVELS.map(l => (
                                <button key={l.value} type="button" onClick={() => setSeverity(l.value)} className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 ${severity === l.value ? "border-orange-400 bg-orange-400/10" : "border-slate-600"}`}>
                                    <div className={`w-4 h-4 rounded-full ${l.color}`}></div>
                                    <div><div className="font-bold">{l.label}</div><div className="text-sm text-slate-400">{l.desc}</div></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700">
                        <h3 className="font-bold mb-4">📸 รูปถ่าย *</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {imagePreview.map((src, i) => (
                                <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => { setImages(p => p.filter((_, idx) => idx !== i)); setImagePreview(p => p.filter((_, idx) => idx !== i)); }} className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full">✕</button>
                                </div>
                            ))}
                        </div>
                        {images.length < 4 && (
                            <label className="block cursor-pointer border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-orange-400">
                                <div className="text-4xl mb-2">📷</div><p className="text-blue-200">คลิกเพื่อถ่ายรูป</p>
                                <input type="file" accept="image/*" capture="environment" multiple onChange={handleImageChange} className="hidden" />
                            </label>
                        )}
                    </div>

                    {error && <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300">{error}</div>}

                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-orange-500 text-white font-bold text-xl rounded-xl hover:bg-orange-400 disabled:opacity-50 shadow-lg">
                        {isSubmitting ? "กำลังส่ง..." : "📤 ส่งรายงาน"}
                    </button>
                </form>
            </main>
        </div>
    );
}
