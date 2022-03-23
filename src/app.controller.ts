import { Controller, Get } from "@nestjs/common";
import { LoggerProvider, PostProvider } from "./app.provider";

@Controller()
export class AppController {
  constructor(private logger: LoggerProvider, private database: PostProvider) {}

  @Get("/")
  data() {
    this.logger.log("info", ["User .... visited", "add", "1111"]);
    return "Hey there!";
  }
}
