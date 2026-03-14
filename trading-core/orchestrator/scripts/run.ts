#!/usr/bin/env bun
/**
 * Trading Orchestrator - Main Entry Point
 * Coordinates all trading skills for 24/7 autonomous operation
 */

import { Orchestrator } from "./orchestrator";

const orchestrator = new Orchestrator();

async function main() {
  console.log("🚀 Starting Polymarket Trading System...");
  console.log("📊 Primary: Polymarket | Secondary: Crypto");
  
  await orchestrator.start();
  
  // Keep running
  process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down gracefully...");
    await orchestrator.stop();
    process.exit(0);
  });
  
  process.on("SIGTERM", async () => {
    await orchestrator.stop();
    process.exit(0);
  });
}

main().catch(console.error);
