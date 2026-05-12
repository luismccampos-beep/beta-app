import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

type JsonObject = Record<string, unknown>;

const PROJECT_ROOT = path.resolve(process.cwd());
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const MESSAGES_DIR = path.join(SRC_DIR, 'messages');

const LOCALES = ['pt', 'en', 'es', 'fr'] as const;
type Locale = (typeof LOCALES)[number];

type InputSpec = {
  file: string; // relative to project root
  namespace: string;
};

const INPUTS: InputSpec[] = [
  {
    file: 'src/app/components/pages/EnhancedTravelPreferencesForm.tsx',
    namespace: 'enhancedTravelPreferencesForm'
  },
  {
    file: 'src/app/components/pages/AuthPage.tsx',
    namespace: 'auth'
  },
  {
    file: 'src/app/components/pages/ResultsPage.tsx',
    namespace: 'results'
  }
];

function setNested(obj: JsonObject, dottedKey: string, value: unknown) {
  const parts = dottedKey.split('.').filter(Boolean);
  if (parts.length === 0) return;

  let cursor: JsonObject = obj;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    const isLast = i === parts.length - 1;

    if (isLast) {
      cursor[part] = value;
      return;
    }

    const existing = cursor[part];
    if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
      cursor = existing as JsonObject;
      continue;
    }

    const next: JsonObject = {};
    cursor[part] = next;
    cursor = next;
  }
}

async function readJsonFile(filePath: string): Promise<JsonObject> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as JsonObject;
  } catch {
    return {};
  }
}

async function writeJsonFile(filePath: string, obj: JsonObject) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function unescapeTsSingleQuoted(input: string) {
  // Minimal unescape for JS/TS single-quoted strings.
  // Important: We intentionally do NOT try to interpret arbitrary escapes,
  // because some strings may contain sequences that are not valid in JSON.
  return input
    .replace(/\\\\/g, '\\')
    .replace(/\\'/g, "'")
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f');
}

function extractInlineTranslations(source: string): Record<string, Record<Locale, string>> {
  // Extracts entries like:
  // keyName: { en: '...', pt: '...', es: '...', fr: '...' }
  //
  // Assumptions (true for these pages):
  // - keys are simple identifiers (no quotes)
  // - values are single-quoted strings, possibly with escapes like \'
  const entries: Record<string, Record<Locale, string>> = {};

  const translationsBlockMatch =
    /\bconst\s+translations\b[\s\S]*?=\s*\{([\s\S]*?)\n\};/m.exec(source);
  const block = translationsBlockMatch?.[1] ?? '';
  if (!block) return entries;

  const entryRe = /\b([A-Za-z_$][\w$]*)\s*:\s*\{([\s\S]*?)\}\s*,?/g;
  const localeRe = /\b(en|pt|es|fr)\s*:\s*'((?:\\'|\\\\|[^'])*)'/g;

  let match: RegExpExecArray | null;
  while ((match = entryRe.exec(block)) !== null) {
    const key = match[1]!;
    const inner = match[2] ?? '';
    const perLocale: Partial<Record<Locale, string>> = {};

    let m2: RegExpExecArray | null;
    while ((m2 = localeRe.exec(inner)) !== null) {
      const locale = m2[1] as Locale;
      const raw = m2[2] ?? '';
      perLocale[locale] = unescapeTsSingleQuoted(raw);
    }

    if (perLocale.en && perLocale.pt && perLocale.es && perLocale.fr) {
      entries[key] = perLocale as Record<Locale, string>;
    }
  }

  return entries;
}

async function main() {
  const resultsPerInput: Array<{ file: string; namespace: string; count: number }> = [];

  for (const input of INPUTS) {
    const absFile = path.join(PROJECT_ROOT, input.file);
    const source = await fs.readFile(absFile, 'utf8');
    const entries = extractInlineTranslations(source);
    const keys = Object.keys(entries);

    for (const locale of LOCALES) {
      const messagesPath = path.join(MESSAGES_DIR, `${locale}.json`);
      const catalog = await readJsonFile(messagesPath);

      for (const key of keys) {
        const value = entries[key]![locale];
        setNested(catalog, `${input.namespace}.${key}`, value);
      }

      await writeJsonFile(messagesPath, catalog);
    }

    resultsPerInput.push({ file: input.file, namespace: input.namespace, count: keys.length });
  }

  // eslint-disable-next-line no-console
  console.log(
    resultsPerInput
      .map((r) => `${r.namespace}: ${r.count} keys (${r.file})`)
      .join('\n')
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

