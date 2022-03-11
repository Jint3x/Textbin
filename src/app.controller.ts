import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  data() {
    return 'Hey there!';
  }
}
