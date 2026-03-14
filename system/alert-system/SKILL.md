---
name: trading-alert-system
description: Notification system for trading events. Sends alerts via Telegram for significant trades, risk breaches, system errors, and daily PnL reports. Never sends trading signals/recommendations - internal team only.
compatibility: Created for Zo Computer
metadata:
  author: kofi.zo.computer
---

# Trading Alert System

Notifications for trading events via Telegram.

## Quick Start

```bash
# Send test alert
bun scripts/test.ts

# Alert on trade
bun scripts/trade.ts --market <id> --pnl <amount>

# Risk alert
bun scripts/risk.ts --type drawdown --value 5.2
```

## Alert Types

| Type | Trigger | Channel |
|------|---------|---------|
| Trade | Position opened/closed | Telegram |
| Risk | Breach or warning | Telegram |
| System | Error or restart | Telegram |
| PnL | Daily summary | Telegram |

## Rules

**INTERNAL ONLY**: Never send trading signals, recommendations, or buy/sell advice externally. All trading information stays within the team.

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `test.ts` | Test alert | `bun test.ts` |
| `trade.ts` | Trade alert | `bun trade.ts --market 123 --pnl 0.5` |
| `risk.ts` | Risk alert | `bun risk.ts --type heat --value 21` |
| `system.ts` | System alert | `bun system.ts --message "Restarted"` |
| `daily.ts` | Daily PnL | `bun daily.ts --pnl 12.5 --trades 8` |

## Configuration

- `TELEGRAM_BOT_TOKEN` - Bot token
- `TELEGRAM_CHAT_ID` - Chat ID for alerts

## Integration Points

**Receives from:**
- Trade Executor (trade confirmations)
- Risk Controller (breach alerts)
- Health Monitor (system issues)
- PnL Tracker (daily reports)
