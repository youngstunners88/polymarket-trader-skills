#!/usr/bin/env bun
/**
 * Market Discovery - Find profitable Polymarket opportunities
 */

import { polymarket } from "../../../common/apis/polymarket.js";
import { Logger } from "../../../common/utils/logger.js";
import { loadConfig } from "../../../common/config/loader.js";

async function discoverMarkets() {
  const config = await loadConfig();
  
  await Logger.system("🔍 Scanning Polymarket for opportunities...");

  // Get active markets with liquidity
  const markets = await polymarket.getMarkets({
    active: true,
    liquidityMin: config.MIN_LIQUIDITY_USD,
    limit: 100,
  });

  console.log(`\n📊 Found ${markets.length} markets with >$${config.MIN_LIQUIDITY_USD} liquidity\n`);

  const opportunities: any[] = [];

  for (const market of markets) {
    const prices = await polymarket.getMarketPrices(market.id);
    
    // Simple signal: price divergence from 0.5 (inefficiency signal)
    const yesDistance = Math.abs(prices.yes - 0.5);
    const noDistance = Math.abs(prices.no - 0.5);
    const maxDistance = Math.max(yesDistance, noDistance);
    
    // Calculate edge based on volume/liquidity ratio
    const volumeLiquidityRatio = (market.volume || 0) / (market.liquidity || 1);
    const edge = maxDistance * 100 * volumeLiquidityRatio;

    if (edge >= config.MIN_EDGE_PCT) {
      const direction = prices.yes < prices.no ? "yes" : "no";
      const entryPrice = direction === "yes" ? prices.yes : prices.no;
      
      opportunities.push({
        id: market.id,
        question: market.question,
        direction,
        price: entryPrice,
        edge: edge.toFixed(2),
        volume: market.volume,
        liquidity: market.liquidity,
      });
    }
  }

  // Sort by edge
  opportunities.sort((a, b) => parseFloat(b.edge) - parseFloat(a.edge));

  console.log("🎯 TOP OPPORTUNITIES:");
  console.log("====================");
  
  for (const opp of opportunities.slice(0, 10)) {
    console.log(`\n${opp.question.slice(0, 60)}...`);
    console.log(`  Direction: ${opp.direction.toUpperCase()} @ ${opp.price.toFixed(4)}`);
    console.log(`  Edge: ${opp.edge}% | Vol: $${Math.round(opp.volume).toLocaleString()} | Liq: $${Math.round(opp.liquidity).toLocaleString()}`);
    console.log(`  Execute: bun run trading-core/trade-executor/scripts/execute-live.ts --market ${opp.id} --direction ${opp.direction} --size 0.5 --edge ${opp.edge}`);
  }

  await Logger.system(`Discovered ${opportunities.length} opportunities`);
}

discoverMarkets().catch(console.error);
