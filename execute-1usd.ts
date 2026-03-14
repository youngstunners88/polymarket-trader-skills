import { ClobClient } from "@polymarket/clob-client";
import { ethers } from "ethers";

const PK = process.env.PolygonPK;
if (!PK) throw new Error("No private key");

const wallet = new ethers.Wallet(PK);
console.log("Wallet:", wallet.address);

// Connect to CLOB
const client = new ClobClient({
  host: "https://clob.polymarket.com",
  wallet: wallet,
  funder: wallet.address,
});

// Set credentials
const apiKey = process.env.POLY;
const secret = process.env.POLY_SECRET;
const passphrase = process.env.PASSPHRASE;

console.log("API Key exists:", !!apiKey);
console.log("Secret exists:", !!secret);
console.log("Passphrase exists:", !!passphrase);

// Authenticate
client.setApiCreds({
  apiKey: apiKey!,
  apiSecret: secret!,
  apiPassphrase: passphrase!,
});

console.log("Authenticated with CLOB");

// Get markets and execute
async function trade() {
  const markets = await client.getMarkets();
  console.log("Markets count:", markets.length);
  
  // Find first valid market
  const market = markets.find(m => !m.closed && m.yesPrice > 0.01 && m.yesPrice < 0.99);
  if (!market) {
    console.log("No valid markets");
    return;
  }
  
  console.log("Trading on:", market.slug);
  console.log("YES price:", market.yesPrice);
  
  // Create and submit order
  const order = await client.createOrder({
    marketId: market.id,
    side: "YES",
    size: 1.0,
    price: market.yesPrice * 0.99, // Slight discount
  });
  
  console.log("Order created:", order);
  
  const result = await client.postOrder(order);
  console.log("Order submitted:", result);
}

trade().catch(console.error);
