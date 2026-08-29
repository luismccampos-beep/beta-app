import { describe, expect, it, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Mocks — must be declared before importing the route module
// ---------------------------------------------------------------------------

const mockPrisma = {
  wvDestination: {
    findMany: vi.fn(),
  },
  userPreference: {
    findUnique: vi.fn(),
  },
}

vi.mock('@akmleva/db', () => ({ prisma: mockPrisma }))

const mockRankDestinations = vi.fn()
vi.mock('@/lib/ml-service/client', () => ({
  rankDestinations: mockRankDestinations,
}))

const mockGetSession = vi.fn()
vi.mock('@/lib/auth/auth', () => ({
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  publicRatelimit: { prefix: 'test' },
  checkRateLimit: vi.fn(async () => ({ success: true })),
}))

// Mock TanStack Router so importing the route module is lightweight
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: (path: string) => (config: Record<string, unknown>) => ({
    __path: path,
    options: config,
  }),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface RecommendedItem {
  itemId: string
  slug: string
  nome: string
  pais: string
  score: number
  confidence: number
}

function makeRequest(query = ''): Request {
  return new Request(`http://localhost/api/ai/recommended-destinations${query}`, {
    headers: { 'content-type': 'application/json' },
  })
}

const DB_ROWS = [
  { id: 1, slug: 'lisboa', nome: 'Lisboa', pais: 'Portugal', continente: 'Europa', iata: 'LIS', tipo: 'cidade', clima: 'mediterranico', imagemUrl: 'https://img/1.jpg' },
  { id: 2, slug: 'porto', nome: 'Porto', pais: 'Portugal', continente: 'Europa', iata: 'OPO', tipo: 'cidade', clima: 'atlantico', imagemUrl: null },
]

function encodePrefs(prefs: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(prefs), 'utf8').toString('base64url')
}

