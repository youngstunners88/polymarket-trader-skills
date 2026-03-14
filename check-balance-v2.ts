#!/usr/bin/env bun
import { ethers } from "ethers";

const WALLET_ADDRESS = "0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB";
const USDC_CONTRACT = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

// Try multiple RPC endpoints
const RPC_ENDPOINTS = [
  "https://polygon.llamarpc.com",
  "https://polygon-bor-rpc.publicnode.com",
  "https://polygon.drpc.org",
  "https://polygon.gateway.tenderly.co"
];

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

async function checkBalance() {
  console.log("🔍 Checking wallet balance...");
  console.log(`Wallet: ${WALLET_ADDRESS}\n`);
  
  for (const rpcUrl of RPC_ENDPOINTS) {
    try {
      console.log(`Trying ${rpcUrl}...`);
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Quick test - get block number
      const block = await provider.getBlockNumber();
      console.log(`  ✅ Connected (block: ${block})`);
      
      // Check MATIC
      const maticBalance = await provider.getBalance(WALLET_ADDRESS);
      console.log(`  💜 MATIC: ${ethers.formatEther(maticBalance)}`);
      
      // Check USDC
      const usdc = new ethers.Contract(USDC_CONTRACT, ERC20_ABI, provider);
      const usdcBalance = await usdc.balanceOf(WALLET_ADDRESS);
      const decimals = await usdc.decimals();
      const usdcFormatted = Number(usdcBalance) / (10 ** decimals);
      
      console.log(`  💵 USDC: $${usdcFormatted.toFixed(2)}`);
      console.log(`  ${usdcFormatted >= 1 ? "✅ Can trade" : "❌ Need USDC"}\n`);
      
      return usdcFormatted;
      
    } catch (e: any) {
      console.log(`  ❌ Failed: ${e.message.slice(0, 80)}...\n`);
    }
  }
  
  console.log("❌ All RPC endpoints failed");
  return 0;
}

checkBalance();
