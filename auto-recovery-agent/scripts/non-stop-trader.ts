#!/usr/bin/env bun
import { appendFile } from "fs/promises";

interface ErrorLog {
  timestamp: string;
  errorType: string;
  component: string;
  wallet: string;
  message: string;
  recoveryAction: string;
  retryCount: number;
}

class NonStopTrader {
  private wallet = "0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB";
  private isRunning = true;
  private retryCounts = new Map<string, number>();
  private circuitBreakers = new Map<string, boolean>();

  async start() {
    await this.log("SYSTEM", "Starting Non-Stop Trader...");
    await this.validateAPIKeys();
    this.tradingLoop();
  }

  private async tradingLoop() {
    while (this.isRunning) {
      try {
        await this.withErrorHandling("scan", async () => {
          console.log("Scanning...");
        });
      } catch (e) {
        await this.logError("LOOP", e as Error, "CRITICAL", "Recovering");
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  private async withErrorHandling<T>(component: string, operation: () => Promise<T>): Promise<T | null> {
    if (this.circuitBreakers.get(component)) {
      return null;
    }
    
    let retries = this.retryCounts.get(component) || 0;
    
    while (retries < 10) {
      try {
        return await operation();
      } catch (error) {
        retries++;
        this.retryCounts.set(component, retries);
        const delay = Math.min(1000 * Math.pow(2, retries), 30000);
        await this.logError(component, error as Error, "RETRY", `Retry ${retries} in ${delay}ms`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
    
    this.circuitBreakers.set(component, true);
    setTimeout(() => this.circuitBreakers.set(component, false), 30000);
    return null;
  }

  private async validateAPIKeys() {
    const hasKeys = !!process.env.POLY && !!process.env.POLY_SECRET;
    if (!hasKeys) throw new Error("Missing API keys");
    await this.log("SYSTEM", "API keys validated");
  }

  private async log(component: string, message: string) {
    const entry = `[${new Date().toISOString()}] [${component}] ${message}\n`;
    await appendFile("/home/workspace/polymarket-trader-skills/logs/system.log", entry);
    console.log(entry.trim());
  }

  private async logError(component: string, error: Error, classification: string, action: string) {
    const log: ErrorLog = {
      timestamp: new Date().toISOString(),
      errorType: classification,
      component,
      wallet: this.wallet,
      message: error.message,
      recoveryAction: action,
      retryCount: this.retryCounts.get(component) || 0
    };
    await appendFile("/home/workspace/polymarket-trader-skills/logs/errors.jsonl", JSON.stringify(log) + "\n");
    await this.log(component, `ERROR: ${error.message} | Action: ${action}`);
  }

  stop() {
    this.isRunning = false;
  }
}

const trader = new NonStopTrader();
process.on("SIGINT", () => trader.stop());
trader.start();
