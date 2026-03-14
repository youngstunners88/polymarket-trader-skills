#!/usr/bin/env bun
/**
 * LIVE Trade Executor - Real Polymarket Trading
 * Uses actual wallet and blockchain transactions
 */

import { parseArgs } from "util";
import { ethers } from "ethers";
import { db } from "../../../common/db/client.js";
import { Logger } from "../../../common/utils/logger.js";
import { loadConfig } from "../../../common/config/loader.js";
import { calculateKellyPosition } from "../../../common/utils/kelly.js";
import { polymarket } from "../../../common/apis/polymarket.js";

const CTF_EXCHANGE_ABI = [
  "function buy(uint256 tokenId, uint256 amount, uint256 maxPrice) external",
  "function sell(uint256 tokenId, uint256 amount, uint256 minPrice) external",
];

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    market: { type: "string" },
    direction: { type: "string" },
    size: { type: "string" },
    edge: { type: "string" },
  },
  strict: true,
  allowPositionals: true,
});

async function executeLiveTrade() {
  const config = await loadConfig();
  
  if (!values.market || !values.direction || !values.size) {
    console.log("Usage: bun execute-live.ts --market <id> --direction <yes/no> --size <usd> [--edge <pct>]");
    process.exit(1);
  }

  const marketId = values.market;
  const direction = values.direction as "yes" | "no";
  const requestedSize = parseFloat(values.size);
  const edge = parseFloat(values.edge || "0");

  // Check trading halted
  const haltCheck = await db.query("SELECT value FROM config WHERE key = 'TRADING_HALTED'");
  if (haltCheck[0]?.value === "true") {
    console.log("🛑 Trading is halted");
    process.exit(1);
  }

  // Get current market price
  const prices = await polymarket.getMarketPrices(marketId);
  const entryPrice = direction === "yes" ? prices.yes : prices.no;
  
  await Logger.system(`Market ${marketId}: YES=${prices.yes.toFixed(4)} NO=${prices.no.toFixed(4)}`);

  // Validate risk
  if (requestedSize > config.MAX_POSITION_USD) {
    await Logger.system(`Risk check failed: Size $${requestedSize} > max $${config.MAX_POSITION_USD}`, "error");
    process.exit(1);
  }

  if (edge < config.MIN_EDGE_PCT) {
    await Logger.system(`Risk check failed: Edge ${edge}% < min ${config.MIN_EDGE_PCT}%`, "error");
    process.exit(1);
  }

  // Calculate position size using Kelly
  const bankroll = 100; // $100 base
  const kellySize = calculateKellyPosition(edge, bankroll, config.KELLY_MULTIPLIER, config.MAX_POSITION_USD);
  const sizeUsd = Math.min(requestedSize, kellySize);

  // Setup wallet
  const privateKey = polymarket.getCredentials().privateKey;
  if (!privateKey) {
    await Logger.system("Missing PRIVATE_KEY - cannot execute trade", "error");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const wallet = new ethers.Wallet(privateKey, provider);
  const walletAddress = await wallet.getAddress();

  await Logger.system(`Wallet: ${walletAddress}`);
  await Logger.system(`Executing LIVE trade: ${marketId} ${direction.toUpperCase()} $${sizeUsd.toFixed(2)} (edge: ${edge}%)`);

  // Get token ID for the outcome
  // Polymarket uses conditional tokens - tokenId is derived from marketId + outcome
  const tokenId = ethers.keccak256(
    ethers.solidityPacked(
      ["bytes32", "uint256"],
      [marketId, direction === "yes" ? 1 : 0]
    )
  );

  // Execute transaction on CTF Exchange
  const ctfExchange = new ethers.Contract(
    "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982C",
    CTF_EXCHANGE_ABI,
    wallet
  );

  // Convert USD to token amount (simplified - real calc needs decimals)
  const tokenAmount = ethers.parseUnits(sizeUsd.toString(), 6); // USDC = 6 decimals
  const maxPrice = ethers.parseUnits((entryPrice * 1.01).toString(), 18); // 1% slippage tolerance

  try {
    // Send the transaction
    const tx = await ctfExchange.buy(tokenId, tokenAmount, maxPrice, {
      gasLimit: 500000,
    });

    await Logger.system(`Transaction sent: ${tx.hash}`);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    
    if (receipt?.status === 1) {
      await Logger.system(`Transaction confirmed: ${tx.hash}`);
    } else {
      await Logger.system(`Transaction failed: ${tx.hash}`, "error");
      process.exit(1);
    }

    // Log the trade
    const trade = {
      timestamp: new Date().toISOString(),
      marketId,
      direction,
      sizeUsd,
      entryPrice,
      edgePct: edge,
      confidence: 0.7,
      expectedProfit: sizeUsd * (edge / 100),
      txHash: tx.hash,
      status: "open",
      gasUsed: receipt?.gasUsed?.toString(),
    };

    await Logger.trade(trade);
    
    await db.exec(
      `INSERT INTO trades (id, timestamp, market_id, direction, size_usd, entry_price, edge_pct, confidence, expected_profit, tx_hash, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tx.hash, trade.timestamp, marketId, direction, sizeUsd, entryPrice, edge, 0.7, trade.expectedProfit, tx.hash, "open"]
    );

    await db.exec(
      `INSERT INTO positions (id, market_id, direction, entry_price, size_usd, entry_time, status, tx_hash) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [tx.hash, marketId, direction, entryPrice, sizeUsd, trade.timestamp, "open", tx.hash]
    );

    // Send alert
    await db.exec(
      `INSERT INTO alerts (type, timestamp, message, data, sent) VALUES (?, ?, ?, ?, ?)`,
      ["trade", trade.timestamp, `✅ OPENED ${direction.toUpperCase()} on ${marketId} for $${sizeUsd.toFixed(2)}`, JSON.stringify(trade), false]
    );

    console.log(`✅ LIVE TRADE EXECUTED: ${tx.hash}`);
    console.log(JSON.stringify(trade, null, 2));

  } catch (error) {
    await Logger.system(`Trade execution failed: ${error}`, "error");
    throw error;
  }
}

executeLiveTrade().catch(async (e) => {
  await Logger.system(`Fatal error: ${e}`, "error");
  console.error(e);
  process.exit(1);
});
