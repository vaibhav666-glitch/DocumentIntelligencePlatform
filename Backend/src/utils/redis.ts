import dotenv from "dotenv";
import IORedis from "ioredis";
dotenv.config()

export const pub = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

export const sub = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});