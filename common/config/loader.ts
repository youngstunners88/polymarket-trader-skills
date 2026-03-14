import { db } from "../db/client.js";
import type { TradingConfig } from "../types/index.js";

export async function loadConfig(): Promise<TradingConfig> {
  const rows = await db.query("SELECT key, value FROM config");
  const config: Record<string, number> = {};
  
  for (const row of rows) {
    config[row.key] = parseFloat(row.value);
  }

  return {
    MAX_POSITION_USD: config.MAX_POSITION_USD ?? 1,
    KELLY_MULTIPLIER: config.KELLY_MULTIPLIER ?? 0.25,
    MAX_DAILY_DRAWDOWN_PCT: config.MAX_DAILY_DRAWDOWN_PCT ?? 5,
    MAX_PORTFOLIO_HEAT_PCT: config.MAX_PORTFOLIO_HEAT_PCT ?? 20,
    MIN_EDGE_PCT: config.MIN_EDGE_PCT ?? 2,
    MAX_SLIPPAGE_PCT: config.MAX_SLIPPAGE_PCT ?? 1,
    MOMENTUM_THRESHOLD_PCT: config.MOMENTUM_THRESHOLD_PCT ?? 2,
    MIN_LIQUIDITY_USD: config.MIN_LIQUIDITY_USD ?? 10000,
    WS_RECONNECT_MAX: config.WS_RECONNECT_MAX ?? 10,
    PRICE_STALE_THRESHOLD_MS: config.PRICE_STALE_THRESHOLD_MS ?? 30000,
  };
}

export async function updateConfig(key: string, value: number): Promise<void> {
  await db.exec(
    "INSERT OR REPLACE INTO config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
    [key, value.toString()]
  );
}
