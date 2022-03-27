import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { LoggerProvider, PostProvider } from "./app.provider";
import { Post, PostSchema } from "./schemas/Post.schema";
import type { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";

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

    process.env.NODE_ENV === "production" || process.env.ENABLE_CACHE === "true"
      ? CacheModule.register<RedisClientOptions>({
          store: redisStore,
          isGlobal: true,
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT) || 6379,
          },
        })
      : CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [LoggerProvider, PostProvider],
})
export class App {}