describe('GET /api/ai/recommended-destinations', () => {
  let getHandler: (ctx: { request: Request }) => Promise<Response>

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('@/routes/api/ai/recommended-destinations')
    getHandler = (mod as Record<string, unknown>).Route.options.server
      .handlers.GET as typeof getHandler
    mockPrisma.wvDestination.findMany.mockResolvedValue(DB_ROWS)
    mockPrisma.userPreference.findUnique.mockResolvedValue(null)
    mockGetSession.mockRejectedValue(new Error('no session'))
  })

  it('returns fallback catalog order when the ML service is unavailable', async () => {
    mockRankDestinations.mockResolvedValue(null)

    const res = await getHandler({ request: makeRequest('?limit=2&lang=pt') })
    const body = await res.json() as { ok: boolean; method: string; items: RecommendedItem[] }

    expect(res.status).toBe(200)
    expect(body.method).toBe('fallback')
    expect(body.items.map((i) => i.itemId)).toEqual(['wv-pt-1', 'wv-pt-2'])
    expect(body.items[0]).toMatchObject({ slug: 'lisboa', nome: 'Lisboa', pais: 'Portugal' })
  })

  it('returns ML-ranked items in ranking order', async () => {
    mockRankDestinations.mockResolvedValue({
      success: true,
      model_loaded: true,
      rankings: [
        { id: 'wv-pt-2', destino_id: 2, score: 0.9, confidence: 0.8, rank: 1, method: 'hybrid' },
        { id: 'wv-pt-1', destino_id: 1, score: 0.5, confidence: 0.6, rank: 2, method: 'hybrid' },
      ],
    })

    const res = await getHandler({ request: makeRequest('?limit=2') })
    const body = await res.json() as { ok: boolean; method: string; items: RecommendedItem[] }

    expect(body.method).toBe('hybrid')
    expect(body.items.map((i) => i.itemId)).toEqual(['wv-pt-2', 'wv-pt-1'])
    expect(body.items[0]).toMatchObject({ score: 0.9, confidence: 0.8 })
  })

  it('passes the authenticated userId into personalized ranking', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-42' } })
    mockRankDestinations.mockResolvedValue({
      success: true,
      rankings: [{ id: 'wv-pt-1', destino_id: 1, score: 0.7, confidence: 0.7, rank: 1, method: 'hybrid' }],
    })

    await getHandler({ request: makeRequest() })

    expect(mockRankDestinations).toHaveBeenCalledTimes(1)
    const args = mockRankDestinations.mock.calls[0] as unknown[]
    expect(args[3]).toBe('user-42')
  })

  it('maps stored onboarding preferences onto the ML preference shape', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-42' } })
    mockPrisma.userPreference.findUnique.mockResolvedValue({
      travelStyle: 'aventura',
      favoriteActivities: ['trilhos', 'surf'],
      favoriteDestinationTypes: ['praia'],
      accommodationPreference: 'hostel',
      pacePreference: 'relaxed',
      budgetRangeMin: 100,
      budgetRangeMax: 2000,
    })
    mockRankDestinations.mockResolvedValue({
      success: true,
      rankings: [{ id: 'wv-pt-1', destino_id: 1, score: 0.7, confidence: 0.7, rank: 1, method: 'hybrid' }],
    })

    await getHandler({ request: makeRequest() })

    expect(mockPrisma.userPreference.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-42' } }),
    )
    const args = mockRankDestinations.mock.calls[0] as unknown[]
    expect(args[0]).toMatchObject({
      travelStyles: ['aventura'],
      activityTypes: ['trilhos', 'surf'],
      preferredDestinations: ['praia'],
      accommodationType: ['hostel'],
      pacePreference: 'relaxed',
      budgetRange: [100, 2000],
    })
  })

  it('prefers explicit compact prefs over stored preferences', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-42' } })
    mockPrisma.userPreference.findUnique.mockResolvedValue({
      travelStyle: 'aventura',
      favoriteActivities: [],
      favoriteDestinationTypes: [],
      accommodationPreference: null,
      pacePreference: null,
      budgetRangeMin: null,
      budgetRangeMax: null,
    })
    mockRankDestinations.mockResolvedValue({
      success: true,
      rankings: [{ id: 'wv-pt-1', destino_id: 1, score: 0.7, confidence: 0.7, rank: 1, method: 'embedding' }],
    })

    const prefs = encodePrefs({ travelStyles: ['gastronomia'] })
    await getHandler({ request: makeRequest(`?prefs=${prefs}`) })

    expect(mockPrisma.userPreference.findUnique).not.toHaveBeenCalled()
    const args = mockRankDestinations.mock.calls[0] as unknown[]
    expect(args[0]).toMatchObject({ travelStyles: ['gastronomia'] })
  })

  it('builds ML candidate ids using the wv-<lang>-<id> namespace', async () => {
    mockRankDestinations.mockResolvedValue({
      success: true,
      rankings: [{ id: 'wv-en-1', destino_id: 1, score: 0.7, confidence: 0.7, rank: 1, method: 'embedding' }],
    })

    await getHandler({ request: makeRequest('?lang=en') })

    const args = mockRankDestinations.mock.calls[0] as unknown[]
    const candidates = args[1] as Array<{ item_id: string; destino_id: number }>
    expect(candidates[0]).toEqual({
      item_id: 'wv-en-1',
      destino_id: 1,
      lang: 'en',
      iata: 'LIS',
      nome: 'Lisboa',
    })
  })

  it('returns empty items when the catalog has no rows', async () => {
    mockPrisma.wvDestination.findMany.mockResolvedValue([])

    const res = await getHandler({ request: makeRequest() })
    const body = await res.json() as { ok: boolean; method: string; items: RecommendedItem[] }

    expect(res.status).toBe(200)
    expect(body.items).toEqual([])
    expect(mockRankDestinations).not.toHaveBeenCalled()
  })

  it('rejects invalid query parameters with 400', async () => {
    const res = await getHandler({ request: makeRequest('?limit=999') })
    expect(res.status).toBe(400)
  })

  it('caps the requested limit to the available candidate count', async () => {
    mockRankDestinations.mockResolvedValue({
      success: true,
      rankings: [
        { id: 'wv-pt-1', destino_id: 1, score: 0.7, confidence: 0.7, rank: 1, method: 'embedding' },
        { id: 'wv-pt-2', destino_id: 2, score: 0.6, confidence: 0.6, rank: 2, method: 'embedding' },
      ],
    })

    const res = await getHandler({ request: makeRequest('?limit=20') })
    const body = await res.json() as { items: RecommendedItem[] }

    const args = mockRankDestinations.mock.calls[0] as unknown[]
    expect(args[2]).toBe(2)
    expect(body.items).toHaveLength(2)
  })
})
