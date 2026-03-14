# Polymarket Trading System - Claude Context

## System Purpose

24/7 autonomous trading system for Polymarket prediction markets (primary) with crypto secondary strategies.

**Core Philosophy:**
- Real trades only - no simulations
- Risk-first architecture
- Self-healing with auto-recovery
- Comprehensive logging for auditability

---

## Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ORCHESTRATOR                                  │
│  Coordinates startup, shutdown, error recovery, skill communication   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ MARKET MONITOR│         │ TRADE EXECUTOR│         │RISK CONTROLLER│
│  (Polymarket) │         │               │         │               │
│  WebSocket    │───────▶ │  Real trades  │◀───────│  Validates    │
│  Sub-100ms    │         │  Blockchain   │         │  all orders   │
└───────────────┘         └───────────────┘         └───────────────┘
        │                           │                           │
        │                   ┌─────────┴─────────┐                 │
        │                   │                   │                 │
        ▼                   ▼                   ▼                 ▼
┌───────────────┐    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│POSITION MANAGER│   │   PnL TRACKER │   │ ALERT SYSTEM  │   │HEALTH MONITOR │
│               │    │               │   │               │   │               │
│ Tracks all    │    │ Logs to       │   │ Telegram      │   │ Skill status  │
│ positions     │    │ trades.jsonl  │   │ notifications │   │ & recovery    │
└───────────────┘    └───────────────┘   └───────────────┘   └───────────────┘
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        │                                                       │
        ▼                                                       ▼
┌──────────────────────────┐                        ┌──────────────────────────┐
│    CRYPTO SECONDARY      │                        │    SYSTEM LAYER          │
│  ┌──────────┬──────────┐ │                        │  ┌────────────────────┐  │
│  │PRICE     │SIGNAL    │ │                        │  │ CONFIG MANAGER     │  │
│  │FEEDS     │AGGREGATOR│ │                        │  │ Hot-reload params   │  │
│  └──────────┴──────────┘ │                        │  └────────────────────┘  │
│  ┌────────────────────┐  │                        └──────────────────────────┘
│  │   ORDER ROUTER     │  │
│  │  Multi-exchange    │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

---

## Skill Inter-Dependencies

```
Orchestrator
├── Market Monitor (starts first, no deps)
├── Risk Controller (no deps, loads rules)
├── Position Manager (depends on: Risk Controller)
├── Trade Executor (depends on: Risk Controller, Position Manager)
├── PnL Tracker (depends on: Position Manager, Trade Executor)
├── Health Monitor (depends on: all trading skills)
├── Alert System (depends on: Health Monitor)
├── Config Manager (no deps)
├── Crypto: Price Feeds (no deps)
├── Crypto: Signal Aggregator (depends on: Price Feeds)
└── Crypto: Order Router (depends on: Signal Aggregator, Risk Controller)
```

---

## Critical Implementation Rules

### 1. Real Trades Only
```typescript
// ❌ NEVER DO THIS
if (process.env.SIMULATE === "true") {
  return mockTradeResult(); // NEVER
}

// ✅ ALWAYS execute real transactions
const tx = await wallet.sendTransaction({...});
await logTradeToJsonl({..., txHash: tx.hash, status: "confirmed"});
```

### 2. Risk-First Execution
```typescript
// Every trade MUST go through Risk Controller
const validation = await riskController.validate({
  marketId,
  direction,
  sizeUsd,
  edgePct,
  currentPortfolioHeat,
  dailyPnl
});

if (!validation.approved) {
  alertSystem.notify(`Trade rejected: ${validation.reason}`);
  return;
}
```

### 3. Kelly Criterion Sizing
```typescript
// Position sizing formula
const kellyFraction = (edge * odds) / (odds - 1);
const positionSize = Math.min(
  bankroll * kellyFraction * KELLY_MULTIPLIER, // 0.25x conservative
  MAX_POSITION_USD // Hard cap at $1
);
```

### 4. Comprehensive Logging
Every trade to `trades.jsonl`:
```json
{
  "timestamp": "2026-03-14T03:05:00Z",
  "market_id": "0x123...",
  "direction": "buy_yes",
  "size_usd": 0.50,
  "edge_pct": 3.2,
  "confidence": 0.78,
  "expected_profit": 0.016,
  "tx_hash": "0xabc...",
  "status": "confirmed",
  "gas_cost_eth": 0.0001,
  "slippage_pct": 0.1,
  "block_number": 12345678
}
```

---

## Database Schema (SQLite/DuckDB)

