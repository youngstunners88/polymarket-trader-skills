#!/usr/bin/env bun
import { parseArgs } from "util";
import { createReadStream } from "fs";
import { createInterface } from "readline";

const { values } = parseArgs({
  args: Bun.argv,
  options: { days: { type: "string", default: "7" } },
  strict: true,
  allowPositionals: true,
});

const TRADES_FILE = "/home/workspace/Skills/vague-sourdough-copy/trades.jsonl";

interface Trade {
  timestamp: string;
  market_id: string;
  direction: string;
  size_usd: number;
  size_pct: number;
  edge_pct: number;
  confidence: number;
  expected_profit: number;
  strategy: string;
}

async function analyzeTrades() {
  console.log("📊 Analyzing vague-sourdough trade history...");
  console.log("This may take a moment for 5.4M+ trades...\n");
  
  const stats = {
    totalTrades: 0,
    totalVolume: 0,
    totalEdge: 0,
    totalConfidence: 0,
    totalExpectedProfit: 0,
    topMarkets: new Map<string, { trades: number; volume: number }>(),
    edges: [] as number[],
  };

  const fileStream = createReadStream(TRADES_FILE);
  const rl = createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const trade: Trade = JSON.parse(line);
      stats.totalTrades++;
      
      const size = Number(trade.size_usd) || 0;
      const edge = Number(trade.edge_pct) || 0;
      const confidence = Number(trade.confidence) || 0;
      const profit = Number(trade.expected_profit) || 0;
      
      stats.totalVolume += size;
      stats.totalEdge += edge;
      stats.totalConfidence += confidence;
      stats.totalExpectedProfit += profit;
      stats.edges.push(edge);
      
      const existing = stats.topMarkets.get(trade.market_id) || { trades: 0, volume: 0 };
      stats.topMarkets.set(trade.market_id, {
        trades: existing.trades + 1,
        volume: existing.volume + size
      });
    } catch {}
  }

  const avgEdge = stats.totalTrades > 0 ? stats.totalEdge / stats.totalTrades : 0;
  const avgConfidence = stats.totalTrades > 0 ? stats.totalConfidence / stats.totalTrades : 0;

  // Sort edges for percentiles
  stats.edges.sort((a, b) => a - b);
  const p90 = stats.edges[Math.floor(stats.edges.length * 0.9)] || 0;
  const p95 = stats.edges[Math.floor(stats.edges.length * 0.95)] || 0;
  const p99 = stats.edges[Math.floor(stats.edges.length * 0.99)] || 0;

  console.log(`📈 Trade History Analysis`);
  console.log(`========================`);
  console.log(`Total Trades: ${stats.totalTrades.toLocaleString()}`);
  console.log(`Total Volume: $${stats.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
  console.log(`Avg Position: $${(stats.totalVolume / stats.totalTrades).toFixed(2)}`);
  console.log(`Avg Edge: ${avgEdge.toFixed(2)}%`);
  console.log(`Avg Confidence: ${avgConfidence.toFixed(1)}%`);
  console.log(`Expected PnL: $${stats.totalExpectedProfit.toFixed(4)}`);
  console.log(`\n📊 Edge Percentiles:`);
  console.log(`  90th: ${p90.toFixed(2)}%`);
  console.log(`  95th: ${p95.toFixed(2)}%`);
  console.log(`  99th: ${p99.toFixed(2)}%`);
  
  console.log(`\n🏆 Top 5 Markets:`);
  const sorted = Array.from(stats.topMarkets.entries())
    .sort((a, b) => b[1].trades - a[1].trades)
    .slice(0, 5);
  for (const [market, data] of sorted) {
    console.log(`  ${market}: ${data.trades.toLocaleString()} trades, $${data.volume.toFixed(2)} vol`);
  }
}

analyzeTrades().catch(console.error);
