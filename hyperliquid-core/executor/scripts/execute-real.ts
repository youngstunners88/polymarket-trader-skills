#!/usr/bin/env bun

import { FixedHyperliquidClient } from "../../api-client/scripts/fixed-client";
import { appendFile } from "fs/promises";

const PRIVATE_KEY = process.env.Private || "";
const LOG_FILE = "/home/workspace/polymarket-trader-skills/hyperliquid-core/data/trades.jsonl";

async function main() {
  const args = process.argv.slice(2);
  const coin = args[0] || "ETH";
  const direction = args[1] || "BUY";
  const size = parseFloat(args[2] || "0.01");

  console.log("═══════════════════════════════════════");
  console.log("🔥 REAL HYPERLIQUID TRADE 🔥");
  console.log("═══════════════════════════════════════\n");

  if (!PRIVATE_KEY) {
    console.error("❌ Private key required");
    process.exit(1);
  }

  const client = new FixedHyperliquidClient(PRIVATE_KEY);
  
  console.log(`Wallet: ${client.address}`);
  console.log(`Coin: ${coin}`);
  console.log(`Direction: ${direction}`);
  console.log(`Size: ${size}\n`);

  // Check balance first
  console.log("Checking balance...");
  const balance = await client.getBalance();
  const usdcBalance = balance.balances?.find((b: any) => b.coin === "USDC");
  console.log(`USDC Balance: $${usdcBalance?.total || "0.00"}\n`);

  // Get price
  console.log("Getting market price...");
  const prices = await client.getMarketPrices();
  const price = prices[coin];
  console.log(`${coin} Price: $${price}\n`);

  // EXECUTE
  console.log("⚡ EXECUTING REAL ORDER...\n");
  
  try {
    const result = await client.placeMarketOrder(
      coin,
      direction === "BUY",
      size
    );

    console.log("✅ ORDER PLACED!");
    console.log(JSON.stringify(result, null, 2));

    const trade = {
      timestamp: new Date().toISOString(),
      exchange: "hyperliquid",
      coin,
      direction,
      size,
      price,
      value_usd: size * parseFloat(price),
      status: "EXECUTED",
      wallet: client.address,
      tx: result
    };

    await appendFile(LOG_FILE, JSON.stringify(trade) + "\n");
    console.log("\n💾 Trade logged\n");

  } catch (error: any) {
    console.error(`❌ Failed: ${error.message}`);
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

main();
