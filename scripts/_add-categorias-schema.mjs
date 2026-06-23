import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SCHEMA = resolve(ROOT, 'prisma/schema.prisma');

let schema = readFileSync(SCHEMA, 'utf8');

// Check if categorias already exists
if (schema.includes('  categorias        Json?')) {
  console.log('✓ Campo categorias já existe no schema.');
  process.exit(0);
}

// Find the WvDestination model and add categorias before hotelCount
const marker = "  hotelCount        Int      @default(0) @map(\"hotel_count\")";
const insert = "  categorias        Json?    @db.JsonB\n";

if (!schema.includes(marker)) {
  console.error('❌ Marker não encontrado no schema!');
  process.exit(1);
}

schema = schema.replace(marker, insert + marker);
writeFileSync(SCHEMA, schema, 'utf8');
console.log('✓ Campo categorias adicionado ao WvDestination no schema Prisma.');
