---
name: trading-config-manager
description: Centralized configuration management for all trading parameters. Manages risk limits, API keys, market filters, and strategy parameters. Supports hot-reloading without restart.
compatibility: Created for Zo Computer
metadata:
  author: kofi.zo.computer
---

# Trading Config Manager

Centralized configuration for all trading parameters.

## Quick Start

```bash
# Load config
bun scripts/load.ts

# Update parameter
bun scripts/update.ts --key MAX_POSITION_USD --value 2

# Hot reload
bun scripts/reload.ts
```

## Configuration Schema

```typescript
interface TradingConfig {
  // Risk Parameters
  MAX_POSITION_USD: number;        // Default: 1
  KELLY_MULTIPLIER: number;        // Default: 0.25
  MAX_DAILY_DRAWDOWN_PCT: number;  // Default: 5
  MAX_PORTFOLIO_HEAT_PCT: number;  // Default: 20
  MIN_EDGE_PCT: number;            // Default: 2
  MAX_SLIPPAGE_PCT: number;        // Default: 1
  
  // Trading Parameters
  MOMENTUM_THRESHOLD_PCT: number; // Default: 2
  MIN_LIQUIDITY_USD: number;        // Default: 10000
  
  // System Parameters
  WS_RECONNECT_MAX: number;        // Default: 10
  PRICE_STALE_THRESHOLD_MS: number; // Default: 30000
}
```

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `load.ts` | Load config | `bun load.ts` |
| `update.ts` | Update value | `bun update.ts --key MAX_POSITION_USD --value 2` |
| `reload.ts` | Hot reload | `bun reload.ts` |
| `validate.ts` | Validate config | `bun validate.ts` |
| `export.ts` | Export config | `bun export.ts --format json` |

## Integration Points

**Outputs to:**
- All trading skills (config values)
- Orchestrator (system-wide settings)

**Storage:**
- SQLite database: `config.db`
- Environment variables (secrets)
