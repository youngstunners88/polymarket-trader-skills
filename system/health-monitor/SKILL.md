---
name: trading-health-monitor
description: System health monitoring, heartbeat checks, resource tracking. Monitors all trading skills for liveness, tracks CPU/memory, and alerts on degradation. Essential for 24/7 reliability.
compatibility: Created for Zo Computer
metadata:
  author: kofi.zo.computer
---

# Trading Health Monitor

24/7 system health monitoring for trading infrastructure.

## Quick Start

```bash
# Start monitoring
bun scripts/monitor.ts

# Check health
bun scripts/health.ts

# Resource usage
bun scripts/resources.ts
```

## Monitored Components

| Component | Check | Interval |
|-----------|-------|----------|
| Market Monitor | WebSocket connected | 10s |
| Trade Executor | API responsive | 30s |
| Position Manager | DB accessible | 60s |
| Risk Controller | Rules loaded | 60s |
| PnL Tracker | Logging active | 30s |

## Health States

- 🟢 HEALTHY - All systems nominal
- 🟡 DEGRADED - Minor issues, monitoring
- 🔴 CRITICAL - Requires intervention

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `monitor.ts` | Start monitor | `bun monitor.ts` |
| `health.ts` | Health check | `bun health.ts` |
| `resources.ts` | Resource stats | `bun resources.ts` |
| `alert.ts` | Test alerts | `bun alert.ts --component market-monitor` |

## Integration Points

**Outputs to:**
- Alert System (on degradation)
- Orchestrator (system status)

**Receives from:**
- All skills (heartbeat signals)
