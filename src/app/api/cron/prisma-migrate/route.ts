import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const asyncExec = promisify(exec);

// Vercel Pro: até 300s. Hobby: 10s (migration pode falhar por timeout).
export const maxDuration = 60;

/**
 * Cron job que corre `prisma migrate deploy` diariamente.
 *
 * Gatilho: `vercel.json` → crons → "0 0 * * *" (meia-noite UTC)
 *
 * Segurança:
 *   - Requer header `Authorization: Bearer <CRON_SECRET>`
 *   - Define `CRON_SECRET` nas env vars do Vercel (Settings → Environment Variables)
 *
 * Respostas:
 *   200 { ok, output } — Migração executada com sucesso
 *   401 { error }      — Token inválido
 *   500 { error }      — Falha na migração
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken) {
    console.warn('[cron/prisma-migrate] CRON_SECRET not set — skipping auth');
    return NextResponse.json(
      { error: 'CRON_SECRET not configured on server' },
      { status: 500 },
    );
  }

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Run status check first (non-blocking — exits 1 when migrations are pending)
  let statusOutput = '';
  try {
    const { stdout: statusStdout } = await asyncExec('node node_modules/.bin/prisma migrate status', {
      cwd: process.cwd(),
      env: { ...process.env },
      timeout: 30_000,
      encoding: 'utf8',
    });
    statusOutput = statusStdout.trim();
    console.log('[cron/prisma-migrate] Status:', statusOutput);
  } catch (statusErr) {
    // migrate status exits 1 when migrations are pending — that's expected
    const execErr = statusErr as { stdout?: string; stderr?: string };
    statusOutput = execErr.stdout || execErr.stderr || '';
    console.log('[cron/prisma-migrate] Status (pending migrations):', statusOutput);
  }

  try {
    const { stdout } = await asyncExec('node node_modules/.bin/prisma migrate deploy', {
      cwd: process.cwd(),
      env: { ...process.env },
      timeout: 60_000,
      encoding: 'utf8',
    });

    console.log('[cron/prisma-migrate] Success:', stdout.trim());

    return NextResponse.json({
      ok: true,
      status: statusOutput,
      output: stdout.trim(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Unknown error during migration';

    console.error('[cron/prisma-migrate] Failed:', message);

    return NextResponse.json(
      {
        error: 'Migration failed',
        status: statusOutput,
        detail: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
