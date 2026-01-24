// Prisma 7 configuration - connection URLs
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL for migrations if available, otherwise DATABASE_URL
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
