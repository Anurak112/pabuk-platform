"use client";

import { useEffect, useState } from "react";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

const DISMISS_KEY = "pwa-install-dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);

    useEffect(() => {
        // Check if already installed
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Check if previously dismissed
        const dismissedAt = localStorage.getItem(DISMISS_KEY);
        if (dismissedAt) {
            const dismissedTime = parseInt(dismissedAt, 10);
            if (Date.now() - dismissedTime < DISMISS_DURATION) {
                return; // Still within dismiss period
            } else {
                localStorage.removeItem(DISMISS_KEY);
            }
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // Listen for successful installation
        window.addEventListener("appinstalled", () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        setIsInstalling(true);

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === "accepted") {
                setShowPrompt(false);
                setDeferredPrompt(null);
            }
        } catch (error) {
            console.error("Install prompt error:", error);
        } finally {
            setIsInstalling(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem(DISMISS_KEY, Date.now().toString());
    };

    if (isInstalled || !showPrompt || !deferredPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:max-w-sm">
            <div
                className="
          bg-gradient-to-br from-slate-800 to-slate-900
          border border-slate-700/50
          rounded-2xl shadow-2xl shadow-black/50
          p-4 animate-slide-up
        "
            >
                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white transition-colors"
                    aria-label="ปิด"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Smartphone className="w-7 h-7 text-white" />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 pr-6">
                        <h3 className="font-semibold text-white mb-1">
                            ติดตั้ง Pabuk.ai
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2">
                            เพิ่มแอปไปที่หน้าจอหลักเพื่อเข้าถึงได้เร็วขึ้น
                        </p>
                    </div>
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap gap-2 mt-3 mb-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300">
                        ⚡ เข้าถึงเร็ว
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300">
                        📱 ใช้งานออฟไลน์
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300">
                        🔔 แจ้งเตือน
                    </span>
                </div>

                {/* Install Button */}
                <button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="
            w-full flex items-center justify-center gap-2
            py-3 px-4 rounded-xl
            bg-gradient-to-r from-amber-500 to-orange-500
            hover:from-amber-600 hover:to-orange-600
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-medium
            transition-all duration-200
            shadow-lg shadow-amber-500/20
          "
                >
                    {isInstalling ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            กำลังติดตั้ง...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            ติดตั้งแอป
                        </>
                    )}
                </button>

                {/* Dismiss Link */}
                <button
                    onClick={handleDismiss}
                    className="w-full mt-2 py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                    ไม่ใช่ตอนนี้
                </button>
            </div>
        </div>
    );
}
