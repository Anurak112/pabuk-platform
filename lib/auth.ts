/**
 * NextAuth.js Auth Utilities (v4)
 * Provides getServerSession helper for server-side auth
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Re-export for convenience
export { authOptions };

// Server-side auth helper
export async function auth() {
    return await getServerSession(authOptions);
}

// Placeholder exports for components that might use these
export const signIn = async (provider?: string) => {
    // Client-side signIn should use next-auth/react
    throw new Error("Use signIn from next-auth/react on client side");
};

export const signOut = async () => {
    // Client-side signOut should use next-auth/react
    throw new Error("Use signOut from next-auth/react on client side");
};
