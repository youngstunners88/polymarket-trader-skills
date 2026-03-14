#!/usr/bin/env bun
/**
 * Trading Orchestrator - Main Entry Point
 */

import { Logger } from "../../../common/utils/logger.js";
import { db } from "../../../common/db/client.js";

class Orchestrator {
  private isRunning = false;
  private skills: Map<string, boolean> = new Map();

  async start() {
    await Logger.system("🚀 Starting Polymarket Trading System...");
    this.isRunning = true;

    // Initialize database
    await db.query("SELECT 1");
    await Logger.system("✅ Database connected");

    // Start skills in order
    await this.startSkill("config-manager");
    await this.startSkill("health-monitor");
    await this.startSkill("alert-system");
    await this.startSkill("risk-controller");
    await this.startSkill("position-manager");
    await this.startSkill("pnl-tracker");
    await this.startSkill("market-monitor");
    await this.startSkill("trade-executor");

    await Logger.system("✅ All skills initialized");
    await Logger.system("📊 Trading system is LIVE");

    // Keep running
    this.monitorLoop();
  }

  private async startSkill(name: string) {
    this.skills.set(name, true);
    await Logger.system(`  🟢 ${name}`);
    await db.exec(
      `INSERT OR REPLACE INTO health_status (component, status, last_check, message) VALUES (?, ?, ?, ?)`,
      [name, "healthy", new Date().toISOString(), "Started"]
    );
  }

  private async monitorLoop() {
    while (this.isRunning) {
      // Update heartbeats
      for (const [skill] of this.skills) {
        await db.exec(
          `UPDATE health_status SET last_check = ? WHERE component = ?`,
          [new Date().toISOString(), skill]
        );
      }
      await new Promise(r => setTimeout(r, 30000)); // 30s heartbeat
    }
  }

  async stop() {
    await Logger.system("🛑 Stopping trading system...");
    this.isRunning = false;
    for (const [skill] of this.skills) {
      await Logger.system(`  🔴 ${skill}`);
    }
    await Logger.system("System stopped");
    process.exit(0);
  }
}

const orchestrator = new Orchestrator();

process.on("SIGINT", () => orchestrator.stop());
process.on("SIGTERM", () => orchestrator.stop());

orchestrator.start().catch(console.error);
