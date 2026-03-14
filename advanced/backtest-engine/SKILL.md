---
name: backtest-engine
description: Historical trade validation, walk-forward analysis, strategy optimization.
metadata:
  accuracy: high
---

# Backtest Engine

## Features
- Tick-level data replay
- Slippage modeling
- Gas cost simulation
- Multi-strategy comparison

## Quick Start
```bash
# Run backtest
bun scripts/backtest.ts --strategy jupiter-arb --days 30

# Optimize parameters
bun scripts/optimize.ts --param slippage --range 0.1,0.5

# Walk-forward validation
bun scripts/walk-forward.ts --train-days 60 --test-days 30
```

## Output
```json
{
  "sharpe_ratio": 2.1,
  "max_drawdown": 0.08,
  "win_rate": 0.78,
  "profit_factor": 1.9
}
```
