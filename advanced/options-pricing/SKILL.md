---
name: options-pricing
description: Black-Scholes, Greeks calculation for perp pricing. Implied volatility, delta hedging.
metadata:
  model: black_scholes
---

# Options Pricing

## Greeks Calculation
```python
delta = ∂V/∂S  (direction exposure)
gamma = ∂²V/∂S² (convexity)
theta = ∂V/∂t  (time decay)
vega = ∂V/∂σ  (volatility exposure)
```

## Edge Detection
- Delta >0.7: Overbought, reduce long
- Delta <0.3: Oversold, add long
- Vega spike: Vol play, size up

## Quick Start
```bash
bun scripts/greeks.ts --perp ETH-USD
bun scripts/delta-hedge.ts --target-delta 0.5
```
