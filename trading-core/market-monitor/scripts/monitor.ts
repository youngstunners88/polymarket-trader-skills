#!/usr/bin/env bun
import WebSocket from "ws";
import { db } from "../../../common/db/client.js";
import { Logger } from "../../../common/utils/logger.js";
import { loadConfig } from "../../../common/config/loader.js";
import type { Market } from "../../../common/types/index.js";

const POLYMARKET_WS = process.env.POLYMARKET_WS_ENDPOINT || "wss://ws.polymarket.com";
const RECONNECT_MAX = 10;

class MarketMonitor {
  private ws: WebSocket | null = null;
  private reconnectCount = 0;
  private markets: Map<string, Market> = new Map();
  private isRunning = false;

  async start() {
    this.isRunning = true;
    await Logger.system("Market Monitor starting...");
    await this.connect();
  }

  private async connect() {
    try {
      this.ws = new WebSocket(POLYMARKET_WS);

      this.ws.on("open", async () => {
        await Logger.system("WebSocket connected");
        this.reconnectCount = 0;
        
        // Subscribe to all markets
        this.ws?.send(JSON.stringify({
          type: "subscribe",
          channel: "markets"
        }));
      });

      this.ws.on("message", async (data: Buffer) => {
        try {
          const msg = JSON.parse(data.toString());
          await this.handleMessage(msg);
        } catch (e) {
          await Logger.system(`Parse error: ${e}`, "error");
        }
      });

      this.ws.on("close", async () => {
        await Logger.system("WebSocket closed");
        await this.reconnect();
      });

      this.ws.on("error", async (err) => {
        await Logger.system(`WebSocket error: ${err.message}`, "error");
      });

    } catch (e) {
      await Logger.system(`Connection failed: ${e}`, "error");
      await this.reconnect();
    }
  }

  private async reconnect() {
    if (!this.isRunning) return;
    
    this.reconnectCount++;
    if (this.reconnectCount > RECONNECT_MAX) {
      await Logger.system("Max reconnects reached, giving up", "error");
      process.exit(1);
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectCount), 30000);
    await Logger.system(`Reconnecting in ${delay}ms (attempt ${this.reconnectCount})`);
    
    setTimeout(() => this.connect(), delay);
  }

  private async handleMessage(msg: any) {
    const config = await loadConfig();

    if (msg.event === "market_update") {
      const market: Market = {
        id: msg.market.id,
        question: msg.market.question,
        slug: msg.market.slug,
        status: msg.market.active ? "active" : "closed",
        yesPrice: parseFloat(msg.market.yesPrice) || 0,
        noPrice: parseFloat(msg.market.noPrice) || 0,
        volume: parseFloat(msg.market.volume) || 0,
        liquidity: parseFloat(msg.market.liquidity) || 0,
        lastUpdated: Date.now(),
      };

      // Filter by liquidity
      if (market.liquidity < config.MIN_LIQUIDITY_USD) return;

      this.markets.set(market.id, market);

      // Check for significant price movement
      const oldMarket = this.markets.get(market.id);
      if (oldMarket) {
        const priceChange = Math.abs(market.yesPrice - oldMarket.yesPrice);
        const changePct = (priceChange / oldMarket.yesPrice) * 100;
        
        if (changePct > config.MOMENTUM_THRESHOLD_PCT) {
          await Logger.system(`Price movement: ${market.slug} ${changePct.toFixed(2)}%`);
          await this.checkForTradeOpportunity(market, changePct);
        }
      }
    }
  }

  private async checkForTradeOpportunity(market: Market, changePct: number) {
    // Simple edge calculation - would be enhanced with ML model
    const edge = changePct * 0.5; // Simplified
    const config = await loadConfig();

    if (edge >= config.MIN_EDGE_PCT) {
      await Logger.system(`Signal: ${market.slug} edge=${edge.toFixed(2)}%`);
      
      // Store signal for executor
      await db.exec(
        `INSERT INTO alerts (type, timestamp, message, data) VALUES (?, ?, ?, ?)`,
        ["trade", new Date().toISOString(), `Signal on ${market.slug}`, JSON.stringify({ marketId: market.id, edge, direction: changePct > 0 ? "no" : "yes" })]
      );
    }
  }

  async stop() {
    this.isRunning = false;
    this.ws?.close();
    await Logger.system("Market Monitor stopped");
  }
}

const monitor = new MarketMonitor();

process.on("SIGINT", () => monitor.stop());
process.on("SIGTERM", () => monitor.stop());

monitor.start().catch(console.error);
