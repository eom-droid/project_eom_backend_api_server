import { createClient, RedisClientType } from "redis";

export class Redis {
  private static instance: RedisClientType;
  private constructor() {}

  public static getInstance(): RedisClientType {
    if (!Redis.instance) {
      Redis.instance = createClient();
    }
    return Redis.instance;
  }
}
