import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  Header,
  Headers,
  HttpStatus,
  HttpCode,
  Query,
  Param,
} from "@nestjs/common";
import { LoggerProvider, PostProvider, QueueProvider, FetchPost_I } from "./app.provider";
import generateID from "./misc/TagGenerator";

@Controller("/api")
export class AppController {
  constructor(
    private logger: LoggerProvider,
    private database: PostProvider,
    private queue: QueueProvider,
  ) {}

  @Get("/")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getPost(@Headers("X-Forwarded-For") ip: string, @Query("id") id?: string): Promise<FetchPost_I> {
    if (typeof id !== "string" || id.length !== 8) {
      this.logger.log(
        "info",
        [new Date().toISOString(), `User tried accessing a document with id ${id} which is not a valid token`],
        { userIp: ip },
        ": "
      )

      throw new HttpException({
        errCode: 400,
        reason: "An invalid id was provided"
      }, 400)
    }

    const document = await this.database.getPost(id);

    if (document === false) {
      this.logger.log(
        "info",
        [new Date().toISOString(), `A user tried fetching document with id ${id} but such document doesn't exist`],
        { userId: ip },
        ": "
      );

      throw new HttpException({
        errCode: 404,
        reason: "A post with this ID was not found"
      }, 404);
    } else if (!document) {
      throw new HttpException({
        errCode: 500,
        reason: "An unexpected error occured when trying to find a document with the provided id"
      }, 500);
    }

    this.logger.log(
      "info",
      [new Date().toISOString(), `A user has fetched a document with id ${id}`],
      { userId: ip },
      ": "
    );

    return document;
  }

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  @Header("Content-Type", "application/json")
  async postText(
    @Headers("X-Forwarded-For") ip: string,
    @Body("header") header?: string,
    @Body("text") text?: string,
    @Body("tags") tags?: string[],
    // @Body("email") _email?: string,
  ) {
    if (typeof header !== "string" || header.length > 70 || header.length < 5) {
      this.logger.log(
        "info",
        [
          new Date().toISOString(),
          "User tried to upload text with a too small or big header",
        ],
        { userIp: ip },
        ": ",
      );

      throw new HttpException(
        {
          errCode: 400,
          reason: "The header must be between 5 and 70 characters",
        },
        400,
      );
    }

    if (typeof text !== "string" || text.length < 20 || text.length > 1500) {
      this.logger.log(
        "info",
        [
          new Date().toISOString(),
          "User tried to upload text with a too small or too big amount of text",
        ],
        { userIp: ip },
      );

      throw new HttpException(
        {
          errCode: 400,
          reason: "The text field must be between 20 and 1500 characters",
        },
        400,
      );
    }

    if (!Array.isArray(tags)) tags = [];

    // Should have a check to remove duplicates?
    if (tags.some((tag) => tag.length > 20) || tags.length > 10) {
      this.logger.log(
        "info",
        [
          new Date().toISOString(),
          "User tried to upload text with a tag that was bigger than the allowed amount or used more than 10 tags",
        ],
        { userIp: ip },
      );

      throw new HttpException(
        {
          errCode: 400,
          reason:
            "A post can have a max of 10 tags and each tag cannot exceed 20 characters",
        },
        400,
      );
    }

    // If email is provided, add a check to confirm it is formatted correctly.

    tags = tags.map((tag) => tag.toLowerCase());
    const id = generateID();

    // Collisions might occur if the same ID is generated. Needs to implement a way to detect that &
    // generate a new ID
    const dbPost = await this.database.createPost({
      _id: id,
      header,
      text,
      tags,
    });

    if (dbPost) {
      this.logger.log(
        "info",
        [
          new Date().toISOString(),
          `A user uploaded a document with id ${id}`,
        ],
        { userIp: ip },
      );

      // If email is provided, invoke a function that will send a request to the email service to send an email.

      return {
        accepted: true,
        message: "You've submitted a post",
        postId: id,
        // If email is provided, can have a field that says if email has been sent or not.
      };
    } else {
      this.logger.log(
        "info",
        [
          new Date().toISOString(),
          "An error occured and the user couldn't upload a text document",
        ],
        { userIp: ip },
        ": ",
      );

      throw new HttpException(
        {
          errCode: 500,
          reason:
            "An unknown error caused your request to not be completed successfully",
        },
        500,
      );
    }
  }
}
