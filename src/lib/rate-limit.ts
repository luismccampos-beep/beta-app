import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const travelRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  analytics: true,
  prefix: 'ratelimit:travel',
});
