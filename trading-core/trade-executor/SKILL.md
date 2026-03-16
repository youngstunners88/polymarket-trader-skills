---
name: trade-executor
description: REAL trade execution on Hyperliquid + Polymarket. On-chain, signed, verified.
---

# Trade Executor

## Quick Start
```bash
# Hyperliquid
bun scripts/execute.ts --chain hyperliquid --coin ETH --size 0.01

# Polymarket
bun scripts/execute.ts --chain polymarket --market <id> --size 5
```

## Real Execution
- Signs with private key
- Submits to exchange API
- Returns tx hash
- Logs to blockchain
- Verifiable on explorer
