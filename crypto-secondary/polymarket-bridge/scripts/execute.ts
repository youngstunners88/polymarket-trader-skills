#!/usr/bin/env bun
/**
 * POLYMARKET REAL TRADE EXECUTOR
 * Uses CLOB API, requires proxy for geo.
 */

import { ethers } from "ethers";
import axios from "axios";
import { appendFile } from "fs/promises";

const CLOB_API = "https://clob.polymarket.com";
const PROXY = process.env.PROXY_URL || "";

class PolymarketExecutor {
  private wallet: ethers.Wallet;
  private apiKey: string;
  private apiSecret: string;
  private passphrase: string;

  constructor(privateKey: string) {
    this.wallet = new ethers.Wallet(privateKey);
    this.apiKey = process.env.POLY || "";
    this.apiSecret = process.env.POLY_SECRET || "";
    this.passphrase = process.env.PASSPHRASE || "";
  }

  async executeTrade(
    conditionId: string,
    tokenId: string,
    isBuy: boolean,
    size: number,
    price: number
  ) {
    const timestamp = Date.now();
    
    // Build order via CLOB
    const orderData = {
      type: "order",
      orders: [{
        conditionId,
        tokenId,
        side: isBuy ? "BUY" : "SELL",
        size: size.toString(),
        price: price.toString(),
        orderType: "Market"
      }],
      nonce: timestamp
    };

    // Sign
    const signature = await this.wallet.signMessage(JSON.stringify(orderData));

    // Submit
    const resp = await axios.post(`${CLOB_API}/exchange`, {
      ...orderData,
      signature
    }, {
      headers: {
        "X-API-KEY": this.apiKey,
        "X-API-SECRET": this.apiSecret,
        "X-PASSPHRASE": this.passphrase
      },
      proxy: PROXY ? { host: PROXY, port: 8080 } : false
    });

    return resp.data;
  }
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("🔥 POLYMARKET REAL TRADE 🔥");
  console.log("═══════════════════════════════════════\n");

  const pk = process.env.Private || "";
  if (!pk) {
    console.error("❌ Private key required");
    process.exit(1);
  }

  const exec = new PolymarketExecutor(pk);
  console.log(`Wallet: ${exec.wallet.address}\n`);

  if (!PROXY) {
    console.warn("⚠️  No proxy set - may be geo-blocked");
    console.warn("Set: export PROXY_URL=\"user:pass@host:port\"\n");
  }

  // Execute (requires valid market params)
  console.log("Ready to execute. Pass --market, --token, --size, --price");
}

main();
