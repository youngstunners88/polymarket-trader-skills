---
name: sentiment-analyzer
description: X/Twitter, Reddit, Discord sentiment analysis. whale movements, insider posts.
metadata:
  source: social_feeds
---

# Sentiment Analyzer

## Data Sources
- X/Twitter (noisyb0y1 and others)
- Polymarket comments
- Discord alpha channels
- Reddit r/ethfinance

## Signals
| Signal | Weight | Action |
|--------|--------|--------|
| Whale post | +15% | Boost edge |
| Insider leak | +20% | High urgency |
| FUD spike | -10% | Reduce size |
| Consensus shift | +12% | Direction bias |

## Quick Start
```bash
bun scripts/analyze-x.ts --handle noisyb0y1 --last-hours 24
bun scripts/whale-alert.ts --min-followers 10000
```

## Edge Boost
```
final_edge = base_edge + (sentiment_score * 0.1)
```
