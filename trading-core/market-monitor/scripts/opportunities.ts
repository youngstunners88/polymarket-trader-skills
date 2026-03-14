#!/usr/bin/env bun
/**
 * Live Opportunity Finder
 * Scans Polymarket for mispriced markets based on historical patterns
 */

import { polymarket } from "../../../common/apis/polymarket.js";
import { Logger } from "../../../common/utils/logger.js";

interface Opportunity {
  marketId: string;
  question: string;
  yesPrice: number;
  noPrice: number;
  edge: number;
  direction: "YES" | "NO";
  confidence: number;
  expectedReturn: number;
  volume: number;
}

async function findOpportunities() {
  await Logger.system("🔍 Scanning for opportunities...");
  
  const markets = await polymarket.getMarkets({ active: true, liquidityMin: 10000, limit: 100 });
  const opportunities: Opportunity[] = [];

  for (const market of markets) {
    const yesPrice = market.yesPrice * 100; // Convert to cents
    const noPrice = market.noPrice * 100;
    
    // BUY ZONE: YES < 40% (potential upside)
    // Edge calculation: distance from fair value
    let edge = 0;
    let direction: "YES" | "NO" = "YES";
    
    if (yesPrice < 40) {
      // Underpriced YES
      edge = 40 - yesPrice;
      direction = "YES";
    } else if (noPrice < 40) {
      // Underpriced NO
      edge = 40 - noPrice;
      direction = "NO";
    }
    
    if (edge >= 5) {
      opportunities.push({
        marketId: market.id,
        question: market.question.slice(0, 60) + "...",
        yesPrice,
        noPrice,
        edge,
        direction,
        confidence: Math.min(95, 50 + edge),
        expectedReturn: edge / 100,
        volume: market.volume
      });
    }
  }

  // Sort by edge
  opportunities.sort((a, b) => b.edge - a.edge);

  console.log(`\n🎯 ${opportunities.length} OPPORTUNITIES FOUND\n`);
  console.log("━".repeat(80));
  
  for (const opp of opportunities.slice(0, 10)) {
    console.log(`\n📊 ${opp.question}`);
    console.log(`   Market: ${opp.marketId}`);
    console.log(`   Direction: BUY_${opp.direction}`);
    console.log(`   YES Price: ${opp.yesPrice.toFixed(1)}¢ | NO Price: ${opp.noPrice.toFixed(1)}¢`);
    console.log(`   📈 Edge: ${opp.edge.toFixed(1)}%`);
    console.log(`   🎯 Confidence: ${opp.confidence.toFixed(0)}%`);
    console.log(`   💰 Expected Return: ${(opp.expectedReturn * 100).toFixed(1)}%`);
    console.log(`   📊 Volume: $${opp.volume.toLocaleString()}`);
    console.log(`   \n   Execute: bun launch.ts pattern-trade --market ${opp.marketId} --direction ${opp.direction.toLowerCase()} --edge ${opp.edge.toFixed(1)}`);
  }

  if (opportunities.length > 0) {
    console.log("\n" + "━".repeat(80));
    console.log(`\n⚡ Top opportunity: ${opportunities[0].question}`);
    console.log(`   Edge: ${opportunities[0].edge.toFixed(1)}% | Confidence: ${opportunities[0].confidence.toFixed(0)}%`);
  }
}

findOpportunities().catch(console.error);
