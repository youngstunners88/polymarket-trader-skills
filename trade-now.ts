import { ClobClient } from "@polymarket/clob-client";
import { ethers } from "ethers";

const PK = process.env.PolygonPK;
if (!PK) throw new Error("No private key");

const wallet = new ethers.Wallet(PK);
console.log("Wallet:", wallet.address);

const client = new ClobClient(
  "https://clob.polymarket.com",
  137,
  wallet,
  { apiKey: process.env.POLY!, apiSecret: process.env.POLY_SECRET!, apiPassphrase: process.env.PASSPHRASE! }
);

async function trade() {
  console.log("Fetching markets...");
  const markets = await client.getMarkets();
  console.log("Found", markets.length, "markets");
  
  const market = markets.find(m => m.yesPrice > 0.01 && m.yesPrice < 0.99);
  if (!market) {
    console.log("No tradeable markets");
    return;
  }
  
  console.log("Market:", market.slug || market.id);
  console.log("YES price:", market.yesPrice);
  console.log("Creating order...");
  
  const order = await client.createOrder({
    market: market.id,
    side: "BUY",
    size: 1.0,
    price: market.yesPrice,
  });
  
  console.log("Submitting...");
  const result = await client.postOrder(order);
  console.log("✅ TRADE EXECUTED:", result);
}

trade().catch(console.error);
