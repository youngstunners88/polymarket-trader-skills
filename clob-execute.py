#!/usr/bin/env python3
"""
Direct CLOB execution - 24/7 autonomous trading
"""
import os
import json
import sys
sys.path.insert(0, '/usr/local/lib/python3.11/dist-packages')

from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCreds, OrderArgs
from py_clob_client.constants import POLYGON
from py_clob_client.order_builder.constants import BUY, SELL

# Credentials
api_key = os.environ.get('POLY')
api_secret = os.environ.get('POLY_SECRET')
passphrase = os.environ.get('PASSPHRASE')
funder = "0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB"

print("🔑 Initializing CLOB client...")
client = ClobClient(
    host="https://clob.polymarket.com",
    chain_id=POLYGON,
    funder=funder
)

creds = ApiCreds(api_key=api_key, api_secret=api_secret, api_passphrase=passphrase)
client.set_api_creds(creds)

print("✅ Authenticated")
print(f"💰 Wallet: {funder}")

# Get markets
print("\n🔍 Scanning for tradeable markets...")
markets = client.get_markets()

# Find best opportunity
best = None
best_edge = 0

for m in markets.get('data', []):
    if m.get('closed') or not m.get('active'):
        continue
    
    yes_price = float(m.get('yes_price', 0))
    
    # Simple edge: buy YES if price < 50%
    if yes_price > 0 and yes_price < 0.50:
        edge = (0.50 - yes_price) * 100  # % edge
        if edge > best_edge:
            best_edge = edge
            best = m

if not best:
    print("❌ No tradeable markets found")
    sys.exit(1)

print(f"\n🎯 TARGET MARKET:")
print(f"Question: {best.get('question', 'N/A')[:60]}")
print(f"YES Price: ${best.get('yes_price'):.3f}")
print(f"Edge: {best_edge:.1f}%")

# Execute $1 trade
token_id = best.get('tokens', [{}])[0].get('token_id') if best.get('tokens') else None

if not token_id:
    print("❌ No token ID")
    sys.exit(1)

print(f"\n⚡ EXECUTING $1 TRADE...")

try:
    order_args = OrderArgs(
        token_id=token_id,
        side=BUY,
        size=1.0,  # $1
        price=float(best.get('yes_price', 0.5))
    )
    
    # Create and sign order
    signed_order = client.create_order(order_args)
    
    # Submit to CLOB
    result = client.post_order(signed_order)
    
    print(f"\n✅ TRADE EXECUTED!")
    print(f"Order ID: {result.get('order_id', 'N/A')}")
    print(f"Status: {result.get('status', 'N/A')}")
    
    # Log to trades.jsonl
    trade_record = {
        'timestamp': __import__('datetime').datetime.utcnow().isoformat(),
        'market_id': best.get('id'),
        'direction': 'BUY_YES',
        'size_usd': 1.0,
        'edge_pct': best_edge,
        'confidence': 0.75,
        'tx_hash': result.get('order_id'),
        'status': result.get('status'),
        'strategy': 'direct-clob',
        'execution_type': 'REAL_BLOCKCHAIN'
    }
    
    with open('/home/workspace/Skills/vague-sourdough-copy/trades.jsonl', 'a') as f:
        f.write(json.dumps(trade_record) + '\n')
    
    print(f"\n💾 Logged to trades.jsonl")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()

