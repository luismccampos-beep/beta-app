/**
 * Hard-delete soft-deleted rows past their retention window.
 *
 * Soft-deleted rows (deleted_at IS NOT NULL) accumulate forever. This script
 * permanently removes rows where deleted_at < NOW() - retention_days.
 *
 * Run as a scheduled cron / Cloudflare Worker Cron Trigger:
 *   node tools/data-pipeline/scripts/purge-soft-deleted.mjs
 *
 * Options:
 *   --dry-run   Log what would be deleted without actually deleting
 *   --verbose   Log every deleted row
 *   --model=X   Only purge a specific model (repeatable)
 *   --retention-days=N  Override default (90 days)
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const verbose = args.has('--verbose');

// Parse --model=Name (repeatable) and --retention-days=N
const modelFilters: string[] = [];
let retentionDays = 90;
for (const a of args) {
  if (a.startsWith('--model=')) modelFilters.push(a.slice('--model='.length));
  if (a.startsWith('--retention-days=')) retentionDays = parseInt(a.slice('--retention-days='.length), 10) || 90;
}

// ── Configuration ──────────────────────────────────────────────────────────

/** Models and their retention periods in days. */
const RETENTION: Record<string, number> = {
  // Core user data — keep 90 days for GDPR erasure requests
  User: 90,
  // Financial records — keep 7 years for tax compliance
  Booking: 365 * 7,
  PaymentTransaction: 365 * 7,
  // Content — 180 days
  Trip: 90,
  Review: 180,
  Destination: 180,
  Package: 180,
  Provider: 180,
  Service: 180,
  Promotion: 90,
  SavedItinerary: 90,
  ArticleComment: 180,
  CommunityPost: 90,
  CommunityComment: 90,
  RoomMessage: 90,
  // CRM — 365 days
  CrmCategory: 365,
  CrmProduct: 365,
  // AI — 30 days (chat conversations)
  AiConversation: 30,
  AiMessage: 30,
  // Loyalty — 90 days (program itself; transactions follow different rules)
  LoyaltyProgram: 90,
};

// ── Setup ──────────────────────────────────────────────────────────────────

function loadEnv() {
  // Try to load .env from project root
  const root = resolve(process.cwd());
  const envPath = resolve(root, '.env');
  try {
    const content = readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env not found — assume env vars are already set
  }
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL },
  },
});

// ── Core logic ─────────────────────────────────────────────────────────────

async function purgeModel(
  modelName: string,
  days: number,
): Promise<number> {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Prisma model names are PascalCase; table names are snake_case
  // We access the model dynamically via (prisma as any)[lowerCamel]
  const accessor = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  const client = prisma as unknown as Record<string, {
    count: (args: Record<string, unknown>) => Promise<number>;
    deleteMany: (args: Record<string, unknown>) => Promise<{ count: number }>;
  }>;

  const model = client[accessor];
  if (!model) {
    console.warn(`  [skip] ${modelName}: no prisma model found`);
    return 0;
  }

  try {
    const count = await model.count({
      where: { deletedAt: { lte: cutoff } },
    });

    if (count === 0) {
      if (verbose) console.log(`  [ok]   ${modelName}: 0 rows to purge`);
      return 0;
    }

    if (dryRun) {
      console.log(`  [dry]  ${modelName}: ${count} rows would be purged (cutoff: ${cutoff.toISOString()})`);
      return 0;
    }

    const result = await model.deleteMany({
      where: { deletedAt: { lte: cutoff } },
    });

    console.log(`  [del]  ${modelName}: ${result.count} rows purged (cutoff: ${cutoff.toISOString()})`);
    return result.count;
  } catch (err) {
    console.error(`  [err]  ${modelName}: ${(err as Error).message}`);
    return 0;
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  loadEnv();

  console.log(
    `${dryRun ? '[DRY RUN] ' : ''}Purging soft-deleted rows older than retention window...\n`,
  );

  const models = Object.keys(RETENTION).filter(
    (m) => modelFilters.length === 0 || modelFilters.includes(m),
  );

  let totalPurged = 0;
  let totalWouldPurge = 0;

  for (const model of models) {
    const days = retentionDays !== 90 ? retentionDays : RETENTION[model];
    const purged = await purgeModel(model, days);
    totalPurged += purged > 0 ? purged : 0;
  }

  console.log(
    `\nFinished. ${dryRun ? `Would purge ${totalPurged} rows.` : `Purged ${totalPurged} rows.`}`,
  );

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Purge failed:', err);
  process.exit(1);
});