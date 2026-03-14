import { appendFile } from "fs/promises";
import { resolve } from "path";

const TRADES_LOG = resolve(process.cwd(), "logs", "trades.jsonl");
const SYSTEM_LOG = resolve(process.cwd(), "logs", "system.log");

export class Logger {
  static async trade(data: Record<string, any>): Promise<void> {
    const entry = JSON.stringify({
      ...data,
      logged_at: new Date().toISOString(),
    });
    await appendFile(TRADES_LOG, entry + "\n");
  }

  static async system(message: string, level: "info" | "warn" | "error" = "info") {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    await appendFile(SYSTEM_LOG, entry);
    console.log(entry.trim());
  }
}
