import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { createLogger, Logger, format, transports } from "winston";
import { Loggly } from "winston-loggly-bulk";
import { Post, PostDocument } from "./schemas/Post.schema";
import { Model } from "mongoose";

interface MetaData {
  [key: string]: any;
}

type LogType = "critical" | "error" | "warn" | "info" | "debug";

@Injectable()
export class LoggerProvider {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: "info",
      format: format.json(),
      transports: [
        process.env.PRODUCTION
          ? new Loggly({
              token: process.env.LOGGLY_TOKEN,
              subdomain: process.env.LOGGLY_SUBDOMAIN,
              json: true,
            })
          : new transports.Console({
              level: "info",
            }),
      ],
    });
  }

  log(type: LogType, args: string[], meta: MetaData = {}, separator = " ") {
    this.logger.log(type, args.join(separator), meta);
  }
}

export { LogType, MetaData };

@Injectable()
export class PostProvider {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create() {
    const testPost = new this.postModel({
      header: "Example Post",
      text: "Some text",
      submittedOn: new Date(),
    });
    testPost.save().catch((err) => console.log(err));
  }
}
