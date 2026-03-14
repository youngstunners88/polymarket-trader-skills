#!/usr/bin/env bun
/**
 * CLOB Sign & Submit - Real blockchain execution
 */

import { Wallet } from "ethers";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    market: { type: "string" },
    direction: { type: "string" },
    size: { type: "string" },
    price: { type: "string" },
  },
  strict: true,
  allowPositionals: true,
});

async function signAndSubmit() {
  const pk = process.env.PolygonPK || process.env.PRIVATE_KEY;
  if (!pk) throw new Error("No private key");
  
  const wallet = new Wallet(pk);
  console.log(`🔑 Wallet: ${wallet.address}`);
  
  const order = {
    market: values.market,
    side: values.direction?.toUpperCase(),
    size: parseFloat(values.size || "0"),
    price: parseFloat(values.price || "0"),
    timestamp: Date.now(),
  };
  
  // Create order hash
  const orderHash = Bun.hash(JSON.stringify(order), "sha256");
  console.log(`📝 Order hash: ${orderHash}`);
  
  // Sign order
  const signature = await wallet.signMessage(`Polymarket:${orderHash}`);
  console.log(`✍️  Signature: ${signature.slice(0, 20)}...`);
  
  // Submit to CLOB
  console.log(`🚀 Submitting to CLOB...`);
  const response = await fetch("https://clob.polymarket.com/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...order, signature }),
  });
  
  const result = await response.json();
  console.log(`📤 Response: ${response.status}`);
  console.log(result);
  
  if (response.ok) {
    console.log(`✅ TRADE EXECUTED!`);
    console.log(`🔗 TX: ${result.tx_hash || result.order_id}`);
  } else {
    console.log(`❌ Failed: ${result.error || result.message}`);
  }
}

signAndSubmit().catch(console.error);
