import { ethers } from "ethers";

const GAMMA_API = "https://gamma-api.polymarket.com";

export interface PolymarketCredentials {
  apiKey: string;
  apiSecret: string;
  passphrase: string;
  privateKey: string;
  walletAddress: string;
}

export class PolymarketAPI {
  private credentials: PolymarketCredentials;

  constructor() {
    const pk = process.env.PolygonPK || "";
    let walletAddress = "";
    
    if (pk) {
      try {
        const wallet = new ethers.Wallet(pk);
        walletAddress = wallet.address;
      } catch {
        walletAddress = "";
      }
    }

    this.credentials = {
      apiKey: process.env.POLY || "",
      apiSecret: process.env.POLY_SECRET || "",
      passphrase: process.env.PASSPHRASE || "",
      privateKey: pk,
      walletAddress,
    };
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${GAMMA_API}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Accept": "application/json",
        "POLYMARKET-API-KEY": this.credentials.apiKey,
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error(`API error ${response.status}`);
    return response.json();
  }

  async getMarkets(params?: { active?: boolean; closed?: boolean; liquidityMin?: number; limit?: number }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.active !== undefined) query.set("active", String(params.active));
    if (params?.closed !== undefined) query.set("closed", String(params.closed));
    if (params?.liquidityMin) query.set("liquidityMin", String(params.liquidityMin));
    if (params?.limit) query.set("limit", String(params.limit));
    return this.request(`/markets?${query.toString()}`);
  }

  async getMarket(marketId: string): Promise<any> {
    return this.request(`/markets/${marketId}`);
  }

  async getMarketPrices(marketId: string): Promise<{ yes: number; no: number }> {
    const market = await this.getMarket(marketId);
    return {
      yes: parseFloat(market.outcomePrices?.[0] || market.yesPrice || 0),
      no: parseFloat(market.outcomePrices?.[1] || market.noPrice || 0),
    };
  }

  getWalletAddress(): string {
    return this.credentials.walletAddress;
  }

  getCredentials(): PolymarketCredentials {
    return this.credentials;
  }
}

export const polymarket = new PolymarketAPI();
