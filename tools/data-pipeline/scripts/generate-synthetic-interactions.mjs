#!/usr/bin/env node
/**
 * Generates realistic synthetic user interaction data for bootstrapping
 * the recommendation engine.
 *
 * Creates:
 *   - ml-service/app/data/interactions.csv (replaces 18-record stub)
 *   - ml-service/app/data/items.csv (replaces 14-item stub)
 *
 * Usage:
 *   node scripts/generate-synthetic-interactions.mjs
 */
import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");

const pyCode = `
import random
import time
import logging
from pathlib import Path

import numpy as np
import pandas as pd

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("synthetic-interactions")

random.seed(42)
np.random.seed(42)

ROOT = Path(r"${ROOT}")
DATA_DIR = ROOT / "ml-service" / "app" / "data"

# ------------------------------------------------------------------ #
# 1. Build rich item catalog from Wikivoyage destinations               #
# ------------------------------------------------------------------ #
log.info("Loading Wikivoyage destinations for item catalog...")
df = pd.read_csv(DATA_DIR / "wikivoyage_destinations.csv")

# Select top destinations by continent to ensure diversity
destinations_per_continent = {}
for _, row in df.iterrows():
    cont = str(row.get("continente") or "Other")
    if cont not in destinations_per_continent:
        destinations_per_continent[cont] = []
    destinations_per_continent[cont].append(row)

# Sample 60 destinations evenly across continents (for item variety)
sampled_destinations = []
for cont, rows in destinations_per_continent.items():
    n = min(12, len(rows))
    sampled = random.sample(rows, n)
    sampled_destinations.extend(sampled)

# Build item catalog
items = []
item_id_counter = 1

# Destination items
dest_items = []
for row in sampled_destinations:
    nome = str(row.get("nome") or "")
    pais = str(row.get("pais") or "")
    continente = str(row.get("continente") or "")
    tipo = str(row.get("tipo") or "")
    clima = str(row.get("clima") or "")
    tags_raw = str(row.get("tags") or "")
    item_id = f"dest-{item_id_counter:04d}"

    tags_list = [t.strip() for t in tags_raw.split("|") if t.strip()]
    tags_list.extend([tipo, clima, continente])
    tags_list = [t for t in tags_list if t and t != "nan"]

    dest_items.append({
        "item_id": item_id,
        "type": "destination",
        "subtype": tipo if tipo and tipo != "nan" else "city",
        "tags": "|".join(tags_list[:8]),
        "nome": nome,
        "pais": pais,
        "continente": continente,
        "clima": clima,
    })
    item_id_counter += 1

items.extend(dest_items)

# Service items (hotels, activities, cruises, transfers, packages)
service_items = [
    # Hotels
    {"item_id": "svc-hotel-01", "type": "accommodation", "subtype": "hotel", "tags": "luxury|5star|central|spa|pool"},
    {"item_id": "svc-hotel-02", "type": "accommodation", "subtype": "hotel", "tags": "budget|economy|clean|transport"},
    {"item_id": "svc-hotel-03", "type": "accommodation", "subtype": "resort", "tags": "beach|all-inclusive|family|pool|kids"},
    {"item_id": "svc-hotel-04", "type": "accommodation", "subtype": "boutique", "tags": "boutique|historic|charming|design|central"},
    {"item_id": "svc-hotel-05", "type": "accommodation", "subtype": "hostel", "tags": "hostel|budget|social|backpacker|young"},
    {"item_id": "svc-hotel-06", "type": "accommodation", "subtype": "villa", "tags": "villa|private|pool|luxury|family"},
    {"item_id": "svc-hotel-07", "type": "accommodation", "subtype": "apartment", "tags": "apartment|kitchen|long-stay|central|modern"},
    {"item_id": "svc-hotel-08", "type": "accommodation", "subtype": "eco-lodge", "tags": "eco|sustainable|nature|remote|peaceful"},
    # Activities
    {"item_id": "svc-act-01", "type": "activity", "subtype": "tour", "tags": "city|walking|culture|historic|guide"},
    {"item_id": "svc-act-02", "type": "activity", "subtype": "adventure", "tags": "adventure|outdoor|hiking|nature|extreme"},
    {"item_id": "svc-act-03", "type": "activity", "subtype": "food", "tags": "food|gastronomy|cooking|wine|local"},
    {"item_id": "svc-act-04", "type": "activity", "subtype": "water", "tags": "water|diving|snorkel|surf|beach"},
    {"item_id": "svc-act-05", "type": "activity", "subtype": "cultural", "tags": "museum|art|gallery|history|architecture"},
    {"item_id": "svc-act-06", "type": "activity", "subtype": "wildlife", "tags": "safari|wildlife|nature|photography|animal"},
    {"item_id": "svc-act-07", "type": "activity", "subtype": "nightlife", "tags": "nightlife|bar|club|music|party"},
    {"item_id": "svc-act-08", "type": "activity", "subtype": "wellness", "tags": "spa|wellness|yoga|relax|health"},
    {"item_id": "svc-act-09", "type": "activity", "subtype": "shopping", "tags": "shopping|market|craft|souvenir|local"},
    {"item_id": "svc-act-10", "type": "activity", "subtype": "sport", "tags": "sport|golf|tennis|cycling|fitness"},
    # Cruises
    {"item_id": "svc-cruise-01", "type": "cruise", "subtype": "sea", "tags": "cruise|sea|luxury|caribbean|island"},
    {"item_id": "svc-cruise-02", "type": "cruise", "subtype": "river", "tags": "cruise|river|culture|europe|danube"},
    {"item_id": "svc-cruise-03", "type": "cruise", "subtype": "expedition", "tags": "cruise|expedition|adventure|antarctic|arctic"},
    {"item_id": "svc-cruise-04", "type": "cruise", "subtype": "mediterranean", "tags": "cruise|mediterranean|italy|greece|spain"},
    # Transfers
    {"item_id": "svc-xfer-01", "type": "transportation", "subtype": "airport", "tags": "transfer|airport|private|premium"},
    {"item_id": "svc-xfer-02", "type": "transportation", "subtype": "shared", "tags": "transfer|shared|shuttle|budget"},
    {"item_id": "svc-xfer-03", "type": "transportation", "subtype": "rental-car", "tags": "rental|car|drive|freedom|road"},
    # Packages
    {"item_id": "svc-pkg-01", "type": "package", "subtype": "city-break", "tags": "package|city|weekend|couple|romantic"},
    {"item_id": "svc-pkg-02", "type": "package", "subtype": "family", "tags": "package|family|kids|all-inclusive|fun"},
    {"item_id": "svc-pkg-03", "type": "package", "subtype": "honeymoon", "tags": "package|honeymoon|romantic|luxury|beach"},
    {"item_id": "svc-pkg-04", "type": "package", "subtype": "adventure", "tags": "package|adventure|trek|outdoor|extreme"},
    {"item_id": "svc-pkg-05", "type": "package", "subtype": "wellness", "tags": "package|wellness|spa|detox|retreat"},
    {"item_id": "svc-pkg-06", "type": "package", "subtype": "cultural", "tags": "package|cultural|museum|art|history"},
]

items.extend(service_items)
items_df = pd.DataFrame(items)

# ------------------------------------------------------------------ #
# 2. Generate synthetic user interactions                               #
# ------------------------------------------------------------------ #
log.info("Generating synthetic user interactions...")

NUM_USERS = 800
NUM_INTERACTIONS = 15000

# User archetypes with preference profiles
ARCHETYPES = [
    {"name": "beach-lover", "weights": {"destination": 0.4, "accommodation": 0.3, "activity": 0.15, "cruise": 0.1, "package": 0.05}, "tag_bias": ["beach", "resort", "tropical", "sea", "water"]},
    {"name": "culture-seeker", "weights": {"destination": 0.35, "activity": 0.35, "accommodation": 0.15, "package": 0.1, "transportation": 0.05}, "tag_bias": ["museum", "art", "historic", "culture", "architecture"]},
    {"name": "adventure-junkie", "weights": {"destination": 0.3, "activity": 0.4, "accommodation": 0.1, "package": 0.15, "transportation": 0.05}, "tag_bias": ["adventure", "hiking", "extreme", "outdoor", "safari"]},
    {"name": "luxury-traveller", "weights": {"destination": 0.25, "accommodation": 0.35, "activity": 0.15, "cruise": 0.15, "package": 0.1}, "tag_bias": ["luxury", "5star", "premium", "spa", "wine"]},
    {"name": "family-vacationer", "weights": {"destination": 0.3, "accommodation": 0.25, "activity": 0.2, "package": 0.2, "transportation": 0.05}, "tag_bias": ["family", "kids", "pool", "fun", "all-inclusive"]},
    {"name": "budget-backpacker", "weights": {"destination": 0.4, "accommodation": 0.25, "activity": 0.2, "transportation": 0.1, "package": 0.05}, "tag_bias": ["budget", "hostel", "backpacker", "cheap", "social"]},
    {"name": "cruise-enthusiast", "weights": {"destination": 0.15, "cruise": 0.5, "accommodation": 0.1, "activity": 0.15, "transportation": 0.1}, "tag_bias": ["cruise", "sea", "island", "caribbean", "mediterranean"]},
    {"name": "wellness-seeker", "weights": {"destination": 0.25, "accommodation": 0.2, "activity": 0.25, "package": 0.2, "transportation": 0.1}, "tag_bias": ["spa", "wellness", "yoga", "relax", "eco"]},
    {"name": "food-tourist", "weights": {"destination": 0.3, "activity": 0.35, "accommodation": 0.15, "package": 0.15, "transportation": 0.05}, "tag_bias": ["food", "gastronomy", "wine", "cooking", "local"]},
    {"name": "family-cruiser", "weights": {"destination": 0.15, "cruise": 0.4, "accommodation": 0.15, "activity": 0.2, "package": 0.1}, "tag_bias": ["cruise", "family", "kids", "pool", "entertainment"]},
]

items_df["tag_set"] = items_df["tags"].apply(lambda x: set(str(x).lower().split("|")))

interactions = []
item_popularity = {item_id: 0 for item_id in items_df["item_id"]}
user_archetypes = {}

for user_id in range(1, NUM_USERS + 1):
    archetype = random.choice(ARCHETYPES)
    user_archetypes[user_id] = archetype["name"]

    # Number of interactions per user (power law - most users have few)
    n_interactions = max(3, int(np.random.pareto(1.5) * 8 + 3))
    n_interactions = min(n_interactions, 50)

    for _ in range(n_interactions):
        # Choose item type based on archetype weights
        type_weights = archetype["weights"]
        item_type = random.choices(
            list(type_weights.keys()),
            weights=list(type_weights.values()),
            k=1
        )[0]

        # Filter items by type
        type_items = items_df[items_df["type"] == item_type]
        if type_items.empty:
            continue

        # Bias towards items with matching tags
        if archetype["tag_bias"] and random.random() < 0.6:
            tag_mask = type_items["tag_set"].apply(
                lambda tags: bool(tags & set(archetype["tag_bias"]))
            )
            tagged = type_items[tag_mask]
            if not tagged.empty:
                type_items = tagged

        chosen = type_items.sample(1).iloc[0]
        item_id = chosen["item_id"]

        # Generate score based on archetype match
        tag_overlap = len(chosen["tag_set"] & set(archetype["tag_bias"]))
        base_score = min(5, max(1, int(2 + tag_overlap * 0.8 + random.gauss(0, 0.8))))
        base_score = max(1, min(5, base_score))

        # Action type
        action = random.choices(
            ["view", "save", "book", "rate"],
            weights=[0.5, 0.2, 0.1, 0.2],
            k=1
        )[0]

        if action == "view":
            score = max(1, base_score - random.randint(0, 1))
        elif action == "save":
            score = max(2, base_score)
        elif action == "book":
            score = max(3, base_score)
        else:  # rate
            score = base_score

        interactions.append({
            "user_id": user_id,
            "item_id": item_id,
            "score": score,
            "action": action,
        })
        item_popularity[item_id] = item_popularity.get(item_id, 0) + 1

# ------------------------------------------------------------------ #
# 3. Add some cross-type interactions (users who booked hotels also    #
#    viewed destinations, etc.)                                        #
# ------------------------------------------------------------------ #
log.info("Adding cross-type interaction chains...")
booked_items = [i for i in interactions if i["action"] == "book"]
for booking in booked_items[:200]:
    user_id = booking["user_id"]
    # Find a destination to pair with
    dest_items_filtered = items_df[items_df["type"] == "destination"]
    if not dest_items_filtered.empty:
        dest = dest_items_filtered.sample(1).iloc[0]
        interactions.append({
            "user_id": user_id,
            "item_id": dest["item_id"],
            "score": random.randint(3, 5),
            "action": "view",
        })

interactions_df = pd.DataFrame(interactions)
interactions_df = interactions_df.drop_duplicates(subset=["user_id", "item_id", "action"])

# ------------------------------------------------------------------ #
# 4. Save outputs                                                      #
# ------------------------------------------------------------------ #
# Save interactions
inter_path = DATA_DIR / "interactions.csv"
interactions_df[["user_id", "item_id", "score"]].to_csv(inter_path, index=False)
log.info(f"Saved {len(interactions_df)} interactions to {inter_path}")

# Save items (keep original columns)
items_out = items_df.drop(columns=["tag_set"], errors="ignore")
items_out.to_csv(DATA_DIR / "items.csv", index=False)
log.info(f"Saved {len(items_out)} items to {DATA_DIR / 'items.csv'}")

# Stats
log.info(f"\\n--- Statistics ---")
log.info(f"Users: {interactions_df['user_id'].nunique()}")
log.info(f"Items: {interactions_df['item_id'].nunique()}")
log.info(f"Total interactions: {len(interactions_df)}")
log.info(f"Avg interactions/user: {len(interactions_df) / interactions_df['user_id'].nunique():.1f}")
log.info(f"Score distribution:")
for s in sorted(interactions_df["score"].unique()):
    count = len(interactions_df[interactions_df["score"] == s])
    log.info(f"  Score {s}: {count} ({count/len(interactions_df)*100:.1f}%)")
log.info(f"\\nArchetype distribution:")
from collections import Counter
arch_counts = Counter(user_archetypes.values())
for arch, count in arch_counts.most_common():
    log.info(f"  {arch}: {count} users")

log.info("\\nDone!")
`;

const tmpPy = join(__dirname, "_tmp_synthetic.py");
writeFileSync(tmpPy, pyCode, "utf-8");
try {
  execSync(`py -3 -X utf8 "${tmpPy}"`, { stdio: "inherit", timeout: 300_000 });
} finally {
  unlinkSync(tmpPy);
}
