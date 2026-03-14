---
name: crypto-order-router
description: Smart order routing for crypto exchanges. Executes trades on Binance, Coinbase, or Kraken based on best price, liquidity, and fees. Integrates with Signal Aggregator for automated crypto trading.
compatibility: Created for Zo Computer
metadata:
  author: kofi.zo.computer
---

# Crypto Order Router

Smart order routing across multiple exchanges.

## Quick Start

```bash
# Route and execute
bun scripts/route.ts --symbol BTC-USD --direction buy --size 100

# Check routes
bun scripts/routes.ts --symbol ETH-USD

# Order status
bun scripts/status.ts --order-id <id>
```

## Routing Logic

1. Get quotes from all connected exchanges
2. Calculate all-in cost (price + fees)
3. Select best venue
4. Execute trade
5. Handle partial fills
6. Log to trade database

## Exchange Priority

| Rank | Exchange | When |
|------|----------|------|
| 1 | Binance | Best for major pairs |
| 2 | Coinbase | Best for US compliance |
| 3 | Kraken | Best for altcoins |

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `route.ts` | Route & execute | `bun route.ts --symbol BTC-USD --direction buy --size 100` |
| `routes.ts` | Show routes | `bun routes.ts` |
| `status.ts` | Order status | `bun status.ts --order-id xyz` |
| `cancel.ts` | Cancel order | `bun cancel.ts --order-id xyz` |

## Configuration

- Exchange API keys (from secrets)
- `MAX_ORDER_SIZE_USD` (default: 500)
- `MAX_SLIPPAGE_PCT` (default: 0.5)
- `PARTIAL_FILL_THRESHOLD` (default: 0.8)

## Integration Points

**Outputs to:**
- PnL Tracker (crypto trades)
- Position Manager (if tracking crypto)

**Receives from:**
- Signal Aggregator (trade signals)
- Price Feeds (execution prices)
