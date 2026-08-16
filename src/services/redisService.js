import { Redis } from '@upstash/redis';
import conf from '../conf/conf';

// Initialize Redis Client using HTTP REST
export const redis = new Redis({
  url: import.meta.env.VITE_UPSTASH_REDIS_REST_URL,
  token: import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN,
});

// Helper Functions for Caching
export const redisCache = {
  // Get cached data
  async get(key) {
    try {
      return await redis.get(key);
    } catch (err) {
      console.warn("Redis GET failed, falling back to database:", err);
      return null;
    }
  },

  // Set cached data with TTL (in seconds)
  async set(key, value, ttlInSeconds = 60) {
    try {
      await redis.set(key, JSON.stringify(value), { ex: ttlInSeconds });
    } catch (err) {
      console.warn("Redis SET failed:", err);
    }
  },

  // Delete cached data (Cache Invalidation)
  async del(key) {
    try {
      await redis.del(key);
    } catch (err) {
      console.warn("Redis DEL failed:", err);
    }
  }
};
