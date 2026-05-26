import { describe, expect, it } from 'vitest';

import { parseValhallaRouteResponse } from './valhalla';

describe('parseValhallaRouteResponse', () => {
  it('builds a plan from trip legs and maneuvers', () => {
    const raw = {
      trip: {
        summary: { time: 720, length: 5.2 },
        legs: [
          {
            maneuvers: [
              { type: 1, instruction: 'Drive west on Avenida da Liberdade.', time: 300, length: 1.2 },
              { type: 10, instruction: 'Arrive at destination.', time: 60, length: 0.1 },
            ],
          },
        ],
      },
    };

    const plans = parseValhallaRouteResponse(raw, 'auto');
    expect(plans).toHaveLength(1);
    expect(plans[0]!.durationMinutes).toBe(12);
    expect(plans[0]!.segments.length).toBeGreaterThanOrEqual(1);
    expect(plans[0]!.segments[0]!.notes).toContain('Liberdade');
  });
});
