import chalk from "chalk";
import fs from "fs";
import path from "path";

export type LogLevel = "error" | "warn" | "info" | "debug";

export interface LoggerOptions {
  level?: LogLevel;
  logDir?: string;
  enableConsole?: boolean;
  enableFile?: boolean;
  jsonFormat?: boolean;
}

export class Logger {
  private level: LogLevel;
  private logDir: string;
  private enableConsole: boolean;
  private enableFile: boolean;
  private jsonFormat: boolean;

  private levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  private colors: Record<LogLevel, chalk.Chalk> = {
    error: chalk.red,
    warn: chalk.yellow,
    info: chalk.blue,
    debug: chalk.gray,
  };

  constructor(options: LoggerOptions = {}) {
    this.level = options.level || "info";
    this.logDir = options.logDir || path.join(process.cwd(), "logs");
    this.enableConsole = options.enableConsole ?? true;
    this.enableFile = options.enableFile ?? true;
    this.jsonFormat = options.jsonFormat ?? true;

    if (this.enableFile && !fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] <= this.levels[this.level];
  }

  private getLogFileName(): string {
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    return path.join(this.logDir, `${date}.log`);
  }

  private writeFile(message: string): void {
    const logFile = this.getLogFileName();
    fs.appendFileSync(logFile, message + "\n", "utf8");
  }

  private formatMessage(level: LogLevel, msg: any): string {
    const timestamp = new Date().toISOString();

    if (this.jsonFormat) {
      return JSON.stringify({
        timestamp,
        level,
        message: msg,
      });
    }

    return `[${timestamp}] [${level.toUpperCase()}]: ${msg}`;
  }

  private log(level: LogLevel, msg: any): void {
    if (!this.shouldLog(level)) return;

    const formatted = this.formatMessage(level, msg);

    if (this.enableConsole) {
      console.log(this.colors[level](formatted));
    }

    if (this.enableFile) {
      this.writeFile(formatted);
    }
  }

  public info(msg: any) {
    this.log("info", msg);
  }
  public warn(msg: any) {
    this.log("warn", msg);
  }
  public error(msg: any) {
    this.log("error", msg);
  }
  public debug(msg: any) {
    this.log("debug", msg);
  }
}
