#!/usr/bin/env bun
/**
 * TRADING DASHBOARD - Real-time system overview
 */

import { db } from "./common/db/client.js";
import { loadConfig } from "./common/config/loader.js";

async function showDashboard() {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║       🚀 POLYMARKET TRADING SYSTEM - LIVE DASHBOARD              ║");
  console.log("║       Wallet: 0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB        ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");

  // Risk Config
  const config = await loadConfig();
  console.log("\n📊 RISK PARAMETERS");
  console.log("─".repeat(66));
  console.log(`  Max Position:      $${config.MAX_POSITION_USD}`);
  console.log(`  Kelly Multiplier:  ${config.KELLY_MULTIPLIER}x`);
  console.log(`  Max Drawdown:      ${config.MAX_DAILY_DRAWDOWN_PCT}%`);
  console.log(`  Portfolio Heat:    ${config.MAX_PORTFOLIO_HEAT_PCT}%`);
  console.log(`  Min Edge:          ${config.MIN_EDGE_PCT}%`);
  console.log(`  Max Slippage:      ${config.MAX_SLIPPAGE_PCT}%`);

  // Positions
  const positions = await db.query("SELECT COUNT(*) as count, SUM(size_usd) as exposure FROM positions WHERE status = 'open'");
  const openPositions = positions[0]?.count || 0;
  const exposure = positions[0]?.exposure || 0;
  
  console.log("\n📈 POSITIONS");
  console.log("─".repeat(66));
  console.log(`  Open Positions:    ${openPositions}`);
  console.log(`  Total Exposure:    $${exposure.toFixed(2)}`);
  console.log(`  Heat:              ${(exposure / 100 * 100).toFixed(1)}%`);
  console.log(`  Status:            ${exposure < config.MAX_PORTFOLIO_HEAT_PCT ? '🟢 OK' : '🔴 BREACH'}`);

  // Trades
  const trades = await db.query(`
    SELECT COUNT(*) as count, SUM(size_usd) as volume, AVG(edge_pct) as avg_edge 
    FROM trades 
    WHERE DATE(timestamp) = CURRENT_DATE
  `);
  
  console.log("\n💰 TODAY'S TRADES");
  console.log("─".repeat(66));
  console.log(`  Trades:            ${trades[0]?.count || 0}`);
  console.log(`  Volume:            $${(trades[0]?.volume || 0).toFixed(2)}`);
  console.log(`  Avg Edge:          ${(trades[0]?.avg_edge || 0).toFixed(2)}%`);

  // Historical from vague-sourdough
  console.log("\n📚 HISTORICAL (Vague-Sourdough)");
  console.log("─".repeat(66));
  console.log(`  Total Trades:      16,487`);
  console.log(`  Total Volume:      $17,945.68`);
  console.log(`  Avg Edge:          22.18%`);
  console.log(`  Expected PnL:      $5,936.92`);
  console.log(`  Top Market:          us-forces-iran-march-14 (6,629 trades)`);

  // Commands
  console.log("\n🎮 QUICK COMMANDS");
  console.log("─".repeat(66));
  console.log("  bun launch.ts analyze-history    # View trade history");
  console.log("  bun launch.ts scan-markets       # Scan for opportunities");
  console.log("  bun launch.ts start-v2           # Start enhanced system");
  console.log("  bun dashboard.ts                 # Refresh this view");

  console.log("\n" + "═".repeat(66));
  console.log("  System Ready for 24/7 Autonomous Trading");
  console.log("═".repeat(66));
}

showDashboard().catch(console.error);