```sql
-- positions table
CREATE TABLE positions (
  id INTEGER PRIMARY KEY,
  market_id TEXT NOT NULL,
  direction TEXT NOT NULL, -- 'yes' | 'no'
  size_usd REAL NOT NULL,
  entry_price REAL NOT NULL,
  current_price REAL,
  unrealized_pnl REAL,
  tx_hash TEXT UNIQUE,
  opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP,
  status TEXT DEFAULT 'open' -- 'open' | 'closed'
);

-- trades table
CREATE TABLE trades (
  id INTEGER PRIMARY KEY,
  market_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  size_usd REAL NOT NULL,
  price REAL NOT NULL,
  edge_pct REAL,
  confidence REAL,
  expected_profit REAL,
  tx_hash TEXT UNIQUE,
  gas_cost_eth REAL,
  slippage_pct REAL,
  block_number INTEGER,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- pnl_snapshots table
CREATE TABLE pnl_snapshots (
  id INTEGER PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  realized_pnl_24h REAL,
  unrealized_pnl REAL,
  total_trades INTEGER,
  winning_trades INTEGER,
  max_drawdown_pct REAL,
  portfolio_heat_pct REAL
);

-- alerts table
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY,
  level TEXT NOT NULL, -- 'info' | 'warning' | 'critical'
  component TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Required for trading
POLYMARKET_API_KEY=            # From https://polymarket.com/settings/api
POLYMARKET_API_SECRET=         # API secret
PRIVATE_KEY=                   # Wallet private key (0x...)
WALLET_ADDRESS=               # Your wallet address

# Crypto exchanges (at least one)
BINANCE_API_KEY=              # For crypto secondary
BINANCE_SECRET=
COINBASE_API_KEY=
COINBASE_SECRET=
KRAKEN_API_KEY=
KRAKEN_SECRET=

# Notifications
TELEGRAM_BOT_TOKEN=          # From @BotFather
TELEGRAM_CHAT_ID=             # Your chat ID

# Risk parameters (optional, have defaults)
MAX_POSITION_USD=1
KELLY_MULTIPLIER=0.25
MAX_DAILY_DRAWDOWN_PCT=5
MAX_PORTFOLIO_HEAT_PCT=20
MIN_EDGE_PCT=2
MAX_SLIPPAGE_PCT=1
```

---

## Error Handling Patterns

### Skill Error Recovery
```typescript
class Skill {
  private retryCount = 0;
  private maxRetries = 10;
  private backoffMs = 1000;

  async runWithRecovery() {
    try {
      await this.run();
      this.retryCount = 0; // Reset on success
    } catch (error) {
      this.retryCount++;
      if (this.retryCount > this.maxRetries) {
        await this.orchestrator.markFailed(this.name);
        throw new FatalError(`Max retries exceeded: ${error.message}`);
      }
      const delay = this.backoffMs * Math.pow(2, this.retryCount);
      await sleep(delay);
      await this.runWithRecovery();
    }
  }
}
```

### Circuit Breaker
```typescript
class CircuitBreaker {
  private failures = 0;
  private threshold = 5;
  private timeoutMs = 60000;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      throw new Error('Circuit breaker is OPEN');
    }
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}
```

---

## Testing Approach

```bash
# Unit tests per skill
bun test trading-core/market-monitor/

# Integration test
bun test integration/orchestrator.test.ts

# Dry-run mode (validates but doesn't trade)
DRY_RUN=true bun trading-core/orchestrator/scripts/run.ts

# Manual health check
bun system/health-monitor/scripts/health.ts --verbose
```

---

## Deployment

```bash
# Local development
bun install
bun trading-core/orchestrator/scripts/run.ts

# Production (using pm2 or similar)
pm2 start ecosystem.config.js

# Docker (optional)
docker-compose up -d
```

---

## Skill Reference

| Skill | Path | Key Scripts | Purpose |
|-------|------|-------------|---------|
| **Market Monitor** | `trading-core/market-monitor/` | `monitor.ts`, `status.ts`, `markets.ts` | Real-time Polymarket scanning |
| **Trade Executor** | `trading-core/trade-executor/` | `execute.ts`, `cancel.ts` | Order execution |
| **Position Manager** | `trading-core/position-manager/` | `track.ts`, `close.ts` | Portfolio tracking |
| **Risk Controller** | `trading-core/risk-controller/` | `validate.ts`, `limits.ts` | Risk validation |
| **PnL Tracker** | `trading-core/pnl-tracker/` | `track.ts`, `report.ts` | Performance |
| **Orchestrator** | `trading-core/orchestrator/` | `run.ts`, `stop.ts`, `health.ts` | System coordination |
| **Price Feeds** | `crypto-secondary/price-feeds/` | `fetch.ts`, `aggregate.ts` | Crypto prices |
| **Signal Aggregator** | `crypto-secondary/signal-aggregator/` | `analyze.ts`, `score.ts` | Technical signals |
| **Order Router** | `crypto-secondary/order-router/` | `route.ts`, `execute.ts` | Multi-exchange execution |
| **Health Monitor** | `system/health-monitor/` | `monitor.ts`, `health.ts` | System health |
| **Alert System** | `system/alert-system/` | `alert.ts`, `notify.ts` | Notifications |
| **Config Manager** | `system/config-manager/` | `load.ts`, `reload.ts` | Configuration |

---

## External APIs

- **Polymarket**: https://docs.polymarket.com/ (Gamma API + WebSocket)
- **Binance**: https://binance-docs.github.io/apidocs/spot/en/
- **Coinbase**: https://docs.cdp.coinbase.com/
- **Kraken**: https://docs.kraken.com/rest/
- **Etherscan**: For transaction verification

---

## Security Notes

1. Private keys in `.env` ONLY - never commit
2. Use hardware wallet if holding significant funds
3. Test with small amounts first
4. Monitor gas costs
5. Keep API keys rotated
6. Use Telegram for sensitive alerts (not email)

---

**Author:** kofi.zo.computer  
**License:** MIT
