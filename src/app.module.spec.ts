import { AppController } from "./app.controller";
import { MetaData, LogType } from "./app.provider";
import { HttpException, Injectable } from "@nestjs/common";

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

  async createPost() {
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

describe("Tests posting a post", () => {
  let appController: AppController;

  beforeEach(async () => {
    appController = new AppController(
      new LoggerProvider() as any,
      new PostProvider() as any,
      new QueueProvider() as any,
    );
  });


  it("Provides wrong header information when creating a post", async () => {
    const ip = "23.23.23.23";
    const header = "head";
    const text =
      "This is a text that will be passed to the text posting command";
    const tags = ["tag1", "tag2"];

    try {
      await appController.postText(ip, header, text, tags);
    } catch (err) {
      expect(err).toEqual(
        new HttpException(
          {
            errCode: 400,
            reason: "The header must be between 5 and 70 characters",
          },
          400,
        ),
      );
    }

    try {
      await appController.postText(ip, header.repeat(30), text, tags);
    } catch (err) {
      expect(err).toEqual(
        new HttpException(
          {
            errCode: 400,
            reason: "The header must be between 5 and 70 characters",
          },
          400,
        ),
      );
    }

    try {
      await appController.postText(ip, undefined, text, tags);
    } catch (err) {
      expect(err).toEqual(
        new HttpException(
          {
            errCode: 400,
            reason: "The header must be between 5 and 70 characters",
          },
          400,
        ),
      );
    }

    const ans = await appController.postText(ip, header.repeat(3), text, tags);
    expect(ans.accepted).toBe(true);
    expect(ans.message).toBe("You've submitted a post");
    expect(ans.postId.length).toBe(8);
  });


  it("Provides wrong text information when submitting a post", async () => {
    const ip = "23.23.23.23";
    const header = "header";
    const text = "small amount of";
    const tags = ["tag1", "tag2"];

    try {
      await appController.postText(ip, header, text, tags);
    } catch (err) {
      expect(err).toEqual(
        new HttpException(
          {
            errCode: 400,
            reason: "The text field must be between 20 and 1500 characters",
          },
          400,
        ),
      );
    }

    try {
      await appController.postText(ip, header, text.padEnd(1501, "a"), tags);
    } catch (err) {
      expect(err).toEqual(
        new HttpException(
          {
            errCode: 400,
            reason: "The text field must be between 20 and 1500 characters",
          },
          400,
        ),
      );
    }

    try {
      await appController.postText(ip, header, undefined, tags);
    } catch (err) {
      expect(err).toEqual(
        new HttpException(
          {
            errCode: 400,
            reason: "The text field must be between 20 and 1500 characters",
          },
          400,
        ),
      );
    }

    const ans = await appController.postText(
      ip,
      header,
      text.padEnd(21, "a"),
      tags,
    );
    expect(ans.accepted).toBe(true);
    expect(ans.message).toBe("You've submitted a post");
    expect(ans.postId.length).toBe(8);
  });


  it("Provides wrong tags information when submitting a post", async () => {
    const ip = "23.23.23.23";
    const header = "header";
    const text = "some text to fill the test";
    const tags = ["tag1", "tag2"];

    try {
      await appController.postText(
        ip,
        header,
        text,
        tags.concat(Array.from({ length: 10 }, () => "")),
      );
    } catch (err) {
      expect(err).toEqual(
        new HttpException(
          {
            errCode: 400,
            reason:
              "A post can have a max of 10 tags and each tag cannot exceed 20 characters",
          },
          400,
        ),
      );
    }

    try {
      await appController.postText(
        ip,
        header,
        text,
        tags.concat(["".padEnd(21, "a")]),
      );
    } catch (err) {
      expect(err).toEqual(
        new HttpException(
          {
            errCode: 400,
            reason: "The text field must be between 20 and 1500 characters",
          },
          400,
        ),
      );
    }

    const ans = await appController.postText(ip, header, text, tags);
    expect(ans.accepted).toBe(true);
    expect(ans.message).toBe("You've submitted a post");
    expect(ans.postId.length).toBe(8);
  });
});


describe("Tests getting a post", () => {
  let appController: AppController;
  const ip = "0.0.0.0";
  const header = "example header";
  const text = "this is some text";
  const tags = [];
  const date = new Date();


  
  @Injectable()
  class PostProvider {
    getPost(id) {
      if (id === "00000000") {
        return;
      } else if (id === "11111111") {
        return false;
      } else {
        return {
          _id: id, 
          header,
          text,
          tags,
          submittedOn: date
        }
      };
    }
  }

  beforeEach(async () => {
    appController = new AppController(
      new LoggerProvider() as any,
      new PostProvider() as any,
      new QueueProvider() as any,
    );
  })


  it("Fetches a document", async () => {
    const id = "idtouse1";
    const document = await appController.getPost(ip, id);

    expect(document._id).toBe(id);
    expect(document.header).toBe(header);
    expect(document.text).toBe(text);
    expect(document.tags).toBe(tags);
    expect(document.submittedOn).toBe(date)
  })


  it("Provides non-existent ID", async () => {
    const id = "11111111";

    try {
      await appController.getPost(ip, id);
      expect(false).toBe(true) // If no error was generated, the test failed
    } catch (err) {
      expect(err).toEqual(
        new HttpException({
          errCode: 404,
          reason: "A post with this ID was not found"
        }, 404)
      );
    };
  })


  it("Provides non-existent ID", async () => {
    const id = "00000000";

    try {
      await appController.getPost(ip, id);
      expect(false).toBe(true) // If no error was generated, the test failed
    } catch (err) {
      expect(err).toEqual(
        new HttpException({
          errCode: 500,
          reason: "An unexpected error occured when trying to find a document with the provided id"
        }, 500)
      );
    };
  })
})
