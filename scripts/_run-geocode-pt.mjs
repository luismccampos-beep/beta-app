/**
 * Runs Fase B for Portugal destinations by spawning a child process.
 * This avoids the CLI timeout issue.
 */
import { spawn } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const child = spawn('node', [
  'scripts/_geocode-destinos.mjs',
  '--country=PT',
], {
  cwd: ROOT,
  stdio: ['ignore', 'inherit', 'inherit'],
  detached: false,
});

child.on('exit', (code) => {
  console.log(`\nProcess exited with code ${code}`);
});

// Keep running
await new Promise(() => {});
