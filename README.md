# Polymarket & Crypto Trading System | 24/7 Autonomous Trader

**Production-grade autonomous trading system for Polymarket prediction markets (primary) with crypto secondary strategies.**

Built for Claude Code / OpenAI Codex / Gemini CLI / OpenClaw / Cursor.

---

## Skills Overview

| Skill | Purpose | Location |
|-------|---------|----------|
| `market-monitor` | Real-time Polymarket WebSocket scanner | `trading-core/market-monitor/` |
| `trade-executor` | Autonomous order execution (real trades only) | `trading-core/trade-executor/` |
| `position-manager` | Portfolio tracking & exposure | `trading-core/position-manager/` |
| `risk-controller` | Risk limits & circuit breakers | `trading-core/risk-controller/` |
| `pnl-tracker` | Real-time PnL & performance | `trading-core/pnl-tracker/` |
| `orchestrator` | System coordination | `trading-core/orchestrator/` |
| `price-feeds` | Multi-source crypto prices | `crypto-secondary/price-feeds/` |
| `signal-aggregator` | Technical indicators & signals | `crypto-secondary/signal-aggregator/` |
| `order-router` | Smart crypto order routing | `crypto-secondary/order-router/` |
| `health-monitor` | System health & liveness | `system/health-monitor/` |
| `alert-system` | Telegram notifications | `system/alert-system/` |
| `config-manager` | Centralized configuration | `system/config-manager/` |

## Quick Start

```bash
# Clone the repo
git clone https://github.com/youngstunners88/polymarket-trader-skills.git
cd polymarket-trader-skills

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start the system
bun trading-core/orchestrator/scripts/run.ts
```

## Risk Parameters

| Parameter | Value | Type |
|-----------|-------|------|
| Max Position | $1 USD | Hard limit |
| Kelly Multiplier | 0.25x | Position sizing |
| Max Daily Drawdown | 5% | Soft alert |
| Max Portfolio Heat | 20% | Hard limit |
| Min Edge | 2% | Hard limit |
| Max Slippage | 1% | Hard limit |

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      ORCHESTRATOR                            │
├──────────────────────────────────────────────────────────────┤
│  POLYMARKET CORE              │  CRYPTO SECONDARY            │
│  ┌──────────┐ ┌──────────┐    │  ┌──────────┐ ┌──────────┐   │
│  │ Market   │ │ Trade    │    │  │ Price    │ │ Signal   │   │
│  │ Monitor  │ │ Executor │    │  │ Feeds    │ │ Aggregator│   │
│  └──────────┘ └──────────┘    │  └──────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐    │  ┌──────────┐               │
│  │ Position │ │ Risk     │    │  │ Order    │               │
│  │ Manager  │ │ Controller│   │  │ Router   │               │
│  └──────────┘ └──────────┘    │  └──────────┘               │
│  ┌──────────┐                  │                             │
│  │ PnL      │                  │                             │
│  │ Tracker  │                  │                             │
│  └──────────┘                  │                             │
├──────────────────────────────────────────────────────────────┤
│  INFRASTRUCTURE                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                      │
│  │ Health   │ │ Alert    │ │ Config   │                      │
│  │ Monitor  │ │ System   │ │ Manager  │                      │
│  └──────────┘ └──────────┘ └──────────┘                      │
└──────────────────────────────────────────────────────────────┘
```

## Critical Rules

1. **NEVER simulate trades** — Always execute real blockchain transactions
2. **Log everything** to `trades.jsonl`
3. **Internal alerts only** — Never share trading signals externally
4. **Risk first** — All trades validated by Risk Controller

## Documentation

Each skill has a `SKILL.md` with:
- Quick start commands
- Core workflows
- Integration points
- Configuration options

Read `CLAUDE.md` for system-wide context.

---

**Author:** kofi.zo.computer  
**License:** MIT
