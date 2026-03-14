#!/usr/bin/env bun
import { parseArgs } from "util";
import { db } from "../../../common/db/client.js";

const { values } = parseArgs({
  args: Bun.argv,
  options: { reason: { type: "string" } },
  strict: true,
  allowPositionals: true,
});

async function main() {
  await db.exec("INSERT INTO config (key, value) VALUES ('TRADING_HALTED', 'true') ON CONFLICT(key) DO UPDATE SET value='true'");
  console.log(`🛑 TRADING HALTED: ${values.reason || 'manual stop'}`);
  process.exit(0);
}
main().catch(console.error);
