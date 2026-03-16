---
name: hyperliquid-executor
description: REAL trade execution on Hyperliquid. Direct API, on-chain submission, no simulation.
metadata:
  exchange: hyperliquid
  chain: arbitrum
---

# Hyperliquid Executor

## Quick Start
```bash
export Private="0x..."
bun scripts/execute.ts ETH BUY 0.01
```

## Real Execution Flow
1. Load private key → Create wallet
2. Get market price → Calculate value
3. Sign order with ethers.js
4. POST to api.hyperliquid.xyz/exchange
5. Log response with tx details
6. Verify on Hyperliquid explorer

## Scripts
| Script | Purpose |
|--------|---------|
| `execute.ts` | Real trade execution |
| `balance.ts` | Check account balance |

## Logs
`/hyperliquid-core/data/trades.jsonl` - All executed trades

## Verification
Check transactions at:
https://app.hyperliquid.xyz/explorer
