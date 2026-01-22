"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { MobileNav, InstallPrompt } from "@/components/pwa";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                <MobileNav />
                <InstallPrompt />
            </QueryClientProvider>
        </SessionProvider>
    );
}
