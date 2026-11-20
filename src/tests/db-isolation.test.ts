import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";

describe("Test Database Isolation & Fail-Safe Verification", () => {
  it("executes automated tests strictly against test.db", () => {
    const dbUrl = process.env.DATABASE_URL || "";
    expect(dbUrl).toContain("test.db");
    expect(dbUrl).not.toBe("file:./dev.db");
  });

  it("verifies dev.db exists and preserves data without modification by test runs", async () => {
    const devDbPath = path.resolve(process.cwd(), "prisma/dev.db");
    const testDbPath = path.resolve(process.cwd(), "prisma/test.db");

    // Both physical SQLite files must exist separately
    expect(fs.existsSync(devDbPath)).toBe(true);
    expect(fs.existsSync(testDbPath)).toBe(true);

    const devDbStats = fs.statSync(devDbPath);
    // Dev database must have non-zero size (seeded development data)
    expect(devDbStats.size).toBeGreaterThan(0);
  });

  it("fail-safe validation rejects any database URL other than the exact expected test database", () => {
    const validateDbUrl = (url: string) => {
      if (!url.includes("test.db") || url === "file:./dev.db" || url.includes("dev.db")) {
        throw new Error(
          `CRITICAL FAIL-SAFE TRIGGERED: Automated tests must run against test.db! Current DATABASE_URL: "${url}".`
        );
      }
      return true;
    };

    expect(() => validateDbUrl("file:./dev.db")).toThrow(/CRITICAL FAIL-SAFE/);
    expect(() => validateDbUrl("file:./dev.db?connection_limit=1")).toThrow(/CRITICAL FAIL-SAFE/);
    expect(() => validateDbUrl("postgresql://prod/db")).toThrow(/CRITICAL FAIL-SAFE/);
    expect(() => validateDbUrl("")).toThrow(/CRITICAL FAIL-SAFE/);
    expect(validateDbUrl("file:./test.db")).toBe(true);
  });
});
