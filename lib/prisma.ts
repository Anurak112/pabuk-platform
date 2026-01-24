// Prisma 7 client - generated in app/generated/prisma
// Use lazy initialization to avoid build-time database connection issues
import { PrismaClient } from "../app/generated/prisma";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient();
    }
    return globalForPrisma.prisma;
}

// Export a getter function and a lazy proxy
const prisma = new Proxy({} as PrismaClient, {
    get(target, prop) {
        const client = getPrismaClient();
        return (client as unknown as Record<string | symbol, unknown>)[prop];
    },
});

export default prisma;
export { prisma };
