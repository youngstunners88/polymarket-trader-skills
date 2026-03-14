#!/usr/bin/env bun
import { db } from "../../../common/db/client.js";
import { loadConfig } from "../../../common/config/loader.js";

async function main() {
  const config = await loadConfig();
  const positions = await db.query("SELECT COALESCE(SUM(size_usd), 0) as total FROM positions WHERE status = 'open'");
  const exposure = positions[0]?.total || 0;
  const heat = (exposure / 100) * 100;

  console.log("🔒 Risk Controller Status");
  console.log("========================");
  console.log(`Max Position: $${config.MAX_POSITION_USD}`);
  console.log(`Kelly Multiplier: ${config.KELLY_MULTIPLIER}x`);
  console.log(`Max Daily Drawdown: ${config.MAX_DAILY_DRAWDOWN_PCT}%`);
  console.log(`Max Portfolio Heat: ${config.MAX_PORTFOLIO_HEAT_PCT}%`);
  console.log(`Current Heat: ${heat.toFixed(1)}%`);
  console.log(`Min Edge: ${config.MIN_EDGE_PCT}%`);
  console.log(`Status: ${heat > config.MAX_PORTFOLIO_HEAT_PCT ? '🔴 BREACH' : '🟢 OK'}`);
}
main().catch(console.error);
