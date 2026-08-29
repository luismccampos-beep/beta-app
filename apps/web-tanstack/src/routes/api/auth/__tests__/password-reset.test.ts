import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createHash } from 'crypto'
import bcrypt from 'bcryptjs'

// ---------------------------------------------------------------------------
// Mocks — must be declared before any import that uses them
// ---------------------------------------------------------------------------

const mockPrisma = {
  user: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  passwordResetToken: {
    findFirst: vi.fn(),
    create: vi.fn(),
    updateMany: vi.fn(),
    update: vi.fn(),
  },
}

vi.mock('@akmleva/db', () => ({ prisma: mockPrisma }))

const mockSendPasswordResetEmail = vi.fn().mockResolvedValue({ success: true })
vi.mock('@/lib/email', () => ({
  sendPasswordResetEmail: mockSendPasswordResetEmail,
  sendPasswordChangeNotification: vi.fn().mockResolvedValue({ success: true }),
}))

// Mock TanStack Router so importing the route modules is lightweight
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: (path: string) => (config: Record<string, unknown>) => ({
    __path: path,
    options: config,
  }),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sha256Hex(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ---------------------------------------------------------------------------
// Forgot Password Tests
// ---------------------------------------------------------------------------

describe('POST /api/auth/forgot-password', () => {
  let postHandler: (ctx: { request: Request }) => Promise<Response>

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('@/routes/api/auth/forgot-password')
    postHandler = (mod as Record<string, unknown>).Route.options.server
      .handlers.POST as typeof postHandler
  })

  it('returns 400 for invalid email', async () => {
    const res = await postHandler({ request: makeRequest({ email: 'bad' }) })
    expect(res.status).toBe(400)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('Invalid email')
  })

  it('returns 400 for missing body', async () => {
    const res = await postHandler({
      request: new Request('http://localhost/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: 'null',
      }),
    })
    expect(res.status).toBe(400)
  })

  it('returns success even when user does not exist (no user enumeration)', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null)

    const res = await postHandler({
      request: makeRequest({ email: 'nobody@example.com' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json() as { success: boolean }
    expect(body.success).toBe(true)

    expect(mockPrisma.passwordResetToken.create).not.toHaveBeenCalled()
    expect(mockSendPasswordResetEmail).not.toHaveBeenCalled()
  })

  it('invalidates old tokens and creates a new PasswordResetToken', async () => {
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
    })
    mockPrisma.passwordResetToken.updateMany.mockResolvedValue({ count: 2 })
    mockPrisma.passwordResetToken.create.mockResolvedValue({ id: 'token-1' })

    const res = await postHandler({
      request: makeRequest({ email: 'test@example.com' }),
    })
    expect(res.status).toBe(200)

    // Invalidated old unused tokens
    expect(mockPrisma.passwordResetToken.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-123', usedAt: null },
      data: { usedAt: expect.any(Date) },
    })

    // Created new token with sha256 hash
    const callData = mockPrisma.passwordResetToken.create.mock.calls[0][0].data
    expect(callData.userId).toBe('user-123')
    expect(callData.token).toMatch(/^[a-f0-9]{64}$/)
    expect(callData.expiresAt.getTime()).toBeGreaterThan(Date.now())

    // Email sent (fire-and-forget)
    await new Promise((r) => setTimeout(r, 50))
    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      token: expect.any(String),
    })
  })
})

// ---------------------------------------------------------------------------
// Reset Password Tests
// ---------------------------------------------------------------------------

describe('POST /api/auth/reset-password', () => {
  let postHandler: (ctx: { request: Request }) => Promise<Response>

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('@/routes/api/auth/reset-password')
    postHandler = (mod as Record<string, unknown>).Route.options.server
      .handlers.POST as typeof postHandler
  })

  it('returns 400 for missing token', async () => {
    const res = await postHandler({
      request: makeRequest({ password: 'longpassword123' }),
    })
    expect(res.status).toBe(400)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('Invalid input')
  })

  it('returns 400 for short password', async () => {
    const res = await postHandler({
      request: makeRequest({ token: 'abc', password: 'short' }),
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid token', async () => {
    mockPrisma.passwordResetToken.findFirst.mockResolvedValue(null)

    const res = await postHandler({
      request: makeRequest({
        token: 'invalid-token',
        password: 'longpassword123',
      }),
    })
    expect(res.status).toBe(400)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('Invalid or expired token')
  })

  it('resets password and marks token as used', async () => {
    mockPrisma.passwordResetToken.findFirst.mockResolvedValue({
      userId: 'user-456',
    })
    mockPrisma.user.update.mockResolvedValue({ id: 'user-456' })
    mockPrisma.passwordResetToken.update.mockResolvedValue({})

    const res = await postHandler({
      request: makeRequest({ token: 'valid-token', password: 'newpassword123' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json() as { success: boolean }
    expect(body.success).toBe(true)

    // Updated user password with bcrypt hash
    const updateData = mockPrisma.user.update.mock.calls[0][0]
    expect(updateData.where.id).toBe('user-456')
    expect(updateData.data.password).toMatch(/^\$2[aby]?\$/)
    expect(updateData.data.passwordChangedAt).toBeInstanceOf(Date)

    // Marked token as used
    expect(mockPrisma.passwordResetToken.update).toHaveBeenCalledWith({
      where: { token: sha256Hex('valid-token') },
      data: { usedAt: expect.any(Date) },
    })
  })

  it('uses the correct sha256 hash for token lookup', async () => {
    const rawToken = 'my-secret-reset-token'
    const expectedHash = sha256Hex(rawToken)

    mockPrisma.passwordResetToken.findFirst.mockResolvedValue({
      userId: 'user-789',
    })
    mockPrisma.user.update.mockResolvedValue({})
    mockPrisma.passwordResetToken.update.mockResolvedValue({})

    await postHandler({
      request: makeRequest({ token: rawToken, password: 'newpassword123' }),
    })

    expect(mockPrisma.passwordResetToken.findFirst).toHaveBeenCalledWith({
      where: {
        token: expectedHash,
        expiresAt: { gte: expect.any(Date) },
        usedAt: null,
      },
      select: { userId: true },
    })
  })
})

// ---------------------------------------------------------------------------
// hashToken unit test
// ---------------------------------------------------------------------------

describe('hashToken', () => {
  it('produces a deterministic sha256 hex digest', () => {
    const input = 'test-token-abc'
    const result = sha256Hex(input)
    expect(result).toBe(sha256Hex(input))
    expect(result).toHaveLength(64)
    expect(result).toMatch(/^[a-f0-9]+$/)
  })
})
