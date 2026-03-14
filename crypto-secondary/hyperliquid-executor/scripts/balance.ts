#!/usr/bin/env bun
/**
 * Check Hyperliquid Account Balance
 */

import { execSync } from "child_process";

const CLI_PATH = "/tmp/hyperliquid-cli/dist/index.js";

function checkBalance() {
  try {
    const output = execSync(`node ${CLI_PATH} account balances --json`, {
      encoding: "utf-8",
      timeout: 10000
    });
    
    const data = JSON.parse(output);
    console.log("💰 Hyperliquid Balance");
    console.log("======================");
    console.log(JSON.stringify(data, null, 2));
    
    return data;
  } catch (e) {
    console.error("❌ Failed to fetch balance:", e);
    process.exit(1);
  }
}

checkBalance();
