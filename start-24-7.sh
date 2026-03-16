#!/bin/bash
# Start 24/7 autonomous trading

echo "🚀 Starting 24/7 Trading System..."
echo "=================================="

# Ensure directories exist
mkdir -p /home/workspace/polymarket-trader-skills/data
mkdir -p /home/workspace/polymarket-trader-skills/logs

# Start orchestrator
cd /home/workspace/polymarket-trader-skills
nohup bun run trading-core/orchestrator/scripts/run-master.ts \
  > logs/orchestrator.log 2>&1 &

ORCH_PID=$!
echo "Orchestrator PID: $ORCH_PID"
echo $ORCH_PID > /tmp/trading-orchestrator.pid

echo ""
echo "✅ System running!"
echo "Logs: tail -f logs/orchestrator.log"
echo "Stop: kill \$(cat /tmp/trading-orchestrator.pid)"
