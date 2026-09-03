# Travel Intelligence Database — Schema & Sourcing Plan

## 1. Architecture Overview

### Design Principles

- **Two-layer destinations**: Country (aggregate) → City/Region (primary recommendation target)
- **12-month vectors**: Every metric stored as `[Jan..Dec]` — enables "best time to visit" and "best value month"
- **Raw + normalized**: Keep source data as-is, compute 0–100 normalized scores alongside
- **Per-user recomputation**: Scores are never global — always computed from user preferences at query time
- **Free/open data only**: No paid APIs, no scraping of paywalled sources
- **Incremental enrichment**: Data pipelines run independently per domain; a destination is usable as soon as any domain is populated

### Entity Hierarchy

```
Country (1) ──→ City/Region (N) ──→ DestinationVenue (N)
                                 ──→ DestinationMetric (12 per metric per dest)
                                 ──→ DestinationEmbedding (1 per model version)
```

### Existing Models to Extend (NOT replace)

| Existing Model | Action |
|---|---|
| `wv_destinations` | Keep as travel catalog. Add `countryId` FK to new `Country` model |
| `destination_venues` | Already built. Stays as-is |
| `col_cities` / `col_country_indices` | Data migrates to `DestinationMetric` monthly vectors |
| `UserProfile` / `UserPreference` | Extended with new fields for hard filters |
| `EmbeddingCache` | Already supports destination embeddings. Add preference-vector variant |
| `DestinationEmbedding` (ML) | Already exists in ml-service. Schema stays in Python, not Prisma |

---

## 2. New Prisma Models

### 2.1 Country

```prisma
model Country {
  id              String  @id @default(uuid())
  iso2            String  @unique @db.VarChar(2)    // "PT", "FR", "US"
  iso3            String  @unique @db.VarChar(3)    // "PRT", "FRA", "USA"
  name            String  @db.VarChar(120)
  nameEn          String? @map("name_en") @db.VarChar(120)
  wikidataId      String? @map("wikidata_id") @db.VarChar(16)
  geonamesId      Int?    @map("geonames_id")
  continent       String? @db.VarChar(20)
  latitude        Float?  @db.Real
  longitude       Float?  @db.Real
  area            Float?  @db.Real                  // km²
  population      BigInt? @db.BigInt
  capitalCity     String? @map("capital_city") @db.VarChar(120)
  currency        String? @db.VarChar(8)            // "EUR", "USD"
  currencySymbol  String? @map("currency_symbol") @db.VarChar(4)
  languages       Json?   @db.JsonB                 // [{code:"pt",name:"Portuguese",prevalence:0.95}]
  plugTypes       Json?   @map("plug_types") @db.JsonB  // ["C","F"]
  drivingSide     String? @map("driving_side") @db.VarChar(10)  // "right"/"left"
  callingCode     String? @map("calling_code") @db.VarChar(8)
  visaRequired    Json?   @map("visa_required") @db.JsonB  // {PT:["visa-free 90d"],US:["evisa"]}
  emergencyNumber String? @map("emergency_number") @db.VarChar(20)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  cities          City[]

  @@index([iso2])
  @@map("countries")
}
```

### 2.2 City (the primary recommendation entity)

