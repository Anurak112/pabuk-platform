"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { THAI_PROVINCES, REGIONS } from "@/lib/thai-provinces";

const DATA_TYPES = [
    { value: "TEXT", label: "ข้อความ", icon: "📝", description: "นิทาน, สุภาษิต, ประวัติศาสตร์ท้องถิ่น" },
    { value: "AUDIO", label: "เสียง", icon: "🎵", description: "ภาษาถิ่น, เพลงพื้นบ้าน, เสียงเทศกาล" },
    { value: "IMAGE", label: "รูปภาพ", icon: "📸", description: "สถานที่, อาหาร, วัตถุวัฒนธรรม" },
    { value: "SYNTHETIC", label: "สังเคราะห์", icon: "🤖", description: "ข้อมูลสร้างโดย AI" },
];

const CATEGORIES: Record<string, { value: string; label: string }[]> = {
    TEXT: [
        { value: "FOLKTALE", label: "นิทานพื้นบ้าน" },
        { value: "PROVERB", label: "สุภาษิต" },
        { value: "HISTORY", label: "ประวัติศาสตร์ท้องถิ่น" },
        { value: "DIALECT", label: "ภาษาถิ่น/คำศัพท์" },
        { value: "OTHER", label: "อื่นๆ" },
    ],
    AUDIO: [
        { value: "DIALECT", label: "บันทึกเสียงภาษาถิ่น" },
        { value: "FOLK_SONG", label: "เพลงพื้นบ้าน" },
        { value: "FESTIVAL_SOUND", label: "เสียงงานประเพณี" },
        { value: "OTHER", label: "อื่นๆ" },
    ],
    IMAGE: [
        { value: "LANDMARK", label: "สถานที่สำคัญ" },
        { value: "LANDSCAPE", label: "ทิวทัศน์" },
        { value: "CULTURAL_OBJECT", label: "วัตถุทางวัฒนธรรม" },
        { value: "FOOD", label: "อาหารท้องถิ่น" },
        { value: "OTHER", label: "อื่นๆ" },
    ],
    SYNTHETIC: [
        { value: "OTHER", label: "ข้อมูลสังเคราะห์" },
    ],
};

