#!/usr/bin/env bun
import { parseArgs } from "util";
import { updateConfig } from "../../../common/config/loader.js";

const { values } = parseArgs({
  args: Bun.argv,
  options: { key: { type: "string" }, value: { type: "string" } },
  strict: true,
  allowPositionals: true,
});

async function main() {
  if (!values.key || !values.value) {
    console.log("Usage: bun update.ts --key <NAME> --value <NUMBER>");
    process.exit(1);
  }
  await updateConfig(values.key, parseFloat(values.value));
  console.log(`✅ Updated ${values.key} = ${values.value}`);
}
main().catch(console.error);
