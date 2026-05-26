import { describe, expect, it } from 'vitest';

import { parseTripGoRoutingResponse } from './tripgo';

describe('parseTripGoRoutingResponse', () => {
  it('merges segment templates into trip plans', () => {
    const raw = {
      groups: [
        {
          trips: [
            {
              depart: 1_700_000_000,
              arrive: 1_700_000_900,
              weightedScore: 10,
              segments: [
                {
                  segmentTemplateHashCode: 'walk1',
                  startTime: 1_700_000_000,
                  endTime: 1_700_000_600,
                  startLocation: { name: 'Airport' },
                  endLocation: { name: 'Station' },
                },
                {
                  segmentTemplateHashCode: 'bus1',
                  startTime: 1_700_000_600,
                  endTime: 1_700_000_900,
                  startLocation: { name: 'Station' },
                  endLocation: { name: 'City' },
                },
              ],
            },
          ],
        },
      ],
      segmentTemplates: [
        { hashCode: 'walk1', mode: 'wa_wal', notes: 'Walk to <LOCATIONS>' },
        { hashCode: 'bus1', mode: 'pt_pub', notes: 'Take <SERVICE_NAME>' },
      ],
    };

    const { plans, error } = parseTripGoRoutingResponse(raw);
    expect(error).toBeUndefined();
    expect(plans).toHaveLength(1);
    expect(plans[0]!.segments).toHaveLength(2);
    expect(plans[0]!.segments[0]!.mode).toBe('wa_wal');
    expect(plans[0]!.durationMinutes).toBeGreaterThan(0);
  });
});
