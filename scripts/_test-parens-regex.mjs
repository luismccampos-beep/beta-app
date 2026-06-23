/**
 * Quick test: regex matching for country parens and check XX dest names
 */
import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

loadProjectEnv(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

async function main() {
  // Test JS regex
  const testRegex = /\(Brasil\)|\(Brazil\)/i;
  console.log('Regex test:', testRegex.test('Foo (Brasil) Bar'));  // should be true
  console.log('Regex test2:', testRegex.test('Foo Brazil Bar'));   // should be false
  console.log('Regex test3:', testRegex.test('Teste (Brazil) x')); // should be true

  // Check: how many XX destinations have parens?
  const total = await p.wvDestination.count({ where: { paisCode: 'XX' } });
  console.log('Total XX:', total);

  // Get ALL XX dest names and test locally
  const all = await p.wvDestination.findMany({
    where: { paisCode: 'XX' },
    select: { id: true, nome: true },
  });

  const parensRegex = /\([A-Za-z]/;
  const withParens = all.filter(d => parensRegex.test(d.nome));
  console.log('With parentheses:', withParens.length);

  // Show some
  console.log('\nSample with parens:');
  for (const d of withParens.slice(0, 30)) {
    console.log(`  [${d.id}] ${d.nome}`);
  }

  // Test the actual patterns from the script
  const COUNTRY_PAREN_MAP = [
    { regex: /\(Brasil\)|\(Brazil\)/i, cc: 'BR' },
    { regex: /\(Portugal\)/i, cc: 'PT' },
    { regex: /\(França\)|\(France\)/i, cc: 'FR' },
    { regex: /\(Japão\)|\(Japan\)/i, cc: 'JP' },
    { regex: /\(Índia\)|\(India\)/i, cc: 'IN' },
    { regex: /\(Estados Unidos\)|\(United States\)|\(USA\)/i, cc: 'US' },
    { regex: /\(Austrália\)|\(Australia\)/i, cc: 'AU' },
    { regex: /\(Canadá\)|\(Canada\)/i, cc: 'CA' },
  ];

  console.log('\nMatches by pattern:');
  for (const { regex, cc } of COUNTRY_PAREN_MAP) {
    const matches = withParens.filter(d => regex.test(d.nome));
    if (matches.length > 0) {
      console.log(`  ${cc}: ${matches.length} matches`);
      for (const m of matches.slice(0, 3)) console.log(`    - ${m.nome}`);
    }
  }

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
