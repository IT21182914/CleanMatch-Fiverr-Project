require("dotenv").config();
const { query } = require("./config/database");

async function checkMigrations() {
  try {
    console.log("Checking pgmigrations table...");

    const result = await query(
      "SELECT name, run_on FROM pgmigrations ORDER BY name"
    );

    console.log("\nMigrations in database:");
    console.log("========================");
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.name} | ${row.run_on}`);
    });

    console.log("\nMigration files in filesystem:");
    console.log("==============================");
    const fs = require("fs");
    const files = fs
      .readdirSync("./migrations")
      .filter((f) => f.endsWith(".js"));
    files.sort().forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    console.log("\nComparison:");
    console.log("===========");
    const dbMigrations = result.rows.map((row) => row.name);
    const fsMigrations = files.map((f) => f.replace(".js", ""));

    const missingInFs = dbMigrations.filter(
      (name) => !fsMigrations.includes(name)
    );
    const missingInDb = fsMigrations.filter(
      (name) => !dbMigrations.includes(name)
    );

    console.log("Missing in filesystem but recorded in DB:", missingInFs);
    console.log("Missing in DB but exists in filesystem:", missingInDb);

    process.exit(0);
  } catch (error) {
    console.error("Error checking migrations:", error);
    process.exit(1);
  }
}

checkMigrations();
