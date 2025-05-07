import * as redis from "redis";
import { config } from "dotenv";
config();

class RedisClient {
  static redisClient: ReturnType<typeof redis.createClient>;

  static async initRedisClient() {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is not defined in environment variables");
    }

    const redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: false,
        connectTimeout: 10000,
        reconnectStrategy: () => 360000,
      },
    });

    redisClient.on("connect", () => console.log("Redis client is connected..."));
    redisClient.on("ready", () => console.log("Redis client is ready..."));
    redisClient.on("error", (err) => console.log("Redis client error occured", err));
    redisClient.on("end", () => console.log("Redis client is disconnected"));

    process.on("SIGINT", () => {
      console.log("Closing Redis client...");
      redisClient.quit();
    });

    let attempts = 0;
    while (attempts < 10) {
      try {
        await redisClient.connect();
        console.log("Connected to Redis");
        break;
      } catch (err) {
        attempts++;
        console.log(`Redis connection failed. Attempt ${attempts}/10`);
        if (attempts < 10) {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Задержка в 5 секунд
        } else {
          throw new Error("Failed to connect to Redis after 10 attempts");
        }
      }
    }

    return redisClient;
  }

  static async getRedisClient() {
    if (!RedisClient.redisClient) {
      RedisClient.redisClient = await RedisClient.initRedisClient();
    }
    return RedisClient.redisClient;
  }
}

export default RedisClient;
