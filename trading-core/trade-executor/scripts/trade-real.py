#!/usr/bin/env python3
"""
LIVE POLYMARKET TRADE - REAL EXECUTION
"""

import os
import sys
import json
from datetime import datetime
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCreds, OrderArgs
from py_clob_client.constants import POLYGON

WALLET = "0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB"

def execute_trade(market_slug: str, side: str, size: float):
    """Execute real trade on Polymarket"""
    
    print("=" * 70)
    print("🔴 REAL TRADE EXECUTION")
    print("=" * 70)
    print(f"Wallet: {WALLET}")
    print(f"Market: {market_slug}")
    print(f"Side: {side}")
    print(f"Size: ${size} USDC")
    
    # Load credentials
    creds = ApiCreds(
        api_key=os.environ.get('POLY', ''),
        api_secret=os.environ.get('POLY_SECRET', ''),
        api_passphrase=os.environ.get('PASSPHRASE', '')
    )
    
    # Initialize client
    client = ClobClient(
        host="https://clob.polymarket.com",
        chain_id=POLYGON,
        key=os.environ.get('PolygonPK', ''),
        signature_type=2,
        funder=WALLET
    )
    client.set_api_creds(creds)
    
    print("\n✅ Client authenticated")
    
    # Get markets
    print("🔍 Finding market...")
    markets = client.get_markets()
    
    target = None
    for m in markets.get('data', []):
        if market_slug.lower() in m.get('slug', '').lower():
            target = m
            break
    
    if not target:
        print(f"❌ Market '{market_slug}' not found")
        return None
    
    print(f"✅ Found: {target.get('question')}")
    
    # Get token ID for side
    tokens = target.get('tokens', [])
    token_id = tokens[0].get('token_id') if side == "YES" and tokens else tokens[1].get('token_id') if len(tokens) > 1 else None
    
    if not token_id:
        print("❌ Could not get token ID")
        return None
    
    print(f"Token ID: {token_id[:20]}...")
    
    # Create order
    print("\n✍️  Creating order...")
    order_args = OrderArgs(
        price=0.5,
        size=size,
        side="BUY",
        token_id=token_id
    )
    
    signed = client.create_order(order_args)
    print(f"✅ Order signed")
    
    # Submit
    print("📤 Submitting to CLOB...")
    resp = client.post_order(signed)
    
    print(f"\n🎉 SUCCESS!")
    print(f"Order ID: {resp.get('order_id')}")
    print(f"Status: {resp.get('status')}")
    
    # Log
    trade = {
        "timestamp": datetime.now().isoformat(),
        "market_slug": market_slug,
        "condition_id": target.get('condition_id'),
        "side": side,
        "size_usd": size,
        "order_id": resp.get('order_id'),
        "status": resp.get('status'),
        "tx_hash": resp.get('transaction_hash'),
        "wallet": WALLET
    }
    
    with open("/home/workspace/Skills/vague-sourdough-copy/trades.jsonl", "a") as f:
        f.write(json.dumps(trade) + "\n")
    
    return trade

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 trade-real.py <market_slug> <YES/NO> <size_usd>")
        sys.exit(1)
    
    try:
        result = execute_trade(sys.argv[1], sys.argv[2], float(sys.argv[3]))
        if result:
            print(f"\n✅ Trade completed")
            print(json.dumps(result, indent=2, default=str))
        else:
            print("\n❌ Trade failed")
            sys.exit(1)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
