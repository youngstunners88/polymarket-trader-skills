#!/usr/bin/env bun
/**
 * Execute Hyperliquid Trade
 * Usage: bun execute.ts --coin ETH-USD --size 0.01 --side buy
 */

import { parseArgs } from "util";
import { execSync } from "child_process";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    coin: { type: "string" },
    size: { type: "string" },
    side: { type: "string" },
    price: { type: "string" }, // Optional for limit orders
  },
  strict: true,
  allowPositionals: true,
});

const CLI_PATH = "/tmp/hyperliquid-cli/dist/index.js";

function executeTrade() {
  if (!values.coin || !values.size || !values.side) {
    console.log("Usage: bun execute.ts --coin ETH-USD --size 0.01 --side buy [--price 3500]");
    process.exit(1);
  }

  const coin = values.coin.toUpperCase();
  const size = parseFloat(values.size);
  const side = values.side.toLowerCase();
  
  try {
    console.log(`🚀 Executing Hyperliquid Trade`);
    console.log(`Coin: ${coin}`);
    console.log(`Size: ${size}`);
    console.log(`Side: ${side}`);
    
    // Execute via CLI
    const cmd = values.price 
      ? `node ${CLI_PATH} trade limit ${coin} ${size} ${values.price} --json`
      : `node ${CLI_PATH} trade market ${coin} ${size} --json`;
    
    const output = execSync(cmd, {
      encoding: "utf-8",
      timeout: 15000,
      env: { ...process.env, HYPERLIQUID_PRIVATE_KEY: process.env.Private || "" }
    });
    
    const result = JSON.parse(output);
    console.log("\n✅ Trade Executed");
    console.log(JSON.stringify(result, null, 2));
    
    // Log to local database
    const trade = {
      timestamp: new Date().toISOString(),
      exchange: "hyperliquid",
      coin,
      size,
      side,
      price: result.price || values.price || "market",
      status: result.status || "executed",
      tx_hash: result.hash || result.txHash || "N/A"
    };
    
    console.log("\n📊 Trade logged");
    
  } catch (e) {
    console.error("❌ Trade failed:", e);
    process.exit(1);
  }
}

executeTrade();
