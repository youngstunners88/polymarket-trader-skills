import { ethers } from "ethers";
import axios from "axios";

const API_URL = "https://api.hyperliquid.xyz";

export class FixedHyperliquidClient {
  private wallet: ethers.Wallet;
  public address: string;

  constructor(privateKey: string) {
    this.wallet = new ethers.Wallet(privateKey);
    this.address = this.wallet.address;
  }

  async getBalance(): Promise<any> {
    const response = await axios.post(API_URL, {
      type: "spotClearinghouseState",
      user: this.address
    }, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  }

  async getMarketPrices(): Promise<any> {
    const response = await axios.post(API_URL, {
      type: "allMids"
    }, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  }

  async placeMarketOrder(
    coin: string,
    isBuy: boolean,
    size: number
  ): Promise<any> {
    // Build action
    const action = {
      type: "order",
      orders: [{
        coin,
        isBuy,
        sz: size.toFixed(8),
        limitPx: "0", // Market order
        orderType: "Market",
        reduceOnly: false,
        cloid: `clob_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      }],
      grouping: "na"
    };

    // Get nonce
    const nonce = Date.now();

    // Build payload
    const payload = {
      action,
      nonce,
      signature: await this.signAction(action, nonce)
    };

    const response = await axios.post(`${API_URL}/exchange`, payload, {
      headers: { "Content-Type": "application/json" }
    });

    return response.data;
  }

  private async signAction(action: any, nonce: number): Promise<string> {
    const message = JSON.stringify(action) + nonce.toString();
    return await this.wallet.signMessage(message);
  }
}

export default FixedHyperliquidClient;
