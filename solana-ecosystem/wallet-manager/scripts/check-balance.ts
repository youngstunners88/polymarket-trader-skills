#!/usr/bin/env bun
import { Keypair, Connection, PublicKey } from "@solana/web3.js";

async function checkBalance() {
  const privateKeyBase58 = process.env.SOLANA || "";
  if (!privateKeyBase58) {
    console.log("❌ SOLANA private key not found in environment");
    process.exit(1);
  }
  
  try {
    const secretKey = Buffer.from(privateKeyBase58, 'base58');
    const keypair = Keypair.fromSecretKey(secretKey);
    
    console.log("🔑 Solana Wallet");
    console.log("================");
    console.log(`Public Key: ${keypair.publicKey.toString()}`);
    
    const conn = new Connection("https://api.mainnet-beta.solana.com");
    const balance = await conn.getBalance(keypair.publicKey);
    
    console.log(`Balance: ${balance / 1e9} SOL`);
    console.log(`Balance: $${(balance / 1e9 * 140).toFixed(2)} USD (est)`);
    
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

checkBalance();
