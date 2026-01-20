"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { THAI_PROVINCES, REGIONS } from "@/lib/thai-provinces";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        provinceId: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "เกิดข้อผิดพลาด");
                return;
            }

            router.push("/auth/signin?registered=true");
        } catch {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold">
                        <span className="text-yellow-400">Pabuk</span>
                        <span className="text-white">.ai</span>
                    </Link>
                    <p className="text-blue-200 mt-2">สมัครเป็นผู้ร่วมสร้างคลังข้อมูลไทย</p>
                </div>

                {/* Form */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">สมัครสมาชิก</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">ชื่อ-นามสกุล*</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400"
                                placeholder="สมชาย ใจดี"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Email*</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400"
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">จังหวัดที่สังกัด*</label>
                            <select
                                value={form.provinceId}
                                onChange={(e) => setForm({ ...form, provinceId: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
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
                            <p className="text-xs text-slate-500 mt-1">
                                ทั้งหมด 77 จังหวัดของประเทศไทย
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transition-all disabled:opacity-50"
                        >
                            {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 mt-6">
                        มีบัญชีแล้ว?{" "}
                        <Link href="/auth/signin" className="text-yellow-400 hover:underline">
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
