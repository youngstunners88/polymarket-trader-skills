#!/usr/bin/env bun
import { db } from "../../../common/db/client.js";

async function main() {
  const status = await db.query(`
    SELECT component, status, last_check 
    FROM health_status 
    ORDER BY component
  `);

  console.log("🏥 System Health");
  console.log("================");
  
  for (const s of status) {
    console.log(`🟢 ${s.component} | ${s.status} | ${s.last_check}`);
  }
}
main().catch(console.error);
