import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../../lib/prisma';
import { signIn } from '@/auth';
import { isNonEmptyString } from '../../../../lib/auth';
import { sendVerificationEmail } from '../../../../lib/email';
import crypto from 'crypto';

function registerErrorResponse(err: unknown): { message: string; status: number } {
  console.error('[POST /api/auth/register]', err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const fields = err.meta?.target;
      const target = Array.isArray(fields) ? fields.join(', ') : String(fields ?? '');
      if (target.includes('email')) {
        return { message: 'Email already in use', status: 409 };
      }
      if (target.includes('phone')) {
        return { message: 'Phone number already in use', status: 409 };
      }
      return { message: 'Some of this data is already registered', status: 409 };
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      message:
        'Could not connect to the database. On Vercel, confirm DATABASE_URL and that MySQL allows remote connections.',
      status: 503,
    };
  }

  const msg = err instanceof Error ? err.message : '';
  if (/Can't reach database server|ECONNREFUSED|ETIMEDOUT|P1001|P1000/i.test(msg)) {
    return {
      message:
        'Could not connect to the database. Check DATABASE_URL and firewall / remote access for your MySQL host.',
      status: 503,
    };
  }

  return { message: 'Registration failed', status: 500 };
}

type RegisterBody = {
  email?: unknown;
  password?: unknown;
  name?: unknown;
  phone?: unknown;
  /** Optional `YYYY-MM-DD` (stored as date-only on the user). */
  birthDate?: unknown;
  agreeToTerms?: unknown;
};

function parseOptionalBirthDate(value: unknown): Date | undefined {
  if (typeof value !== 'string') return undefined;
  const s = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const [y, m, d] = s.split('-').map((x) => Number(x));
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return undefined;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(dt.getTime())) return undefined;
  return dt;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as RegisterBody;

  if (!isNonEmptyString(body.email)) {
    return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
  }
  if (!isNonEmptyString(body.password) || body.password.length < 8) {
    return NextResponse.json(
      { success: false, message: 'Password must be at least 8 characters' },
      { status: 400 },
    );
  }
  if (body.agreeToTerms !== true) {
    return NextResponse.json(
      { success: false, message: 'You must accept the terms' },
      { status: 400 },
    );
  }

  const email = body.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(body.password, 12);

  try {
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 409 });
    }

    const birthDate = parseOptionalBirthDate(body.birthDate);

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: isNonEmptyString(body.name) ? body.name.trim() : null,
        phone: isNonEmptyString(body.phone) ? body.phone.trim() : null,
        birthDate,
        termsAccepted: true,
        acceptedTermsDate: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Auto-login using Auth.js
    await signIn('credentials', {
      email,
      password: body.password as string,
      redirect: false,
    });

    // Auto-send verification email (non-blocking, don't fail registration if email fails)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
    const verificationToken = crypto.randomBytes(32).toString('hex');
    void prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        email: user.email,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    }).then(() => sendVerificationEmail({ to: user.email, token: verificationToken, baseUrl }));

    return NextResponse.json({ success: true, user });
  } catch (err) {
    const { message, status } = registerErrorResponse(err);
    return NextResponse.json({ success: false, message }, { status });
  }
}

