#!/usr/bin/env bun
import { parseArgs } from "util";
import { db } from "../../../common/db/client.js";

const { values } = parseArgs({
  args: Bun.argv,
  options: { period: { type: "string", default: "daily" } },
  strict: true,
  allowPositionals: true,
});

async function main() {
  const period = values.period as "daily" | "weekly" | "monthly";
  let dateFilter: string;
  
  if (period === "daily") dateFilter = "DATE(timestamp) = CURRENT_DATE";
  else if (period === "weekly") dateFilter = "timestamp >= DATE_TRUNC('week', CURRENT_DATE)";
  else dateFilter = "timestamp >= DATE_TRUNC('month', CURRENT_DATE)";

  const trades = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN realized_pnl > 0 THEN 1 ELSE 0 END) as wins,
      SUM(CASE WHEN realized_pnl < 0 THEN 1 ELSE 0 END) as losses,
      SUM(realized_pnl) as realized_pnl,
      AVG(realized_pnl) as avg_pnl,
      MAX(realized_pnl) as max_win,
      MIN(realized_pnl) as max_loss
    FROM trades 
    WHERE ${dateFilter} AND status = 'closed'
  `);

  const t = trades[0];
  const winRate = t.total > 0 ? (t.wins / t.total) * 100 : 0;

  console.log(`📊 PnL Report (${period})`);
  console.log("=======================");
  console.log(`Realized PnL: $${(t.realized_pnl || 0).toFixed(4)}`);
  console.log(`Total Trades: ${t.total || 0}`);
  console.log(`Win Rate: ${winRate.toFixed(1)}% (${t.wins || 0}/${t.total || 0})`);
  console.log(`Avg Trade: $${(t.avg_pnl || 0).toFixed(4)}`);
  console.log(`Best: $${(t.max_win || 0).toFixed(4)}`);
  console.log(`Worst: $${(t.max_loss || 0).toFixed(4)}`);
}
main().catch(console.error);
