#!/usr/bin/env bun
/**
 * MASTER ORCHESTRATOR v4.0
 * Runs Hyperliquid + Polymarket simultaneously, 24/7
 */

import { spawn } from "child_process";
import { appendFile } from "fs/promises";

const LOG_FILE = "/home/workspace/polymarket-trader-skills/data/orchestrator.log";

async function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  await appendFile(LOG_FILE, line + "\n");
}

async function runHyperliquidCycle() {
  await log("🔥 Running Hyperliquid cycle...");
  
  try {
    const result = spawn("bun", [
      "/home/workspace/polymarket-trader-skills/crypto-secondary/hyperliquid-executor/scripts/execute.ts",
      "ETH", "BUY", "0.01"
    ], {
      env: { ...process.env, Private: process.env.Private || "" }
    });

    let output = "";
    result.stdout?.on("data", (d) => { output += d; });
    result.stderr?.on("data", (d) => { output += d; });

    await new Promise((resolve) => result.on("close", resolve));
    
    if (output.includes("✅ EXECUTED")) {
      await log("✅ Hyperliquid trade executed");
      return true;
    }
  } catch (e: any) {
    await log(`❌ Hyperliquid error: ${e.message}`);
  }
  
  return false;
}

async function runPolymarketCycle() {
  await log("🗳️  Running Polymarket cycle...");
  
  // Check if proxy configured
  if (!process.env.PROXY_URL) {
    await log("⚠️  Polymarket skipped: No proxy configured");
    return false;
  }

  await log("⚠️  Polymarket: Needs valid market params");
  return false;
}

async function main() {
  await log("═══════════════════════════════════════");
  await log("🌌 MASTER ORCHESTRATOR v4.0 STARTED");
  await log("═══════════════════════════════════════");
  await log("Chains: Hyperliquid + Polymarket");
  await log("Mode: 24/7 Autonomous");
  await log("Target: 81% win rate\n");

  while (true) {
    const hlResult = await runHyperliquidCycle();
    const pmResult = await runPolymarketCycle();

    const total = (hlResult ? 1 : 0) + (pmResult ? 1 : 0);
    await log(`\n📊 Cycle complete: ${total} trades\n`);

    await log("⏱️  Sleeping 60s...\n");
    await new Promise(r => setTimeout(r, 60000));
  }
}

main();
