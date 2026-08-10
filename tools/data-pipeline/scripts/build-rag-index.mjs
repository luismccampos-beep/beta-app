#!/usr/bin/env node
/**
 * Builds a RAG vector index from Wikivoyage destination data.
 *
 * Creates a TF-IDF sparse matrix + cosine similarity search index
 * that can answer travel questions without an external vector DB.
 *
 * Output: ml-service/app/models/trained/rag_index.pkl
 *
 * Usage:
 *   node scripts/build-rag-index.mjs
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
from scipy import sparse
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("rag-index")

ROOT = Path(r"${ROOT}")
DATA_DIR = ROOT / "ml-service" / "app" / "data"
CSV_PATH = DATA_DIR / "wikivoyage_destinations.csv"
OUT_DIR = ROOT / "ml-service" / "app" / "models" / "trained"
OUT_PATH = OUT_DIR / "rag_index.pkl"
META_PATH = DATA_DIR / "rag_index_meta.json"

# ------------------------------------------------------------------ #
# 1. Load data                                                         #
# ------------------------------------------------------------------ #
log.info("Loading Wikivoyage destinations...")
t0 = time.time()
df = pd.read_csv(CSV_PATH)
log.info(f"Loaded {len(df)} rows in {time.time()-t0:.1f}s")

# Build a rich text field per destination for better retrieval
def build_rag_doc(row):
    parts = []
    nome = str(row.get("nome") or "")
    pais = str(row.get("pais") or "")
    continente = str(row.get("continente") or "")
    tipo = str(row.get("tipo") or "")
    clima = str(row.get("clima") or "")
    tags = str(row.get("tags") or "")
    text_doc = str(row.get("text_doc") or "")

    # Structured metadata as searchable text
    if nome:
        parts.append(f"destino {nome}")
    if pais:
        parts.append(f"pais {pais}")
    if continente:
        parts.append(f"continente {continente}")
    if tipo:
        parts.append(f"tipo {tipo}")
    if clima:
        parts.append(f"clima {clima}")
    if tags and tags != "nan":
        parts.append(f"tags {tags.replace('|', ' ')}")

    # The full article text
    if text_doc and text_doc != "nan":
        parts.append(text_doc[:3000])  # cap at 3000 chars for index size

    return " ".join(parts)

log.info("Building RAG documents...")
df["rag_doc"] = df.apply(build_rag_doc, axis=1)

# Filter out empty docs
mask = df["rag_doc"].str.strip().str.len() > 10
df = df[mask].reset_index(drop=True)
log.info(f"Indexing {len(df)} destinations with content")

# ------------------------------------------------------------------ #
# 2. Build TF-IDF index                                                #
# ------------------------------------------------------------------ #
log.info("Building TF-IDF index...")
t0 = time.time()

vectorizer = TfidfVectorizer(
    max_features=50000,
    ngram_range=(1, 2),
    min_df=2,
    max_df=0.95,
    strip_accents="unicode",
    sublinear_tf=True,
    dtype=np.float32,
)

tfidf_matrix = vectorizer.fit_transform(df["rag_doc"])
log.info(f"TF-IDF matrix: {tfidf_matrix.shape} in {time.time()-t0:.1f}s")

# Build document metadata for retrieval
doc_meta = []
for _, row in df.iterrows():
    doc_meta.append({
        "item_id": str(row.get("item_id", "")),
        "destino_id": int(row["destino_id"]) if pd.notna(row.get("destino_id")) else None,
        "nome": str(row.get("nome", "")),
        "pais": str(row.get("pais", "")),
        "pais_code": str(row.get("pais_code", "")),
        "iata": str(row.get("iata", "")),
        "continente": str(row.get("continente", "")),
        "tipo": str(row.get("tipo", "")),
        "clima": str(row.get("clima", "")),
        "lang": str(row.get("lang", "pt")),
        "tags": str(row.get("tags", "")),
        "text_preview": str(row.get("text_doc", ""))[:500],
    })

# ------------------------------------------------------------------ #
# 3. Pre-compute popular queries cache                                 #
# ------------------------------------------------------------------ #
popular_topics = {
    "praia": "praia beach resort costa litoral",
    "montanha": "montanha mountain hiking trekking",
    "cidade": "cidade city urbano metropolitan",
    "historia": "historia history monument castelo patrimonio cultural",
    "gastronomia": "gastronomia food restaurant cuisine culinaria",
    "aventura": "aventura adventure safari outdoor extreme",
    "familia": "familia family kids children parque diversiones",
    "romance": "romance romantic casal honeymoon lua de mel",
    "ecoturismo": "ecoturismo ecotourism natureza natural sustainable",
    "luxo": "luxo luxury premium cinco estrelas resort",
    "cruzeiro": "cruzeiro cruise navio porto rota",
    "inverno": "inverno winter snow ski neve",
    "culturais": "culturais cultural museu galeria arte exposicao",
    "vida noturna": "vida noturna nightlife bar pub discoteca",
    "compras": "compras shopping loja mercado",
    "relaxamento": "relaxamento relax spa wellness descanso",
    "budget": "budget economico barato低价廉价",
    "festival": "festival evento celebracao tradicao folklore",
}

# Pre-compute embeddings for popular topic queries
topic_vectors = {}
q_tfidf = vectorizer.transform(list(popular_topics.values()))
topic_keys = list(popular_topics.keys())
topic_scores = cosine_similarity(q_tfidf, tfidf_matrix)
for i, topic in enumerate(topic_keys):
    top_indices = np.argsort(-topic_scores[i])[:20]
    topic_vectors[topic] = [
        {"item_id": doc_meta[j]["item_id"], "nome": doc_meta[j]["nome"], "score": float(topic_scores[i][j])}
        for j in top_indices
    ]

# ------------------------------------------------------------------ #
# 4. Save index                                                        #
# ------------------------------------------------------------------ #
OUT_DIR.mkdir(parents=True, exist_ok=True)

index_data = {
    "vectorizer": vectorizer,
    "tfidf_matrix": tfidf_matrix,
    "doc_meta": doc_meta,
    "topic_vectors": topic_vectors,
}

joblib.dump(index_data, OUT_PATH)

meta = {
    "documents": len(doc_meta),
    "vocabulary_size": len(vectorizer.vocabulary_),
    "matrix_shape": list(tfidf_matrix.shape),
    "matrix_density": float(tfidf_matrix.nnz / (tfidf_matrix.shape[0] * tfidf_matrix.shape[1])),
    "popular_topics": list(popular_topics.keys()),
    "source": str(CSV_PATH),
    "model": str(OUT_PATH),
}
META_PATH.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")

log.info(f"RAG index saved: {OUT_PATH}")
log.info(f"  Documents: {len(doc_meta)}")
log.info(f"  Vocabulary: {len(vectorizer.vocabulary_)} terms")
log.info(f"  Matrix: {tfidf_matrix.shape}, density: {meta['matrix_density']:.4f}")
log.info(f"  Popular topics: {len(topic_vectors)}")

# ------------------------------------------------------------------ #
# 5. Quick test                                                        #
# ------------------------------------------------------------------ #
test_query = "praias no Brasil"
q_vec = vectorizer.transform([test_query])
scores = cosine_similarity(q_vec, tfidf_matrix).ravel()
top5 = np.argsort(-scores)[:5]
log.info(f"\\nTest query: '{test_query}'")
for rank, idx in enumerate(top5, 1):
    m = doc_meta[idx]
    log.info(f"  {rank}. {m['nome']} ({m['pais']}) - score={scores[idx]:.4f}")

log.info("\\nDone!")
`;

const tmpPy = join(__dirname, "_tmp_rag_index.py");
writeFileSync(tmpPy, pyCode, "utf-8");
try {
  execSync(`py -3 -X utf8 "${tmpPy}"`, { stdio: "inherit", timeout: 600_000 });
} finally {
  unlinkSync(tmpPy);
}
