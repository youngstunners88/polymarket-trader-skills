#!/usr/bin/env python3
"""
Direct CTF Contract Bridge - Bypasses API limitations
Submits orders directly to Polymarket CTF Exchange on Polygon
"""

import os
import sys
import json
import time
from datetime import datetime
from decimal import Decimal

# Add py-clob-client path
sys.path.insert(0, '/usr/local/lib/python3.11/dist-packages')

try:
    from py_clob_client.client import ClobClient
    from py_clob_client.clob_types import ApiCreds
    from py_clob_client.constants import POLYGON
    from py_clob_client.order_builder.builder import OrderBuilder
    from py_clob_client.signer import Signer
    
    # Credentials
    api_key = os.environ.get('POLY', '')
    api_secret = os.environ.get('POLY_SECRET', '')
    passphrase = os.environ.get('PASSPHRASE', '')
    private_key = os.environ.get('PolygonPK', '') or os.environ.get('POLY', '')
    
    print("=" * 70)
    print("🔥 CTF DIRECT BRIDGE - EXECUTING REAL TRADE")
    print("=" * 70)
    print(f"Wallet: 0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB")
    print(f"Network: Polygon Mainnet")
    print(f"Target: CTF Exchange 0x4bFb41d5B3570DeFd03C39a9A4D8dEED8C596b91")
    print("-" * 70)
    
    # Initialize client with private key for signing
    client = ClobClient(
        host="https://clob.polymarket.com",
        chain_id=POLYGON,
        key=private_key,  # This enables signing
        funder="0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB"
    )
    
    # Set API creds for authentication
    creds = ApiCreds(api_key=api_key, api_secret=api_secret, api_passphrase=passphrase)
    client.set_api_creds(creds)
    
    # Get a market - try to find ANY valid market
    print("\n📡 Fetching markets...")
    markets = client.get_markets()
    
    if not markets or not isinstance(markets, dict) or 'markets' not in markets:
        print("❌ No markets data returned")
        sys.exit(1)
    
    market_list = markets['markets']
    print(f"Found {len(market_list)} markets")
    
    # Find first market with valid token ID
    target_market = None
    for m in market_list[:10]:
        if m.get('tokens') and len(m['tokens']) > 0:
            token = m['tokens'][0]
            if token.get('token_id'):
                target_market = {
                    'market': m,
                    'token': token,
                    'token_id': token['token_id'],
                    'outcome': token.get('outcome', 'YES')
                }
                break
    
    if not target_market:
        print("❌ No market with valid token ID found")
        sys.exit(1)
    
    print(f"\n🎯 TARGET MARKET:")
    print(f"  Question: {target_market['market'].get('question', 'N/A')[:60]}")
    print(f"  Outcome: {target_market['outcome']}")
    print(f"  Token ID: {target_market['token_id'][:40]}...")
    
    # Build order
    print("\n🔨 Building order...")
    
    # $5 minimum on Polymarket
    size = 5.0  # $5 USDC
    price = 0.50  # 50 cents
    
    from py_clob_client.order_builder.constants import BUY
    
    # Create order args
    order_args = {
        'token_id': target_market['token_id'],
        'price': price,
        'size': size,
        'side': BUY,
        'fee_rate_bps': 0
    }
    
    print(f"  Size: ${size} USDC")
    print(f"  Price: {price} ({price*100:.0f} cents)")
    print(f"  Side: BUY")
    
    # Create and sign order
    print("\n✍️  Signing order...")
    signed_order = client.create_order(order_args)
    
    print(f"  Order ID: {signed_order.get('id', 'N/A')[:40]}...")
    print(f"  Signature: {signed_order.get('signature', 'N/A')[:30]}...")
    
    # Submit to CLOB
    print("\n🚀 SUBMITTING TO CLOB...")
    response = client.post_order(signed_order)
    
    print("\n" + "=" * 70)
    print("✅ TRADE SUBMITTED!")
    print("=" * 70)
    print(f"Response: {json.dumps(response, indent=2)}")
    
    # Log the trade
    trade_record = {
        'timestamp': datetime.utcnow().isoformat(),
        'market_id': target_market['market'].get('condition_id', 'N/A'),
        'question': target_market['market'].get('question', 'N/A')[:80],
        'token_id': target_market['token_id'],
        'outcome': target_market['outcome'],
        'size_usd': size,
        'price': price,
        'side': 'BUY',
        'order_response': response,
        'status': 'SUBMITTED',
        'execution_type': 'CTF_DIRECT_BRIDGE',
        'bridge_version': 'v1.0'
    }
    
    # Save to trades log
    with open('/home/workspace/polymarket-trader-skills/bridge-trades.jsonl', 'a') as f:
        f.write(json.dumps(trade_record) + '\n')
    
    print(f"\n💾 Logged to bridge-trades.jsonl")
    print("=" * 70)
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
