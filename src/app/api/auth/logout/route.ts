import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { prisma } from '../../../../lib/prisma';
import { SESSION_COOKIE_NAME } from '../../../../lib/auth';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.updateMany({
      where: { token },
      data: { isRevoked: true, revokedAt: new Date() },
    });
  }

  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  });

  return NextResponse.json({ success: true });
}

