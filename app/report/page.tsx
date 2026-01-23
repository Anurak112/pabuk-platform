"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Damage type options with Thai labels
const DAMAGE_TYPES = [
    { value: "POTHOLE", label: "หลุม", labelEn: "Pothole", icon: "🕳️" },
    { value: "CRACK", label: "รอยแตก", labelEn: "Crack", icon: "⚡" },
    { value: "COLLAPSE", label: "ถนนทรุด", labelEn: "Collapse", icon: "📉" },
    { value: "EROSION", label: "การกัดเซาะ", labelEn: "Erosion", icon: "🌊" },
    { value: "FLOODING", label: "น้ำท่วมขัง", labelEn: "Flooding", icon: "💧" },
    { value: "SURFACE_WEAR", label: "ผิวถนนสึกหรอ", labelEn: "Surface Wear", icon: "🛣️" },
    { value: "BRIDGE_DAMAGE", label: "สะพานชำรุด", labelEn: "Bridge Damage", icon: "🌉" },
    { value: "SHOULDER_DAMAGE", label: "ไหล่ทางชำรุด", labelEn: "Shoulder Damage", icon: "⚠️" },
    { value: "OTHER", label: "อื่นๆ", labelEn: "Other", icon: "❓" },
];

// Severity levels with Thai labels
const SEVERITY_LEVELS = [
    { value: "LOW", label: "เล็กน้อย", labelEn: "Low", color: "bg-green-500", description: "รอยแตกเล็กๆ ไม่กระทบการขับขี่" },
    { value: "MEDIUM", label: "ปานกลาง", labelEn: "Medium", color: "bg-yellow-500", description: "หลุมขนาดกลาง ควรระวัง" },
    { value: "HIGH", label: "รุนแรง", labelEn: "High", color: "bg-orange-500", description: "หลุมใหญ่ อันตราย" },
    { value: "CRITICAL", label: "วิกฤต", labelEn: "Critical", color: "bg-red-500", description: "ไม่สามารถสัญจรได้ อันตรายมาก" },
];

