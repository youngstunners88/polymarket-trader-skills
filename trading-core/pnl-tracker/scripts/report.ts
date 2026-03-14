#!/usr/bin/env bun
/**
 * PnL Report Generator
 * Daily/weekly/monthly performance reports
 */

import { parseArgs } from "util";
import { PnLTracker } from "./tracker";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    period: { type: "string", default: "daily" },
  },
  strict: true,
  allowPositionals: true,
});

async function main() {
  const tracker = new PnLTracker();
  const report = await tracker.generateReport(values.period as "daily" | "weekly" | "monthly");
  
  console.log("📊 PnL Report");
  console.log("=============");
  console.log(`Period: ${report.period}`);
  console.log(`Realized PnL: $${report.realizedPnl.toFixed(2)}`);
  console.log(`Unrealized PnL: $${report.unrealizedPnl.toFixed(2)}`);
  console.log(`Total Trades: ${report.totalTrades}`);
  console.log(`Win Rate: ${(report.winRate * 100).toFixed(1)}%`);
  console.log(`Sharpe Ratio: ${report.sharpeRatio.toFixed(2)}`);
  console.log(`Max Drawdown: ${(report.maxDrawdown * 100).toFixed(1)}%`);
}

main().catch(console.error);
