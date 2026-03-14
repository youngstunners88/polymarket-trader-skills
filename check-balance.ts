#!/usr/bin/env bun
import { ethers } from "ethers";

const RPC_URL = "https://polygon-rpc.com";
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || "0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB";

// USDC on Polygon
const USDC_CONTRACT = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

async function checkBalance() {
  console.log("🔍 Checking wallet balance...");
  console.log(`Wallet: ${WALLET_ADDRESS}`);
  
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Check native MATIC balance
    const maticBalance = await provider.getBalance(WALLET_ADDRESS);
    console.log(`\n💜 MATIC Balance: ${ethers.formatEther(maticBalance)} MATIC`);
    
    // Check USDC balance
    const usdc = new ethers.Contract(USDC_CONTRACT, ERC20_ABI, provider);
    const usdcBalance = await usdc.balanceOf(WALLET_ADDRESS);
    const decimals = await usdc.decimals();
    const symbol = await usdc.symbol();
    
    const usdcFormatted = Number(usdcBalance) / (10 ** decimals);
    console.log(`💵 ${symbol} Balance: $${usdcFormatted.toFixed(2)}`);
    
    if (usdcFormatted >= 1) {
      console.log("\n✅ Sufficient funds for trading");
      process.exit(0);
    } else {
      console.log("\n❌ Insufficient USDC for $1 trade");
      process.exit(1);
    }
    
  } catch (e) {
    console.error("Error checking balance:", e);
    process.exit(1);
  }
}

checkBalance();
