import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

// Build providers array - always include Credentials for development/build
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: any[] = [
    // Credentials provider for development/testing
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            // For development only - accept any credentials
            if (credentials?.email) {
                return {
                    id: credentials.email as string,
                    email: credentials.email as string,
                    name: (credentials.email as string).split("@")[0],
                    role: "CONTRIBUTOR",
                    provinceId: null,
                };
            }
            return null;
        },
    }),
];

// Add Google if configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

// Add GitHub if configured
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        })
    );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = "CONTRIBUTOR";
                token.provinceId = "";
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!;
                session.user.role = (token.role as string) || "CONTRIBUTOR";
                session.user.provinceId = (token.provinceId as string) || "";
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
});

