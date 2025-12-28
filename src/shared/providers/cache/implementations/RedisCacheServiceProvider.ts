import { env } from "@shared/config/env";
import { isValueAnObject } from "@shared/utils/isValueAnObject";
import { createClient, type RedisClientOptions } from "redis";
import type { CacheServiceProvider } from "../interface/CacheServiceProvider";

const clientConfig: RedisClientOptions = {
  url: env.REDIS_URL,
};

export class RedisCacheServiceProvider implements CacheServiceProvider {
  constructor(
    public client = createClient(clientConfig)
  ) {
    this.client.connect()
    console.log("Connected to Redis")
  }

  async get<T>(key: string): Promise<T | null> {
    const response = await this.client.get(key);

    if (response === null) return null;

    try {
      return JSON.parse(response) as T;
    } catch {
      return response as T;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (isValueAnObject(value)) {
      await this.client.set(key, JSON.stringify(value), { EX: ttl });

      return;
    }

    await this.client.set(key, JSON.stringify(value), { EX: ttl });
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

}