---
name: vague-sourdough-bridge
description: Bridge to vague-sourdough-copy trading system. Reads 5.4M+ trades, extracts patterns.
---

# Vague-Sourdough Bridge

Integration layer accessing 27MB trade history.

## Quick Start

```bash
bun scripts/analyze.ts --days 7
bun scripts/sync.ts
```

## Scripts

| Script | Purpose |
|--------|---------|
| `analyze.ts` | Pattern analysis |
| `sync.ts` | Sync to DuckDB |
| `patterns.ts` | Extract winning patterns |
