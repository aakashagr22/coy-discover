import { beforeAll } from "vitest";
import { prisma } from "../lib/prisma";
import { seedDatabase } from "../../prisma/seed";
import { execSync } from "child_process";

beforeAll(async () => {
  const dbUrl = process.env.DATABASE_URL || "";

  // 1. Critical Fail-Safe: reject execution if the active database is NOT test.db
  if (!dbUrl.includes("test.db")) {
    throw new Error(
      `CRITICAL FAIL-SAFE TRIGGERED: Automated tests must run against test.db! Current DATABASE_URL: "${dbUrl}". Aborting test execution to protect development database.`
    );
  }

  // 2. Ensure test.db schema exists
  try {
    await prisma.user.findFirst();
  } catch {
    // If SQLite test.db does not have tables yet, sync schema
    execSync("npx prisma db push --skip-generate --accept-data-loss", {
      env: { ...process.env, DATABASE_URL: "file:./test.db" },
      stdio: "ignore",
    });
  }

  // 3. Ensure test.db contains the seeded demo user and profiles
  const profileCount = await prisma.profile.count();
  if (profileCount < 32) {
    await seedDatabase(prisma);
  }
});
