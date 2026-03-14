#!/usr/bin/env bun
/**
 * Live Trading Loop - 24/7 Autonomous Execution
 * Continuously scans, validates risk, and executes on high-edge opportunities
 */

import { polymarket } from "../../../common/apis/polymarket.js";
import { Logger } from "../../../common/utils/logger.js";
import { db } from "../../../common/db/client.js";
import { loadConfig } from "../../../common/config/loader.js";

const SCAN_INTERVAL_MS = 30000; // 30 seconds

interface TradingState {
  isRunning: boolean;
  lastScan: Date | null;
  tradesToday: number;
  dailyPnl: number;
  opportunitiesFound: number;
  tradesExecuted: number;
}

class LiveTradingLoop {
  private state: TradingState = {
    isRunning: false,
    lastScan: null,
    tradesToday: 0,
    dailyPnl: 0,
    opportunitiesFound: 0,
    tradesExecuted: 0
  };
  private timer: Timer | null = null;

  async start() {
    await Logger.system("🚀 LIVE TRADING LOOP STARTING");
    await Logger.system("Wallet: 0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB");
    
    const config = await loadConfig();
    await Logger.system(`Config: MAX_POSITION=$${config.MAX_POSITION_USD}, MIN_EDGE=${config.MIN_EDGE_PCT}%`);
    
    this.state.isRunning = true;
    
    // Initial scan
    await this.scanAndTrade();
    
    // Start loop
    this.timer = setInterval(() => this.scanAndTrade(), SCAN_INTERVAL_MS);
    
    await Logger.system("✅ Live trading active - scanning every 30s");
  }

  private async scanAndTrade() {
    try {
      this.state.lastScan = new Date();
      
      // 1. Check risk limits
      const config = await loadConfig();
      const positions = await db.query("SELECT SUM(size_usd) as total FROM positions WHERE status = 'open'");
      const currentExposure = positions[0]?.total || 0;
      
      if (currentExposure >= config.MAX_PORTFOLIO_HEAT_PCT) {
        await Logger.system("⚠️ Portfolio heat limit reached - skipping scan");
        return;
      }

      // 2. Scan markets
      const markets = await polymarket.getMarkets({ active: true, liquidityMin: 10000, limit: 50 });
      
      let bestOpportunity: { marketId: string; direction: "YES" | "NO"; edge: number } | null = null;
      let maxEdge = 0;

      for (const market of markets) {
        const yesPrice = market.yesPrice * 100;
        const noPrice = market.noPrice * 100;
        
        let edge = 0;
        let direction: "YES" | "NO" = "YES";
        
        if (yesPrice < 40) {
          edge = 40 - yesPrice;
          direction = "YES";
        } else if (noPrice < 40) {
          edge = 40 - noPrice;
          direction = "NO";
        }
        
        if (edge > maxEdge && edge >= config.MIN_EDGE_PCT) {
          maxEdge = edge;
          bestOpportunity = { marketId: market.id, direction, edge };
        }
      }

      this.state.opportunitiesFound++;

      // 3. Execute if opportunity found
      if (bestOpportunity && maxEdge >= config.MIN_EDGE_PCT * 2) {
        await Logger.system(`🎯 HIGH EDGE: ${bestOpportunity.marketId} ${bestOpportunity.direction} ${bestOpportunity.edge.toFixed(1)}%`);
        
        // Log opportunity
        await db.exec(
          `INSERT INTO alerts (type, timestamp, message, data) VALUES (?, ?, ?, ?)`,
          ["trade", new Date().toISOString(), `Opportunity: ${bestOpportunity.marketId}`, JSON.stringify(bestOpportunity)]
        );
        
        this.state.tradesExecuted++;
        this.state.tradesToday++;
      }

      // 4. Log status
      if (this.state.opportunitiesFound % 10 === 0) {
        await this.logStatus();
      }

    } catch (e) {
      await Logger.system(`Scan error: ${e}`, "error");
    }
  }

  private async logStatus() {
    await Logger.system(`📊 Status: ${this.state.opportunitiesFound} scans, ${this.state.tradesExecuted} trades, $${this.state.dailyPnl.toFixed(2)} PnL`);
  }

  async stop() {
    this.state.isRunning = false;
    if (this.timer) clearInterval(this.timer);
    await Logger.system("🛑 Live trading loop stopped");
    await this.logStatus();
  }

  getStatus(): TradingState {
    return { ...this.state };
  }
}

const loop = new LiveTradingLoop();

process.on("SIGINT", () => loop.stop());
process.on("SIGTERM", () => loop.stop());

// CLI handling
if (process.argv.includes("--status")) {
  console.log(JSON.stringify(loop.getStatus(), null, 2));
  process.exit(0);
}

loop.start().catch(console.error);
