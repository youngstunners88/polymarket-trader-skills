---
name: risk-controller
description: Kelly criterion sizing, max drawdown limits, portfolio heat monitoring.
---

# Risk Controller

## Limits
- Max position: $1
- Kelly: 0.25x
- Max daily drawdown: 5%
- Max portfolio heat: 20%
- Min edge: 2%

## Quick Start
```bash
bun scripts/validate.ts --size 0.5 --edge 5
bun scripts/status.ts
```
