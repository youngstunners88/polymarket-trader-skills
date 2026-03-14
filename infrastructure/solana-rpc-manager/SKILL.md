---
name: solana-rpc-manager
description: Solana RPC connection manager with failover, priority fees.
---

# Solana RPC Manager

## Quick Start
```bash
bun scripts/health-check.ts
bun scripts/priority-fee.ts --adjust dynamic
```

## RPCs
- Primary: `api.mainnet-beta.solana.com`
- Fallback: `solana-rpc.gateway.pokt.network`
- Premium: Helius/QuickNode