```prisma
model City {
  id              String   @id @default(uuid())
  countryId       String   @map("country_id")
  slug            String   @unique @db.VarChar(64)
  wikidataId      String?  @map("wikidata_id") @db.VarChar(16)
  geonamesId      Int?     @map("geonames_id")
  osmId           String?  @map("osm_id") @db.VarChar(32)  // "node/12345"

  // Identity
  name            String   @db.VarChar(200)
  nameEn          String?  @map("name_en") @db.VarChar(200)
  region          String?  @db.VarChar(120)  // state/province
  timezone        String?  @db.VarChar(40)   // "Europe/Lisbon"
  elevation       Float?   @db.Real          // meters above sea level
  latitude        Float    @db.Real
  longitude       Float    @db.Real

  // Population & density
  population      BigInt?  @db.BigInt
  area            Float?   @db.Real          // km² urban area
  density         Float?   @db.Real          // pop/km²

  // English prevalence (0-1 score from EF EPI or Wikidata)
  englishLevel    Float?   @map("english_level") @db.Real

  // Flags
  isCoastal       Boolean  @default(false) @map("is_coastal")
  isIsland         Boolean  @default(false) @map("is_island")
  isCapital       Boolean  @default(false) @map("is_capital")

  // Connectivity
  airportIata     String?  @map("airport_iata") @db.VarChar(8)
  airportName     String?  @map("airport_name") @db.VarChar(200)

  // Raw metadata (overflow / source-specific)
  metadata        Json?    @db.JsonB

  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  country         Country          @relation(fields: [countryId], references: [id])
  metrics         CityMetric[]
  monthlyMetrics  CityMonthlyMetric[]
  venues          DestinationVenue[] @relation(fields: [slug], references: [slug])
  embeddings      CityEmbedding[]

  @@index([countryId])
  @@index([latitude, longitude])
  @@index([nameEn])
  @@map("cities")
}
```

### 2.3 CityMetric — domain-level composite scores (point-in-time snapshots)

```prisma
model CityMetric {
  id        String   @id @default(uuid())
  cityId    String   @map("city_id")
  domain    String   @db.VarChar(30)   // "safety"|"health"|"budget"|"nature"|"culture"|"logistics"|"crowds"
  score     Float    @db.Real          // 0-100 normalized composite
  raw       Json?    @db.JsonB         // source-specific raw values
  modelVer  String?  @map("model_ver") @db.VarChar(20)
  computedAt DateTime @default(now()) @map("computed_at")

  city      City @relation(fields: [cityId], references: [id], onDelete: Cascade)

  @@unique([cityId, domain, modelVer])
  @@index([domain, score])
  @@map("city_metrics")
}
```

### 2.4 CityMonthlyMetric — 12-month resolution for every metric

```prisma
model CityMonthlyMetric {
  id        String   @id @default(uuid())
  cityId    String   @map("city_id")
  month     SmallInt @db.SmallInt       // 1-12
  domain    String   @db.VarChar(30)    // same domains as CityMetric
  metric    String   @db.VarChar(60)    // "temp_avg", "rainfall_mm", "budget_daily_eur", ...
  value     Float    @db.Real           // raw value
  normalized Float?  @db.Real           // 0-100 after normalization
  source    String?  @db.VarChar(50)    // "open-meteo", "numbeo", "wdpa", ...
  computedAt DateTime @default(now()) @map("computed_at")

  city      City @relation(fields: [cityId], references: [id], onDelete: Cascade)

  @@unique([cityId, month, domain, metric])
  @@index([domain, metric, month])
  @@map("city_monthly_metrics")
}
```

### 2.5 CityEmbedding — precomputed preference vectors

```prisma
model CityEmbedding {
  id        String   @id @default(uuid())
  cityId    String   @map("city_id")
  modelVer  String   @map("model_ver") @db.VarChar(20)
  vector    Json     @db.JsonB          // float[] of dimension 64-128
  tags      Json?    @db.JsonB          // ["beach","culture","budget",...]
  computedAt DateTime @default(now()) @map("computed_at")

  city      City @relation(fields: [cityId], references: [id], onDelete: Cascade)

  @@unique([cityId, modelVer])
  @@index([modelVer])
  @@map("city_embeddings")
}
```

### 2.6 UserTravelProfile — extends existing UserPreference

