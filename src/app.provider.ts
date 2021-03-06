import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { createLogger, Logger, format, transports } from "winston";
import { Loggly } from "winston-loggly-bulk";
import { Post, PostDocument } from "./schemas/Post.schema";
import { Model } from "mongoose";
import * as queue from "amqplib";

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

interface PostData_I {
  _id: string;
  header: string;
  text: string;
  tags: string[];
}

interface FetchPost_I extends PostData_I {
  submittedOn: Date
}

@Injectable()
export class PostProvider {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private logger: LoggerProvider,
  ) {}

  async createPost(postData: PostData_I) {
    const post = new this.postModel({
      _id: postData._id,
      header: postData.header,
      text: postData.text,
      tags: postData.tags,
      submittedOn: new Date().toISOString(),
    });

    return post
      .save()
      .then(() => {
        this.logger.log(
          "info",
          [
            new Date().toISOString(),
            `A post with id ${postData._id} has been submitted.`,
          ],
          {},
          ": ",
        );

        return true;
      })
      .catch((err) => {
        this.logger.log(
          "warn",
          [
            new Date().toISOString(),
            `A post with id ${postData._id} couldn't be submitted.`,
          ],
          { err },
          ": ",
        );

        return false;
      });
  }

  async getPost(id: string): Promise<FetchPost_I | undefined | false> {
    try {
      const post = await this.postModel.findOne({ _id: id });
      if (!post) return false;

      return {
        _id: post._id, 
        header: post.header,
        text: post.text,
        tags: post.tags,
        submittedOn: post.submittedOn
      }
    } catch(err) {
      this.logger.log(
        "error",
        [new Date().toISOString(), "User tried finding a document with id ${id}, but got an error"],
        { err: err },
        ": "
      )

      return;
    }
  }
}

@Injectable()
export class QueueProvider {
  queueServer: queue.Connection;

  constructor() {
    queue.connect(process.env.QUEUE_HOST).then((connection) => {
      this.queueServer = connection;
    });
  }
}

export { LogType, MetaData, FetchPost_I };
