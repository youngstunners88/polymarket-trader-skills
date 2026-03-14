// Trading System Core Types

export interface Market {
  id: string;
  question: string;
  slug: string;
  status: "active" | "closed" | "resolved";
  yesPrice: number;
  noPrice: number;
  volume: number;
  liquidity: number;
  category?: string;
  resolutionDate?: string;
  lastUpdated: number;
}

export interface Trade {
  timestamp: string;
  marketId: string;
  direction: "yes" | "no";
  sizeUsd: number;
  entryPrice: number;
  exitPrice?: number;
  edgePct: number;
  confidence: number;
  expectedProfit: number;
  realizedPnl?: number;
  txHash: string;
  status: "open" | "closed" | "pending";
}

export interface Position {
  id: string;
  marketId: string;
  direction: "yes" | "no";
  entryPrice: number;
  sizeUsd: number;
  entryTime: string;
  unrealizedPnl: number;
  realizedPnl: number;
  status: "open" | "closed";
}

export interface Signal {
  timestamp: string;
  marketId: string;
  direction: "yes" | "no";
  confidence: number;
  edgePct: number;
  expectedProfit: number;
  indicators: Record<string, number>;
}

export interface RiskCheck {
  approved: boolean;
  reason?: string;
  portfolioHeat: number;
  dailyDrawdown: number;
  positionSize: number;
}

export interface TradingConfig {
  MAX_POSITION_USD: number;
  KELLY_MULTIPLIER: number;
  MAX_DAILY_DRAWDOWN_PCT: number;
  MAX_PORTFOLIO_HEAT_PCT: number;
  MIN_EDGE_PCT: number;
  MAX_SLIPPAGE_PCT: number;
  MOMENTUM_THRESHOLD_PCT: number;
  MIN_LIQUIDITY_USD: number;
  WS_RECONNECT_MAX: number;
  PRICE_STALE_THRESHOLD_MS: number;
}

export interface HealthStatus {
  component: string;
  status: "healthy" | "degraded" | "critical";
  lastCheck: number;
  message?: string;
}

export interface PnLReport {
  period: "daily" | "weekly" | "monthly";
  realizedPnl: number;
  unrealizedPnl: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  expectancy: number;
}

export type AlertType = "trade" | "risk" | "system" | "pnl";

export interface Alert {
  type: AlertType;
  timestamp: string;
  message: string;
  data?: Record<string, any>;
}
