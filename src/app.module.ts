import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { LoggerProvider, PostProvider } from "./app.provider";
import { Post, PostSchema } from "./schemas/Post.schema";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING, {
      connectionName: process.env.MONGODB_CONNECTION_NAME1,
    }),
    MongooseModule.forFeature(
      [{ name: Post.name, schema: PostSchema }],
      process.env.MONGODB_CONNECTION_NAME1,
    ),
  ],
  controllers: [AppController],
  providers: [LoggerProvider, PostProvider],
})
export class App {}
