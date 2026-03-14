---
name: sde-simulator
description: Stochastic Differential Equation simulator. Physics-informed attention, 1000-path Monte Carlo before every trade.
metadata:
  version: v1.5
---

# SDE Simulator

## Physics Model
```
dS/dt = μS + σS·dW/dt + market_noise

PDE Residual Loss = |dS/dt - (μS + σS·dW/dt)|
```

## Path Coherence
- >0.7: APPROVE trade
- 0.5-0.7: REDUCE size
- <0.5: BLOCK trade

## Quick Start
```bash
# 1000-path stress test
bun scripts/sde-stress.ts --market BTC-USD --paths 1000

# Kelly adjustment based on drawdown risk
bun scripts/dynamic-kelly.ts --max-fraction 0.35
```

## Output
```json
{
  "static_edge": 0.07,
  "path_coherence": 0.244,
  "recommendation": "BLOCK",
  "position_size_usd": 0.26
}
```
