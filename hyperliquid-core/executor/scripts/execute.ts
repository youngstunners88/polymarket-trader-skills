#!/usr/bin/env bun
/**
 * REAL HYPERLIQUID TRADE EXECUTOR
 * No simulation. Actual on-chain execution.
 */

import { HyperliquidClient } from "../../api-client/scripts/client";
import { appendFile } from "fs/promises";

const PRIVATE_KEY = process.env.Private || "";
const LOG_FILE = "/home/workspace/polymarket-trader-skills/hyperliquid-core/data/trades.jsonl";

async function executeRealTrade(
  coin: string,
  direction: "BUY" | "SELL",
  size: number,
  price?: number
) {
  console.log("═══════════════════════════════════════");
  console.log("🔥 REAL HYPERLIQUID TRADE EXECUTION 🔥");
  console.log("═══════════════════════════════════════\n");

  if (!PRIVATE_KEY) {
    console.error("❌ Private key not found in environment");
    process.exit(1);
  }

  const client = new HyperliquidClient(PRIVATE_KEY);
  const address = client.getAddress();
  
  console.log(`Wallet: ${address}`);
  console.log(`Coin: ${coin}`);
  console.log(`Direction: ${direction}`);
  console.log(`Size: ${size}\n`);

  try {
    // Get market price if not provided
    const marketData = await client.getMarketData(coin);
    const currentPrice = price || parseFloat(marketData[coin]);
    
    console.log(`Market Price: $${currentPrice}`);
    console.log(`Estimated Value: $${(size * currentPrice).toFixed(2)}\n`);

    // EXECUTE REAL ORDER
    console.log("⚡ SUBMITTING ORDER TO HYPERLIQUID MAINNET...\n");
    
    const result = await client.placeOrder(
      coin,
      direction === "BUY",
      size,
      currentPrice,
      "market"
    );

    // Log result
    const tradeRecord = {
      timestamp: new Date().toISOString(),
      exchange: "hyperliquid",
      coin,
      direction,
      size,
      price: currentPrice,
      value_usd: size * currentPrice,
      status: result.status || "PENDING",
      response: result,
      wallet: address,
      execution_type: "REAL_ON_CHAIN"
    };

    await appendFile(LOG_FILE, JSON.stringify(tradeRecord) + "\n");

    console.log("✅ ORDER SUBMITTED");
    console.log(`Response: ${JSON.stringify(result, null, 2)}\n`);
    console.log("🌐 Check: https://app.hyperliquid.xyz/explorer");
    console.log(`Search: ${address}\n`);

    return tradeRecord;

  } catch (error: any) {
    console.error(`❌ Execution failed: ${error.message}`);
    if (error.response) {
      console.error(`API Error: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    throw error;
  }
}

// Execute from command line
const args = process.argv.slice(2);
const coin = args[0] || "ETH";
const direction = (args[1] || "BUY") as "BUY" | "SELL";
const size = parseFloat(args[2] || "0.01");

executeRealTrade(coin, direction, size).catch(console.error);