```prisma
model UserTravelProfile {
  id              String   @id @default(uuid())
  userId          String   @unique @map("user_id")

  // Hard filters
  passportCountry String?  @map("passport_country") @db.VarChar(2)  // ISO2
  budgetCeiling   Decimal? @map("budget_ceiling") @db.Decimal(8, 2) // max daily EUR
  travelDates     Json?    @map("travel_dates") @db.JsonB  // {from:"2026-06-01",to:"2026-08-31"}
  accessibility   Json?    @db.JsonB  // {wheelchair:false,visual:false,hearing:false}
  dietaryNeeds    Json?    @map("dietary_needs") @db.JsonB  // ["vegan","halal"]
  preferredClimate Json?   @map("preferred_climate") @db.JsonB  // {tempMin:18,tempMax:30,rainMax:80}
  
  // Activity/vibe preferences (weighted 0-1)
  activityWeights Json?    @map("activity_weights") @db.JsonB  // {beach:0.8,museum:0.3,nightlife:0.1,...}
  vibeWeights     Json?    @map("vibe_weights") @db.JsonB      // {quiet:0.2,bustling:0.7,family:0.5,...}
  
  // Computed
  preferenceVector Json?   @map("preference_vector") @db.JsonB  // float[] for cosine similarity
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("user_travel_profiles")
}
```

---

## 3. Data Sourcing Plan

### 3.1 Identity Domain

| Attribute | Source | Format | Coverage | Update |
|---|---|---|---|---|
| City IDs, coords, population, elevation, timezone | **GeoNames** dump | TSV (11MB) | 120K cities | Monthly |
| Wikidata ID, UNESCO, airport, languages, currency | **Wikidata SPARQL** | JSON | Global | Weekly |
| English proficiency | **EF EPI** (free report) | CSV | 115 countries | Annual |
| Plug types, driving side | **Wikidata** SPARQL | JSON | Global | Weekly |
| OSM node ID | **Overpass API** | JSON | Global | On-demand |

**Pipeline**: `fetch-identity.mjs` — GeoNames dump → CSV → DuckDB → upsert `cities` table. Wikidata SPARQL queries for enrichment.

### 3.2 Cost Domain

| Attribute | Source | Format | Coverage | Update |
|---|---|---|---|---|
| Cost-of-living index | **Numbeo** (scrape, free tier) | CSV | 5K cities | Monthly |
| Budget tiers (hostel/mid/luxury) | **Numbeo** + **Booking.com** public | JSON | 5K cities | Monthly |
| Meal prices | **Numbeo** restaurant index | CSV | 5K cities | Monthly |
| Transport costs | **Numbeo** + local transit APIs | JSON | 2K cities | Monthly |
| Monthly price seasonality | **Numbeo** historical + **Open-Meteo** tourism | JSON | 2K cities | Monthly |
| COL index by country | **OECD** + **World Bank** | CSV | 200 countries | Quarterly |

**Existing**: `col_cities`, `col_country_indices` — data migrates to `CityMonthlyMetric`.
**Pipeline**: `fetch-costs.mjs` — Numbeo scrape → DuckDB → `CityMonthlyMetric` rows for months 1-12.

### 3.3 Climate Domain

| Attribute | Source | Format | Coverage | Update |
|---|---|---|---|---|
| 12-month temp, rain, humidity, wind | **Open-Meteo Historical API** (free, no key) | JSON | Global | Monthly |
| Sea temperature | **Open-Meteo Marine API** (free) | JSON | Coastal | Monthly |
| UV index | **Open-Meteo** | JSON | Global | Monthly |
| Hurricane/monsoon seasons | **Wikidata** + **WMO** calendars | JSON | Regional | Annual |
| Avalanche risk | **EAWS** (European Avalanche) | JSON | Alps + selected | Seasonal |
| Wildfire season | **NASA FIRMS** (free archive) | CSV | Global | Monthly |
| Mosquito risk | **Malaria Atlas Project** (free) | GeoTIFF | Tropics | Annual |

**Pipeline**: `fetch-climate.mjs` — Open-Meteo batch requests per city coordinates → 12-month arrays → `CityMonthlyMetric`.

### 3.4 Nature Domain

