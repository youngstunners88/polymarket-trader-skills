---
name: trading-orchestrator
description: Central orchestrator managing the 24/7 trading system. Coordinates market-monitor, trade-executor, position-manager, risk-controller, pnl-tracker. Handles startup, shutdown, error recovery, and inter-skill communication.
compatibility: Created for Zo Computer
metadata:
  author: kofi.zo.computer
---

# Trading Orchestrator

Central conductor for the 24/7 autonomous trading system.

## Quick Start

```bash
# Start full system
bun scripts/run.ts

# Graceful shutdown
bun scripts/stop.ts

# Check system health
bun scripts/health.ts
```

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │Market Monitor│  │Trade Executor│  │   Position Manager   │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │Risk Controller│  │  PnL Tracker   │  │   Alert System       │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐                          │
│  │ Crypto Price │  │Signal Aggregator│  │   Config Manager     │ │
│  │   Feeds      │  └──────────────┘  └──────────────────────┘ │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

## Core Workflows

### System Startup
1. Load configuration from Config Manager
2. Initialize all skills in dependency order
3. Start Health Monitor heartbeat
4. Connect to Polymarket WebSocket
5. Begin market monitoring loop

### Trading Loop
1. Market Monitor detects opportunity
2. Risk Controller validates
3. Trade Executor places order
4. Position Manager tracks
5. PnL Tracker logs
6. Alert System notifies on significant events

### Error Recovery
- Skill crash → Auto-restart with backoff
- API failure → Circuit breaker + REST fallback
- Data corruption → Restore from last checkpoint
- Fatal error → Graceful shutdown with alert

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `run.ts` | Start system | `bun run.ts` |
| `stop.ts` | Graceful stop | `bun stop.ts` |
| `health.ts` | System health | `bun health.ts` |
| `restart.ts` | Restart skill | `bun restart.ts --skill market-monitor` |

## Integration Points

**Manages:**
- All trading-core skills
- All crypto-secondary skills
- System infrastructure skills

**Receives from:**
- Health Monitor (status checks)
- Config Manager (parameter updates)
