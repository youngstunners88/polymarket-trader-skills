---
name: solana-wallet-hunter-bridge
description: Bridge to existing wallet_hunter_v2.py system. Leverages Solana wallet tracking, whale monitoring, and alpha detection.
---

# Solana Wallet Hunter Bridge

Integration with existing wallet hunter infrastructure.

## Quick Start

```bash
# Sync whale wallets
bun scripts/sync-whales.ts

# Get alpha signals
bun scripts/alpha.ts --min-confidence 75

# Execute on whale buy
bun scripts/mirror.ts --wallet $WHALE_WALLET --amount 0.05
```
