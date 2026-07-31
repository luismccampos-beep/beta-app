#!/usr/bin/env node
/**
 * After Vite build, ensure dist/client/assets (lowercase) exists.
 * Vite on Windows outputs to dist/client/Assets (capital A).
 * Cloudflare Linux is case-sensitive, so /assets/ must be lowercase.
 *
 * On Linux: simple rename works.
 * On Windows: rename is a no-op (case-insensitive FS), so we use
 * a temp directory to force the lowercase name.
 */
import { existsSync, readdirSync, mkdirSync, copyFileSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'

const src = join('dist', 'client', 'Assets')
const dst = join('dist', 'client', 'assets')

if (!existsSync(src)) {
  // Already lowercase or no assets dir — nothing to do
  process.exit(0)
}

if (src === dst) {
  // Same string — impossible, but guard
  process.exit(0)
}

// Check if src and dst are the same directory (Windows case-insensitive)
const srcStat = statSync(src)
let dstInode = 0
try { dstInode = statSync(dst).ino } catch {}

if (srcStat.ino === dstInode && dstInode !== 0) {
  // Same directory on case-insensitive FS (Windows)
  // Use temp dir to force lowercase name
  const tmp = join('dist', 'client', '_cf_assets_tmp')
  if (existsSync(tmp)) rmSync(tmp, { recursive: true, force: true })

  // Copy Assets -> tmp
  mkdirSync(tmp, { recursive: true })
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name)
    const dstPath = join(tmp, entry.name)
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, dstPath)
    } else {
      copyFileSync(srcPath, dstPath)
    }
  }

  // Remove original
  rmSync(src, { recursive: true, force: true })

  // Copy tmp -> assets
  mkdirSync(dst, { recursive: true })
  for (const entry of readdirSync(tmp, { withFileTypes: true })) {
    const srcPath = join(tmp, entry.name)
    const dstPath = join(dst, entry.name)
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, dstPath)
    } else {
      copyFileSync(srcPath, dstPath)
    }
  }

  // Cleanup
  rmSync(tmp, { recursive: true, force: true })
} else {
  // Different directories (Linux) — rename works
  const { renameSync } = await import('node:fs')
  renameSync(src, dst)
}

function copyDirRecursive(srcDir, dstDir) {
  mkdirSync(dstDir, { recursive: true })
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = join(srcDir, entry.name)
    const dstPath = join(dstDir, entry.name)
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, dstPath)
    } else {
      copyFileSync(srcPath, dstPath)
    }
  }
}
