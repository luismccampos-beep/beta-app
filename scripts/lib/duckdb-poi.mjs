/**
 * DuckDB helper for querying Overture Maps (GeoParquet on S3) and
 * local Geofabrik .osm.pbf files for hospitals, police & cultural POIs.
 *
 * Usage:
 *   import { queryOverturePois, queryPbfPois, createDuckdb } from './lib/duckdb-poi.mjs';
 *
 *   // Query Overture Maps directly from S3 (no download needed)
 *   const pois = await queryOverturePois({ lat: 38.7, lon: -9.1, radiusKm: 5 });
 *
 *   // Query a local Geofabrik PBF file
 *   const pois2 = await queryPbfPois({ pbfPath: './data/portugal.osm.pbf', lat: 38.7, lon: -9.1, radiusKm: 5 });
 */

import duckdb from 'duckdb';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// ── POI category definitions ──────────────────────────────────────────────────

/** Overture Maps category taxonomy values for our target POIs */
export const OVERTURE_CATEGORIES = {
  hospital: ['hospital', 'clinic'],
  police: ['police'],
  cultural: [
    'museum', 'art_gallery', 'library', 'theater', 'cinema',
    'heritage', 'monument', 'archaeological_site',
  ],
};

/** OSM tags that map to our POI groups (for PBF / ST_ReadOSM queries) */
export const OSM_POI_TYPES = [
  // Hospitals
  { tag: 'amenity', value: 'hospital', group: 'hospital' },
  { tag: 'amenity', value: 'clinic', group: 'hospital' },
  { tag: 'amenity', value: 'doctors', group: 'hospital' },
  { tag: 'healthcare', value: 'hospital', group: 'hospital' },
  // Police
  { tag: 'amenity', value: 'police', group: 'police' },
  // Cultural
  { tag: 'tourism', value: 'museum', group: 'cultural' },
  { tag: 'tourism', value: 'artwork', group: 'cultural' },
  { tag: 'tourism', value: 'attraction', group: 'cultural' },
  { tag: 'amenity', value: 'arts_centre', group: 'cultural' },
  { tag: 'amenity', value: 'theatre', group: 'cultural' },
  { tag: 'amenity', value: 'cinema', group: 'cultural' },
  { tag: 'amenity', value: 'library', group: 'cultural' },
  { tag: 'historic', value: 'castle', group: 'cultural' },
  { tag: 'historic', value: 'monument', group: 'cultural' },
  { tag: 'historic', value: 'archaeological_site', group: 'cultural' },
  { tag: 'historic', value: 'ruins', group: 'cultural' },
];

// ── DuckDB lifecycle ──────────────────────────────────────────────────────────