export default function ReportPage() {
    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [location, setLocation] = useState("");
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsError, setGpsError] = useState<string | null>(null);
    const [severity, setSeverity] = useState<string>("");
    const [damageType, setDamageType] = useState<string>("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/auth/signin");
        }
    }, [status]);

    // Get current GPS location
    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setGpsError("เบราว์เซอร์ของคุณไม่รองรับ GPS");
            return;
        }

        setGpsLoading(true);
        setGpsError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setGpsLoading(false);
            },
            (error) => {
                setGpsError("ไม่สามารถระบุตำแหน่งได้: " + error.message);
                setGpsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    // Auto-get location on mount
    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation]);

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages = Array.from(files).slice(0, 4 - images.length);
        setImages((prev) => [...prev, ...newImages].slice(0, 4));

        // Create previews
        newImages.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview((prev) => [...prev, reader.result as string].slice(0, 4));
            };
            reader.readAsDataURL(file);
        });
    };

    // Remove image
    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreview((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!location.trim()) {
            setError("กรุณาระบุตำแหน่งหรือสถานที่");
            return;
        }
        if (latitude === null || longitude === null) {
            setError("กรุณาระบุพิกัด GPS");
            return;
        }
        if (!severity) {
            setError("กรุณาเลือกระดับความรุนแรง");
            return;
        }
        if (!damageType) {
            setError("กรุณาเลือกประเภทความเสียหาย");
            return;
        }
        if (images.length === 0) {
            setError("กรุณาถ่ายรูปอย่างน้อย 1 รูป");
            return;
        }

        setIsSubmitting(true);

        try {
            // For now, we'll just simulate success
            // TODO: Implement actual API call with image upload
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSubmitSuccess(true);
        } catch (err) {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
                <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-green-500/30">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-white mb-2">รายงานสำเร็จ!</h2>
                    <p className="text-blue-200 mb-6">
                        ขอบคุณที่ช่วยรายงานปัญหาถนน รายงานของคุณจะถูกตรวจสอบโดยเจ้าหน้าที่
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/map"
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all"
                        >
                            ดูแผนที่
                        </Link>
                        <button
                            onClick={() => {
                                setSubmitSuccess(false);
                                setLocation("");
                                setSeverity("");
                                setDamageType("");
                                setDescription("");
                                setImages([]);
                                setImagePreview([]);
                            }}
                            className="px-6 py-3 bg-yellow-400 text-slate-900 font-semibold rounded-xl hover:bg-yellow-300 transition-all"
                        >
                            รายงานอีกครั้ง
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-yellow-500/20">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold">
                            <span className="text-yellow-400">🛣️ Chaiyaphum</span>
                            <span className="text-white"> Road Monitor</span>
                        </Link>
                        <Link href="/dashboard" className="text-blue-200 hover:text-yellow-400 transition-all">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">รายงานถนนชำรุด</h1>
                    <p className="text-blue-200">ช่วยแจ้งปัญหาถนนในชัยภูมิ เพื่อความปลอดภัยของทุกคน</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* GPS Location */}
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span>📍</span> ตำแหน่ง GPS
                        </h3>

                        <div className="flex items-center gap-4 mb-4">
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={gpsLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {gpsLoading ? (
                                    <>
                                        <span className="animate-spin">⏳</span> กำลังระบุตำแหน่ง...
                                    </>
                                ) : (
                                    <>📍 ระบุตำแหน่งปัจจุบัน</>
                                )}
                            </button>
                        </div>

                        {gpsError && (
                            <p className="text-red-400 text-sm mb-4">{gpsError}</p>
                        )}

                        {latitude !== null && longitude !== null && (
                            <div className="bg-slate-900/50 rounded-lg p-3 text-sm">
                                <p className="text-green-400 mb-1">✅ ระบุตำแหน่งสำเร็จ</p>
                                <p className="text-slate-400">
                                    พิกัด: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                                </p>
                            </div>
                        )}

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                สถานที่ / ถนน / กม. (ระบุเพิ่มเติม) *
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="เช่น ถนนสาย 201 กม. 45 ใกล้โรงงานน้ำตาล"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-yellow-400 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Damage Type */}
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span>🔧</span> ประเภทความเสียหาย *
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {DAMAGE_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setDamageType(type.value)}
                                    className={`p-3 rounded-xl border-2 transition-all text-center ${damageType === type.value
                                            ? "border-yellow-400 bg-yellow-400/10"
                                            : "border-slate-600 hover:border-slate-500"
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{type.icon}</div>
                                    <div className="text-sm font-medium">{type.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Severity */}
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span>⚠️</span> ระดับความรุนแรง *
                        </h3>
                        <div className="space-y-3">
                            {SEVERITY_LEVELS.map((level) => (
                                <button
                                    key={level.value}
                                    type="button"
                                    onClick={() => setSeverity(level.value)}
                                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${severity === level.value
                                            ? "border-yellow-400 bg-yellow-400/10"
                                            : "border-slate-600 hover:border-slate-500"
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full ${level.color}`}></div>
                                    <div>
                                        <div className="font-bold">{level.label}</div>
                                        <div className="text-sm text-slate-400">{level.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Photos */}
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span>📸</span> รูปถ่าย * (สูงสุด 4 รูป)
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {imagePreview.map((src, index) => (
                                <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                                    <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-all"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {images.length < 4 && (
                            <label className="block cursor-pointer">
                                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-yellow-400 transition-all">
                                    <div className="text-4xl mb-2">📷</div>
                                    <p className="text-blue-200">คลิกเพื่อถ่ายรูปหรือเลือกไฟล์</p>
                                    <p className="text-slate-500 text-sm mt-1">เหลือ {4 - images.length} รูป</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span>📝</span> รายละเอียดเพิ่มเติม (ถ้ามี)
                        </h3>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="อธิบายเพิ่มเติม เช่น หลุมลึกประมาณ 10 ซม. อยู่กลางถนน รถบรรทุกอ้อยผ่านบ่อย"
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-yellow-400 focus:outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-yellow-400 text-slate-900 font-bold text-xl rounded-xl hover:bg-yellow-300 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-yellow-400/30"
                    >
                        {isSubmitting ? "กำลังส่ง..." : "📤 ส่งรายงาน"}
                    </button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-8">
                    รายงานของคุณจะถูกตรวจสอบโดยเจ้าหน้าที่ และจะได้รับคะแนนเมื่อรายงานถูกยืนยัน
                </p>
            </main>
        </div>
    );
}
