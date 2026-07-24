import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth/auth', () => ({
  auth: {
    api: {
      signInEmail: vi.fn(),
      signUpEmail: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    emailVerificationToken: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/email', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

import { POST as loginPOST } from '../login/route';
import { POST as registerPOST } from '../register/route';
import { POST as forgotPasswordPOST } from '../forgot-password/route';
import { POST as resetPasswordPOST } from '../reset-password/route';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// Prisma's generic types are too deep for vi.mocked() — cast to any to avoid TS2589
const asMock = (fn: unknown) => fn as ReturnType<typeof vi.fn>;

function makeRequest(body: unknown, method = 'POST'): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/login', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid email', async () => {
    const req = makeRequest({ email: 'not-an-email', password: 'password123' });
    const res = await loginPOST(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(400);
  });

  it('returns 400 for missing password', async () => {
    const req = makeRequest({ email: 'test@example.com' });
    const res = await loginPOST(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(400);
  });

  it('returns 200 on successful login', async () => {
    asMock(auth.api.signInEmail).mockResolvedValue({ error: null } as never);
    const req = makeRequest({ email: 'test@example.com', password: 'password123' });
    const res = await loginPOST(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it('returns 401 on invalid credentials', async () => {
    asMock(auth.api.signInEmail).mockRejectedValue(new Error('CredentialsSignin'));
    const req = makeRequest({ email: 'test@example.com', password: 'wrong' });
    const res = await loginPOST(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.code).toBe('INVALID_CREDENTIALS');
  });
});

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid email', async () => {
    const req = makeRequest({ email: 'bad', password: '12345678', agreeToTerms: true });
    const res = await registerPOST(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(400);
  });

  it('returns 400 for short password', async () => {
    const req = makeRequest({ email: 'test@example.com', password: '123', agreeToTerms: true });
    const res = await registerPOST(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(400);
  });

  it('returns 400 when agreeToTerms is false', async () => {
    const req = makeRequest({ email: 'test@example.com', password: '12345678', agreeToTerms: false });
    const res = await registerPOST(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(400);
  });

  it('returns 409 for existing email', async () => {
    asMock(prisma.user.findUnique).mockResolvedValue({ id: 'existing-id' } as never);
    const req = makeRequest({ email: 'taken@example.com', password: '12345678', agreeToTerms: true });
    const res = await registerPOST(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.code).toBe('EMAIL_EXISTS');
  });

  it('creates user and returns 200 on success', async () => {
    asMock(prisma.user.findUnique).mockResolvedValue(null);
    asMock(auth.api.signUpEmail).mockResolvedValue({ error: null } as never);
    asMock(prisma.user.update).mockResolvedValue({} as never);
    asMock(prisma.user.findUnique).mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'new-id', email: 'new@example.com', name: null });
    asMock(prisma.emailVerificationToken.create).mockResolvedValue({} as never);

    const req = makeRequest({ email: 'new@example.com', password: '12345678', agreeToTerms: true });
    const res = await registerPOST(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.user.email).toBe('new@example.com');
  });
});

describe('POST /api/auth/forgot-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid email', async () => {
    const req = makeRequest({ email: 'not-valid' });
    const res = await forgotPasswordPOST(req);
    expect(res.status).toBe(400);
  });

  it('returns success even for non-existent email (prevents enumeration)', async () => {
    asMock(prisma.user.findUnique).mockResolvedValue(null);
    const req = makeRequest({ email: 'nonexistent@example.com' });
    const res = await forgotPasswordPOST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('sets reset token for existing user', async () => {
    asMock(prisma.user.findUnique).mockResolvedValue({ id: 'user-1', email: 'user@example.com' } as never);
    asMock(prisma.user.update).mockResolvedValue({} as never);

    const req = makeRequest({ email: 'user@example.com' });
    const res = await forgotPasswordPOST(req);
    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: expect.objectContaining({
          passwordResetToken: expect.any(String),
          passwordResetExpires: expect.any(Date),
        }),
      }),
    );
  });
});

describe('POST /api/auth/reset-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid token', async () => {
    asMock(prisma.user.findFirst).mockResolvedValue(null);
    const req = makeRequest({ token: '', password: '12345678' });
    const res = await resetPasswordPOST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for short password', async () => {
    const req = makeRequest({ token: 'valid-token', password: '123' });
    const res = await resetPasswordPOST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for expired token', async () => {
    asMock(prisma.user.findFirst).mockResolvedValue(null);
    const req = makeRequest({ token: 'expired-token', password: '12345678' });
    const res = await resetPasswordPOST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('Invalid or expired');
  });

  it('updates password and returns 200 on success', async () => {
    asMock(prisma.user.findFirst).mockResolvedValue({ id: 'user-1', email: 'user@example.com' } as never);
    asMock(prisma.user.update).mockResolvedValue({} as never);

    const req = makeRequest({ token: 'valid-token', password: 'newpassword123' });
    const res = await resetPasswordPOST(req);
    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: expect.objectContaining({
          passwordResetToken: null,
          passwordResetExpires: null,
        }),
      }),
    );
  });
});
