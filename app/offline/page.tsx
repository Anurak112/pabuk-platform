"use client";

import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Offline Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4">
                        <WifiOff className="w-12 h-12 text-amber-400" />
                    </div>
                </div>

                {/* Thai Text */}
                <h1 className="text-3xl font-bold text-white mb-3">
                    คุณอยู่ในโหมดออฟไลน์
                </h1>
                <p className="text-slate-400 mb-2">
                    You are currently offline
                </p>

                {/* Description */}
                <p className="text-slate-500 mb-8 leading-relaxed">
                    ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้ในขณะนี้
                    กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg shadow-amber-500/20"
                    >
                        <RefreshCw className="w-5 h-5" />
                        ลองใหม่อีกครั้ง
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 text-slate-300 font-medium rounded-xl hover:bg-slate-700 transition-all duration-200 border border-slate-600/50"
                    >
                        <Home className="w-5 h-5" />
                        กลับหน้าแรก
                    </Link>
                </div>

                {/* Cached Data Notice */}
                <div className="mt-12 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <p className="text-sm text-slate-400">
                        💡 <span className="text-slate-300">หมายเหตุ:</span> คุณยังสามารถดูข้อมูลที่เคยเข้าชมได้จากแคช
                    </p>
                </div>

                {/* Network Status Indicator */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span>ไม่ได้เชื่อมต่อ</span>
                </div>
            </div>
        </div>
    );
}
