#!/usr/bin/env node
/**
 * Converts CSV and XLSX files to Parquet format.
 *
 * Targets:
 *   - Database/rentacar_db/*.csv
 *   - Database/cruises/*.csv + *.xlsx
 *   - ml-service/app/data/*.csv
 *
 * Usage:
 *   node scripts/convert-to-parquet.mjs
 */
import { execSync } from "node:child_process";
import { existsSync, readdirSync, mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { join, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");

const TARGETS = [
  {
    name: "rentacar_db",
    dir: join(ROOT, "Database", "rentacar_db"),
    exts: [".csv"],
  },
  {
    name: "cruises",
    dir: join(ROOT, "Database", "cruises"),
    exts: [".csv", ".xlsx"],
  },
  {
    name: "ml-service",
    dir: join(ROOT, "ml-service", "app", "data"),
    exts: [".csv"],
  },
];

function globFiles(dir, exts) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => {
    const ext = extname(f).toLowerCase();
    return exts.includes(ext);
  });
}

function convertFile(inputPath, outputPath) {
  const ext = extname(inputPath).toLowerCase();
  const readFn = ext === ".csv" ? "read_csv" : "read_excel";
  const extra = ext === ".xlsx" ? ', engine="openpyxl"' : "";

  const pyCode = `import pandas as pd
df = pd.${readFn}(r"${inputPath}"${extra})
# Force all columns to string to avoid mixed-type Arrow errors in XLSX
df = df.astype(str)
df.to_parquet(r"${outputPath}", index=False)
print(f"  {len(df)} rows -> ${basename(outputPath)}")
`;

  const tmpPy = join(__dirname, "_tmp_convert.py");
  writeFileSync(tmpPy, pyCode, "utf-8");
  try {
    execSync(`py -3 -X utf8 "${tmpPy}"`, { stdio: "inherit" });
  } finally {
    unlinkSync(tmpPy);
  }
}

let totalFiles = 0;
let totalErrors = 0;

for (const target of TARGETS) {
  console.log(`\n=== ${target.name} ===`);

  const files = globFiles(target.dir, target.exts);

  if (files.length === 0) {
    console.log("  No files found.");
    continue;
  }

  for (const file of files) {
    const inputPath = join(target.dir, file);
    const outName = basename(file, extname(file)) + ".parquet";
    const outputPath = join(target.dir, "parquet", outName);

    mkdirSync(join(target.dir, "parquet"), { recursive: true });

    try {
      convertFile(inputPath, outputPath);
      totalFiles++;
    } catch (err) {
      console.error(`  ERROR converting ${file}: ${err.message}`);
      totalErrors++;
    }
  }
}

console.log(`\nDone: ${totalFiles} files converted, ${totalErrors} errors.`);
