---
name: polymarket-market-monitor
description: Real-time market scanner for Polymarket prediction markets. Monitors price movements, volume spikes, liquidity changes, and new market listings. Uses WebSocket connections for sub-second latency. Primary engine for 24/7 autonomous trading.
compatibility: Created for Zo Computer - Polymarket prediction market trading
metadata:
  author: kofi.zo.computer
---

# Polymarket Market Monitor

24/7 real-time scanner for Polymarket prediction markets with sub-second WebSocket latency.

## Quick Start

```bash
# Start the monitor
bun scripts/monitor.ts

# Check market status
bun scripts/status.ts
```

## Core Workflows

### Market Discovery
1. Connect to Polymarket WebSocket API
2. Subscribe to all active markets
3. Track new market listings
4. Filter by liquidity threshold (>$10k)
5. **HANDOFF TO**: Signal Generator for analysis

### Price Movement Detection
1. Monitor tick-by-tick price changes
2. Calculate 1m/5m/15m momentum
3. Flag movements >2% in 60s
4. Log to volatility index
5. **HANDOFF TO**: Trade Executor if edge > threshold

### Volume Spike Detection
1. Track rolling 5m volume baseline
2. Detect spikes >3 standard deviations
3. Correlate with price movement
4. Alert on unusual activity
5. **HANDOFF TO**: Position Manager for sizing

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `monitor.ts` | Main WebSocket monitor | `bun monitor.ts` |
| `status.ts` | Health check & metrics | `bun status.ts` |
| `markets.ts` | List active markets | `bun markets.ts --min-liquidity 10000` |

## Configuration

Environment variables:
- `POLYMARKET_API_KEY` - API authentication
- `POLYMARKET_WS_ENDPOINT` - WebSocket URL
- `MIN_LIQUIDITY_USD` - Filter threshold (default: 10000)
- `MOMENTUM_THRESHOLD_PCT` - Price alert threshold (default: 2)

## Integration Points

**Outputs to:**
- Trade Executor (when edge detected)
- Position Manager (position updates)
- PnL Tracker (market data for valuation)
- Alert System (anomaly notifications)

**Receives from:**
- Config Manager (parameter updates)
- Health Monitor (heartbeat checks)

## Risk Controls

- Max WebSocket reconnect attempts: 10
- Circuit breaker on >50% message loss
- Rate limiting: 100 req/min for REST fallback
