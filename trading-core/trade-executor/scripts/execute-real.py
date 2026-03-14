#!/usr/bin/env python3
"""
REAL Polymarket Trade Execution
Uses py-clob-client with your keys
"""

import os
import sys
import json
from datetime import datetime
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCreds, OrderArgs
from py_clob_client.constants import POLYGON

# Your wallet
WALLET_ADDRESS = "0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB"

# Get keys from environment
API_KEY = os.environ.get('POLY', '')
API_SECRET = os.environ.get('POLY_SECRET', '')
PASSPHRASE = os.environ.get('PASSPHRASE', '')
PRIVATE_KEY = os.environ.get('PolygonPK', '')

def execute_real_trade(market_id: str, direction: str, size: float):
    """Execute real trade on Polymarket"""
    
    print(f"🚀 REAL TRADE EXECUTION")
    print(f"Wallet: {WALLET_ADDRESS}")
    print(f"Market: {market_id}")
    print(f"Direction: {direction}")
    print(f"Size: ${size}")
    
    # Initialize client
    creds = ApiCreds(api_key=API_KEY, api_secret=API_SECRET, passphrase=PASSPHRASE)
    client = ClobClient(
        host="https://clob.polymarket.com",
        chain_id=POLYGON,
        creds=creds,
        signature_type=1,
        funder=WALLET_ADDRESS
    )
    
    # Set API credentials
    client.set_api_creds(creds)
    
    print(f"✅ Client initialized")
    
    # Get market info
    try:
        market = client.get_market(condition_id=market_id)
        print(f"📊 Market: {market.get('question', 'Unknown')}")
        print(f"   YES: ${market.get('yes_price', 0):.4f}")
        print(f"   NO: ${market.get('no_price', 0):.4f}")
    except Exception as e:
        print(f"⚠️ Could not fetch market: {e}")
    
    # Build order
    side = "BUY" if direction.upper() == "YES" else "SELL"
    
    # For now, log what we WOULD do
    # Full implementation needs USDC approval + order signing
    print(f"\n📝 ORDER PREVIEW:")
    print(f"   Side: {side}")
    print(f"   Token: {market_id}")
    print(f"   Size: {size} USDC")
    
    # Real execution requires:
    # 1. Approve USDC for CTFExchange
    # 2. Sign order with private key
    # 3. Submit to CLOB
    
    print(f"\n⛔ PRODUCTION MODE: Order logged but not submitted")
    print(f"   Reason: Need USDC approval + order signing implemented")
    
    # Log to trades.jsonl
    trade = {
        "timestamp": datetime.now().isoformat(),
        "market_id": market_id,
        "direction": f"BUY_{direction.upper()}",
        "size_usd": size,
        "status": "PENDING_IMPLEMENTATION",
        "wallet": WALLET_ADDRESS,
        "note": "Real execution needs CLOB order signing + USDC approval"
    }
    
    with open("/home/workspace/Skills/vague-sourdough-copy/trades.jsonl", "a") as f:
        f.write(json.dumps(trade) + "\n")
    
    return trade

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 execute-real.py <market_id> <yes/no> <size_usd>")
        print("Example: python3 execute-real.py us-forces-iran-march-14 yes 1.0")
        sys.exit(1)
    
    market = sys.argv[1]
    direction = sys.argv[2]
    size = float(sys.argv[3])
    
    result = execute_real_trade(market, direction, size)
    print(f"\n✅ Trade logged: {result}")
