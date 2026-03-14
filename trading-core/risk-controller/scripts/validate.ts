#!/usr/bin/env bun
import { parseArgs } from "util";
import { db } from "../../../common/db/client.js";
import { loadConfig } from "../../../common/config/loader.js";
import type { RiskCheck } from "../../../common/types/index.js";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    market: { type: "string" },
    size: { type: "string" },
    edge: { type: "string" },
  },
  strict: true,
  allowPositionals: true,
});

async function validateTrade(): Promise<RiskCheck> {
  const config = await loadConfig();
  const sizeUsd = parseFloat(values.size || "0");
  const edgePct = parseFloat(values.edge || "0");

  if (sizeUsd > config.MAX_POSITION_USD) {
    return { approved: false, reason: `Position $${sizeUsd} exceeds max $${config.MAX_POSITION_USD}`, portfolioHeat: 0, dailyDrawdown: 0, positionSize: sizeUsd };
  }

  if (edgePct < config.MIN_EDGE_PCT) {
    return { approved: false, reason: `Edge ${edgePct}% below min ${config.MIN_EDGE_PCT}%`, portfolioHeat: 0, dailyDrawdown: 0, positionSize: sizeUsd };
  }

  const positions = await db.query("SELECT COALESCE(SUM(size_usd), 0) as total FROM positions WHERE status = 'open'");
  const currentExposure = positions[0]?.total || 0;
  const portfolioHeat = ((currentExposure + sizeUsd) / 100) * 100;

  if (portfolioHeat > config.MAX_PORTFOLIO_HEAT_PCT) {
    return { approved: false, reason: `Heat ${portfolioHeat.toFixed(1)}% exceeds max ${config.MAX_PORTFOLIO_HEAT_PCT}%`, portfolioHeat, dailyDrawdown: 0, positionSize: sizeUsd };
  }

  return { approved: true, portfolioHeat, dailyDrawdown: 0, positionSize: sizeUsd };
}

async function main() {
  if (!values.size || !values.edge) {
    console.log("Usage: bun validate.ts --size <usd> --edge <pct> [--market <id>]");
    process.exit(1);
  }
  const result = await validateTrade();
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.approved ? 0 : 1);
}
main().catch(console.error);
