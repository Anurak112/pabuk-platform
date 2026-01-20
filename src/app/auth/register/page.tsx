"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const REGIONS = [
    { value: "NORTH", label: "ภาคเหนือ", labelEn: "North" },
    { value: "NORTHEAST", label: "ภาคตะวันออกเฉียงเหนือ", labelEn: "Northeast" },
    { value: "CENTRAL", label: "ภาคกลาง", labelEn: "Central" },
    { value: "EAST", label: "ภาคตะวันออก", labelEn: "East" },
    { value: "WEST", label: "ภาคตะวันตก", labelEn: "West" },
    { value: "SOUTH", label: "ภาคใต้", labelEn: "South" },
];

// Pilot provinces for MVP
const PROVINCES = [
    { id: "bangkok", nameEn: "Bangkok", nameTh: "กรุงเทพมหานคร", region: "CENTRAL" },
    { id: "chiang-mai", nameEn: "Chiang Mai", nameTh: "เชียงใหม่", region: "NORTH" },
    { id: "nakhon-si-thammarat", nameEn: "Nakhon Si Thammarat", nameTh: "นครศรีธรรมราช", region: "SOUTH" },
];

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        provinceId: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Registration failed");
            }

            router.push("/auth/signin?registered=true");
        } catch (err) {
            setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black">
                        <span className="text-yellow-400">Pabuk</span>
                        <span className="text-white">.ai</span>
                    </h1>
                    <p className="text-blue-200 mt-2">
                        สมัครเป็นผู้ร่วมสร้างคลังข้อมูลไทย
                    </p>
                </div>

                {/* Card */}
                <div className="bg-slate-800/50 backdrop-blur-lg border border-yellow-400/20 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        สมัครสมาชิก
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-2">
                                ชื่อ-นามสกุล *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="สมชาย ใจดี"
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                                อีเมล *
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Province */}
                        <div>
                            <label htmlFor="province" className="block text-sm font-medium text-blue-200 mb-2">
                                จังหวัดที่สังกัด *
                            </label>
                            <select
                                id="province"
                                value={formData.provinceId}
                                onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                required
                            >
                                <option value="">เลือกจังหวัด</option>
                                {REGIONS.map((region) => (
                                    <optgroup key={region.value} label={region.label}>
                                        {PROVINCES.filter((p) => p.region === region.value).map((province) => (
                                            <option key={province.id} value={province.id}>
                                                {province.nameTh} ({province.nameEn})
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-slate-400">
                                * MVP เปิดรับเฉพาะ 3 จังหวัดนำร่อง
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-yellow-400 text-slate-900 font-bold rounded-xl hover:bg-yellow-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {isLoading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-slate-400 text-sm">
                        มีบัญชีอยู่แล้ว?{" "}
                        <a href="/auth/signin" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                            เข้าสู่ระบบ
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
