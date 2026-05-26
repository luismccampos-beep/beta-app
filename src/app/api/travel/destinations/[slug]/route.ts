import { GET as getV1 } from '../../v1/destinations/[slug]/route';

export const dynamic = 'force-dynamic';

type RouteCtx = { params: Promise<{ slug: string }> };

/** @deprecated Prefer GET /api/travel/v1/destinations/[slug] */
export async function GET(req: Request, ctx: RouteCtx) {
  return getV1(req, ctx);
}
