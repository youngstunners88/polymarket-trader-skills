import { Database } from "duckdb";
import { resolve } from "path";

const DB_PATH = resolve(process.cwd(), "data", "trading.db");

export class DBClient {
  private db: Database;
  private static instance: DBClient;

  private constructor() {
    this.db = new Database(DB_PATH);
    this.initTables();
  }

  static getInstance(): DBClient {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  }

  private initTables(): void {
    // Positions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS positions (
        id TEXT PRIMARY KEY,
        market_id TEXT NOT NULL,
        direction TEXT NOT NULL,
        entry_price DECIMAL(10,4) NOT NULL,
        size_usd DECIMAL(10,2) NOT NULL,
        entry_time TIMESTAMP NOT NULL,
        unrealized_pnl DECIMAL(10,4) DEFAULT 0,
        realized_pnl DECIMAL(10,4) DEFAULT 0,
        status TEXT DEFAULT 'open',
        tx_hash TEXT,
        closed_at TIMESTAMP
      )
    `);

    // Trades table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS trades (
        id TEXT PRIMARY KEY,
        timestamp TIMESTAMP NOT NULL,
        market_id TEXT NOT NULL,
        direction TEXT NOT NULL,
        size_usd DECIMAL(10,2) NOT NULL,
        entry_price DECIMAL(10,4) NOT NULL,
        exit_price DECIMAL(10,4),
        edge_pct DECIMAL(5,2) NOT NULL,
        confidence DECIMAL(3,2) NOT NULL,
        expected_profit DECIMAL(10,4) NOT NULL,
        realized_pnl DECIMAL(10,4),
        tx_hash TEXT NOT NULL,
        status TEXT DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Alerts table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY,
        type TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        message TEXT NOT NULL,
        data TEXT,
        sent BOOLEAN DEFAULT FALSE
      )
    `);

    // Config table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Health status table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS health_status (
        component TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        last_check TIMESTAMP NOT NULL,
        message TEXT
      )
    `);

    // Insert default config
    const defaults = [
      ["MAX_POSITION_USD", "1"],
      ["KELLY_MULTIPLIER", "0.25"],
      ["MAX_DAILY_DRAWDOWN_PCT", "5"],
      ["MAX_PORTFOLIO_HEAT_PCT", "20"],
      ["MIN_EDGE_PCT", "2"],
      ["MAX_SLIPPAGE_PCT", "1"],
      ["MOMENTUM_THRESHOLD_PCT", "2"],
      ["MIN_LIQUIDITY_USD", "10000"],
      ["WS_RECONNECT_MAX", "10"],
      ["PRICE_STALE_THRESHOLD_MS", "30000"],
    ];

    for (const [key, value] of defaults) {
      this.db.exec(
        `INSERT OR IGNORE INTO config (key, value) VALUES (?, ?)`,
        [key, value]
      );
    }
  }

  query(sql: string, params?: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  exec(sql: string, params?: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  close(): void {
    this.db.close();
  }
}

export const db = DBClient.getInstance();
