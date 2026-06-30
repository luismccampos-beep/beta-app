import { NextResponse } from 'next/server';

/**
 * DEPRECATED: This route is disabled.
 *
 * Prisma migrations are now handled exclusively via CI/CD
 * (.github/workflows/deploy-migrations.yml).
 *
 * Running migrations via API route in serverless is risky:
 * cold-start timeouts, concurrency issues, inconsistent state,
 * and incomplete logs. The CI/CD pipeline is the correct place
 * for this operation.
 *
 * This route returns 410 Gone to indicate it is intentionally disabled.
 */
export async function GET() {
  return NextResponse.json(
    {
      error: 'Gone',
      message: 'This cron route is disabled. Migrations run via CI/CD.',
    },
    { status: 410 },
  );
}
