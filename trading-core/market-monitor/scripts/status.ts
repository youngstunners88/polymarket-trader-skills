#!/usr/bin/env bun
import { db } from "../../../common/db/client.js";

async function main() {
  const markets = await db.query("SELECT COUNT(*) as count FROM alerts WHERE type = 'trade' AND timestamp > datetime('now', '-1 hour')");
  console.log(`🔍 Market Monitor Status`);
  console.log(`Signals last hour: ${markets[0]?.count || 0}`);
}
main().catch(console.error);
