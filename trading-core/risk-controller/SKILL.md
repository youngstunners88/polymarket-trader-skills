---
name: polymarket-risk-controller
description: Risk management system enforcing max position $1, 0.25x Kelly, max 5% daily drawdown, 20% portfolio heat. Pre-trade validation, position limits, circuit breakers. The safety layer of the trading system.
compatibility: Created for Zo Computer
metadata:
  author: kofi.zo.computer
---

# Risk Controller

Safety layer enforcing trading limits and circuit breakers.

## Risk Parameters

| Parameter | Value | Hard Limit |
|-----------|-------|------------|
| Max Position | $1 USD | Hard stop |
| Kelly Multiplier | 0.25x | Hard stop |
| Max Daily Drawdown | 5% | Soft alert |
| Max Portfolio Heat | 20% | Hard stop |
| Min Edge | 2% | Hard stop |
| Max Slippage | 1% | Hard stop |

## Quick Start

```bash
# Check risk status
bun scripts/status.ts

# Validate trade
bun scripts/validate.ts --market <id> --size <usd> --edge <pct>

# Emergency stop
bun scripts/kill.ts
```

## Core Workflows

### Pre-Trade Validation
1. Check portfolio heat < 20%
2. Validate position size ≤ $1
3. Verify edge ≥ 2%
4. Check daily drawdown < 5%
5. **RETURN**: APPROVE or REJECT with reason

### Circuit Breakers
- Daily loss > 5%: PAUSE trading for 1 hour
- Portfolio heat > 20%: REJECT all new positions
- WebSocket down > 60s: FALLBACK to REST polling
- 3 consecutive losses: REDUCE size by 50%

### Risk Monitoring
- Real-time PnL tracking
- Rolling 24h drawdown calculation
- Correlation analysis (avoid concentrated bets)
- Volatility regime detection

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `validate.ts` | Validate trade | `bun validate.ts --size 0.5 --edge 2.5` |
| `status.ts` | Risk dashboard | `bun status.ts` |
| `kill.ts` | Emergency stop | `bun kill.ts --reason "manual"` |
| `resume.ts` | Resume trading | `bun resume.ts` |

## Integration Points

**Outputs to:**
- Trade Executor (approve/deny signals)
- Alert System (breach notifications)
- Orchestrator (system state)

**Receives from:**
- Position Manager (exposure data)
- PnL Tracker (drawdown metrics)
