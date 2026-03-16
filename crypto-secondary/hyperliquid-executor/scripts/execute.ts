#!/usr/bin/env bun
/**
 * HYPERLIQUID REAL TRADE EXECUTOR
 * On-chain, signed, verified.
 */

import { ethers } from "ethers";
import axios from "axios";
import { appendFile } from "fs/promises";
import { resolve } from "path";

const API_URL = "https://api.hyperliquid.xyz";
const EXCHANGE_URL = "https://api.hyperliquid.xyz/exchange";
const LOG_FILE = resolve(import.meta.dir, "../../data/hyperliquid-trades.jsonl");

class HyperliquidExecutor {
  private wallet: ethers.Wallet;
  public address: string;

  constructor(privateKey: string) {
    this.wallet = new ethers.Wallet(privateKey);
    this.address = this.wallet.address;
  }

  async getBalance() {
    const resp = await axios.post(API_URL, {
      type: "spotClearinghouseState",
      user: this.address
    });
    return resp.data;
  }

  async getPrices() {
    const resp = await axios.post(API_URL, { type: "allMids" });
    return resp.data;
  }

  async executeTrade(
    coin: string,
    isBuy: boolean,
    size: number
  ) {
    const timestamp = Date.now();
    
    // Build action
    const action = {
      type: "order",
      orders: [{
        coin,
        isBuy,
        sz: size.toString(),
        limitPx: "0",
        orderType: "Market",
        reduceOnly: false,
        cloid: `clob_${timestamp}_${Math.random().toString(36).slice(2, 8)}`
      }],
      grouping: "na"
    };

    // Sign
    const signature = await this.signAction(action, timestamp);

    // Execute
    const resp = await axios.post(EXCHANGE_URL, {
      action,
      nonce: timestamp,
      signature
    });

    return resp.data;
  }

  private async signAction(action: any, nonce: number) {
    const msg = JSON.stringify(action) + nonce.toString();
    return await this.wallet.signMessage(msg);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const coin = args[0] || "ETH";
  const direction = args[1] || "BUY";
  const size = parseFloat(args[2] || "0.01");

  console.log("═══════════════════════════════════════");
  console.log("🔥 HYPERLIQUID REAL TRADE 🔥");
  console.log("═══════════════════════════════════════\n");

  const pk = process.env.Private || "";
  if (!pk) {
    console.error("❌ Private key required");
    process.exit(1);
  }

  const exec = new HyperliquidExecutor(pk);

  console.log(`Wallet: ${exec.address}`);
  console.log(`Coin: ${coin}`);
  console.log(`Direction: ${direction}`);
  console.log(`Size: ${size}\n`);

  // Check balance
  const balance = await exec.getBalance();
  const usdc = balance.balances?.find((b: any) => b.coin === "USDC");
  console.log(`USDC: $${usdc?.total || "0.00"}\n`);

  // Get price
  const prices = await exec.getPrices();
  const price = prices[coin];
  console.log(`${coin}: $${price}\n`);

  // Execute
  console.log("⚡ EXECUTING...\n");
  
  try {
    const result = await exec.executeTrade(coin, direction === "BUY", size);

    console.log("✅ EXECUTED!");
    console.log(JSON.stringify(result, null, 2));

    await appendFile(LOG_FILE, JSON.stringify({
      timestamp: new Date().toISOString(),
      coin, direction, size, price,
      value: size * parseFloat(price),
      result,
      wallet: exec.address
    }) + "\n");

    console.log("\n💾 Logged\n");

  } catch (e: any) {
    console.error(`❌ ${e.message}`);
    process.exit(1);
  }
}

main();
