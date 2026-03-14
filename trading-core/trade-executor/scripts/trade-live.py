#!/usr/bin/env python3
"""
LIVE POLYMARKET TRADE EXECUTION
Uses py-clob-client with wallet signing
"""

import os
import sys
import json
from decimal import Decimal
from datetime import datetime
from eth_account import Account
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCreds
from py_clob_client.constants import POLYGON

# Wallet and credentials
WALLET_ADDRESS = "0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB"
API_KEY = os.environ.get('POLY', '')
API_SECRET = os.environ.get('POLY_SECRET', '')
PASSPHRASE = os.environ.get('PASSPHRASE', '')
PRIVATE_KEY = os.environ.get('PolygonPK', '')

def trade_live(market_id: str, side: str, size: float, price: float = 0.5):
    """
    Execute live trade on Polymarket CLOB
    
    Args:
        market_id: Market condition ID
        side: "YES" or "NO" 
        size: USD amount
        price: Limit price (default 0.5)
    """
    
    print("=" * 70)
    print("🔴 LIVE POLYMARKET TRADE EXECUTION")
    print("=" * 70)
    
    # Validate credentials
    if not all([API_KEY, API_SECRET, PASSPHRASE, PRIVATE_KEY]):
        print("❌ Missing credentials in environment")
        return None
    
    print(f"Wallet: {WALLET_ADDRESS}")
    print(f"Market: {market_id}")
    print(f"Side: {side}")
    print(f"Size: ${size}")
    print(f"Price: {price}")
    
    try:
        # Initialize client with signing
        creds = ApiCreds(api_key=API_KEY, api_secret=API_SECRET, passphrase=PASSPHRASE)
        
        client = ClobClient(
            host="https://clob.polymarket.com",
            chain_id=POLYGON,
            key=PRIVATE_KEY,  # For signing
            creds=creds,
            signature_type=2,  # EO
            funder=WALLET_ADDRESS
        )
        
        # Create order arguments
        from py_clob_client.clob_types import OrderArgs
        
        order_args = OrderArgs(
            price=price,
            size=size,
            side="BUY",
            token_id=market_id  # This needs to be the actual token ID
        )
        
        # Create and sign order
        print("\n✍️  Signing order...")
        signed_order = client.create_order(order_args)
        
        # Submit order
        print("📤 Submitting to CLOB...")
        resp = client.post_order(signed_order)
        
        print(f"\n✅ ORDER SUBMITTED!")
        print(f"Order ID: {resp.get('order_id', 'N/A')}")
        print(f"Status: {resp.get('status', 'N/A')}")
        
        # Log trade
        trade = {
            "timestamp": datetime.now().isoformat(),
            "market_id": market_id,
            "direction": f"BUY_{side}",
            "size_usd": size,
            "price": price,
            "status": "SUBMITTED",
            "order_id": resp.get('order_id'),
            "response": resp,
            "wallet": WALLET_ADDRESS
        }
        
        with open("/home/workspace/Skills/vague-sourdough-copy/trades.jsonl", "a") as f:
            f.write(json.dumps(trade) + "\n")
        
        return trade
        
    except Exception as e:
        print(f"\n❌ TRADE FAILED: {e}")
        
        # Log error
        error_trade = {
            "timestamp": datetime.now().isoformat(),
            "market_id": market_id,
            "direction": f"BUY_{side}",
            "size_usd": size,
            "status": "FAILED",
            "error": str(e),
            "wallet": WALLET_ADDRESS
        }
        
        with open("/home/workspace/Skills/vague-sourdough-copy/trades.jsonl", "a") as f:
            f.write(json.dumps(error_trade) + "\n")
        
        return error_trade

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 trade-live.py <market_id> <YES/NO> <size_usd> [price]")
        print("Example: python3 trade-live.py 0x123... YES 1.0 0.5")
        sys.exit(1)
    
    market = sys.argv[1]
    side = sys.argv[2]
    size = float(sys.argv[3])
    price = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
    
    result = trade_live(market, side, size, price)
    
    if result:
        print(f"\n📊 Result:")
        print(json.dumps(result, indent=2, default=str))
    else:
        print("\n⛔ Trade could not be executed")
        sys.exit(1)
