#!/usr/bin/env bun
import { loadConfig } from "../../../common/config/loader.js";

async function main() {
  const config = await loadConfig();
  console.log("⚙️ Trading Configuration");
  console.log("=======================");
  for (const [key, value] of Object.entries(config)) {
    console.log(`${key}: ${value}`);
  }
}
main().catch(console.error);
