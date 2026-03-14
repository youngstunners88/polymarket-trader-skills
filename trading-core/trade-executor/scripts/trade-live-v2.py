#!/usr/bin/env python3
"""
LIVE POLYMARKET TRADE EXECUTION - v2
Fixed credential format
"""

import os
import sys
import json
from datetime import datetime
from py_clob_client.client import ClobClient
from py_clob_client.constants import POLYGON

WALLET_ADDRESS = "0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB"
API_KEY = os.environ.get('POLY', '')
API_SECRET = os.environ.get('POLY_SECRET', '')
PASSPHRASE = os.environ.get('PASSPHRASE', '')
PRIVATE_KEY = os.environ.get('PolygonPK', '')

def trade_live_v2(market_id: str, side: str, size: float):
    """Execute live trade"""
    
    print("=" * 70)
    print("🔴 LIVE TRADE EXECUTION v2")
    print("=" * 70)
    
    print(f"Wallet: {WALLET_ADDRESS}")
    print(f"API Key present: {bool(API_KEY)}")
    print(f"Secret present: {bool(API_SECRET)}")
    print(f"Passphrase present: {bool(PASSPHRASE)}")
    print(f"Private key present: {bool(PRIVATE_KEY)}")
    
    try:
        # Initialize client
        client = ClobClient(
            host="https://clob.polymarket.com",
            chain_id=POLYGON,
            key=PRIVATE_KEY,
            signature_type=2,
            funder=WALLET_ADDRESS
        )
        
        # Set API credentials (correct format)
        client.set_api_creds(API_KEY, API_SECRET, PASSPHRASE)
        
        print("\n✅ Client authenticated")
        
        # Get markets to find token ID
        print("\n🔍 Fetching markets...")
        markets = client.get_markets()
        print(f"Found {len(markets.get('data', []))} markets")
        
        # Find target market
        target = None
        for m in markets.get('data', []):
            if market_id in m.get('slug', '') or market_id in m.get('condition_id', ''):
                target = m
                break
        
        if not target:
            print(f"⚠️ Market '{market_id}' not found in active markets")
            print("Available markets (slugs):")
            for m in markets.get('data', [])[:5]:
                print(f"  - {m.get('slug', 'N/A')}")
            return None
        
        print(f"\n📊 Market: {target.get('question')}")
        print(f"   YES: ${float(target.get('yes_price', 0)):.4f}")
        print(f"   NO: ${float(target.get('no_price', 0)):.4f}")
        
        # Get token ID for side
        token_id = target.get('tokens', [{}])[0].get('token_id') if side == "YES" else target.get('tokens', [{}])[1].get('token_id')
        
        print(f"\n📝 Preparing order...")
        print(f"   Token ID: {token_id}")
        print(f"   Side: {side}")
        print(f"   Size: {size} USDC")
        
        # For production, we would:
        # 1. Create order with OrderArgs
        # 2. Sign with client.create_order()
        # 3. Submit with client.post_order()
        
        print("\n⛔ SIMULATION MODE - Order ready but not submitted")
        print("   Next: Implement order signing + CLOB submission")
        
        trade = {
            "timestamp": datetime.now().isoformat(),
            "market_id": market_id,
            "market_slug": target.get('slug'),
            "condition_id": target.get('condition_id'),
            "direction": f"BUY_{side}",
            "size_usd": size,
            "token_id": token_id,
            "status": "SIMULATED",
            "wallet": WALLET_ADDRESS
        }
        
        return trade
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 trade-live-v2.py <market_slug> <YES/NO> <size_usd>")
        sys.exit(1)
    
    result = trade_live_v2(sys.argv[1], sys.argv[2], float(sys.argv[3]))
    
    if result:
        print(f"\n✅ Result:")
        print(json.dumps(result, indent=2, default=str))
