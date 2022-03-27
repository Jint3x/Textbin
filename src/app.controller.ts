import { Controller, Get } from "@nestjs/common";
import { LoggerProvider, PostProvider, QueueProvider } from "./app.provider";

@Controller()
export class AppController {
  constructor(
    private logger: LoggerProvider,
    private database: PostProvider,
    private queue: QueueProvider,
  ) {}

  @Get("/")
  data() {
    this.logger.log("info", ["User .... visited", "add", "1111"]);
    return "Hey there!";
  }
}
