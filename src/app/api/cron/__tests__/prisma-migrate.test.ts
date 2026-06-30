import { describe, it, expect } from 'vitest';
import { GET } from '../../../api/cron/prisma-migrate/route';

describe('/api/cron/prisma-migrate', () => {
  it('returns 410 Gone', async () => {
    const req = new Request('http://localhost:3000/api/cron/prisma-migrate');
    const res = await GET(req);
    expect(res.status).toBe(410);
    const json = await res.json();
    expect(json.error).toBe('Gone');
    expect(json.message).toContain('disabled');
  });
});
