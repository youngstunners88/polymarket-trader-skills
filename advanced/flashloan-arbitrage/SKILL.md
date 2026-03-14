---
name: flashloan-arbitrage
description: Capital-free arbitrage via Aave/Spark/Maker. Multi-DEX price differences, atomic execution.
metadata:
  max_position: 10000
---

# Flash Loan Arbitrage

## Supported Pools
- Aave v3 (Arbitrum, Base)
- Spark Protocol (Maker)
- Morpho Blue

## Strategy
1. Borrow $10k USDC flash loan
2. Buy on DEX A (lower price)
3. Sell on DEX B (higher price)
4. Repay loan, keep profit
5. Atomic execution (all or nothing)

## Quick Start
```bash
# Find arb opportunities
bun scripts/scan-arb.ts --min-profit 0.5%

# Execute flash loan arb
bun scripts/flash-arb.ts --from Uniswap --to Sushi --amount 10000
```

## Profit Calculation
```
profit = (price_B - price_A) * amount - gas - flash_loan_fee
min_profit_threshold = 0.3%
```
