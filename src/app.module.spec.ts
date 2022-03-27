import { AppController } from "./app.controller";
import { MetaData, LogType } from "./app.provider";
import { Injectable } from "@nestjs/common";

@Injectable()
class LoggerProvider {
  log(type: LogType, args: string[], meta: MetaData = {}, separator = " ") {
    return { type, args, meta, separator };
  }
}

@Injectable()
class PostProvider {
  async create() {
    return "Object has been created";
  }
}

@Injectable()
class QueueProvider {
  queueServer: any;

  constructor() {
    this.queueServer = jest.fn(() => true);
  }
}

describe("Tests AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    appController = new AppController(
      new LoggerProvider() as any,
      new PostProvider() as any,
      new QueueProvider() as any,
    );
  });

  it("Assures that the correct response has been returned", () => {
    const response = appController.data();

    expect(response).toBe("Hey there!");
  });
});
