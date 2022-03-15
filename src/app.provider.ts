import { Injectable } from "@nestjs/common";
import { createLogger, Logger, format, transports } from "winston";
import { Loggly } from "winston-loggly-bulk"

interface MetaData {
    [key: string]: any
}

type LogType = "critical" | "error" | "warn" | "info" | "debug"


@Injectable()
export class LoggerProvider {
  logger: Logger

  constructor() {
    this.logger = createLogger({
      level: "info",
      format: format.json(),
      transports: [
        process.env.PRODUCTION ? 
        new Loggly({
          token: process.env.LOGGLY_TOKEN,
          subdomain: process.env.LOGGLY_SUBDOMAIN,
          json: true,
        })
        :
        new transports.Console({
          level: "info"
        })
      ]
    })
  }

  log(type: LogType, args: string[], meta: MetaData = {}, separator: string = " ") {
    this.logger.log(type, args.join(separator), meta) 
  }
}