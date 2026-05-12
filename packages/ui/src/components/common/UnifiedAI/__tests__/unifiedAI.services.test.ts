import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchSuggestions } from '../suggestions/suggestionsService';
import { createTripDraft } from '../trip-generator/tripGeneratorService';
import { aiRequest } from '../services/aiApiClient';

vi.mock('../services/aiApiClient', () => ({
  aiRequest: vi.fn(),
}));

describe('UnifiedAI services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('maps recommendation suggestions and caches results', async () => {
    vi.mocked(aiRequest).mockResolvedValue({
      success: true,
      data: [
        { id: 1, name: 'Lisboa', rating: 4.8, score: 0.92, relevance: 0.87 },
      ],
    });

    const first = await fetchSuggestions({ cacheTtlMs: 1000 });
    const second = await fetchSuggestions({ cacheTtlMs: 1000 });

    expect(first).toHaveLength(1);
    expect(first[0]?.label).toBe('Lisboa');
    expect(first[0]?.payload?.rating).toBe(4.8);
    expect(second).toHaveLength(1);
    expect(vi.mocked(aiRequest)).toHaveBeenCalledTimes(1);
  });

  it('returns generated trip data and caches results', async () => {
    vi.mocked(aiRequest).mockResolvedValue({
      success: true,
      data: {
        id: 'trip-1',
        destination: 'Porto',
        duration: 3,
        totalEstimatedCost: 600,
        summary: 'Viagem cultural',
        days: [
          {
            day: 1,
            title: 'Centro Histórico',
            activities: ['Passeio', 'Museu'],
            location: 'Porto',
            estimatedCost: 150,
          },
        ],
        generatedAt: new Date().toISOString(),
        aiGenerated: true,
      },
    });

    const preferences = {
      budget: 800,
      duration: 3,
      interests: ['cultura'],
      sustainability: 3,
      travelers: 2,
    };

    const first = await createTripDraft(preferences);
    const second = await createTripDraft(preferences);

    expect(first.destination).toBe('Porto');
    expect(second.id).toBe('trip-1');
    expect(vi.mocked(aiRequest)).toHaveBeenCalledTimes(1);
  });
});
