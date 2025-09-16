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
  prettyPrint?: boolean;
  singleLine?: boolean;
}

export class Logger {
  private level: LogLevel;
  private logDir: string;
  private enableConsole: boolean;
  private enableFile: boolean;
  private jsonFormat: boolean;
  private prettyPrint: boolean;
  private singleLine: boolean;

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
    this.prettyPrint = options.prettyPrint ?? false;
    this.singleLine = options.singleLine ?? false;

    if (this.enableFile && !fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] <= this.levels[this.level];
  }

  private getLogFileName(): string {
    const date = new Date().toISOString().split("T")[0];
    return path.join(this.logDir, `${date}.log`);
  }

  private writeFile(message: string): void {
    const logFile = this.getLogFileName();
    fs.appendFileSync(logFile, message + "\n", "utf8");
  }

  private colorizeJson(jsonString: string): string {
    return jsonString.replace(
      /("(.*?)":)|(".*?")|(\b\d+\b)|\b(true|false|null)\b/g,
      (match) => {
        if (/^".*":$/.test(match)) {
          return chalk.cyan(match);
        } else if (/^".*"$/.test(match)) {
          return chalk.green(match);
        } else if (/^\d+$/.test(match)) {
          return chalk.yellow(match);
        } else if (/true|false/.test(match)) {
          return chalk.magenta(match);
        } else if (/null/.test(match)) {
          return chalk.gray(match);
        }
        return match;
      }
    );
  }

  private formatMessage(
    level: LogLevel,
    ...args: any[]
  ): { consoleMsg: string; fileMsg: string } {
    const timestamp = new Date().toISOString();

    if (this.jsonFormat) {
      const logObj = {
        timestamp,
        level,
        messages: args.map((a) => (typeof a === "object" ? a : String(a))),
      };

      // singleLine luôn ưu tiên
      const space = this.singleLine ? 0 : this.prettyPrint ? 2 : 0;
      const fileMsg = JSON.stringify(logObj, null, space);

      let consoleMsg = fileMsg;
      if (this.prettyPrint && !this.singleLine) {
        consoleMsg = this.colorizeJson(fileMsg);
      }

      return { consoleMsg, fileMsg };
    }

    const msg = args
      .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
      .join(" ");
    const formatted = `[${timestamp}] [${level.toUpperCase()}]: ${msg}`;
    return { consoleMsg: formatted, fileMsg: formatted };
  }

  private log(level: LogLevel, ...args: any[]): void {
    if (!this.shouldLog(level)) return;

    const { consoleMsg, fileMsg } = this.formatMessage(level, ...args);

    if (this.enableConsole) {
      console.log(this.colors[level](consoleMsg));
    }

    if (this.enableFile) {
      this.writeFile(fileMsg);
    }
  }

  public info(...args: any[]) {
    this.log("info", ...args);
  }
  public warn(...args: any[]) {
    this.log("warn", ...args);
  }
  public error(...args: any[]) {
    this.log("error", ...args);
  }
  public debug(...args: any[]) {
    this.log("debug", ...args);
  }
}
