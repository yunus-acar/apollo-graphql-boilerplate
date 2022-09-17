import Redis from "ioredis";

class IRedisService {
  private redisClient: Redis.Redis;

  constructor(redisInstance: typeof Redis) {
    this.redisClient = new redisInstance(
      process.env.REDIS_URL || "redis://localhost:6379",
      {
        password: process.env.REDIS_PASSWORD,
      }
    );

    this.redisClient.on("ready", () => console.log("🔴Redis is ready ✅"));
    this.redisClient.on("error", (e) =>
      console.log("🔴Redis error:: ❌", e.message)
    );
  }

  get client() {
    return this.redisClient;
  }
}

const RedisService = new IRedisService(Redis);

export default RedisService;
