#!/usr/bin/env bun
import { db } from "../../../common/db/client.js";

async function main() {
  const rows = await db.query("SELECT direction, SUM(size_usd) as total FROM positions WHERE status = 'open' GROUP BY direction");
  
  console.log("🔥 Portfolio Heat Map");
  console.log("====================");
  
  for (const row of rows) {
    console.log(`${row.direction.toUpperCase()}: $${row.total}`);
  }
  
  const total = await db.query("SELECT COALESCE(SUM(size_usd), 0) as total FROM positions WHERE status = 'open'");
  console.log(`\nTotal Heat: $${total[0]?.total || 0}`);
}
main().catch(console.error);
