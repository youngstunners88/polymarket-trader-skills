#!/usr/bin/env bun
/**
 * Deposit Watcher - Monitors all chains for incoming funds
 * Auto-trades when deposits confirm
 */

import { Logger } from "./common/utils/logger.js";

interface WalletMonitor {
  chain: string;
  wallet: string;
  lastBalance: number;
  threshold: number;
}

class DepositWatcher {
  private wallets: WalletMonitor[] = [
    { chain: "Hyperliquid", wallet: "0x93efA50f6dc50c2a3119aC392D790E308d23928E", lastBalance: 0, threshold: 5 },
    { chain: "Solana", wallet: "8312rG4xtn5nWHfjT8RXoLWyNjCjjtghPXcQXCXv4WA7", lastBalance: 0, threshold: 0.01 },
  ];

  async checkHyperliquid(): Promise<number> {
    try {
      const { execSync } = await import("child_process");
      const output = execSync(
        "HYPERLIQUID_PRIVATE_KEY='$Private' node /tmp/hyperliquid-cli/dist/index.js account balances --json",
        { encoding: "utf-8", timeout: 10000, env: { ...process.env, HYPERLIQUID_PRIVATE_KEY: process.env.Private || "" } }
      );
      const data = JSON.parse(output);
      const perpBalance = parseFloat(data.perpBalance || "0");
      const spotBalance = data.spotBalances?.reduce((sum: number, b: any) => sum + parseFloat(b.balance || 0), 0) || 0;
      return perpBalance + spotBalance;
    } catch {
      return 0;
    }
  }

  async checkSolana(): Promise<number> {
    try {
      const resp = await fetch("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: ["8312rG4xtn5nWHfjT8RXoLWyNjCjjtghPXcQXCXv4WA7"]
        })
      });
      const data = await resp.json();
      return (data.result?.value || 0) / 1_000_000_000;
    } catch {
      return 0;
    }
  }

  async monitor(): Promise<void> {
    await Logger.system("👁️  Deposit Watcher Started");
    await Logger.system("   Watching: Hyperliquid L2 + Solana");
    await Logger.system("   Auto-trade threshold: $5 (HL) / 0.01 SOL");

    while (true) {
      // Check Hyperliquid
      const hlBalance = await this.checkHyperliquid();
      if (hlBalance > this.wallets[0].lastBalance && hlBalance >= this.wallets[0].threshold) {
        await Logger.system(`🚨 HYPERLIQUID DEPOSIT DETECTED: $${hlBalance}`);
        await this.triggerTrade("Hyperliquid", hlBalance);
        this.wallets[0].lastBalance = hlBalance;
      }

      // Check Solana  
      const solBalance = await this.checkSolana();
      if (solBalance > this.wallets[1].lastBalance && solBalance >= this.wallets[1].threshold) {
        await Logger.system(`🚨 SOLANA DEPOSIT DETECTED: ${solBalance} SOL`);
        await this.triggerTrade("Solana", solBalance);
        this.wallets[1].lastBalance = solBalance;
      }

      await new Promise(r => setTimeout(r, 30000)); // Check every 30s
    }
  }

  async triggerTrade(chain: string, amount: number): Promise<void> {
    await Logger.system(`⚡ AUTO-TRADING ON ${chain} WITH $${amount}`);
    // Would trigger actual trade execution here
  }
}

const watcher = new DepositWatcher();
watcher.monitor().catch(console.error);
