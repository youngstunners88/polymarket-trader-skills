#!/usr/bin/env bun
import { parseArgs } from "util";
import TelegramBot from "node-telegram-bot-api";

const { values } = parseArgs({
  args: Bun.argv,
  options: { market: { type: "string" }, pnl: { type: "string" } },
  strict: true,
  allowPositionals: true,
});

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const bot = new TelegramBot(token, { polling: false });
  const message = `🎯 Trade Alert\nMarket: ${values.market}\nPnL: $${values.pnl || 0}`;
  await bot.sendMessage(chatId, message);
}
main().catch(console.error);
