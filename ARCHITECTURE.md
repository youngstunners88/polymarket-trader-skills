# Polymarket Trader Skills - Architecture v2.0

## Mission
24/7 autonomous trading across **Solana**, **Base**, **Arbitrum** with **zero Polymarket dependency**.

## Core Philosophy
| Principle | Implementation |
|-----------|---------------|
| **DEX-Only** | No CEX dependencies |
| **Chain Agnostic** | Solana, Base, Arbitrum |
| **Modular Skills** | Each protocol = standalone |
| **Zero UI** | Headless automation |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│               ORCHESTRATION LAYER                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Position │  │  Signal  │  │   Risk   │          │
│  │ Manager  │  │ Aggregator│  │  Engine  │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
└───────┼────────────┼────────────┼──────────────────┘
        │            │            │
┌───────▼────────────▼────────────▼──────────────────┐
│                  CHAIN ROUTER                       │
├────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌────────────┐│
│  │    SOLANA    │ │    BASE      │ │  ARBITRUM  ││
│  │  ┌────────┐  │ │  ┌────────┐  │ │  ┌────────┐││
│  │  │Jupiter │  │ │  │Aerodrom│  │ │  │HyperLiq│││
│  │  │Raydium │  │ │  │Uniswap │  │ │  │  GMX   │││
│  │  │Meteora │  │ │  │Pendle  │  │ │  │Camelot │││
│  │  │ Drift  │  │ │  │  ...   │  │ │  │  ...   │││
│  │  └────────┘  │ │  └────────┘  │ │  └────────┘││
│  └──────────────┘ └──────────────┘ └────────────┘│
└────────────────────────────────────────────────────┘
```

## Chain Ecosystems

### Solana
- Jupiter: Multi-hop swaps, price impact arb
- Raydium: Concentrated LP, fee harvesting  
- Meteora: Volatility farming, dynamic bins
- Drift: Funding rate arbitrage

### Base
- Aerodrome: Bribe optimization
- Uniswap v3: Range order strategy
- Pendle: PT/YT arbitrage

### Arbitrum
- Hyperliquid: Orderbook perps
- GMX: GLP delta-neutral
- Camelot: Nitro concentrated LP

## Execution Flow
1. **Signal Discovery** - Jupiter/0x/Hyperliquid APIs
2. **Edge Calculation** - DEX price comparison
3. **Route Optimization** - Multi-hop pathfinding
4. **Execution** - Submit signed transaction

## Wallets Required
```bash
# Solana
export SOLANA_WALLET="<pubkey>"
export SOLANA_PRIVATE_KEY="<base58>"

# Base  
export BASE_WALLET="0x..."
export BASE_PRIVATE_KEY="0x..."

# Arbitrum (already set)
export ARBITRUM_WALLET="0x93efA50f6dc50c2a3119aC392D790E308d23928E"
```

## Commands
```bash
# Start all chains
bun trading-core/orchestrator/scripts/run.ts --chains solana,base,arbitrum

# Swap on Solana
bun solana-ecosystem/jupiter-aggregator/scripts/swap.ts --from SOL --to USDC

# Swap on Base
bun base-ecosystem/aerodrome-amm/scripts/swap.ts --from ETH --to USDC
```

## Risk Limits
| Chain | Max Position | Slippage |
|-------|-------------|----------|
| Solana | 20% | 1.5% |
| Base | 25% | 1.0% |
| Arbitrum | 25% | 0.5% |