| Attribute | Source | Format | Coverage | Update |
|---|---|---|---|---|
| Protected areas | **WDPA** (UNEP-WCMC) | CSV/Shapefile | 280K sites | Annual |
| Trails | **OpenStreetMap** (Overpass: `highway=path`) | JSON | Global | Quarterly |
| Beaches | **OpenStreetMap** (`natural=beach`) + **OpenDiveMap** | JSON | Coastal | Quarterly |
| Water quality | **EEA** (European) + **OSM** tags | JSON | Europe + OSM | Annual |
| Dive spots | **OpenDiveMap** (3K sites, ODbL) | JSON | Global coastal | Annual |
| Surf spots | **Wikidata** + **OSM** (`sport=surfing`) | JSON | Global coastal | Quarterly |
| Ski resorts | **Wikidata** + **OSM** (`sport=skiing`) | JSON | Mountainous | Annual |
| Wildlife calendars | **iNaturalist** + **eBird** API (free) | JSON | Global | Seasonal |
| Whale migration | **Happywhale** (free dataset) | CSV | Oceanic | Annual |
| Aurora forecast | **NOAA SWPC** (free) | JSON | High-latitude | Real-time (archive) |

**Pipeline**: `fetch-nature.mjs` — Overpass + WDPA + OpenDiveMap → per-city enrichment.

### 3.5 Culture Domain

| Attribute | Source | Format | Coverage | Update |
|---|---|---|---|---|
| UNESCO WH sites | **UNESCO** (free API) | JSON | 1,200 sites | Annual |
| Museums | **OpenStreetMap** (`tourism=museum`) | JSON | Global | Quarterly |
| Cuisine tags | **OSM** + **Wikidata** + existing Yelp/TripAdvisor | JSON | Global | Quarterly |
| Festivals | **Wikidata** + **OpenHolidays API** (free) | JSON | Europe + global | Monthly |
| Public holidays | **OpenHolidays API** (free, no key) | JSON | 40+ countries | Annual |
| Nightlife density | **OSM** (`amenity=bar/nightclub`) per city | JSON | Global | Quarterly |
| Dress codes / LGBTQ+ safety | **Wikidata** + **ILGA** reports (free) | JSON | Global | Annual |
| Solo-female safety | **Women, Peace & Security Index** (free) | CSV | 177 countries | Annual |

**Pipeline**: `fetch-culture.mjs` — UNESCO API + Overpass + OpenHolidays → per-city.

### 3.6 Stays & Food Domain

| Attribute | Source | Format | Coverage | Update |
|---|---|---|---|---|
| Hotel density + price bands | **OSM** (`tourism=hotel/hostel`) + **Wikidata** | JSON | Global | Quarterly |
| Restaurant density | **OSM** (`amenity=restaurant`) | JSON | Global | Quarterly |
| Dietary availability | **OSM** tags + **HappyCow** (free scrape) | JSON | Major cities | Quarterly |
| Venue data | **Existing**: `destination_venues` table | DB | 142K venues | Already built |

**Pipeline**: `fetch-stays-food.mjs` — Overpass density counts + existing venue data.

### 3.7 Mobility Domain

| Attribute | Source | Format | Coverage | Update |
|---|---|---|---|---|
| Direct-flight connectivity | **OpenFlights** routes + **OurAirports** | CSV | 60K routes | Quarterly |
| Car rental availability + avg price | **OpenStreetMap** + **Wikidata** | JSON | Global | Quarterly |
| Transit quality | **Transitland** (free GTFS index) | JSON | 2K cities | Quarterly |
| Road safety | **WHO Global Status Report** (free) | CSV | 180 countries | Annual |
| Walkability | **OpenStreetMap** foot infrastructure + POI density | JSON | Global | Quarterly |

**Pipeline**: `fetch-mobility.mjs` — OpenFlights + OurAirports + Transitland.

### 3.8 Cruise Domain

