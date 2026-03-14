---
name: arbitrage-engine
description: Binance-Polymarket arbitrage engine. Replicates $20k/day @0x8dxd strategy.
---

# Arbitrage Engine

Real-time arbitrage between Binance spot and Polymarket prediction markets.

## Quick Start

```bash
bun scripts/activate.ts    # Start Python engine
bun scripts/status.ts      # Check status
bun config.ts            # Configure edge threshold
```

## Configuration

- `MIN_EDGE_THRESHOLD`: 5% (default)
- `MAX_POSITION_USD`: $1
- `REBALANCE_THRESHOLD`: 85%