/** Promisified wrapper around duckdb Connection.all() */
function all(conn, sql) {
  return new Promise((resolve, reject) => {
    conn.all(sql, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

/**
 * Create an in-memory DuckDB instance with spatial + httpfs extensions loaded.
 * Call `db.close()` when done.
 *
 * @returns {{ db: duckdb.Database, conn: duckdb.Connection, query: (sql: string) => Promise<any[]> }}
 */
export function createDuckdb() {
  const db = new duckdb.Database(':memory:');
  const conn = db.connect();

  const query = (sql) => all(conn, sql);

  // Extensions are loaded lazily (first query triggers installation)
  return { db, conn, query };
}

/**
 * Ensure spatial + httpfs extensions are installed and loaded.
 * Must be called before any spatial or S3 queries.
 */
export async function ensureExtensions(query) {
  await query('INSTALL httpfs; LOAD httpfs;');
  await query('INSTALL spatial; LOAD spatial;');
  await query("SET s3_region = 'us-west-2';");
}

// ── Haversine distance helper (SQL) ───────────────────────────────────────────

/**
 * SQL fragment: haversine distance in km between two lon/lat points.
 * Usage in queries: ST_Distance_Sphere(geom, ST_Point(lon, lat)) / 1000.0
 */

/** Validate a category name to prevent SQL injection (alphanumeric + underscore only). */
function safeCategory(c) {
  if (!/^[a-zA-Z0-9_]+$/.test(c)) throw new Error(`Invalid category name: ${c}`);
  return c;
}

/** Validate an Overture release string (YYYY-MM-DD.N format). */
function safeRelease(r) {
  if (!/^\d{4}-\d{2}-\d{2}\.(\d+|nightly)$/.test(r)) throw new Error(`Invalid release format: ${r}`);
  return r;
}

// ── Overture Maps queries ─────────────────────────────────────────────────────

const OVERTURE_S3_BASE = 's3://overturemaps-us-west-2/release';

/**
 * Query Overture Maps GeoParquet directly from S3 for POIs near a coordinate.
 *
 * @param {Object} opts
 * @param {number} opts.lat - Center latitude
 * @param {number} opts.lon - Center longitude
 * @param {number} [opts.radiusKm=5] - Search radius in km
 * @param {string[]} [opts.categories] - Overture category values to filter (e.g. ['hospital'])
 * @param {number} [opts.limit=30] - Max results per query
 * @param {string} [opts.release] - Overture release date (e.g. '2024-06-13.0')
 * @param {duckdb.Connection} [opts.conn] - Existing DuckDB connection (creates one if not provided)
 * @returns {Promise<Array<{id: string, name: string, category: string, lat: number, lon: number, distanceKm: number}>>}
 */
export async function queryOverturePois({
  lat, lon, radiusKm = 5, categories, limit = 30, release, conn,
}) {
  if (lat == null || lon == null) throw new Error('lat and lon are required');

  const createdDb = !conn;
  let db, query;
  if (createdDb) {
    ({ db, conn, query } = createDuckdb());
    await ensureExtensions(query);
  } else {
    query = (sql) => all(conn, sql);
  }

  try {
    const whereCategory = categories?.length
      ? `AND categories.primary IN (${categories.map((c) => `'${safeCategory(c)}'`).join(',')})` 
      : '';

    // Overture stores coordinates as geometry; we compute haversine distance
    // to filter within radius. The S3 path uses wildcards for all parts.
    // Release format: full identifier like '2024-06-13.0' or just date '2024-06-13'
    const releaseId = release ? safeRelease(release) : '2026-06-17.0';
    const s3Path = `${OVERTURE_S3_BASE}/${releaseId}/theme=places/type=place/*`;

    // Bounding box pre-filter using Overture bbox columns for predicate pushdown
    const latDelta = radiusKm / 111.0;
    const lonDelta = radiusKm / (111.0 * Math.cos((lat * Math.PI) / 180));
    const minLon = lon - lonDelta;
    const maxLon = lon + lonDelta;
    const minLat = lat - latDelta;
    const maxLat = lat + latDelta;

    const sql = `
      WITH bbox_pois AS (
        SELECT
          id,
          COALESCE(names.primary, 'Unknown') AS name,
          categories.primary AS category,
          ST_Y(geometry::geometry) AS lat,
          ST_X(geometry::geometry) AS lon,
          geometry::geometry AS geom
        FROM read_parquet('${s3Path}', hive_partitioning=true)
        WHERE geometry IS NOT NULL
          AND bbox.xmax >= ${minLon} AND bbox.xmin <= ${maxLon}
          AND bbox.ymax >= ${minLat} AND bbox.ymin <= ${maxLat}
          ${whereCategory}
      ),
      filtered AS (
        SELECT
          *,
          ST_Distance_Sphere(geom, ST_Point(${lon}, ${lat})) / 1000.0 AS distance_km
        FROM bbox_pois
      )
      SELECT *
      FROM filtered
      WHERE distance_km <= ${radiusKm}
      ORDER BY distance_km ASC
      LIMIT ${limit};
    `;

    const rows = await query(sql);
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      lat: r.lat,
      lon: r.lon,
      distanceKm: Math.round(r.distance_km * 100) / 100,
      source: 'overture',
    }));
  } finally {
    if (createdDb) db.close();
  }
}

/**
 * Query Overture Maps for multiple destinations at once (batch).
 * Groups all categories into a single query for efficiency.
 *
 * @param {Array<{lat: number, lon: number, id?: string}>} destinations
 * @param {Object} opts
 * @param {number} [opts.radiusKm=5]
 * @param {string[]} [opts.categories] - Overture category values
 * @param {number} [opts.limit=30] - Max results per destination
 * @param {string} [opts.release]
 * @returns {Promise<Map<string, Array>>} Map of destId → POI array
 */
export async function queryOverturePoisBatch(destinations, opts = {}) {
  const { db, conn, query } = createDuckdb();
  await ensureExtensions(query);

  try {
    const { radiusKm = 5, categories, limit = 30, release } = opts;

    const whereCategory = categories?.length
      ? `AND categories.primary IN (${categories.map((c) => `'${safeCategory(c)}'`).join(',')})` 
      : '';

    // Release format: full identifier like '2024-06-13.0' or just date '2024-06-13'
    const releaseId = release ? safeRelease(release) : '2026-06-17.0';
    const s3Path = `${OVERTURE_S3_BASE}/${releaseId}/theme=places/type=place/*`;

    // Build a destinations table in DuckDB
    const destValues = destinations
      .map((d, i) => `(${i}, ${d.lat}, ${d.lon}, '${String(d.id ?? `dest_${i}`).replace(/'/g, "''")}')`)
      .join(',');

    await query(`
      CREATE TABLE destinations (
        idx INTEGER, lat DOUBLE, lon DOUBLE, dest_id VARCHAR
      );
      INSERT INTO destinations VALUES ${destValues};
    `);

    // Compute global bounding box across all destinations for pre-filtering
    const allLats = destinations.map((d) => d.lat);
    const allLons = destinations.map((d) => d.lon);
    const minLat = Math.min(...allLats) - radiusKm / 111.0;
    const maxLat = Math.max(...allLats) + radiusKm / 111.0;
    const centerLat = (Math.min(...allLats) + Math.max(...allLats)) / 2;
    const cosLat = Math.cos((centerLat * Math.PI) / 180);
    const minLon = Math.min(...allLons) - radiusKm / (111.0 * (cosLat || 1));
    const maxLon = Math.max(...allLons) + radiusKm / (111.0 * (cosLat || 1));

    // Single spatial join with bounding box pre-filter
    const sql = `
      WITH overture AS (
        SELECT
          id,
          COALESCE(names.primary, 'Unknown') AS name,
          categories.primary AS category,
          ST_Y(geometry::geometry) AS poi_lat,
          ST_X(geometry::geometry) AS poi_lon,
          geometry::geometry AS geom
        FROM read_parquet('${s3Path}', hive_partitioning=true)
        WHERE geometry IS NOT NULL
          AND bbox.xmax >= ${minLon} AND bbox.xmin <= ${maxLon}
          AND bbox.ymax >= ${minLat} AND bbox.ymin <= ${maxLat}
          ${whereCategory}
      )
      SELECT
        d.dest_id,
        o.id,
        o.name,
        o.category,
        o.poi_lat AS lat,
        o.poi_lon AS lon,
        ST_Distance_Sphere(o.geom, ST_Point(d.lon, d.lat)) / 1000.0 AS distance_km
      FROM destinations d
      JOIN overture o ON ST_Distance_Sphere(o.geom, ST_Point(d.lon, d.lat)) <= ${radiusKm * 1000}
      ORDER BY d.dest_id, distance_km ASC;
    `;

    const rows = await query(sql);

    // Group by dest_id (ensure all keys are strings to match DuckDB VARCHAR output)
    const result = new Map();
    for (const d of destinations) {
      result.set(String(d.id ?? `dest_${destinations.indexOf(d)}`), []);
    }

    // Track counts per dest for limit enforcement
    const counts = new Map();
    for (const r of rows) {
      const destId = String(r.dest_id);
      const cur = counts.get(destId) || 0;
      if (cur >= limit) continue;
      counts.set(destId, cur + 1);

      const list = result.get(destId) || [];
      list.push({
        id: r.id,
        name: r.name,
        category: r.category,
        lat: r.lat,
        lon: r.lon,
        distanceKm: Math.round(r.distance_km * 100) / 100,
        source: 'overture',
      });
      result.set(destId, list);
    }

    return result;
  } finally {
    db.close();
  }
}

// ── Geofabrik PBF queries ────────────────────────────────────────────────────

/**
 * Query a local .osm.pbf file (Geofabrik extract) for POIs near a coordinate.
 * Uses DuckDB's ST_ReadOSM() to read the PBF directly without import.
 *
 * @param {Object} opts
 * @param {string} opts.pbfPath - Path to .osm.pbf file
 * @param {number} opts.lat - Center latitude
 * @param {number} opts.lon - Center longitude
 * @param {number} [opts.radiusKm=5] - Search radius in km
 * @param {string[]} [opts.groups] - POI groups to include: 'hospital', 'police', 'cultural'
 * @param {number} [opts.limit=30] - Max results
 * @returns {Promise<Array>}
 */
export async function queryPbfPois({
  pbfPath, lat, lon, radiusKm = 5, groups, limit = 30,
}) {
  if (!existsSync(pbfPath)) throw new Error(`PBF file not found: ${pbfPath}`);
  if (lat == null || lon == null) throw new Error('lat and lon are required');

  const { db, query } = createDuckdb();
  await ensureExtensions(query);

  try {
    const absPath = resolve(pbfPath);

    // Build WHERE clause for OSM tag filtering
    const filteredTypes = groups?.length
      ? OSM_POI_TYPES.filter((t) => groups.includes(t.group))
      : OSM_POI_TYPES;

    const tagConditions = filteredTypes
      .map((t) => `(tags['${t.tag}'] = '${t.value}')`)
      .join(' OR ');

    // Approximate bounding box filter (fast pre-filter before haversine)
    const latDelta = radiusKm / 111.0;
    const lonDelta = radiusKm / (111.0 * Math.cos((lat * Math.PI) / 180));

    const sql = `
      WITH nodes AS (
        SELECT
          id,
          tags,
          lat AS poi_lat,
          lon AS poi_lon
        FROM ST_ReadOSM('${absPath.replace(/\\/g, '\\\\')}')
        WHERE lat IS NOT NULL
          AND lon IS NOT NULL
          AND lat BETWEEN ${lat - latDelta} AND ${lat + latDelta}
          AND lon BETWEEN ${lon - lonDelta} AND ${lon + lonDelta}
          AND (${tagConditions})
      ),
      with_dist AS (
        SELECT
          *,
          ST_Distance_Sphere(
            ST_Point(poi_lon, poi_lat),
            ST_Point(${lon}, ${lat})
          ) / 1000.0 AS distance_km
        FROM nodes
      )
      SELECT
        'node/' || id AS osm_id,
        tags['name'] AS name,
        CASE
          ${filteredTypes.map((t) => `WHEN tags['${t.tag}'] = '${t.value}' THEN '${t.group}'`).join('\n          ')}
          ELSE 'other'
        END AS "group",
        CASE
          ${filteredTypes.map((t) => `WHEN tags['${t.tag}'] = '${t.value}' THEN '${t.value}'`).join('\n          ')}
          ELSE 'unknown'
        END AS type,
        poi_lat AS lat,
        poi_lon AS lon,
        distance_km
      FROM with_dist
      WHERE distance_km <= ${radiusKm}
      ORDER BY distance_km ASC
      LIMIT ${limit};
    `;

    const rows = await query(sql);
    return rows.map((r) => ({
      osm_id: r.osm_id,
      name: r.name || null,
      group: r.group,
      type: r.type,
      lat: r.lat,
      lon: r.lon,
      distanceKm: Math.round(r.distance_km * 100) / 100,
      source: 'osm_pbf',
    }));
  } finally {
    db.close();
  }
}

/**
 * Download a Geofabrik PBF extract if not already present.
 *
 * @param {string} url - Full Geofabrik URL
 * @param {string} destPath - Local path to save the file
 * @returns {Promise<string>} The local file path
 */
export async function downloadGeofabrikPbf(url, destPath) {
  if (existsSync(destPath)) return destPath;

  const dir = dirname(destPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);

  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(destPath, buf);
  return destPath;
}

// ── Geofabrik PBF batch queries ───────────────────────────────────────────

/**
 * Geofabrik extract URLs by country code.
 * Source: https://download.geofabrik.de/
 */
export const GEOFABRIK_URLS = {
  PT: 'https://download.geofabrik.de/europe/portugal-latest.osm.pbf',
  ES: 'https://download.geofabrik.de/europe/spain-latest.osm.pbf',
  FR: 'https://download.geofabrik.de/europe/france-latest.osm.pbf',
  DE: 'https://download.geofabrik.de/europe/germany-latest.osm.pbf',
  IT: 'https://download.geofabrik.de/europe/italy-latest.osm.pbf',
  GB: 'https://download.geofabrik.de/europe/great-britain-latest.osm.pbf',
  NL: 'https://download.geofabrik.de/europe/netherlands-latest.osm.pbf',
  BE: 'https://download.geofabrik.de/europe/belgium-latest.osm.pbf',
  CH: 'https://download.geofabrik.de/europe/switzerland-latest.osm.pbf',
  AT: 'https://download.geofabrik.de/europe/austria-latest.osm.pbf',
  PL: 'https://download.geofabrik.de/europe/poland-latest.osm.pbf',
  CZ: 'https://download.geofabrik.de/europe/czech-republic-latest.osm.pbf',
  GR: 'https://download.geofabrik.de/europe/greece-latest.osm.pbf',
  HR: 'https://download.geofabrik.de/europe/croatia-latest.osm.pbf',
  SE: 'https://download.geofabrik.de/europe/sweden-latest.osm.pbf',
  NO: 'https://download.geofabrik.de/europe/norway-latest.osm.pbf',
  DK: 'https://download.geofabrik.de/europe/denmark-latest.osm.pbf',
  FI: 'https://download.geofabrik.de/europe/finland-latest.osm.pbf',
  IE: 'https://download.geofabrik.de/europe/ireland-latest.osm.pbf',
  IS: 'https://download.geofabrik.de/europe/iceland-latest.osm.pbf',
  RO: 'https://download.geofabrik.de/europe/romania-latest.osm.pbf',
  HU: 'https://download.geofabrik.de/europe/hungary-latest.osm.pbf',
  BG: 'https://download.geofabrik.de/europe/bulgaria-latest.osm.pbf',
  RS: 'https://download.geofabrik.de/europe/serbia-latest.osm.pbf',
  UA: 'https://download.geofabrik.de/europe/ukraine-latest.osm.pbf',
  BR: 'https://download.geofabrik.de/south-america/brazil-latest.osm.pbf',
  AR: 'https://download.geofabrik.de/south-america/argentina-latest.osm.pbf',
  CL: 'https://download.geofabrik.de/south-america/chile-latest.osm.pbf',
  CO: 'https://download.geofabrik.de/south-america/colombia-latest.osm.pbf',
  PE: 'https://download.geofabrik.de/south-america/peru-latest.osm.pbf',
  MX: 'https://download.geofabrik.de/central-america/mexico-latest.osm.pbf',
  US: 'https://download.geofabrik.de/north-america/us-latest.osm.pbf',
  CA: 'https://download.geofabrik.de/north-america/canada-latest.osm.pbf',
  JP: 'https://download.geofabrik.de/asia/japan-latest.osm.pbf',
  KR: 'https://download.geofabrik.de/asia/south-korea-latest.osm.pbf',
  TH: 'https://download.geofabrik.de/asia/thailand-latest.osm.pbf',
  VN: 'https://download.geofabrik.de/asia/vietnam-latest.osm.pbf',
  IN: 'https://download.geofabrik.de/asia/india-latest.osm.pbf',
  AU: 'https://download.geofabrik.de/oceania/australia-latest.osm.pbf',
  NZ: 'https://download.geofabrik.de/oceania/new-zealand-latest.osm.pbf',
  ZA: 'https://download.geofabrik.de/africa/south-africa-latest.osm.pbf',
  MA: 'https://download.geofabrik.de/africa/morocco-latest.osm.pbf',
  EG: 'https://download.geofabrik.de/africa/egypt-latest.osm.pbf',
  TR: 'https://download.geofabrik.de/asia/turkey-latest.osm.pbf',
  ID: 'https://download.geofabrik.de/asia/indonesia-latest.osm.pbf',
  MY: 'https://download.geofabrik.de/asia/malaysia-singapore-brunei-latest.osm.pbf',
  PH: 'https://download.geofabrik.de/asia/philippines-latest.osm.pbf',
};

/**
 * Resolve a country code to a local PBF path, downloading if needed.
 * Files are cached in data/pbf/ relative to the project root.
 *
 * @param {string} countryCode - ISO 3166-1 alpha-2 code (e.g. 'PT')
 * @param {string} [dataDir] - Directory to store PBF files
 * @returns {Promise<string>} Local path to the .osm.pbf file
 */
export async function resolveGeofabrikPbf(countryCode, dataDir) {
  const cc = countryCode.toUpperCase();
  const url = GEOFABRIK_URLS[cc];
  if (!url) throw new Error(`No Geofabrik extract for country: ${cc}. Available: ${Object.keys(GEOFABRIK_URLS).join(', ')}`);

  const dir = dataDir ?? resolve(process.cwd(), 'data', 'pbf');
  const filename = url.split('/').pop();
  const destPath = resolve(dir, filename);

  if (existsSync(destPath)) {
    console.log(`   📂 Using cached PBF: ${destPath}`);
    return destPath;
  }

  console.log(`   ⬇️  Downloading Geofabrik extract for ${cc}...`);
  console.log(`      ${url}`);
  return downloadGeofabrikPbf(url, destPath);
}

/**
 * Query a local .osm.pbf file for POIs near multiple destinations (batch).
 * Uses DuckDB's ST_ReadOSM() to read the PBF directly without import.
 *
 * @param {Array<{lat: number, lon: number, id?: string}>} destinations
 * @param {Object} opts
 * @param {string} opts.pbfPath - Path to .osm.pbf file
 * @param {number} [opts.radiusKm=5]
 * @param {string[]} [opts.groups] - POI groups: 'hospital', 'police', 'cultural'
 * @param {number} [opts.limit=30] - Max results per destination
 * @returns {Promise<Map<string, Array>>} Map of destId → POI array
 */
export async function queryPbfPoisBatch(destinations, opts = {}) {
  const { pbfPath, radiusKm = 5, groups, limit = 30 } = opts;
  if (!pbfPath || !existsSync(pbfPath)) throw new Error(`PBF file not found: ${pbfPath}`);

  const { db, query } = createDuckdb();
  await ensureExtensions(query);

  try {
    const absPath = resolve(pbfPath);

    // Filter OSM tag types by group
    const filteredTypes = groups?.length
      ? OSM_POI_TYPES.filter((t) => groups.includes(t.group))
      : OSM_POI_TYPES;

    const tagConditions = filteredTypes
      .map((t) => `(tags['${t.tag}'] = '${t.value}')`)
      .join(' OR ');

    // Build a destinations table in DuckDB
    const destValues = destinations
      .map((d, i) => `(${i}, ${d.lat}, ${d.lon}, '${String(d.id ?? `dest_${i}`).replace(/'/g, "''")}')`)
      .join(',');

    await query(`
      CREATE TABLE destinations (
        idx INTEGER, lat DOUBLE, lon DOUBLE, dest_id VARCHAR
      );
      INSERT INTO destinations VALUES ${destValues};
    `);

    // Compute global bounding box for the PBF pre-filter
    const allLats = destinations.map((d) => d.lat);
    const allLons = destinations.map((d) => d.lon);
    const minLat = Math.min(...allLats) - radiusKm / 111.0;
    const maxLat = Math.max(...allLats) + radiusKm / 111.0;
    const centerLat = (Math.min(...allLats) + Math.max(...allLats)) / 2;
    const cosLat = Math.cos((centerLat * Math.PI) / 180);
    const minLon = Math.min(...allLons) - radiusKm / (111.0 * (cosLat || 1));
    const maxLon = Math.max(...allLons) + radiusKm / (111.0 * (cosLat || 1));

    // Single query: read PBF, filter by bbox + tags, join with destinations by distance
    const pbfEscaped = absPath.replace(/\\/g, '\\\\');
    const sql = `
      WITH pois AS (
        SELECT
          id,
          tags,
          lat AS poi_lat,
          lon AS poi_lon
        FROM ST_ReadOSM('${pbfEscaped}')
        WHERE lat IS NOT NULL
          AND lon IS NOT NULL
          AND lat BETWEEN ${minLat} AND ${maxLat}
          AND lon BETWEEN ${minLon} AND ${maxLon}
          AND (${tagConditions})
      ),
      pois_with_group AS (
        SELECT
          id,
          tags,
          poi_lat,
          poi_lon,
          CASE
            ${filteredTypes.map((t) => `WHEN tags['${t.tag}'] = '${t.value}' THEN '${t.group}'`).join('\n            ')}
            ELSE 'other'
          END AS poi_group,
          CASE
            ${filteredTypes.map((t) => `WHEN tags['${t.tag}'] = '${t.value}' THEN '${t.value}'`).join('\n            ')}
            ELSE 'unknown'
          END AS poi_type
        FROM pois
      )
      SELECT
        d.dest_id,
        'node/' || p.id AS osm_id,
        p.tags['name'] AS name,
        p.poi_group AS "group",
        p.poi_type AS type,
        p.poi_lat AS lat,
        p.poi_lon AS lon,
        ST_Distance_Sphere(
          ST_Point(p.poi_lon, p.poi_lat),
          ST_Point(d.lon, d.lat)
        ) / 1000.0 AS distance_km
      FROM destinations d
      JOIN pois_with_group p ON ST_Distance_Sphere(
        ST_Point(p.poi_lon, p.poi_lat),
        ST_Point(d.lon, d.lat)
      ) <= ${radiusKm * 1000}
      ORDER BY d.dest_id, distance_km ASC;
    `;

    const rows = await query(sql);

    // Group by dest_id
    const result = new Map();
    for (const d of destinations) {
      result.set(String(d.id ?? `dest_${destinations.indexOf(d)}`), []);
    }

    const counts = new Map();
    for (const r of rows) {
      const destId = String(r.dest_id);
      const cur = counts.get(destId) || 0;
      if (cur >= limit) continue;
      counts.set(destId, cur + 1);

      const list = result.get(destId) || [];
      list.push({
        osm_id: r.osm_id,
        name: r.name || null,
        group: r.group,
        type: r.type,
        lat: r.lat,
        lon: r.lon,
        distanceKm: Math.round(r.distance_km * 100) / 100,
        source: 'osm_pbf',
      });
      result.set(destId, list);
    }

    return result;
  } finally {
    db.close();
  }
}

// ── Convenience: all-in-one POI query ─────────────────────────────────────────

/**
 * Query POIs from Overture Maps for a list of destinations.
 * This is the recommended "fast path" — no downloads, no rate limits.
 *
 * @param {Array<{latitude: number, longitude: number, id?: string, nome?: string}>} destinations
 * @param {Object} [opts]
 * @param {number} [opts.radiusKm=5]
 * @param {number} [opts.limit=30]
 * @returns {Promise<Map<string, Array>>} Map of destId → POI array
 */
export async function enrichDestinationsFromOverture(destinations, opts = {}) {
  const allCategories = [
    ...OVERTURE_CATEGORIES.hospital,
    ...OVERTURE_CATEGORIES.police,
    ...OVERTURE_CATEGORIES.cultural,
  ];

  const batchInput = destinations.map((d, i) => ({
    lat: d.latitude,
    lon: d.longitude,
    id: d.id || d.nome || `dest_${i}`,
  }));

  return queryOverturePoisBatch(batchInput, {
    radiusKm: opts.radiusKm ?? 5,
    categories: allCategories,
    limit: opts.limit ?? 30,
    release: opts.release,
  });
}
