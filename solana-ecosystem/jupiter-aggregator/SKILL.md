---
name: jupiter-aggregator
description: Jupiter v6 DEX aggregator for Solana. Multi-hop swaps, smart routing.
---

# Jupiter Aggregator

## Quick Start
```bash
bun scripts/swap.ts --from SOL --to USDC --amount 0.1
bun scripts/monitor.ts --token SOL
```

## Config
- `SOLANA_WALLET`, `SOLANA_PRIVATE_KEY`
- `JUPITER_RPC`

## Edge: Price impact arbitrage, route optimization
