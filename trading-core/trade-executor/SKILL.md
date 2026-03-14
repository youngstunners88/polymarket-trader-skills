---
name: polymarket-trade-executor
description: Autonomous order execution for Polymarket with smart order routing, slippage protection, and position sizing. Executes trades based on edge calculations with max position $1, 0.25x Kelly criterion. Never simulates - always executes real transactions.
compatibility: Created for Zo Computer - Real blockchain execution only
metadata:
  author: kofi.zo.computer
---

# Polymarket Trade Executor

Autonomous order execution with real blockchain transactions. Never simulate.

## Quick Start

```bash
# Execute trade
bun scripts/execute.ts --market <id> --direction <yes/no> --size <usd>

# Check pending orders
bun scripts/orders.ts --status pending
```

## Core Workflows

### Trade Execution
1. Receive signal from Market Monitor
2. Validate edge > MIN_EDGE_PCT (2%)
3. Calculate position size (Kelly 0.25x, max $1)
4. Check portfolio heat < MAX_HEAT (20%)
5. Execute blockchain transaction
6. Log to trades.jsonl
7. **HANDOFF TO**: Position Manager for tracking

### Position Sizing (Kelly Criterion)
```
Kelly % = (Edge / Odds) - ((1 - Edge) / (Odds - 1))
Position = Bankroll × Kelly % × 0.25
Max Position = $1 USD
```

### Slippage Protection
- Max slippage: 1%
- If slippage exceeded, reject trade
- Log rejected trades for analysis

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `execute.ts` | Execute trade | `bun execute.ts --market 123 --direction yes --size 0.50` |
| `orders.ts` | List orders | `bun orders.ts --status filled` |
| `cancel.ts` | Cancel order | `bun cancel.ts --order-id <id>` |

## Configuration

- `PRIVATE_KEY` - Wallet private key (from secrets)
- `MAX_POSITION_USD` - Max single position (default: 1)
- `KELLY_MULTIPLIER` - Kelly fraction (default: 0.25)
- `MIN_EDGE_PCT` - Minimum edge to trade (default: 2)
- `MAX_SLIPPAGE_PCT` - Slippage limit (default: 1)

## Critical Rules

**NEVER simulate trades. ALWAYS execute real blockchain transactions.**

**Log format:**
```json
{"timestamp": "2026-03-14T00:55:00Z", "market_id": "123", "direction": "yes", "size_usd": 0.50, "edge_pct": 2.5, "confidence": 0.7, "expected_profit": 0.0125, "tx_hash": "0x...", "status": "confirmed"}
```

## Integration Points

**Outputs to:**
- Position Manager (new positions)
- PnL Tracker (trade records)
- Risk Controller (exposure updates)

**Receives from:**
- Market Monitor (trade signals)
- Risk Controller (approval/denial)
