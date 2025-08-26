import { Logger, LoggerOptions } from "./logger";

export const createLogger = (options?: LoggerOptions): Logger => {
  return new Logger(options);
};

export { Logger, LoggerOptions };
