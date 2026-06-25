import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
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
export const maxDuration = 30;

const BoxSchema = z.string().transform((val, ctx) => {
  const parts = val.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Expected minLat,minLon,maxLat,maxLon' });
    return z.NEVER;
  }
  return { box: [parts[0]!, parts[1]!, parts[2]!, parts[3]!] } as AisBoundingBox;
});

const AisQuerySchema = z.object({
  action: z.enum(['config', 'vessels']).default('config'),
  box: BoxSchema.optional(),
  listenSeconds: z.coerce.number().int().min(1).max(20).default(6),
  ferriesOnly: z.enum(['true', 'false']).default('true'),
  types: z.string().optional(),
});

export const GET = apiHandler(async (req: Request) => {
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
  const params = AisQuerySchema.parse(Object.fromEntries(url.searchParams));
  const apiKey = getAisApiKey()!;

  switch (params.action) {
    case 'config': {
      return NextResponse.json({
        ok: true,
        configured: true,
        webSocketUrl: getAisWebSocketUrl(),
        subscriptionTemplate: buildAisSubscription(apiKey, [
          { box: [-90, -180, 90, 180] },
        ]),
        note: 'Use WebSocket directly for continuous streaming. The REST proxy endpoint (action=vessels) is for occasional ferry queries.',
      });
    }

    case 'vessels': {
      if (!params.box) {
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

      const typesFilter = params.types
        ? params.types.split(',').map((s) => parseInt(s.trim(), 10)).filter(Number.isFinite)
        : undefined;

      const vessels = await sampleAisStream(apiKey, params.box, params.listenSeconds, {
        ferriesOnly: params.ferriesOnly !== 'false',
        typesFilter,
      });

      return NextResponse.json({
        ok: true,
        configured: true,
        vessels,
        sampleSeconds: params.listenSeconds,
        sampledAt: new Date().toISOString(),
        note: 'Snapshot from short WebSocket sample. Not a complete view of the area.',
      });
    }
  }
});

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