| Attribute | Source | Format | Coverage | Update |
|---|---|---|---|---|
| Port presence (river/ocean) | **OpenStreetMap** (`waterway=river_port`, `leisure=marina`) + **Wikidata** | JSON | Global | Annual |
| Call season | **Cruise port Wikipedia** + **Wikidata** | JSON | Major ports | Annual |
| Port-day crowding | **OSM** POI density around port coordinates | JSON | Major ports | Annual |

**Note**: No free cruise schedule API exists. Port presence and seasonal patterns derived from OSM/Wikidata静态 data.

**Pipeline**: `fetch-cruises.mjs` — Overpass port queries + Wikidata.

### 3.9 Safety & Health Domain

| Attribute | Source | Format | Coverage | Update |
|---|---|---|---|---|
| Gov travel advisories | **US State Dept** + **UK FCDO** + **Canada** (free feeds) | JSON | Global | Weekly |
| Crime stats | **UNODC** (free) + **Numbeo Safety Index** | CSV | 300+ cities | Annual |
| Terrorism index | **Global Terrorism Database** (free) | CSV | Global | Annual |
| Natural hazard history | **EM-DAT** (free) | CSV | Global | Annual |
| Shark incidents | **ISAF** (free) + **Global Shark Attack File** | CSV | Global coastal | Annual |
| Jellyfish risk | **Wikipedia** + **OBIS** (free) | JSON | Coastal | Annual |
| Tap water safety | **WHO** + **OSM** (`amenity=drinking_water`) | JSON | Global | Annual |
| Air quality | **Open-Meteo Air Quality API** (free) | JSON | Global | Monthly |
| Disease/vaccination | **WHO** + **CDC** (free travel health pages) | JSON | Global | Quarterly |
| Hospitals per capita | **OSM** (`amenity=hospital`) density | JSON | Global | Quarterly |
| Pharmacies per capita | **OSM** (`amenity=pharmacy`) density | JSON | Global | Quarterly |

**Pipeline**: `fetch-safety-health.mjs` — Multi-source aggregation + normalization.

---

## 4. Normalization & Composite Scoring

### 4.1 Normalization (per metric, per month)

```typescript
// Min-max within the metric's global distribution
function normalize(value: number, metricMin: number, metricMax: number): number {
  if (metricMax === metricMin) return 50;
  return ((value - metricMin) / (metricMax - metricMin)) * 100;
}

// Direction-aware: some metrics are "lower is better" (crime, cost)
// inversion flag per metric
const INVERT_METRICS = new Set([
  'crime_rate', 'cost_daily', 'rainfall_mm', 'hazard_risk',
  'crowding_index', 'pollution_aqi', 'disease_risk'
]);
```

### 4.2 Composite Domains

Each composite is a weighted sum of its constituent normalized metrics:

| Domain | Components | Default Weights |
|---|---|---|
| **Safety** | crime_rate, terrorism, gov_advisory, natural_hazard, wildlife_incidents | 0.30, 0.20, 0.25, 0.15, 0.10 |
| **Health** | hospitals_pc, pharmacies_pc, tap_water, air_quality, disease_risk, vaccination | 0.15, 0.10, 0.20, 0.20, 0.20, 0.15 |
| **Budget** | cost_daily, lodging_price, meal_price, transport_price, activity_price | 0.25, 0.25, 0.20, 0.15, 0.15 |
| **Nature** | protected_areas, trails, beaches, dive_spots, surf_spots, ski_spots, wildlife | 0.15, 0.15, 0.15, 0.10, 0.10, 0.10, 0.25 |
| **Culture** | unesco, museums, cuisine_diversity, festivals, nightlife, lgbtq_safety | 0.20, 0.15, 0.20, 0.15, 0.15, 0.15 |
| **Logistics** | flight_connectivity, car_rental, transit_quality, walkability, road_safety | 0.25, 0.15, 0.25, 0.20, 0.15 |
| **Crowds** | tourist_density, hotel_occupancy, peak_season_penalty | 0.40, 0.30, 0.30 |

