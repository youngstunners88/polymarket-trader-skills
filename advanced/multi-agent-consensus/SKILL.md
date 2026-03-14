---
name: multi-agent-consensus
description: 4-6 agent voting system. GoldRush, TrendHunter, PulseScanner, TokenScout, BCCO, Quantum. 3/4 consensus required.
metadata:
  version: v2.0
---

# Multi-Agent Consensus

## Agents
| Agent | Weight | Signal Type |
|-------|--------|-------------|
| BCCO-1 | 25% | Edge detection |
| TrendHunter | 20% | Technical analysis |
| GoldRush | 20% | Insider/value |
| PulseScanner | 15% | Macro/geopol |
| TokenScout | 15% | Token metrics |
| Quantum | 5% | Coherence boost |

## Consensus Rules
- **BUY**: 3/4 agents agree, avg confidence >70%
- **SELL**: 2/3 bearish agents agree
- **HOLD**: No consensus or <3 agents
- **MUTE**: Kelly <15% or edge <20%

## Quick Start
```bash
bun scripts/consensus-vote.ts --market SOL-USD
bun scripts/agent-status.ts --show-all
```

## Output
```json
{
  "consensus": "BUY",
  "agents_agree": 4,
  "confidence": 81.5,
  "expected_win_rate": 0.81
}
```
