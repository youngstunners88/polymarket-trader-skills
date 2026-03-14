---
name: crypto-signal-aggregator
description: Technical indicator calculation and signal scoring for crypto trading. Combines price feeds, momentum indicators, and market regime detection. Provides buy/sell signals with confidence scores for secondary crypto strategies.
compatibility: Created for Zo Computer
metadata:
  author: kofi.zo.computer
---

# Crypto Signal Aggregator

Technical analysis and signal generation for crypto secondary trading.

## Quick Start

```bash
# Generate signals
bun scripts/signals.ts --symbol BTC-USD

# Backtest strategy
bun scripts/backtest.ts --strategy momentum --days 30

# List active signals
bun scripts/active.ts
```

## Technical Indicators

| Indicator | Period | Weight |
|-----------|--------|--------|
| RSI | 14 | 20% |
| MACD | 12/26/9 | 25% |
| EMA Cross | 9/21 | 20% |
| Volume Profile | 24h | 15% |
| Bollinger Bands | 20 | 20% |

## Core Workflows

### Signal Generation
1. Receive price updates from Price Feeds
2. Calculate all technical indicators
3. Score each indicator (0-1)
4. Weighted aggregate → Signal score
5. Apply confidence threshold (0.6)
6. **HANDOFF TO**: Order Router if signal > threshold

### Market Regime Detection
1. Calculate volatility (ATR)
2. Classify regime: trending/ranging/volatile
3. Adjust indicator weights by regime
4. Reduce size in volatile regimes

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `signals.ts` | Generate signals | `bun signals.ts --symbol BTC-USD` |
| `backtest.ts` | Strategy backtest | `bun backtest.ts --strategy momentum` |
| `active.ts` | Active signals | `bun active.ts` |
| `regime.ts` | Market regime | `bun regime.ts --symbol ETH-USD` |

## Signal Format

```json
{
  "timestamp": "2026-03-14T00:55:00Z",
  "symbol": "BTC-USD",
  "direction": "buy",
  "confidence": 0.72,
  "indicators": {
    "rsi": 0.65,
    "macd": 0.80,
    "ema": 0.70
  },
  "regime": "trending",
  "suggested_size": 0.25
}
```

## Integration Points

**Outputs to:**
- Order Router (trading signals)
- Orchestrator (signal dashboard)

**Receives from:**
- Price Feeds (price data)
- Config Manager (strategy parameters)