Weights are configurable per user via `UserTravelProfile.activityWeights`.

### 4.3 "Best Time to Visit" Computation

```
For each month m (1-12):
  composite(m) = Σ domain_weight × domain_composite(m)
  value(m) = composite(m) / cost_normalized(m)  // quality per euro

bestMonth = argmax composite(m)
bestValueMonth = argmax value(m)
avoidMonth = argmin composite(m)
```

---

## 5. Matching Algorithm

### 5.1 Hard Filters (eliminate before scoring)

```typescript
interface HardFilters {
  passport: string;           // ISO2 — check visa requirements
  budgetCeiling: number;      // max daily EUR
  travelDates: { from: string; to: string };  // availability check
  accessibility?: { wheelchair: boolean };
  dietaryNeeds?: string[];    // must have availability
  climate?: { tempMin: number; tempMax: number; rainMax: number };
}

function passesHardFilters(city: City, filters: HardFilters): boolean {
  // 1. Visa check
  const visaReq = city.country.visaRequired?.[filters.passport];
  if (visaReq === 'visa-required') return false;
  
  // 2. Budget ceiling (check cheapest month in travel dates)
  const months = getMonthsInRange(filters.travelDates);
  const minCost = Math.min(...months.map(m => city.monthlyCost(m)));
  if (minCost > filters.budgetCeiling) return false;
  
  // 3. Climate fit
  if (filters.climate) {
    const avgTemp = avgOfMonthly(city.metrics, 'temp_avg', months);
    if (avgTemp < filters.climate.tempMin || avgTemp > filters.climate.tempMax) return false;
  }
  
  // 4. Accessibility
  if (filters.accessibility?.wheelchair && !city.metadata?.wheelchairAccessible) return false;
  
  // 5. Dietary
  if (filters.dietaryNeeds?.length) {
    const available = filters.dietaryNeeds.every(d => city.hasDietaryOption(d));
    if (!available) return false;
  }
  
  return true;
}
```

### 5.2 Weighted Similarity (soft scoring)

```typescript
function computeScore(city: City, profile: UserTravelProfile): number {
  const weights = profile.activityWeights ?? DEFAULT_WEIGHTS;
  const months = getMonthsInRange(profile.travelDates);
  
  // Activity/vibe vector similarity (cosine)
  const cityVector = city.embedding.vector;  // precomputed
  const userVector = profile.preferenceVector;  // from quiz/behavior
  const similarity = cosineSimilarity(cityVector, userVector);
  
  // Domain composites averaged over travel months
  const domainScores = DOMAINS.map(d => ({
    domain: d,
    score: avgOfMonthly(city.monthlyMetrics, d, months),
    weight: weights[d] ?? 1.0,
  }));
  
  const weightedDomain = domainScores.reduce(
    (sum, d) => sum + d.score * d.weight, 0
  ) / domainScores.reduce((sum, d) => sum + d.weight, 0);
  
  // Final: 60% activity match + 40% domain fit
  return 0.6 * similarity * 100 + 0.4 * weightedDomain;
}
```

### 5.3 Per-User Recomputation

- Scores are NEVER stored as a single number on the city
- `CityMetric` stores domain composites (reusable)
- `CityMonthlyMetric` stores monthly values (reusable)
- `CityEmbedding` stores city preference vector (reusable)
- **Final score = computed at query time** from user profile + city metrics
- Cache: store per-user top-N results in `UserTravelProfile.preferenceVector` hash for 24h

---

## 6. Data Pipeline Architecture

### Pipeline Scripts (in `tools/data-pipeline/scripts/`)

