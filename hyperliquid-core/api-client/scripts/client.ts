import { ethers } from "ethers";
import axios from "axios";

const HYPERLIQUID_API = "https://api.hyperliquid.xyz";
const EXCHANGE_API = "https://api.hyperliquid.xyz/exchange";

export class HyperliquidClient {
  private wallet: ethers.Wallet;
  private address: string;

  constructor(privateKey: string) {
    this.wallet = new ethers.Wallet(privateKey);
    this.address = this.wallet.address;
  }

  getAddress(): string {
    return this.address;
  }

  async getBalance(): Promise<any> {
    const response = await axios.post(HYPERLIQUID_API, {
      type: "spotClearinghouseState",
      user: this.address
    });
    return response.data;
  }

  async getMarketData(coin: string): Promise<any> {
    const response = await axios.post(HYPERLIQUID_API, {
      type: "allMids"
    });
    return response.data;
  }

  async placeOrder(
    coin: string,
    isBuy: boolean,
    size: number,
    price: number,
    orderType: "limit" | "market" = "market"
  ): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000);
    
    const orderData = {
      type: "order",
      orders: [{
        coin,
        isBuy,
        sz: size.toString(),
        limitPx: price.toString(),
        orderType: orderType === "market" ? "Market" : "Limit",
        reduceOnly: false,
        cloid: `order_${timestamp}_${Math.random().toString(36).slice(2, 8)}`
      }],
      grouping: "na"
    };

    // Sign the order
    const signature = await this.signOrder(orderData);
    
    const payload = {
      ...orderData,
      signature
    };

    const response = await axios.post(EXCHANGE_API, payload, {
      headers: { "Content-Type": "application/json" }
    });

    return response.data;
  }

  private async signOrder(orderData: any): Promise<string> {
    const message = JSON.stringify(orderData);
    const signature = await this.wallet.signMessage(message);
    return signature;
  }
}

export default HyperliquidClient;
