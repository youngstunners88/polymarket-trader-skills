---
name: reinforcement-learning
description: PPO/A3C agents that learn from every trade. Auto-strategy evolution.
metadata:
  algo: PPO,A3C
---

# Reinforcement Learning

## Agent Types
| Agent | Purpose | State Space |
|-------|---------|-------------|
| PPO-Price | Entry timing | Price, volume, RSI |
| A3C-Sizing | Position size | Kelly, edge, confidence |
| DQN-Exit | Exit timing | PnL, momentum, time |

## Training Loop
```bash
# Train on historical trades
bun scripts/train-ppo.ts --epochs 1000 --win-rate-target 0.75

# Live deployment
bun scripts/deploy-rl.ts --model ppo-v3
```

## Reward Function
```
reward = realized_pnl - (0.1 * max_drawdown) + (0.05 * win_rate)
```
