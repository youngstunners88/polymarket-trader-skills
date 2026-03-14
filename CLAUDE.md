# Polymarket Trading System - Claude Context

## System Purpose

24/7 autonomous trading system for Polymarket prediction markets (primary) with crypto secondary strategies.

## Architecture

- **trading-core/**: Primary Polymarket trading engine
- **crypto-secondary/**: Crypto price feeds and signals
- **system/**: Infrastructure (health, alerts, config)

## Critical Rules

1. **NEVER simulate trades** - Always execute real blockchain transactions
2. **Max position $1**, 0.25x Kelly criterion
3. **Max daily drawdown 5%**, portfolio heat 20%
4. **Logging**: All trades to trades.jsonl
5. **Alerts**: Telegram only, internal team

## Quick Commands

```bash
# Start system
bun trading-core/orchestrator/scripts/run.ts

# Check health
bun system/health-monitor/scripts/health.ts

# View PnL
bun trading-core/pnl-tracker/scripts/report.ts --period daily
```

## Risk Parameters

See `trading-core/risk-controller/SKILL.md` for full limits.

## Skills Reference

| Skill | Path | Purpose |
|-------|------|---------|
| Market Monitor | trading-core/market-monitor/ | Real-time market scanning |
| Trade Executor | trading-core/trade-executor/ | Order execution |
| Position Manager | trading-core/position-manager/ | Portfolio tracking |
| Risk Controller | trading-core/risk-controller/ | Risk management |
| PnL Tracker | trading-core/pnl-tracker/ | Performance tracking |
| Orchestrator | trading-core/orchestrator/ | System coordination |
| Price Feeds | crypto-secondary/price-feeds/ | Crypto price data |
| Signal Aggregator | crypto-secondary/signal-aggregator/ | Technical signals |
| Order Router | crypto-secondary/order-router/ | Crypto execution |

## External APIs

- Polymarket (Gamma API + WebSocket)
- Binance (crypto price + trading)
- Coinbase (crypto price + trading)
- Kraken (crypto price + trading)
