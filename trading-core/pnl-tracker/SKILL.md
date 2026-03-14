---
name: polymarket-pnl-tracker
description: Real-time profit and loss tracking, daily/weekly/monthly reports, performance analytics. Tracks every trade, calculates win rate, Sharpe ratio, expectancy. Logs to trades.jsonl with full details.
compatibility: Created for Zo Computer
metadata:
  author: kofi.zo.computer
---

# PnL Tracker

Real-time profit/loss tracking and performance analytics.

## Quick Start

```bash
# Get PnL report
bun scripts/report.ts --period daily

# Trade history
bun scripts/history.ts --limit 100

# Performance metrics
bun scripts/metrics.ts
```

## Core Workflows

### Trade Logging
All trades logged to `trades.jsonl`:
```json
{
  "timestamp": "2026-03-14T00:55:00Z",
  "market_id": "123",
  "direction": "yes",
  "size_usd": 0.50,
  "entry_price": 0.45,
  "exit_price": null,
  "edge_pct": 2.5,
  "confidence": 0.7,
  "expected_profit": 0.0125,
  "realized_pnl": null,
  "tx_hash": "0x...",
  "status": "open"
}
```

### Daily Reporting
1. Calculate daily PnL
2. Update win rate
3. Calculate Sharpe ratio
4. Track max drawdown
5. **OUTPUT**: Daily report to console + log

### Performance Metrics
- Win Rate: Wins / Total Trades
- Expectancy: (Win% × Avg Win) - (Loss% × Avg Loss)
- Sharpe: (Return - Risk Free) / Volatility
- Max Drawdown: Peak to trough decline

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `report.ts` | PnL report | `bun report.ts --period daily|weekly|monthly` |
| `history.ts` | Trade history | `bun history.ts --limit 50` |
| `metrics.ts` | Performance stats | `bun metrics.ts` |
| `export.ts` | Export to CSV | `bun export.ts --start 2026-03-01` |

## Integration Points

**Outputs to:**
- Risk Controller (drawdown data)
- Alert System (PnL alerts)
- Orchestrator (performance summary)

**Receives from:**
- Trade Executor (trade confirmations)
- Position Manager (position updates)
