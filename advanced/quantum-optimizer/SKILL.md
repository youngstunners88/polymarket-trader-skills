---
name: quantum-optimizer
description: BCCO v1.7 quantum layer. QuTiP-based probability paths, two-level quantum systems with market noise decoherence.
metadata:
  version: v1.7
---

# Quantum Optimizer

## Core Formula
```python
# Hamiltonian drift toward resolution
H = ℏωσz/2 + market_noise

# Quantum coherence score ≥90 → edge boost ≥3%
edge_boost = quantum_coherence * 0.03
```

## Quick Start
```bash
bun scripts/quantum-optimize.ts --market ETH-USD --paths 1000
bun scripts/coherence-check.ts --min-score 90
```

## Scripts
| Script | Purpose |
|--------|---------|
| `quantum-optimize.ts` | Run QuTiP simulation |
| `coherence-check.ts` | Validate trade quantum score |
| `probability-paths.ts` | Generate Monte Carlo paths |

## Edge Boost
- Coherence 90-95: +3% edge
- Coherence 95-99: +5% edge  
- Coherence 99+: +8% edge

## Integration
- **Outputs to**: Signal Aggregator, Risk Controller
- **BCCO v1.7**: Core component
