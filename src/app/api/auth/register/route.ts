import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';

import { prisma } from '../../../../lib/prisma';
import { isNonEmptyString, SESSION_COOKIE_NAME } from '../../../../lib/auth';

type RegisterBody = {
  email?: unknown;
  password?: unknown;
  name?: unknown;
  phone?: unknown;
  agreeToTerms?: unknown;
};

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

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: isNonEmptyString(body.name) ? body.name.trim() : null,
        phone: isNonEmptyString(body.phone) ? body.phone.trim() : null,
        termsAccepted: true,
        acceptedTermsDate: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Create session + cookie (auto-login after registration)
    const token = randomBytes(48).toString('base64url');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
      select: { id: true },
    });

    (await cookies()).set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: expiresAt,
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Registration failed' }, { status: 500 });
  }
}

