"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Home,
    LayoutDashboard,
    Upload,
    BookOpen,
    User
} from "lucide-react";

interface NavItem {
    href: string;
    icon: React.ElementType;
    label: string;
    labelTh: string;
}

const navItems: NavItem[] = [
    { href: "/", icon: Home, label: "Home", labelTh: "หน้าแรก" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", labelTh: "แดชบอร์ด" },
    { href: "/submit", icon: Upload, label: "Submit", labelTh: "ส่งข้อมูล" },
    { href: "/catalogue", icon: BookOpen, label: "Catalogue", labelTh: "คลังข้อมูล" },
    { href: "/profile", icon: User, label: "Profile", labelTh: "โปรไฟล์" },
];

export function MobileNav() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isStandalone, setIsStandalone] = useState(false);

    // Detect if running as installed PWA
    useEffect(() => {
        const isInStandaloneMode =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
        setIsStandalone(isInStandaloneMode);
    }, []);

    // Hide on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY + 10) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY - 10) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Only show on mobile screens
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (!isMobile) return null;

    return (
        <nav
            className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-slate-900/95 backdrop-blur-xl
        border-t border-slate-700/50
        transition-transform duration-300 ease-out
        ${isVisible ? "translate-y-0" : "translate-y-full"}
      `}
            style={{
                paddingBottom: isStandalone ? "env(safe-area-inset-bottom)" : "0",
            }}
        >
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex flex-col items-center justify-center
                flex-1 h-full py-2 px-1
                rounded-lg transition-all duration-200
                ${isActive
                                    ? "text-amber-400"
                                    : "text-slate-400 hover:text-slate-200"
                                }
              `}
                        >
                            <div className={`
                relative p-1.5 rounded-lg transition-all duration-200
                ${isActive
                                    ? "bg-amber-500/20"
                                    : "hover:bg-slate-800"
                                }
              `}>
                                <Icon className="w-5 h-5" />
                                {isActive && (
                                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                                )}
                            </div>
                            <span className="text-[10px] font-medium mt-1 line-clamp-1">
                                {item.labelTh}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
