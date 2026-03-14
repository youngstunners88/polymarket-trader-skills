---
name: onchain-analytics
description: Whale watching, insider detection, order flow analysis. Dune API, Nansen, Arkham.
metadata:
  data_sources: Dune,Arkham,Nansen
---

# On-Chain Analytics

## Detected Patterns
| Pattern | Signal | Action |
|---------|--------|--------|
| Whale buy $50k+ | +25% edge | Follow trade |
| Insider transfer | +30% edge | Copy position |
| Exchange inflow | -20% edge | Sell signal |
| Smart money net buy | +15% edge | Direction bias |

## Quick Start
```bash
# Whale alert
bun scripts/whale-watch.ts --min-value 50000 --token ETH

# Insider copy
bun scripts/insider-copy.ts --track-wallet 0x123...
```

## Dune Queries
- Whale accumulation
- Exchange flows
- Smart money moves
