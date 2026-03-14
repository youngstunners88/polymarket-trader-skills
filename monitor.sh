#!/bin/bash
# Real-time trade monitor

echo "🔴 LIVE TRADE MONITOR"
echo "====================="
echo ""

while true; do
    clear
    echo "🔴 LIVE TRADE MONITOR - $(date -u +"%H:%M:%S UTC")"
    echo "====================="
    echo ""
    
    # Count trades
    TOTAL=$(wc -l < /home/workspace/Skills/vague-sourdough-copy/trades.jsonl)
    echo "📊 Total Trades: $TOTAL"
    echo ""
    
    # Latest 3 trades
    echo "🚀 Latest Trades:"
    tail -3 /home/workspace/Skills/vague-sourdough-copy/trades.jsonl | python3 -c "
import sys, json
for line in sys.stdin:
    if line.strip():
        d = json.loads(line)
        print(f\"  {d['timestamp'][11:19]} | {d['market_question'][:35]}... | \${d['size_usd']:.2f} | {d['status']}\")
"
    
    # Check if orchestrator running
    PID=$(pgrep -f "orchestrator.py" | head -1)
    if [ -n "$PID" ]; then
        echo ""
        echo "✅ Orchestrator: PID $PID (RUNNING)"
    else
        echo ""
        echo "❌ Orchestrator: NOT RUNNING"
    fi
    
    sleep 10
done
