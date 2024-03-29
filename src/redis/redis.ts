import { createClient, RedisClientType } from "redis";

export class Redis {
  private static instance: RedisClientType;
  private constructor() {}

  public static getInstance(): RedisClientType {
    if (!Redis.instance) {
      const { REDIS_HOST, REDIS_PORT } = process.env;
      Redis.instance = createClient({
        socket: {
          host: REDIS_HOST ?? "127.0.0.1",
          port: REDIS_PORT === undefined ? 6379 : Number(REDIS_PORT),
        },
      });
    }
    return Redis.instance;
  }
}
