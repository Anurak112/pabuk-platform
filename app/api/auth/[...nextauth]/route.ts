import { handlers } from "@/lib/auth";

// Dynamic route - skip static generation
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const { GET, POST } = handlers;
