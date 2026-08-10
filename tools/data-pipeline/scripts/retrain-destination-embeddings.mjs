#!/usr/bin/env node
/**
 * Re-trains the destination embedding model on ALL 28k+ destinations.
 *
 * Improvements over the original:
 *   - Uses all 28,474 destinations (was 12,000)
 *   - Richer text document construction
 *   - Higher-dimensional SVD (128 vs 64)
 *   - Better metadata coverage
 *
 * Output:
 *   - ml-service/app/models/trained/destination_embeddings.pkl
 *   - ml-service/app/data/wikivoyage_model_meta.json
 *
 * Usage:
 *   node scripts/retrain-destination-embeddings.mjs
 */
import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");

const pyCode = `
import json
import logging
import time
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("retrain-embeddings")

ROOT = Path(r"${ROOT}")
DATA_DIR = ROOT / "ml-service" / "app" / "data"
CSV_PATH = DATA_DIR / "wikivoyage_destinations.csv"
OUT_DIR = ROOT / "ml-service" / "app" / "models" / "trained"
OUT_PATH = OUT_DIR / "destination_embeddings.pkl"
META_PATH = DATA_DIR / "wikivoyage_model_meta.json"

# Import the model class
import sys
sys.path.insert(0, str(ROOT / "ml-service"))
from app.models.destination_embedding_model import DestinationEmbeddingModel

# ------------------------------------------------------------------ #
# 1. Load all destinations                                              #
# ------------------------------------------------------------------ #
log.info("Loading ALL Wikivoyage destinations...")
t0 = time.time()
df = pd.read_csv(CSV_PATH)
log.info(f"Loaded {len(df)} destinations in {time.time()-t0:.1f}s")

# Stats
log.info(f"Languages: {df['lang'].value_counts().to_dict()}")
log.info(f"Continents: {df['continente'].value_counts().to_dict()}")

# ------------------------------------------------------------------ #
# 2. Build enriched text documents                                      #
# ------------------------------------------------------------------ #
log.info("Building enriched text documents...")

def build_rich_text_doc(row):
    """Build a richer text document than the original for better embeddings."""
    parts = []

    # Core metadata as structured tokens
    nome = str(row.get("nome") or "")
    pais = str(row.get("pais") or "")
    continente = str(row.get("continente") or "")
    tipo = str(row.get("tipo") or "")
    clima = str(row.get("clima") or "")
    tags = str(row.get("tags") or "")

    if nome:
        parts.append(f"destino {nome} destination")
    if pais:
        parts.append(f"pais {pais} country")
    if continente:
        parts.append(f"continente {continente}")
    if tipo and tipo != "nan":
        parts.append(f"tipo {tipo} category")
    if clima and clima != "nan":
        parts.append(f"clima {clima} weather")
    if tags and tags != "nan":
        tag_str = tags.replace("|", " ")
        parts.append(f"tags {tag_str}")
        # Add individual tags as repeated signals
        parts.append(tag_str)

    # Full article text (the main content)
    text_doc = str(row.get("text_doc") or "")
    if text_doc and text_doc != "nan":
        parts.append(text_doc[:4000])  # cap at 4000 chars

    return " ".join(parts)

df["rich_text_doc"] = df.apply(build_rich_text_doc, axis=1)

# Filter out empty or very short docs
mask = df["rich_text_doc"].str.strip().str.len() > 20
df = df[mask].reset_index(drop=True)
log.info(f"Indexing {len(df)} destinations with content")

# ------------------------------------------------------------------ #
# 3. Train TF-IDF + SVD on ALL destinations                            #
# ------------------------------------------------------------------ #
log.info("Training TF-IDF vectorizer on ALL destinations...")
t0 = time.time()

vectorizer = TfidfVectorizer(
    max_features=30000,       # more features for richer vocabulary
    ngram_range=(1, 3),       # up to trigrams for better phrase capture
    min_df=2,
    max_df=0.95,
    strip_accents="unicode",
    sublinear_tf=True,
    dtype=np.float32,
)

tfidf = vectorizer.fit_transform(df["rich_text_doc"])
log.info(f"TF-IDF matrix: {tfidf.shape} ({time.time()-t0:.1f}s)")

n_components = 128  # higher than original 64 for richer representation
log.info(f"Training SVD with {n_components} components...")
t0 = time.time()

svd = TruncatedSVD(n_components=n_components, random_state=42)
embeddings = svd.fit_transform(tfidf)
embeddings = normalize(embeddings)

log.info(f"SVD done in {time.time()-t0:.1f}s")
log.info(f"Explained variance ratio: {svd.explained_variance_ratio_.sum():.4f}")

# ------------------------------------------------------------------ #
# 4. Build metadata indexes                                             #
# ------------------------------------------------------------------ #
log.info("Building metadata indexes...")

item_ids = df["item_id"].astype(str).tolist()
item_meta = {}
id_by_destino = {}
id_by_iata = {}

for _, row in df.iterrows():
    iid = str(row["item_id"])
    dest_id = row.get("destino_id")
    if pd.isna(dest_id):
        parts = iid.split("-")
        dest_id = int(parts[-1]) if parts[-1].isdigit() else None
    lang = str(row.get("lang") or "pt")
    iata = str(row.get("iata") or "").strip().upper()

    meta = {
        "destino_id": int(dest_id) if dest_id is not None and not pd.isna(dest_id) else None,
        "nome": str(row.get("nome") or ""),
        "iata": iata or None,
        "pais": str(row.get("pais") or ""),
        "tipo": str(row.get("tipo") or ""),
        "clima": str(row.get("clima") or ""),
        "continente": str(row.get("continente") or ""),
        "lang": lang,
        "tags": str(row.get("tags") or "").split("|"),
    }
    item_meta[iid] = meta
    if meta["destino_id"] is not None:
        id_by_destino[f"{lang}:{meta['destino_id']}"] = iid
    if iata:
        if iata not in id_by_iata:
            id_by_iata[iata] = iid

# ------------------------------------------------------------------ #
# 5. Build and save the model                                          #
# ------------------------------------------------------------------ #
log.info("Assembling DestinationEmbeddingModel...")

model = DestinationEmbeddingModel(
    vectorizer=vectorizer,
    svd=svd,
    item_embeddings=embeddings,
    item_ids=item_ids,
    item_meta=item_meta,
    id_by_destino=id_by_destino,
    id_by_iata=id_by_iata,
)

OUT_DIR.mkdir(parents=True, exist_ok=True)

# Backup old model
old_path = OUT_DIR / "destination_embeddings.pkl.bak"
if OUT_PATH.exists():
    import shutil
    shutil.copy2(OUT_PATH, old_path)
    log.info(f"Old model backed up to {old_path}")

joblib.dump(model, OUT_PATH)

# Save metadata
meta_out = {
    "items": len(item_ids),
    "dimensions": n_components,
    "explained_variance_ratio": float(svd.explained_variance_ratio_.sum()),
    "max_features": 30000,
    "ngram_range": [1, 3],
    "source": str(CSV_PATH),
    "model": str(OUT_PATH),
    "trained_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
}
META_PATH.write_text(json.dumps(meta_out, indent=2), encoding="utf-8")

log.info(f"\\nModel saved: {OUT_PATH}")
log.info(f"  Items: {len(item_ids)}")
log.info(f"  Dimensions: {n_components}")
log.info(f"  Explained variance: {svd.explained_variance_ratio_.sum():.4f}")
log.info(f"  Vocabulary size: {len(vectorizer.vocabulary_)}")

# ------------------------------------------------------------------ #
# 6. Test queries                                                      #
# ------------------------------------------------------------------ #
test_queries = [
    {"travelStyles": ["beach", "relaxation"], "budgetRange": [1000, 3000]},
    {"travelStyles": ["adventure"], "activityTypes": ["hiking", "safari"]},
    {"travelStyles": ["culture"], "activityTypes": ["museum", "history"]},
    {"travelStyles": ["luxury"], "budgetRange": [5000, 15000]},
]

for prefs in test_queries:
    # Build preference doc manually (same as build_preference_document)
    parts = []
    for key in ("travelStyles", "activityTypes", "travelPurpose", "experienceTypes", "ecoPreferences", "accommodationType", "preferredDestinations"):
        val = prefs.get(key)
        if isinstance(val, list):
            parts.extend(str(v) for v in val)
        elif isinstance(val, str) and val:
            parts.append(val)
    budget = prefs.get("budgetRange")
    if isinstance(budget, list) and len(budget) >= 2:
        mid = (float(budget[0]) + float(budget[1])) / 2
        if mid < 2000:
            parts.append("budget-friendly economy")
        elif mid > 8000:
            parts.append("luxury premium")
    pref_doc = " ".join(parts)

    q_tfidf = vectorizer.transform([pref_doc])
    q_vec = svd.transform(q_tfidf)
    q_norm = normalize(q_vec)
    scores = (embeddings @ q_norm.T).ravel()
    top5 = np.argsort(-scores)[:5]

    log.info(f"\\nQuery: {prefs}")
    log.info(f"  Preference doc: '{pref_doc}'")
    for rank, idx in enumerate(top5, 1):
        m = item_meta[item_ids[idx]]
        log.info(f"  {rank}. {m['nome']} ({m['pais']}) - score={scores[idx]:.4f}")

log.info("\\nRetraining complete!");
`;

const tmpPy = join(__dirname, "_tmp_retrain.py");
writeFileSync(tmpPy, pyCode, "utf-8");
try {
  execSync(`py -3 -X utf8 "${tmpPy}"`, { stdio: "inherit", timeout: 600_000 });
} finally {
  unlinkSync(tmpPy);
}
