import Redis from "ioredis";

const getRedisUrl = () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL environment variable is not set");
  }
  return url;
};

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(getRedisUrl(), {
      maxRetriesPerRequest: 3,
    });
  }
  return redis;
}

export async function getValue<T>(key: string): Promise<T | null> {
  const client = getRedis();
  const data = await client.get(key);
  if (!data) return null;
  return JSON.parse(data) as T;
}

export async function setValue<T>(key: string, value: T): Promise<void> {
  const client = getRedis();
  await client.set(key, JSON.stringify(value));
}
