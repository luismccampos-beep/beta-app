import fs from 'node:fs/promises';
import path from 'node:path';

type JsonObject = Record<string, unknown>;

const PROJECT_ROOT = path.resolve(process.cwd());
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const MESSAGES_DIR = path.join(SRC_DIR, 'messages');

const LOCALES = ['pt', 'en', 'es', 'fr'] as const;
type Locale = (typeof LOCALES)[number];

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

function isSourceFile(filePath: string) {
  return SOURCE_EXTENSIONS.has(path.extname(filePath));
}

async function listFilesRecursive(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Ignore build and dependency folders, even if user misconfigured includes
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      out.push(...(await listFilesRecursive(fullPath)));
      continue;
    }

    if (entry.isFile() && isSourceFile(fullPath)) out.push(fullPath);
  }

  return out;
}

function extractKeysFromSource(source: string): string[] {
  // Matches:
  // - t('a.b.c')
  // - t.rich("a.b.c")
  // - t.markup(`a.b.c`)
  // - t.raw('a.b.c')
  //
  // With namespaces:
  // - const t = useTranslations('landing'); t('hero') -> landing.hero
  // - const t = useTranslations(); t('hero') -> hero
  //
  // Non-goals (intentionally ignored):
  // - dynamic keys like t(key)
  // - template concatenations like t(`a.${b}`)
  const translatorVarToNamespace = new Map<string, string>();

  // Capture: const t = useTranslations('ns')
  // Also supports: let/var and typed assignments.
  const nsRe =
    /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*useTranslations\(\s*(?:['"]([^'"]+)['"])?\s*\)/g;

  let nsMatch: RegExpExecArray | null;
  while ((nsMatch = nsRe.exec(source)) !== null) {
    const varName = nsMatch[1];
    const namespace = nsMatch[2] ?? '';
    if (!varName) continue;
    translatorVarToNamespace.set(varName, namespace);
  }

  // Capture any translator function call:
  // - t('key')
  // - t.rich('key')
  // - t.raw("key")
  const callRe = /\b([A-Za-z_$][\w$]*)(?:\.(?:rich|markup|raw))?\(\s*(['"`])([^'"`]+)\2/g;

  const keys: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = callRe.exec(source)) !== null) {
    const varName = match[1]?.trim();
    const key = match[3]?.trim();
    if (!key) continue;
    const namespace = (varName && translatorVarToNamespace.has(varName))
      ? translatorVarToNamespace.get(varName)!
      : '';

    if (namespace) keys.push(`${namespace}.${key}`);
    else keys.push(key);
  }
  return keys;
}

function setNested(obj: JsonObject, dottedKey: string, value: unknown) {
  const parts = dottedKey.split('.').filter(Boolean);
  if (parts.length === 0) return;

  let cursor: JsonObject = obj;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    const isLast = i === parts.length - 1;

    if (isLast) {
      if (!(part in cursor)) cursor[part] = value;
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
  } catch (err: unknown) {
    // If file doesn't exist or isn't valid JSON, start fresh.
    return {};
  }
}

async function writeJsonFile(filePath: string, obj: JsonObject) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

async function main() {
  const files = await listFilesRecursive(SRC_DIR);

  const allKeys = new Set<string>();
  for (const filePath of files) {
    const source = await fs.readFile(filePath, 'utf8');
    for (const key of extractKeysFromSource(source)) allKeys.add(key);
  }

  const sortedKeys = [...allKeys].sort((a, b) => a.localeCompare(b));

  const perLocaleCounts: Record<Locale, number> = {
    pt: 0,
    en: 0,
    es: 0,
    fr: 0,
  };

  for (const locale of LOCALES) {
    const targetPath = path.join(MESSAGES_DIR, `${locale}.json`);
    const catalog = await readJsonFile(targetPath);

    for (const key of sortedKeys) {
      setNested(catalog, key, '');
    }

    await writeJsonFile(targetPath, catalog);
    perLocaleCounts[locale] = sortedKeys.length;
  }

  console.log(
    `Extracted ${sortedKeys.length} next-intl keys from src/. Updated: ` +
      LOCALES.map((l) => `${l}(${perLocaleCounts[l]})`).join(', ') +
      `. Output dir: ${path.relative(PROJECT_ROOT, MESSAGES_DIR)}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

