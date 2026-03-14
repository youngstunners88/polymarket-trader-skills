---
name: polymarket-position-manager
description: Portfolio tracking, position reconciliation, and exposure management for Polymarket positions. Tracks open positions, calculates unrealized PnL, manages position lifecycle from entry to exit.
compatibility: Created for Zo Computer
metadata:
  author: kofi.zo.computer
---

# Position Manager

Portfolio tracking and exposure management for all Polymarket positions.

## Quick Start

```bash
# List positions
bun scripts/positions.ts

# Get exposure report
bun scripts/exposure.ts

# Close position
bun scripts/close.ts --market <id>
```

## Core Workflows

### Position Tracking
1. Receive trade confirmation from Executor
2. Update position database
3. Calculate unrealized PnL
4. Update portfolio heat map
5. **ALERT IF**: Portfolio heat > 20%

### Position Reconciliation
1. Hourly reconciliation with blockchain
2. Verify on-chain vs database match
3. Flag discrepancies for manual review
4. Auto-correct if <1% variance

### Exit Management
1. Monitor positions for exit signals
2. Check take-profit / stop-loss levels
3. Execute exits through Trade Executor
4. Log realized PnL

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `positions.ts` | List all positions | `bun positions.ts --status open` |
| `exposure.ts` | Portfolio heat map | `bun exposure.ts` |
| `close.ts` | Close position | `bun close.ts --market 123` |
| `reconcile.ts` | Reconcile with chain | `bun reconcile.ts` |

## Database Schema

```sql
CREATE TABLE positions (
  id TEXT PRIMARY KEY,
  market_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  entry_price DECIMAL NOT NULL,
  size_usd DECIMAL NOT NULL,
  entry_time TIMESTAMP NOT NULL,
  unrealized_pnl DECIMAL DEFAULT 0,
  realized_pnl DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'open'
);
```

## Integration Points

**Outputs to:**
- PnL Tracker (position data)
- Risk Controller (exposure metrics)
- Orchestrator (portfolio state)

**Receives from:**
- Trade Executor (new trades)
- Market Monitor (price updates)
