---
name: crypto-price-feeds
description: Multi-source price aggregation from Binance, Coinbase, Kraken for crypto secondary trading. Provides real-time price data with failover between sources. Used for crypto arbitrage and signal generation.
compatibility: Created for Zo Computer
metadata:
  author: kofi.zo.computer
---

# Crypto Price Feeds

Multi-source price aggregation for crypto secondary strategies.

## Quick Start

```bash
# Start price feeds
bun scripts/start.ts

# Get price for symbol
bun scripts/price.ts --symbol BTC-USD

# List all prices
bun scripts/snapshot.ts
```

## Supported Exchanges

| Exchange | Priority | Failover |
|----------|----------|----------|
| Binance | Primary | Auto |
| Coinbase | Secondary | Auto |
| Kraken | Tertiary | Auto |

## Core Workflows

### Price Aggregation
1. Connect to all exchange WebSockets
2. Maintain order book for each symbol
3. Calculate VWAP (Volume Weighted Average Price)
4. Detect cross-exchange arbitrage opportunities
5. **HANDOFF TO**: Signal Aggregator

### Failover Handling
1. Primary source fails → Switch to secondary
2. All sources fail → Use REST polling
3. Price stale > 30s → Flag for review
4. Spread > 2% between exchanges → Alert

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `start.ts` | Start feeds | `bun start.ts` |
| `price.ts` | Get price | `bun price.ts --symbol ETH-USD` |
| `snapshot.ts` | All prices | `bun snapshot.ts` |
| `arbitrage.ts` | Arb scanner | `bun arbitrage.ts --min-spread 0.5` |

## Configuration

- `BINANCE_API_KEY` / `BINANCE_SECRET`
- `COINBASE_API_KEY` / `COINBASE_SECRET`
- `KRAKEN_API_KEY` / `KRAKEN_SECRET`
- `PRICE_STALE_THRESHOLD_MS` (default: 30000)
- `MIN_ARBITRAGE_SPREAD_PCT` (default: 0.5)

## Integration Points

**Outputs to:**
- Signal Aggregator (price data)
- Arbitrage strategies

**Receives from:**
- Orchestrator (start/stop commands)
- Config Manager (symbol lists)
