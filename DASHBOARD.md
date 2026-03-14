# 🚀 Polymarket Trading System - Live Dashboard

## System Status
- **Status**: ✅ ACTIVE
- **Uptime**: 2h 44m+
- **PID**: 43141
- **Last Trade**: 07:14:05 UTC

## Trading Metrics (Last 100 Trades)
| Metric | Value |
|--------|-------|
| **Trades/Hour** | 40 |
| **Total Volume** | $62.26 |
| **Avg Edge** | 13.5% |
| **Expected Profit** | $8.41 |
| **Win Rate Target** | 75% |

## Total Performance
| Metric | Value |
|--------|-------|
| **Total Trades** | 16,653 |
| **Strategy** | 0.25x Kelly, Edge >4% |
| **Execution** | Real Blockchain |

## Active Markets
- **Primary**: Cleveland Cavaliers NBA (100% of recent trades)
- **Edge Detection**: ML model + historical probability
- **Position Sizing**: Fractional Kelly (0.25x)

## Files
- Trades: `/home/workspace/Skills/vague-sourdough-copy/trades.jsonl`
- Logs: `/home/workspace/Skills/vague-sourdough-copy/orchestrator.log`
- Monitor: `./monitor.sh`

## Quick Commands
```bash
# View live trades
tail -f /home/workspace/Skills/vague-sourdough-copy/trades.jsonl

# Check status
./monitor.sh

# Count total trades
wc -l /home/workspace/Skills/vague-sourdough-copy/trades.jsonl
```

Last Updated: 2026-03-14 07:15 UTC
