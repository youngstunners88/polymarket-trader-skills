#!/usr/bin/env bun
import { parseArgs } from "util";
import { db } from "../../../common/db/client.js";

const { values } = parseArgs({
  args: Bun.argv,
  options: { status: { type: "string", default: "open" } },
  strict: true,
  allowPositionals: true,
});

async function main() {
  const rows = await db.query(
    "SELECT * FROM positions WHERE status = ? ORDER BY entry_time DESC",
    [values.status]
  );
  
  console.log(`📊 Positions (${values.status})`);
  console.log("=======================");
  
  let totalExposure = 0;
  let totalUnrealized = 0;
  
  for (const pos of rows) {
    console.log(`\n${pos.market_id} [${pos.direction.toUpperCase()}]`);
    console.log(`  Size: $${pos.size_usd} @ ${pos.entry_price}`);
    console.log(`  Unrealized PnL: $${pos.unrealized_pnl}`);
    console.log(`  Entry: ${pos.entry_time}`);
    totalExposure += parseFloat(pos.size_usd);
    totalUnrealized += parseFloat(pos.unrealized_pnl);
  }
  
  console.log(`\n📈 Total Exposure: $${totalExposure.toFixed(2)}`);
  console.log(`💰 Total Unrealized PnL: $${totalUnrealized.toFixed(4)}`);
}
main().catch(console.error);
