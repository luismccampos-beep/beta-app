/**
 * AISstream.io — real-time vessel tracking (AIS data via WebSocket).
 * https://aisstream.io/documentation
 *
 * Free tier: global AIS stream, 1 subscription update/second.
 * Auth: API key in subscription message.
 *
 * Since Next.js routes are serverless / short-lived, we provide:
 * 1. A REST endpoint that opens a brief WebSocket connection (~6s) to sample data.
 * 2. Direct WebSocket URL + subscription payload for client-side use.
 */

// ── Types ────────────────────────────────────────────────────────────────

export type AisBoundingBox = {
  /** [minLat, minLon, maxLat, maxLon] */
  box: [number, number, number, number];
};

export type AisStreamSubscription = {
  APIKey: string;
  BoundingBoxes: number[][][];
  FilterMessageTypes?: string[];
};

export type AisVesselPosition = {
  /** MMSI identifier */
  mmsi: number;
  /** Ship name (from static data if cached) */
  shipName?: string;
  latitude: number;
  longitude: number;
  /** Speed over ground in knots */
  speedOverGround?: number;
  /** Course over ground in degrees */
  courseOverGround?: number;
  /** Heading in degrees */
  heading?: number;
  /** True heading if available */
  trueHeading?: number;
  /** Rate of turn */
  rateOfTurn?: number;
  /** Timestamp of position (epoch seconds) */
  timestamp: number;
  /** Ship type (cargo, passenger, tanker, etc.) */
  shipType?: number;
  /** IMO number */
  imo?: number;
  /** Call sign */
  callSign?: string;
  /** Destination */
  destination?: string;
  /** ETA */
  eta?: string;
  /** Draught in meters */
  draught?: number;
  /** Dimensions: [length, beam, fromBow, fromPort] */
  dimensions?: [number, number, number, number];
};

export type AisQueryInput = {
  /** Bounding box [minLat, minLon, maxLat, maxLon] */
  box: [number, number, number, number];
  /** How long to listen (seconds). Default 6, max 20 */
  listenSeconds?: number;
  /** Filter by MMSI (optional) */
  mmsiFilter?: number[];
  /** Filter by ship type */
  shipTypeFilter?: number[];
};

// ── Config ───────────────────────────────────────────────────────────────

const AIS_STREAM_URL = 'wss://stream.aisstream.io/v0/stream';

export function getAisApiKey(): string | undefined {
  return process.env.AISSTREAM_API_KEY?.trim() || undefined;
}

export function isAisConfigured(): boolean {
  return Boolean(getAisApiKey());
}

/**
 * Get the WebSocket URL (public, no secret).
 * The API key is sent inside the subscription message.
 */
export function getAisWebSocketUrl(): string {
  return AIS_STREAM_URL;
}

/**
 * Build the subscription message for AISstream.
 */
export function buildAisSubscription(
  apiKey: string,
  boxes: AisBoundingBox[],
  filterTypes?: string[],
): AisStreamSubscription {
  return {
    APIKey: apiKey,
    BoundingBoxes: boxes.map((b) => [b.box]),
    FilterMessageTypes: filterTypes ?? ['PositionReport', 'ShipStaticData'],
  };
}

// ── Ship type labels ─────────────────────────────────────────────────────

const SHIP_TYPE_LABELS: Record<number, string> = {
  0: 'Not available',
  20: 'Wing in ground',
  21: 'Wing in ground',
  22: 'Wing in ground',
  23: 'Wing in ground',
  24: 'Wing in ground',
  25: 'Wing in ground',
  26: 'Wing in ground',
  27: 'Wing in ground',
  28: 'Wing in ground',
  29: 'Wing in ground',
  30: 'Fishing',
  31: 'Towing',
  32: 'Towing (large)',
  33: 'Dredging',
  34: 'Diving',
  35: 'Military',
  36: 'Sailing',
  37: 'Pleasure craft',
  38: 'Reserved (HSC)',
  39: 'Reserved (WIG)',
  40: 'High speed craft',
  41: 'High speed craft',
  42: 'High speed craft',
  43: 'High speed craft',
  44: 'High speed craft',
  45: 'High speed craft',
  46: 'High speed craft',
  47: 'High speed craft',
  48: 'High speed craft',
  49: 'High speed craft',
  50: 'Pilot vessel',
  51: 'Search and rescue',
  52: 'Tug',
  53: 'Port tender',
  54: 'Pollution response',
  55: 'Law enforcement',
  56: 'Spare (local)',
  57: 'Spare (local)',
  58: 'Medical transport',
  59: 'Non-combatant',
  60: 'Passenger (all)',
  61: 'Passenger (all)',
  62: 'Passenger (all)',
  63: 'Passenger (all)',
  64: 'Passenger (all)',
  65: 'Passenger (all)',
  66: 'Passenger (all)',
  67: 'Passenger (all)',
  68: 'Passenger (all)',
  69: 'Passenger (all)',
  70: 'Cargo (all)',
  71: 'Cargo (hazard A)',
  72: 'Cargo (hazard B)',
  73: 'Cargo (hazard C)',
  74: 'Cargo (hazard D)',
  75: 'Cargo (all)',
  76: 'Cargo (all)',
  77: 'Cargo (all)',
  78: 'Cargo (all)',
  79: 'Cargo (all)',
  80: 'Tanker (all)',
  81: 'Tanker (hazard A)',
  82: 'Tanker (hazard B)',
  83: 'Tanker (hazard C)',
  84: 'Tanker (hazard D)',
  85: 'Tanker (all)',
  86: 'Tanker (all)',
  87: 'Tanker (all)',
  88: 'Tanker (all)',
  89: 'Tanker (all)',
  90: 'Other (all)',
  91: 'Other (all)',
  92: 'Other (all)',
  93: 'Other (all)',
  94: 'Other (all)',
  95: 'Other (all)',
  96: 'Other (all)',
  97: 'Other (all)',
  98: 'Other (all)',
  99: 'Other (all)',
  100: 'Reserved (SART)',
  101: 'Reserved (SART)',
  102: 'Reserved (SART)',
  103: 'Reserved (SART)',
  104: 'Reserved (SART)',
  105: 'Reserved (SART)',
  106: 'Reserved (SART)',
  107: 'Reserved (SART)',
  108: 'Reserved (SART)',
  109: 'Reserved (SART)',
};

