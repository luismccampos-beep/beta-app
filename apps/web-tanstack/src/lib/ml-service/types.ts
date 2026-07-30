/**
 * Shared TypeScript types matching ML service Pydantic schemas.
 * Keep in sync with ml-service/app/api/routes/*.py models.
 *
 * @see ml-service/app/api/routes/travel_ranking.py
 * @see ml-service/app/api/routes/travel_distance.py
 * @see ml-service/app/api/routes/unified.py
 */

// ─── LatLon ────────────────────────────────────────────────────────────────

export type LatLonPoint = {
  lat: number;
  lon: number;
};

// ─── Travel Ranking ────────────────────────────────────────────────────────

/** Matches ml-service: TravelRankCandidate */
export type TravelRankCandidate = {
  item_id?: string;
  destino_id?: number;
  iata?: string;
  lang?: string;
  nome?: string;
};

/** Matches ml-service: TravelRankRequest */
export type TravelRankRequest = {
  preferences: Record<string, unknown>;
  candidates: TravelRankCandidate[];
  limit: number;
};

/** Matches ml-service: TravelRankItem */
export type TravelRankItem = {
  id: string;
  destino_id?: number | null;
  iata?: string | null;
  nome?: string | null;
  score: number;
  confidence: number;
  rank: number;
  method: string;
};

/** Matches ml-service: TravelRankResponse */
export type TravelRankResponse = {
  success: boolean;
  rankings: TravelRankItem[];
  model_loaded: boolean;
  processing_time: number;
  timestamp: string;
};

// ─── Travel Distance ───────────────────────────────────────────────────────

/** Matches ml-service: DistanceRequest */
export type DistanceRequest = {
  origin: LatLonPoint;
  destination: LatLonPoint;
  geograph?: string;
};

/** Matches ml-service: DistanceResponse */
export type DistanceResponse = {
  success: boolean;
  distance_km: number;
  method: string;
  geograph: string;
  scgraph_available: boolean;
  processing_time: number;
  timestamp: string;
};

/** Matches ml-service: BatchDestination */
export type BatchDestination = {
  id?: string;
  lat: number;
  lon: number;
};

/** Matches ml-service: BatchDistanceItem */
export type BatchDistanceItem = {
  id?: string | null;
  distance_km?: number | null;
  method: string;
  error?: string | null;
};

/** Matches ml-service: BatchDistanceResponse */
export type BatchDistanceResponse = {
  success: boolean;
  results: BatchDistanceItem[];
  geograph: string;
  scgraph_available: boolean;
  processing_time: number;
  timestamp: string;
};

// ─── Unified AI ────────────────────────────────────────────────────────────

/** Matches ml-service: UnifiedAIRequest (subset) */
export type UnifiedQueryRequest = {
  query: string;
  context?: Record<string, unknown>;
  user_preferences?: Record<string, unknown>;
  include_explanation?: boolean;
  include_alternatives?: boolean;
  max_sources?: number;
  language?: string;
};

/** Matches ml-service: UnifiedAIResponse (subset) */
export type UnifiedQueryData = {
  answer?: string;
  confidence?: number;
  sources?: Array<{ title?: string; url?: string; relevance?: number }>;
  explanation?: Record<string, unknown> | null;
  alternatives?: unknown[];
  request_id?: string;
  processing_time: number;
};

/** Matches ml-service: UnifiedQueryResponse */
export type UnifiedQueryResponse = {
  success: boolean;
  data?: UnifiedQueryData | null;
  error?: string | null;
  detail?: string | null;
  processing_time: number;
};

// ─── Health Check ──────────────────────────────────────────────────────────

/** Matches ml-service: HealthCheckResponse */
export type MlServiceHealth = {
  status: 'ok' | 'degraded' | 'unhealthy';
  services?: Record<string, unknown>;
  capabilities?: string[];
  version?: string;
  timestamp?: string;
  error?: string | null;
};

/** Matches ml-service: travel_rank_health */
export type MlRankHealth = {
  ok: boolean;
  model_path: string;
  model_exists: boolean;
  items: number;
};

/** Matches ml-service: travel_distance_health */
export type MlDistanceHealth = {
  ok: boolean;
  scgraph_installed: boolean;
  geograph: string;
  hint: string;
};
