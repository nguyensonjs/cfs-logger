import { Logger, LoggerOptions, LogLevel } from "./logger";

export const createLogger = (options?: LoggerOptions): Logger => {
  return new Logger(options);
};

export { Logger, LoggerOptions, LogLevel };
