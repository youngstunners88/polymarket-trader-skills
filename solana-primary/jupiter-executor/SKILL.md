---
name: solana-jupiter-executor
description: Jupiter DEX aggregator for Solana. Executes trades on Solana via Jupiter API. Best prices across all Solana DEXs.
---

# Solana Jupiter Executor

Primary Solana trading execution via Jupiter DEX aggregator.

## Quick Start

```bash
# Check balance
bun scripts/balance.ts --wallet $SOLANA_WALLET

# Execute swap SOL -> USDC
bun scripts/swap.ts --from SOL --to USDC --amount 0.1

# Execute arbitrary trade
bun scripts/trade.ts --input SOL --output $TOKEN --amount 0.05 --slippage 1
```

## API Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `balance.ts` | Check wallet balances | `bun balance.ts` |
| `swap.ts` | Simple token swap | `bun swap.ts --from SOL --to USDC --amount 0.1` |
| `trade.ts` | Complex order routing | `bun trade.ts --input SOL --output TOKEN --amount 0.05` |
| `quote.ts` | Get price quote | `bun quote.ts --input SOL --output USDC --amount 0.1` |

## Risk Parameters

- Max trade size: $1 (Solana is fast, but respect Kelly)
- Slippage: 1% default (0.5% for stable pairs)
- Priority fee: Auto-adjust based on network congestion
