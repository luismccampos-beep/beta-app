import { NextResponse } from 'next/server';

import {
  isAisConfigured,
  getAisApiKey,
  getAisWebSocketUrl,
  buildAisSubscription,
  parseAisMessage,
  type AisVesselPosition,
  type AisBoundingBox,
  isPassengerVessel,
} from '../../../../../lib/travel/aisstream';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // allow up to 30s for WebSocket sampling

/**
 * AISstream REST proxy.
 *
 * Since Next.js serverless functions are short-lived, we expose:
 * 1. `GET /api/travel/v1/aisstream?action=config` — Get WebSocket URL + subscription template
 * 2. `GET /api/travel/v1/aisstream?action=vessels&box=minLat,minLon,maxLat,maxLon&listenSeconds=6`
 *    — Opens a WebSocket, samples data for N seconds, returns vessels.
 *    ⚠ Works only on runtimes that support WebSocket (Node 18+, serverful).
 *
 * For production, use a persistent service (e.g. cron) to cache vessel positions.
 */

function parseBoxParam(param: string | null): AisBoundingBox | null {
  if (!param) return null;
  const parts = param.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  return { box: [parts[0]!, parts[1]!, parts[2]!, parts[3]!] };
}

export async function GET(req: Request) {
  if (!isAisConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message:
          'AISstream API key missing. Add AISSTREAM_API_KEY to .env.local — https://aisstream.io',
        vessels: [],
      },
      { status: 503 },
    );
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action') || 'config';
  const apiKey = getAisApiKey()!;

  switch (action) {
    // ── Config: return WebSocket URL and subscription template ────────
    case 'config': {
      return NextResponse.json({
        ok: true,
        configured: true,
        webSocketUrl: getAisWebSocketUrl(),
        subscriptionTemplate: buildAisSubscription(apiKey, [
          { box: [-90, -180, 90, 180] }, // example: global
        ]),
        note: 'Use WebSocket directly for continuous streaming. The REST proxy endpoint (action=vessels) is for occasional ferry queries.',
      });
    }

    // ── Vessels: short WebSocket sample ──────────────────────────────
    case 'vessels': {
      const box = parseBoxParam(url.searchParams.get('box'));
      if (!box) {
        return NextResponse.json(
          {
            ok: false,
            message:
              'Vessels requires: box=minLat,minLon,maxLat,maxLon. Example: box=38.7,-9.2,38.8,-9.1',
            vessels: [],
          },
          { status: 400 },
        );
      }

      const listenSeconds = Math.min(
        parseInt(url.searchParams.get('listenSeconds') || '6', 10),
        20,
      );
      const ferriesOnly = url.searchParams.get('ferriesOnly') !== 'false';
      const typesFilter = url.searchParams.get('types'); // optional comma-separated type numbers

      try {
        const vessels = await sampleAisStream(apiKey, box, listenSeconds, {
          ferriesOnly,
          typesFilter: typesFilter
            ? typesFilter.split(',').map((s) => parseInt(s.trim(), 10)).filter(Number.isFinite)
            : undefined,
        });

        return NextResponse.json({
          ok: true,
          configured: true,
          vessels,
          sampleSeconds: listenSeconds,
          sampledAt: new Date().toISOString(),
          note: 'Snapshot from short WebSocket sample. Not a complete view of the area.',
        });
      } catch (e: unknown) {
        return NextResponse.json(
          {
            ok: false,
            configured: true,
            message: e instanceof Error ? e.message : 'AIS stream sample failed',
            vessels: [],
          },
          { status: 502 },
        );
      }
    }

    default:
      return NextResponse.json(
        {
          ok: false,
          message: `Unknown action: ${action}. Use: config, vessels`,
          vessels: [],
        },
        { status: 400 },
      );
  }
}

// ── WebSocket sampler ────────────────────────────────────────────────────

/**
 * Open a WebSocket connection to AISstream, subscribe to a bounding box,
 * collect vessel positions for `durationSec` seconds, then close.
 *
 * Uses Node.js `WebSocket` (available globally in Node 18+ / Bun / Edge).
 */
async function sampleAisStream(
  apiKey: string,
  box: AisBoundingBox,
  durationSec: number,
  filters?: { ferriesOnly?: boolean; typesFilter?: number[] },
): Promise<AisVesselPosition[]> {
  return new Promise((resolve, reject) => {
    const vessels = new Map<number, AisVesselPosition>();
    const timeout = setTimeout(() => {
      ws.close();
      resolve(Array.from(vessels.values()));
    }, durationSec * 1000);

    const ws = new WebSocket(getAisWebSocketUrl());

    ws.onopen = () => {
      const sub = buildAisSubscription(apiKey, [box], [
        'PositionReport',
        'ShipStaticData',
      ]);
      ws.send(JSON.stringify(sub));
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const raw = typeof event.data === 'string' ? event.data : Buffer.from(event.data).toString();
        const msg = JSON.parse(raw) as Record<string, unknown>;
        const vessel = parseAisMessage(msg);
        if (!vessel) return;

        // Apply filters
        if (filters?.ferriesOnly && !isPassengerVessel(vessel.shipType ?? 0)) {
          return;
        }
        if (
          filters?.typesFilter?.length &&
          vessel.shipType != null &&
          !filters.typesFilter.includes(vessel.shipType)
        ) {
          return;
        }

        // Keep the most recent position per MMSI
        const existing = vessels.get(vessel.mmsi);
        if (!existing || vessel.timestamp > existing.timestamp) {
          vessels.set(vessel.mmsi, vessel);
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('AIS WebSocket error'));
    };

    ws.onclose = () => {
      clearTimeout(timeout);
      resolve(Array.from(vessels.values()));
    };
  });
}
