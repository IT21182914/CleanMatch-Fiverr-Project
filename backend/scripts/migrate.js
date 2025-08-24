#!/usr/bin/env node
require("dotenv").config();

// robust load: prefer named `runner`, fall back to default or module itself
const mod = require("node-pg-migrate");
const migrate =
  mod && typeof mod.runner === "function"
    ? mod.runner
    : mod && typeof mod.default === "function"
    ? mod.default
    : typeof mod === "function"
    ? mod
    : null;

if (!migrate) {
  console.error("Could not load node-pg-migrate programmatic API.");
  process.exit(1);
}

function makeUrl() {
  const {
    DATABASE_URL,
    DATABASE_HOST,
    DATABASE_PORT = 5432,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD = "",
    PGSSLMODE = "require", // Supabase needs SSL
  } = process.env;
  if (DATABASE_URL) {
    // Add SSL parameter to existing URL
    const url = new URL(DATABASE_URL);
    url.searchParams.set("sslmode", "require");
    url.searchParams.set("ssl", "true");
    return url.toString();
  }
  if (!DATABASE_HOST || !DATABASE_NAME || !DATABASE_USER) {
    throw new Error("Missing DB env vars.");
  }
  return `postgres://${encodeURIComponent(DATABASE_USER)}:${encodeURIComponent(
    DATABASE_PASSWORD
  )}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?sslmode=require&ssl=true`;
}

(async () => {
  const direction = (process.argv[2] || "up").toLowerCase(); // 'up' | 'down'
  const count = process.argv[3] ? Number(process.argv[3]) : undefined;

  await migrate({
    databaseUrl: makeUrl(),
    dir: "migrations",
    migrationsTable: "pgmigrations",
    direction,
    count,
    logger: console,
    ignorePattern: "\\..*",
    ssl: {
      rejectUnauthorized: false,
      ca: false,
    },
  });

  console.log(`✔ migrations ${direction}${count ? " " + count : ""}`);
})().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
