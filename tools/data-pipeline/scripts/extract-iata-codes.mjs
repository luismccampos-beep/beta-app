#!/usr/bin/env node
/**
 * Extracts IATA city/airport codes from PDF → CSV → Parquet.
 *
 * Source: Database/IATA/1432804003.pdf (33 pages of IATA code tables)
 * Output: Database/IATA/parquet/iata_codes.parquet
 *
 * Usage:
 *   node scripts/extract-iata-codes.mjs
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");
const IATA_DIR = join(ROOT, "Database", "IATA");
const PDF_PATH = join(IATA_DIR, "1432804003.pdf");
const OUTPUT_DIR = join(IATA_DIR, "parquet");

mkdirSync(OUTPUT_DIR, { recursive: true });

console.log("Extracting IATA codes from PDF...");

const pyCode = `import pdfplumber
import pandas as pd

pdf_path = r"${PDF_PATH}"
output_csv = r"${join(IATA_DIR, "iata_codes.csv")}"
output_parquet = r"${join(OUTPUT_DIR, "iata_codes.parquet")}"

all_rows = []
with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            for row in table:
                if not row or not row[0]:
                    continue
                if "Ciudad" in str(row[0]) or "Location" in str(row[0]):
                    continue
                city = (row[0] or "").strip()
                city_code = (row[1] or "").strip()
                airport_code = (row[2] or "").strip() if len(row) > 2 else ""
                if city and city_code:
                    all_rows.append({
                        "city": city,
                        "city_code": city_code,
                        "airport_code": airport_code,
                    })

df = pd.DataFrame(all_rows)
df = df.drop_duplicates()
df.to_csv(output_csv, index=False)
df.to_parquet(output_parquet, index=False)
print(f"Extracted {len(df)} IATA codes")
print(f"  CSV: {output_csv}")
print(f"  Parquet: {output_parquet}")
`;

const tmpPy = join(__dirname, "_tmp_iata.py");
writeFileSync(tmpPy, pyCode, "utf-8");
try {
  execSync(`py -3 -X utf8 "${tmpPy}"`, { stdio: "inherit" });
} finally {
  unlinkSync(tmpPy);
}
