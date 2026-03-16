#!/usr/bin/env bun

import { HyperliquidClient } from "./client";

const PRIVATE_KEY = process.env.Private || "";

async function checkBalance() {
  if (!PRIVATE_KEY) {
    console.error("❌ Private key not found");
    process.exit(1);
  }

  const client = new HyperliquidClient(PRIVATE_KEY);
  const address = client.getAddress();

  console.log("💰 HYPERLIQUID BALANCE CHECK");
  console.log("════════════════════════════\n");
  console.log(`Wallet: ${address}\n`);

  try {
    const balance = await client.getBalance();
    console.log("Balance Data:");
    console.log(JSON.stringify(balance, null, 2));
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
  }
}

checkBalance();
