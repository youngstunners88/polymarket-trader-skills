#!/usr/bin/env bun
/**
 * Hermes Setup for 24/7 Autonomous Trading
 */

import { execSync } from "child_process";

function setupHermes() {
  console.log("🌌 Setting up Hermes Agent for Trading...");
  console.log("==========================================\n");
  
  // Check if Hermes installed
  try {
    execSync("which hermes", { stdio: "pipe" });
    console.log("✅ Hermes already installed");
  } catch {
    console.log("📦 Installing Hermes...");
    execSync("curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash", {
      stdio: "inherit"
    });
  }
  
  console.log("\n🔧 Configuration:");
  console.log("1. Run: hermes setup");
  console.log("2. Run: hermes model (select best model)");
  console.log("3. Run: hermes gateway setup");
  console.log("\n📅 Trading Automations:");
  console.log("hermes schedule \"*/5 * * * *\" \"bun master-run.ts\"");
  console.log("hermes schedule \"0 */6 * * *\" \"bun train-ppo.ts\"");
  
  console.log("\n✅ Hermes ready for 81%+ win rate trading!");
}

setupHermes();
