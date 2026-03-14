#!/usr/bin/env bun
import { parseArgs } from "util";
import { db } from "../../../common/db/client.js";

const { values } = parseArgs({
  args: Bun.argv,
  options: { limit: { type: "string", default: "50" } },
  strict: true,
  allowPositionals: true,
});

async function main() {
  const limit = parseInt(values.limit || "50");
  const rows = await db.query("SELECT * FROM trades ORDER BY timestamp DESC LIMIT ?", [limit]);
  
  console.log("📜 Trade History");
  console.log("================");
  
  for (const trade of rows) {
    const pnl = trade.realized_pnl ? `$${trade.realized_pnl}` : 'open';
    console.log(`${trade.timestamp} | ${trade.market_id} ${trade.direction.toUpperCase()} $${trade.size_usd} | PnL: ${pnl}`);
  }
}
main().catch(console.error);