export default function SubmitPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        type: "",
        category: "",
        provinceId: "",
        title: "",
        titleTh: "",
        content: "",
        dialect: "",
        file: null as File | null,
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/contributions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: form.type,
                    category: form.category,
                    provinceId: form.provinceId,
                    title: form.title,
                    titleTh: form.titleTh,
                    content: form.content,
                    dialect: form.dialect,
                }),
            });

            if (res.ok) {
                router.push("/dashboard?submitted=true");
            } else {
                alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
            }
        } catch {
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-white mb-4">กรุณาเข้าสู่ระบบ</h2>
                    <p className="text-blue-200 mb-6">คุณต้องเข้าสู่ระบบก่อนส่งข้อมูล</p>
                    <Link href="/auth/signin" className="px-6 py-3 bg-yellow-400 text-slate-900 font-bold rounded-lg">
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-lg border-b border-yellow-400/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold">
                        <span className="text-yellow-400">Pabuk</span>
                        <span className="text-white">.ai</span>
                    </Link>
                    <Link href="/auth/signin" className="px-4 py-2 bg-yellow-400 text-slate-900 font-bold rounded-lg">
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? "bg-yellow-400 text-slate-900" : "bg-slate-700 text-slate-400"
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 3 && <div className={`w-20 h-1 ${step > s ? "bg-yellow-400" : "bg-slate-700"}`}></div>}
                        </div>
                    ))}
                </div>

                {/* Step Title */}
                <h1 className="text-3xl font-black text-white text-center mb-2">
                    ส่งข้อมูลใหม่
                </h1>
                <p className="text-blue-200 text-center mb-8">
                    {step === 1 && "เลือกประเภทข้อมูล"}
                    {step === 2 && "กรอกรายละเอียด"}
                    {step === 3 && "ตรวจสอบและส่ง"}
                </p>

                {/* Step 1: Choose Type */}
                {step === 1 && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {DATA_TYPES.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => {
                                    setForm({ ...form, type: type.value, category: "" });
                                    setStep(2);
                                }}
                                className="p-6 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 rounded-xl text-left hover:border-yellow-400 transition-all group"
                            >
                                <div className="text-4xl mb-3">{type.icon}</div>
                                <h3 className="text-xl font-bold text-white group-hover:text-yellow-400">{type.label}</h3>
                                <p className="text-sm text-slate-400 mt-2">{type.description}</p>
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Fill Details */}
                {step === 2 && (
                    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 space-y-6">
                        {/* Province */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">จังหวัด*</label>
                            <select
                                value={form.provinceId}
                                onChange={(e) => setForm({ ...form, provinceId: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                required
                            >
                                <option value="">เลือกจังหวัด</option>
                                {REGIONS.map((region) => (
                                    <optgroup key={region.value} label={`${region.labelTh} (${region.labelEn})`}>
                                        {THAI_PROVINCES.filter((p) => p.region === region.value).map((province) => (
                                            <option key={province.id} value={province.id}>
                                                {province.nameTh} ({province.nameEn})
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">หมวดหมู่*</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                required
                            >
                                <option value="">เลือกหมวดหมู่</option>
                                {CATEGORIES[form.type]?.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">ชื่อเรื่อง (ภาษาไทย)*</label>
                            <input
                                type="text"
                                value={form.titleTh}
                                onChange={(e) => setForm({ ...form, titleTh: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                placeholder="เช่น นิทานปลาบู่ทอง"
                                required
                            />
                        </div>

                        {/* Content for Text */}
                        {form.type === "TEXT" && (
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">เนื้อหา*</label>
                                <textarea
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white h-48"
                                    placeholder="เนื้อหาข้อมูลของคุณ..."
                                    required
                                />
                            </div>
                        )}

                        {/* File Upload for Audio/Image */}
                        {(form.type === "AUDIO" || form.type === "IMAGE") && (
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">อัปโหลดไฟล์</label>
                                <input
                                    type="file"
                                    accept={form.type === "AUDIO" ? "audio/*" : "image/*"}
                                    onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    {form.type === "AUDIO" ? "รองรับ MP3, WAV, M4A" : "รองรับ JPG, PNG, WebP"}
                                </p>
                            </div>
                        )}

                        {/* Dialect */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">ภาษาถิ่น (ถ้ามี)</label>
                            <input
                                type="text"
                                value={form.dialect}
                                onChange={(e) => setForm({ ...form, dialect: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                placeholder="เช่น อีสาน, ใต้, เหนือ"
                            />
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition-all"
                            >
                                ← กลับ
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!form.provinceId || !form.category || !form.titleTh}
                                className="flex-1 py-3 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transition-all disabled:opacity-50"
                            >
                                ต่อไป →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-6">ตรวจสอบข้อมูล</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                <span className="text-slate-400">ประเภท</span>
                                <span className="text-white">{DATA_TYPES.find((t) => t.value === form.type)?.label}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                <span className="text-slate-400">จังหวัด</span>
                                <span className="text-white">
                                    {THAI_PROVINCES.find((p) => p.id === form.provinceId)?.nameTh}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                <span className="text-slate-400">หมวดหมู่</span>
                                <span className="text-white">
                                    {CATEGORIES[form.type]?.find((c) => c.value === form.category)?.label}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                <span className="text-slate-400">ชื่อเรื่อง</span>
                                <span className="text-white">{form.titleTh}</span>
                            </div>
                            {form.dialect && (
                                <div className="flex justify-between border-b border-slate-700 pb-2">
                                    <span className="text-slate-400">ภาษาถิ่น</span>
                                    <span className="text-white">{form.dialect}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition-all"
                            >
                                ← แก้ไข
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 py-3 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transition-all disabled:opacity-50"
                            >
                                {loading ? "กำลังส่ง..." : "✓ ส่งข้อมูล"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