```
fetch-identity.mjs          → cities table (GeoNames + Wikidata)
fetch-costs.mjs             → CityMonthlyMetric (Numbeo + OECD)
fetch-climate.mjs           → CityMonthlyMetric (Open-Meteo)
fetch-nature.mjs            → CityMonthlyMetric + metadata (OSM + WDPA)
fetch-culture.mjs           → CityMonthlyMetric + metadata (UNESCO + Overpass)
fetch-stays-food.mjs        → CityMonthlyMetric + metadata (OSM + existing venues)
fetch-mobility.mjs          → CityMonthlyMetric (OpenFlights + Transitland)
fetch-cruises.mjs           → CityMonthlyMetric + metadata (OSM + Wikidata)
fetch-safety-health.mjs     → CityMonthlyMetric (multi-source)

compute-composites.mjs      → CityMetric (weighted sums from CityMonthlyMetric)
compute-embeddings.mjs      → CityEmbedding (ML service)
compute-normalization.mjs   → normalizes all CityMonthlyMetric rows
```

### npm Scripts

```json
"intel:fetch:all": "npm run intel:fetch:identity && npm run intel:fetch:costs && npm run intel:fetch:climate && npm run intel:fetch:nature && npm run intel:fetch:culture && npm run intel:fetch:stays-food && npm run intel:fetch:mobility && npm run intel:fetch:cruises && npm run intel:fetch:safety-health",
"intel:compute": "npm run intel:compute:normalize && npm run intel:compute:composites && npm run intel:compute:embeddings",
"intel:full": "npm run intel:fetch:all && npm run intel:compute"
```

### Schedule

| Pipeline | Frequency | Duration (est.) |
|---|---|---|
| `fetch-identity` | Monthly | ~5 min (GeoNames dump is 11MB) |
| `fetch-costs` | Monthly | ~30 min (Numbeo rate limits) |
| `fetch-climate` | Monthly | ~15 min (Open-Meteo batch) |
| `fetch-nature` | Quarterly | ~45 min (Overpass heavy) |
| `fetch-culture` | Monthly | ~20 min (Overpass + APIs) |
| `fetch-stays-food` | Quarterly | ~30 min (Overpass density) |
| `fetch-mobility` | Quarterly | ~10 min (static datasets) |
| `fetch-cruises` | Annual | ~5 min (small dataset) |
| `fetch-safety-health` | Monthly | ~20 min (multi-source) |
| `compute-*` | After fetch | ~5 min (DuckDB batch) |

---

## 7. Migration Path from Existing Data

| Current | Target | Action |
|---|---|---|
| `col_cities.indices` (JSON) | `CityMonthlyMetric` rows | Extract monthly values, create 12 rows per metric |
| `col_country_indices` | `Country` fields or `CityMonthlyMetric` | Migrate to country-level metrics |
| `wv_destinations.climaTempo` (JSON) | `CityMonthlyMetric` climate rows | Parse and distribute to monthly rows |
| `wv_destinations.custoDeVida` (JSON) | `CityMonthlyMetric` cost rows | Parse and distribute |
| `destination_venues` | Stays as-is | FK updated to link via `City.slug` |
| `UserProfile.travelFrequency` | `UserTravelProfile` fields | Migrate preferences |
| `UserPreference.favoriteActivities` | `UserTravelProfile.activityWeights` | Convert to weighted map |
| `EmbeddingCache` | `CityEmbedding` | New table, old cache stays for ML |

---

## 8. Query Patterns

### "Recommend destinations for me"

```sql
-- 1. Hard filter
WITH filtered AS (
  SELECT c.* FROM cities c
  JOIN countries co ON co.id = c.countryId
  WHERE NOT (co.visa_required->>$1 = 'visa-required')
    AND EXISTS (
      SELECT 1 FROM city_monthly_metrics m
      WHERE m.cityId = c.id AND m.metric = 'cost_daily'
        AND m.month = ANY($2)  -- travel months
        AND m.value <= $3      -- budget ceiling
    )
),
-- 2. Domain composites for travel months
scored AS (
  SELECT f.*,
    AVG(CASE WHEN m.domain = 'safety' THEN m.normalized END) AS safety,
    AVG(CASE WHEN m.domain = 'budget' THEN m.normalized END) AS budget,
    AVG(CASE WHEN m.domain = 'nature' THEN m.normalized END) AS nature,
    AVG(CASE WHEN m.domain = 'culture' THEN m.normalized END) AS culture,
    AVG(CASE WHEN m.domain = 'logistics' THEN m.normalized END) AS logistics
  FROM filtered f
  JOIN city_monthly_metrics m ON m.cityId = f.id AND m.month = ANY($2)
  GROUP BY f.id
)
-- 3. Weighted score
SELECT *,
  ($4*safety + $5*budget + $6*nature + $7*culture + $8*logistics) AS final_score
FROM scored
ORDER BY final_score DESC
LIMIT 20;
```

