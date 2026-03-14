---
name: mev-protection
description: Flashbots, MEV-blocker, Eden Network. Protect trades from sandwich attacks, front-running.
metadata:
  priority: critical
---

# MEV Protection

## Protection Layers
1. **Flashbots** (Ethereum/Arbitrum)
2. **MEV-Blocker** RPC
3. **Eden Network** (Solana)
4. **Jito MEV** (Solana)

## Quick Start
```bash
# Check MEV status
bun scripts/mev-check.ts --chain arbitrum

# Submit Flashbots bundle
bun scripts/flashbots-submit.ts --market ETH-USD --amount 1
```

## Config
```bash
export FLASHBOTS_RELAY="https://relay.flashbots.net"
export MEV_RPC="https://mev-blocker.io/v1/"
```

## Scripts
| Script | Purpose |
|--------|---------|
| `mev-check.ts` | Check protection status |
| `flashbots-submit.ts` | Submit private bundle |
| `eden-submit.ts` | Eden Solana submission |
| `jito-bundle.ts` | Jito MEV bundle |
