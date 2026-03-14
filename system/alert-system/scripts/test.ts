#!/usr/bin/env bun
import TelegramBot from "node-telegram-bot-api";

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("⚠️ TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID required");
    process.exit(1);
  }

  const bot = new TelegramBot(token, { polling: false });
  await bot.sendMessage(chatId, "🤖 Polymarket Trader Alert Test\nSystem is online!");
  console.log("✅ Test alert sent");
}
main().catch(console.error);
