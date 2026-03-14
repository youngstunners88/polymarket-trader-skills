import { ethers } from "ethers";
const wallet = "0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB";
const usdc = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const abi = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];

async function check() {
  console.log(`Checking wallet: ${wallet}`);
  const provider = new ethers.JsonRpcProvider("https://polygon.llamarpc.com");
  try {
    const block = await provider.getBlockNumber();
    console.log(`Connected at block ${block}`);
    const contract = new ethers.Contract(usdc, abi, provider);
    const balance = await contract.balanceOf(wallet);
    const decimals = await contract.decimals();
    const usdcBalance = Number(balance) / 10 ** decimals;
    console.log(`USDC Balance: $${usdcBalance.toFixed(2)}`);
  } catch(e) {
    console.log(`Error: ${e.message}`);
  }
}
check();
