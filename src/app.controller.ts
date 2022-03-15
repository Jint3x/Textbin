import { Controller, Get } from '@nestjs/common';
import { LoggerProvider } from './app.provider';

@Controller()
export class AppController {
  constructor(private logger: LoggerProvider) {}

  @Get('/')
  data() {
    this.logger.log(
      "info", 
      ["User .... visited", "add", "1111"]
    )

    return 'Hey there!';
  }
}
