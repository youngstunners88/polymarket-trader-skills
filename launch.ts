#!/usr/bin/env bun
/**
 * MASTER LAUNCHER - Polymarket Trading System
 * One command to rule them all
 */

import { parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    mode: { type: "string", default: "standard" },
    dryRun: { type: "boolean", default: false },
  },
  strict: true,
  allowPositionals: true,
});

const COMMANDS: Record<string, { desc: string; cmd: string }> = {
  "analyze-history": {
    desc: "📊 Analyze vague-sourdough trade history",
    cmd: "bun run ./trading-core/vague-sourdough-bridge/scripts/analyze.ts"
  },
  "scan-markets": {
    desc: "🔍 Scan Polymarket for opportunities",
    cmd: "bun run ./trading-core/market-monitor/scripts/scan.ts"
  },
  "risk-status": {
    desc: "🛡️ Check risk controller status",
    cmd: "bun run ./trading-core/risk-controller/scripts/status.ts"
  },
  "positions": {
    desc: "📈 View current positions",
    cmd: "bun run ./trading-core/position-manager/scripts/positions.ts"
  },
  "pnl-report": {
    desc: "💰 Generate PnL report",
    cmd: "bun run ./trading-core/pnl-tracker/scripts/report.ts"
  },
  "start": {
    desc: "🚀 Start trading system (standard)",
    cmd: "bun run ./trading-core/orchestrator/scripts/run.ts"
  },
  "start-v2": {
    desc: "🚀 Start enhanced system (with integrations)",
    cmd: "bun run ./trading-core/orchestrator/scripts/run-v2.ts"
  },
  "health": {
    desc: "🏥 System health check",
    cmd: "bun run ./system/health-monitor/scripts/health.ts"
  },
  "test-alert": {
    desc: "📢 Test Telegram alerts",
    cmd: "bun run ./system/alert-system/scripts/test.ts"
  },
};

function showHelp() {
  console.log("\n🎯 Polymarket Trading System - Master Launcher\n");
  console.log("Usage: bun launch.ts <command>\n");
  console.log("Commands:\n");
  for (const [name, info] of Object.entries(COMMANDS)) {
    console.log(`  ${info.desc}`);
    console.log(`    bun launch.ts ${name}\n`);
  }
  console.log("Examples:\n");
  console.log("  bun launch.ts analyze-history");
  console.log("  bun launch.ts scan-markets");
  console.log("  bun launch.ts start-v2\n");
}

async function main() {
  const command = positionals[2];
  
  if (!command || command === "help" || command === "--help") {
    showHelp();
    process.exit(0);
  }
  
  const config = COMMANDS[command];
  if (!config) {
    console.log(`❌ Unknown command: ${command}`);
    console.log("Run 'bun launch.ts help' for available commands");
    process.exit(1);
  }
  
  console.log(config.desc);
  console.log("━".repeat(50));
  
  if (values.dryRun) {
    console.log("[DRY RUN] Would execute:");
    console.log(config.cmd);
    process.exit(0);
  }
  
  const proc = Bun.spawn(config.cmd.split(" "), {
    stdout: "inherit",
    stderr: "inherit",
  });
  
  await proc.exited;
}

main().catch(console.error);
