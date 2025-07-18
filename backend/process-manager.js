#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

let serverProcess = null;
let restartCount = 0;
const MAX_RESTARTS = 5;
const RESTART_DELAY = 5000; // 5 seconds

function startServer() {
  console.log("🚀 Starting CleanMatch server...");

  serverProcess = spawn("node", ["server.js"], {
    stdio: ["inherit", "inherit", "inherit"],
    cwd: __dirname,
    env: process.env,
  });

  serverProcess.on("exit", (code, signal) => {
    console.log(`\n❌ Server exited with code ${code} and signal ${signal}`);

    if (signal === "SIGINT" || signal === "SIGTERM") {
      console.log("✅ Server shutdown gracefully");
      process.exit(0);
    }

    if (restartCount < MAX_RESTARTS) {
      restartCount++;
      console.log(
        `🔄 Restarting server... (attempt ${restartCount}/${MAX_RESTARTS})`
      );

      setTimeout(() => {
        startServer();
      }, RESTART_DELAY);
    } else {
      console.error(
        `❌ Max restarts (${MAX_RESTARTS}) reached. Server will not restart.`
      );
      process.exit(1);
    }
  });

  serverProcess.on("error", (error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Received SIGINT, shutting down gracefully...");
  if (serverProcess) {
    serverProcess.kill("SIGINT");
  }
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
  }
});

// Start the server
startServer();

// Reset restart count on successful operation (after 5 minutes)
setInterval(() => {
  if (restartCount > 0) {
    console.log("✅ Server stable, resetting restart count");
    restartCount = 0;
  }
}, 5 * 60 * 1000); // 5 minutes