### "Best time to visit Lisbon"

```sql
SELECT month, normalized AS score
FROM city_monthly_metrics
WHERE cityId = (SELECT id FROM cities WHERE slug = 'lisboa')
  AND domain = 'nature'
ORDER BY month;
```

### "Cheapest month for beach destination in Europe"

```sql
SELECT c.nameEn, m.month, m.value AS cost
FROM cities c
JOIN city_monthly_metrics m ON m.cityId = c.id
WHERE c.isCoastal = true
  AND c.countryId IN (SELECT id FROM countries WHERE continent = 'Europe')
  AND m.metric = 'cost_daily'
  AND m.month IN (6,7,8)  -- summer
ORDER BY m.value ASC
LIMIT 10;
```

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

- [ ] Create Prisma migration for new models
- [ ] Build `fetch-identity.mjs` (GeoNames + Wikidata)
- [ ] Seed 5K+ cities with basic identity data
- [ ] Update `destination_venues` FK to link via `City.slug`

### Phase 2: Core Metrics (Week 3-4)

- [ ] Build `fetch-climate.mjs` (Open-Meteo — fastest ROI)
- [ ] Build `fetch-costs.mjs` (Numbeo — existing COL data migration)
- [ ] Build `compute-normalization.mjs` + `compute-composites.mjs`
- [ ] Verify 12-month vectors for 1K top cities

### Phase 3: Rich Domains (Week 5-6)

- [ ] Build `fetch-nature.mjs` (Overpass + WDPA)
- [ ] Build `fetch-culture.mjs` (UNESCO + Overpass + OpenHolidays)
- [ ] Build `fetch-safety-health.mjs` (multi-source)
- [ ] Build `fetch-stays-food.mjs` (Overpass density)

### Phase 4: Mobility & Cruises (Week 7)

- [ ] Build `fetch-mobility.mjs` (OpenFlights + Transitland)
- [ ] Build `fetch-cruises.mjs` (OSM ports)

### Phase 5: Matching Engine (Week 8)

- [ ] Extend `UserTravelProfile` with hard-filter fields
- [ ] Build preference vector computation
- [ ] Implement cosine similarity matching
- [ ] Wire into existing ML service `/v1/travel/rank` endpoint

### Phase 6: UI Integration (Week 9-10)

- [ ] Preferences page: passport, budget, dates, activities, climate
- [ ] Results page: ranked destinations with domain scores + "best month"
- [ ] Destination detail: 12-month charts, safety breakdown, cost comparison

---

## See Also

- [SCHEMA_MIGRATION_PLAN.md](./SCHEMA_MIGRATION_PLAN.md) — migration plan to reach this target schema
- [SCHEMA_REFACTORING_PHASE2.md](./SCHEMA_REFACTORING_PHASE2.md) — phase 2 refactoring aligned with this design
- [TRAVEL_CATALOG_API.md](./TRAVEL_CATALOG_API.md) — API layer built on this schema
- [CULTURAL_DATA_ARCHITECTURE.md](./CULTURAL_DATA_ARCHITECTURE.md) — cultural data models feeding into this schema
- [DATA_COMPLIANCE.md](./DATA_COMPLIANCE.md) — data source licenses for all sources in this schema
- [Documentation Index](./README.md)
