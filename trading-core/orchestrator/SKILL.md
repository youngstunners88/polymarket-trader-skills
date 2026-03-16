---
name: orchestrator
description: Central conductor. Coordinates all skills, 24/7 autonomous execution.
---

# Orchestrator

## Quick Start
```bash
# Start full system
bun scripts/run.ts --all-chains

# Status check
bun scripts/health.ts
```

## Architecture
```
Market Monitor → Risk Check → Signal Consensus → Execute → Log → Repeat
```
