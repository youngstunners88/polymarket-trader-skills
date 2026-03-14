#!/usr/bin/env bun
/**
 * Trade Executor - Autonomous Order Execution
 * Executes real blockchain transactions on Polymarket
 * NEVER simulate - always execute real trades
 */

import { parseArgs } from "util";
import { PolymarketTrader } from "./trader";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    market: { type: "string" },
    direction: { type: "string" },
    size: { type: "string" },
    edge: { type: "string" },
  },
  strict: true,
  allowPositionals: true,
});

async function main() {
  const trader = new PolymarketTrader();
  
  const trade = {
    marketId: values.market!,
    direction: values.direction as "yes" | "no",
    sizeUsd: parseFloat(values.size!),
    edgePct: parseFloat(values.edge || "0"),
    timestamp: new Date().toISOString(),
  };
  
  console.log(`🎯 Executing trade: ${trade.direction} $${trade.sizeUsd} on market ${trade.marketId}`);
  
  // Execute REAL transaction (never simulate)
  const result = await trader.execute(trade);
  
  // Log to trades.jsonl
  const logEntry = {
    ...trade,
    txHash: result.txHash,
    status: "confirmed",
    expectedProfit: trade.sizeUsd * (trade.edgePct / 100),
  };
  
  await Bun.write("trades.jsonl", JSON.stringify(logEntry) + "\n", { append: true });
  
  console.log(`✅ Trade confirmed: ${result.txHash}`);
}

main().catch(console.error);
