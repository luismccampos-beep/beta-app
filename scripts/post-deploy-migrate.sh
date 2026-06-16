#!/bin/bash
# post-deploy-migrate.sh
# Script de migração pós-deploy para Vercel + Neon
#
# Este script pode ser usado:
#   1. Como Release Command no Vercel (se o DB for acessível durante o deploy)
#   2. Como script chamado por um cron job (Vercel Cron Jobs)
#   3. Como script executado por um Deploy Hook via API endpoint
#
# Pré-requisitos:
#   - DATABASE_URL e DATABASE_URL_UNPOOLED definidos como env vars no Vercel
#   - Prisma Client instalado (npm ci)
#
# Uso:
#   bash scripts/post-deploy-migrate.sh

set -euo pipefail

echo "=== Post-Deploy Migration ==="
echo "Timestamp: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# Verificar se as env vars existem
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL not set. Skipping migration."
  exit 0
fi

echo "1. Generating Prisma Client..."
npx prisma generate

echo "2. Applying pending migrations..."
if [ -d "prisma/migrations" ]; then
  npx prisma migrate deploy
  echo "   ✓ Migrations applied successfully"
else
  echo "   ⚠ No migrations directory found."
  echo "   Run locally: npx prisma migrate dev --name init"
  echo "   Or resolve:  npx prisma migrate resolve --applied <migration_name>"
  exit 1
fi

echo "3. Verifying schema..."
npx prisma validate

echo "=== Migration complete ==="
