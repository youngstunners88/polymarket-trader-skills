---
name: hyperliquid-orchestrator
description: 24/7 autonomous trading on Hyperliquid. Real execution, no simulation.
metadata:
  mode: autonomous
  interval: 60s
---

# Hyperliquid Orchestrator

## Quick Start
```bash
bun scripts/run-24-7.ts
```

## Features
- Scans markets every 60s
- Detects edge opportunities
- Executes REAL trades
- Logs to blockchain
- Error recovery

## Autonomous Mode
```bash
nohup bun scripts/run-24-7.ts > /dev/null 2>&1 &
```

## Target
| Metric | Value |
|--------|-------|
| Win Rate | 81%+ |
| Max Position | $1 |
| Kelly | 0.25x |
| Slippage | <0.5% |
