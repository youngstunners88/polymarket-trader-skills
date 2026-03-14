---
name: auto-recovery-agent
description: PERMANENT automated error handling and recovery for all trading operations. Self-healing agent with circuit breakers, exponential backoff, and rich contextual logging. Never requires manual mention.
compatibility: Created for Zo Computer - Polymarket trading
metadata:
  author: kofi.zo.computer
  automated: true
  always_active: true
---

# Auto-Recovery Agent

**AUTOMATED - NEVER requires manual mention.**

This agent automatically handles all errors for trading operations with self-healing capabilities.

## Automatic Behaviors

### Error Handling (Auto-enabled)
- Network failures → Exponential backoff retry
- Database crashes → Circuit breaker + reconnect
- API rate limits → Queue + throttle
- Auth failures → Key rotation alert
- Insufficient funds → Trading halt + alert

### Logging (Auto-enabled)
Every operation logged to `logs/system.log` with:
- ISO8601 timestamp
- Error classification
- Component name
- Recovery action
- Retry count

## Usage

**NEVER MANUAL** - Automatically wraps all trading commands.

Manual check: `bun scripts/status.ts`
