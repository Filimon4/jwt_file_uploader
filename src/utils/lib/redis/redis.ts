import * as redis from "redis";

import {config} from 'dotenv'
config()

class RedisClient {
  static redisClient: ReturnType<typeof redis.createClient>

  static initRedisClient() {
    const redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: !process.env.REDIS_URL?.includes?.("localhost"),
        connectTimeout: 3000,
        reconnectStrategy: () => 360000,
      },
    });
    redisClient.on("connect", () =>
      console.log("Redis client is connected...")
    );
    redisClient.on("ready", () => console.log("Redis client is ready..."));
    redisClient.on("error", (err) =>
      console.log("Redis client error occured", err)
    );
    redisClient.on("end", () => console.log("Redis client is disconnected"));
    process.on("SIGINT", () => redisClient.quit());
    redisClient.connect();
    return redisClient;
  }
  
  static getRedisClient() {
    if (!RedisClient.redisClient) {
      RedisClient.redisClient = RedisClient.initRedisClient();
    }
    return RedisClient.redisClient;
  }
}
export default RedisClient;
