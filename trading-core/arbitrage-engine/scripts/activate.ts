#!/usr/bin/env bun
import { spawn } from "child_process";
import { Logger } from "../../../common/utils/logger.js";

async function activateEngine() {
  await Logger.system("⚡ Activating Binance-Polymarket Arbitrage Engine...");
  
  const pythonPath = "/usr/bin/python3";
  const scriptPath = "/home/workspace/Skills/binance-polymarket-arbitrage/scripts/arbitrage_engine.py";
  
  const child = spawn(pythonPath, [scriptPath], {
    detached: true,
    stdio: "ignore",
    env: { ...process.env, MAX_POSITION_USD: "1" }
  });
  
  child.unref();
  
  await Logger.system(`✅ Arbitrage Engine started (PID: ${child.pid})`);
  console.log(`PID: ${child.pid}`);
  console.log("Monitor with: ps aux | grep arbitrage");
}

activateEngine().catch(console.error);
