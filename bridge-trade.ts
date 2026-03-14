import { ethers } from "ethers";

// Polymarket CTF Exchange contract on Polygon
const CTF_EXCHANGE = "0x4bFb41d5B3570DeFd03C39a9A4D8dEED8C596b91";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Polygon USDC

// ABI for CTF Exchange (simplified - only what we need)
const CTF_ABI = [
  "function getOrderStatus(bytes32 orderHash) view returns (uint8)",
  "event OrderFilled(bytes32 indexed orderHash, address indexed maker, address indexed taker, uint256 makerAmountFilled, uint256 takerAmountFilled)",
];

// ABI for ERC20 approve
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
];

const privateKey = process.env.PolygonPK || process.env.POLY || "";
const wallet = new ethers.Wallet(privateKey);

console.log("Building bridge for wallet:", wallet.address);
