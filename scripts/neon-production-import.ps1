# Import travel catalog into Vercel Neon (production).
# Neon URLs are NOT in `vercel env pull` — copy from Vercel → Storage → neon-beta-app → Connect.
#
# Usage (PowerShell):
#   $env:DATABASE_URL = "postgresql://...pooled..."
#   $env:DATABASE_URL_UNPOOLED = "postgresql://...direct..."  # or same as DATABASE_URL
#   .\scripts\neon-production-import.ps1
#   .\scripts\neon-production-import.ps1 -Fresh -Backfill

param(
  [switch]$Fresh,
  [switch]$Backfill,
  [switch]$ImagesOnly
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

if (-not $env:DATABASE_URL -or $env:DATABASE_URL.Length -lt 20) {
  Write-Error @"
DATABASE_URL is missing. Copy from Vercel Dashboard:
  Project beta-app → Storage → neon-beta-app → Connect → Pooled connection string
Set DATABASE_URL and DATABASE_URL_UNPOOLED in this shell (unpooled = direct URL for Prisma migrate).
"@
}

if (-not $env:DATABASE_URL_UNPOOLED) {
  $env:DATABASE_URL_UNPOOLED = $env:DATABASE_URL
}

$envBackup = Join-Path $Root '.env.localdev.bak'
if (Test-Path (Join-Path $Root '.env')) {
  if (Test-Path $envBackup) { Remove-Item $envBackup -Force }
  Rename-Item (Join-Path $Root '.env') $envBackup
  Write-Host 'Renamed .env -> .env.localdev.bak (avoids localhost:5433 override)'
}

try {
  npx prisma migrate deploy
  $importArgs = @()
  if ($ImagesOnly) { $importArgs += '--images-only' }
  elseif ($Fresh) { $importArgs += '--fresh' }
  if ($Backfill) {
    $importArgs += '--backfill-hotel-geo', '--backfill-dest-geo', '--verify-hotels-geo'
  }
  if ($importArgs.Count -gt 0) {
    npm run travel:catalog:import -- @importArgs
  } else {
    npm run travel:catalog:import
  }
} finally {
  if (Test-Path $envBackup) {
    $envPath = Join-Path $Root '.env'
    if (Test-Path $envPath) { Remove-Item $envPath -Force }
    Rename-Item $envBackup $envPath
    Write-Host 'Restored .env'
  }
}

Write-Host ''
Write-Host 'Done. Validate: https://beta-app-tau.vercel.app/api/travel/demo-stats (source=db, destinos>0)'
