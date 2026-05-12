import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';

import { prisma } from '../../../../lib/prisma';
import { isNonEmptyString, SESSION_COOKIE_NAME } from '../../../../lib/auth';

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as LoginBody;

  if (!isNonEmptyString(body.email) || !isNonEmptyString(body.password)) {
    return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, password: true },
  });

  if (!user?.password) {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }

  const ok = await bcrypt.compare(body.password, user.password);
  if (!ok) {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }

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

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
    select: { id: true },
  });

  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });

  return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
}

