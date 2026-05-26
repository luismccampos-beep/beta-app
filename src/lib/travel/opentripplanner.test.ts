import { describe, expect, it } from 'vitest';

import { parseOtpPlanResponse } from './opentripplanner';

describe('parseOtpPlanResponse', () => {
  it('parses itineraries and legs from GraphQL plan response', () => {
    const raw = {
      data: {
        plan: {
          itineraries: [
            {
              startTime: 1_700_000_000_000,
              endTime: 1_700_000_3600_000,
              duration: 3600,
              legs: [
                {
                  mode: 'WALK',
                  startTime: 1_700_000_000_000,
                  endTime: 1_700_000_600_000,
                  from: { name: 'Airport', lat: 38.78, lon: -9.14 },
                  to: { name: 'Metro stop', lat: 38.77, lon: -9.14 },
                },
                {
                  mode: 'BUS',
                  startTime: 1_700_000_600_000,
                  endTime: 1_700_000_3600_000,
                  from: { name: 'Metro stop', lat: 38.77, lon: -9.14 },
                  to: { name: 'City center', lat: 38.71, lon: -9.14 },
                  route: { shortName: '728', longName: 'Aeroporto' },
                },
              ],
            },
          ],
        },
      },
    };

    const plans = parseOtpPlanResponse(raw);
    expect(plans).toHaveLength(1);
    expect(plans[0]!.durationMinutes).toBe(60);
    expect(plans[0]!.segments.some((s) => s.modeLabel.includes('728'))).toBe(true);
  });
});
