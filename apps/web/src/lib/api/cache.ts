import Redis from 'ioredis';

let client: Redis | null = null;

function getClient(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });
  }
  return client;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const r = getClient();
    const raw = await r.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  try {
    const r = getClient();
    await r.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
  }
}

export async function cacheDel(pattern: string): Promise<void> {
  try {
    const r = getClient();
    const keys = await r.keys(pattern);
    if (keys.length > 0) await r.del(...keys);
  } catch {
  }
}

export async function cacheWrap<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds = 300,
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;
  const value = await fn();
  await cacheSet(key, value, ttlSeconds);
  return value;
}
