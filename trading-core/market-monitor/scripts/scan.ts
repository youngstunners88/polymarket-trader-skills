#!/usr/bin/env bun
/**
 * Market Scanner - Live Polymarket Opportunities
 */

import { polymarket } from "../../../common/apis/polymarket.js";

async function scanMarkets() {
  console.log("🔍 Scanning Polymarket...");
  console.log("Wallet:", polymarket.getWalletAddress());
  
  const markets = await polymarket.getMarkets({
    active: true,
    liquidityMin: 5000,
    limit: 100,
  });

  console.log(`\n📊 ${markets.length} active markets\n`);

  const opportunities: any[] = [];

  for (const market of markets.slice(0, 30)) {
    try {
      const prices = await polymarket.getMarketPrices(market.id);
      const volume = market.volume || 0;
      const liquidity = market.liquidity || 1;
      
      // Signal: High volume/liquidity ratio with price divergence
      const volumeRatio = volume / liquidity;
      const priceImbalance = Math.abs(prices.yes - prices.no);
      const signalStrength = volumeRatio * priceImbalance * 100;
      
      if (signalStrength > 1) {
        const direction = prices.yes < prices.no ? "YES" : "NO";
        const entryPrice = direction === "YES" ? prices.yes : prices.no;
        
        opportunities.push({
          id: market.id,
          question: market.question?.slice(0, 50),
          direction,
          price: entryPrice.toFixed(3),
          signal: signalStrength.toFixed(2),
          volume: Math.round(volume).toLocaleString(),
          liquidity: Math.round(liquidity).toLocaleString(),
        });
      }
    } catch {
      // Skip
    }
  }

  opportunities.sort((a, b) => parseFloat(b.signal) - parseFloat(a.signal));

  console.log("🎯 TOP OPPORTUNITIES:");
  console.log("======================");
  
  for (const opp of opportunities.slice(0, 10)) {
    console.log(`\n${opp.question}...`);
    console.log(`  Direction: ${opp.direction} @ ${opp.price}`);
    console.log(`  Signal: ${opp.signal} | Vol: $${opp.volume} | Liq: $${opp.liquidity}`);
    console.log(`  Command: bun run trading-core/trade-executor/scripts/execute-live.ts --market ${opp.id} --direction ${opp.direction.toLowerCase()} --size 0.5 --edge ${Math.round(parseFloat(opp.signal))}`);
  }

  console.log(`\n✅ ${opportunities.length} opportunities found`);
}

scanMarkets().catch(console.error);