export function shipTypeLabel(type: number): string {
  return SHIP_TYPE_LABELS[type] ?? `Type ${type}`;
}

/**
 * Check if a ship type is a passenger vessel (ferry, cruise, etc.)
 */
export function isPassengerVessel(type: number): boolean {
  return (type >= 60 && type <= 69) || type === 40 || type === 41;
}

/**
 * Check if a ship type is a cargo vessel.
 */
export function isCargoVessel(type: number): boolean {
  return (type >= 70 && type <= 79) || type === 80 || type === 81;
}

// ── Parse AIS messages ───────────────────────────────────────────────────

/**
 * Parse a raw AISstream message into structured vessel data.
 */
export function parseAisMessage(
  message: Record<string, unknown>,
): AisVesselPosition | null {
  const messageType = message.MessageType as string | undefined;

  // Position Report
  if (messageType === 'PositionReport') {
    const pos = message.Message as Record<string, unknown> | undefined;
    if (!pos) return null;

    const meta = pos.MetaData as Record<string, unknown> | undefined;

    return {
      mmsi: Number(pos.UserID ?? 0),
      shipName:
        typeof meta?.ShipName === 'string'
          ? (meta.ShipName as string)
          : undefined,
      latitude: Number(pos.Latitude ?? 0),
      longitude: Number(pos.Longitude ?? 0),
      speedOverGround:
        typeof pos.Sog === 'number' ? (pos.Sog as number) : undefined,
      courseOverGround:
        typeof pos.Cog === 'number' ? (pos.Cog as number) : undefined,
      heading:
        typeof pos.TrueHeading === 'number'
          ? (pos.TrueHeading as number)
          : undefined,
      trueHeading:
        typeof pos.TrueHeading === 'number'
          ? (pos.TrueHeading as number)
          : undefined,
      rateOfTurn:
        typeof pos.Rot === 'number' ? (pos.Rot as number) : undefined,
      timestamp:
        typeof meta?.time_utc === 'string'
          ? Math.floor(new Date(meta.time_utc as string).getTime() / 1000)
          : Math.floor(Date.now() / 1000),
      shipType: typeof pos.ShipType === 'number' ? (pos.ShipType as number) : undefined,
      imo: typeof pos.Imo === 'number' ? (pos.Imo as number) : undefined,
      callSign:
        typeof pos.CallSign === 'string'
          ? (pos.CallSign as string)
          : undefined,
      destination: typeof pos.Destination === 'string' ? (pos.Destination as string) : undefined,
      eta: typeof pos.Eta === 'string' ? (pos.Eta as string) : undefined,
      draught: typeof pos.Draught === 'number' ? (pos.Draught as number) : undefined,
      dimensions:
        pos.Dimensions && typeof pos.Dimensions === 'object'
          ? [
              Number((pos.Dimensions as Record<string, number>).A ?? 0),
              Number((pos.Dimensions as Record<string, number>).B ?? 0),
              Number((pos.Dimensions as Record<string, number>).C ?? 0),
              Number((pos.Dimensions as Record<string, number>).D ?? 0),
            ]
          : undefined,
    };
  }

  // Ship Static Data
  if (messageType === 'ShipStaticData') {
    const staticData = message.Message as Record<string, unknown> | undefined;
    if (!staticData) return null;

    const meta = staticData.MetaData as Record<string, unknown> | undefined;

    return {
      mmsi: Number(staticData.UserID ?? 0),
      shipName:
        typeof staticData.Name === 'string'
          ? (staticData.Name as string).trim()
          : typeof meta?.ShipName === 'string'
            ? (meta.ShipName as string)
            : undefined,
      latitude: 0,
      longitude: 0,
      timestamp:
        typeof meta?.time_utc === 'string'
          ? Math.floor(new Date(meta.time_utc as string).getTime() / 1000)
          : Math.floor(Date.now() / 1000),
      shipType:
        typeof staticData.ShipType === 'number'
          ? (staticData.ShipType as number)
          : undefined,
      imo: typeof staticData.Imo === 'number' ? (staticData.Imo as number) : undefined,
      callSign:
        typeof staticData.CallSign === 'string'
          ? (staticData.CallSign as string)
          : undefined,
      dimensions:
        staticData.Dimensions && typeof staticData.Dimensions === 'object'
          ? [
              Number((staticData.Dimensions as Record<string, number>).A ?? 0),
              Number((staticData.Dimensions as Record<string, number>).B ?? 0),
              Number((staticData.Dimensions as Record<string, number>).C ?? 0),
              Number((staticData.Dimensions as Record<string, number>).D ?? 0),
            ]
          : undefined,
    };
  }

  return null;
}
