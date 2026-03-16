---
name: market-monitor
description: 24/7 WebSocket market scanning. Real-time price, volume, liquidity tracking.
---

# Market Monitor

## Quick Start
```bash
bun scripts/monitor.ts --markets all
bun scripts/status.ts
```

## Features
- WebSocket connection to all DEXs
- Price movement detection (>2% in 60s)
- Volume spike alerts (>3 std dev)
- Auto-reconnect with exponential backoff
