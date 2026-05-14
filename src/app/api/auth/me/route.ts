import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { prisma } from '../../../../lib/prisma';
import { SESSION_COOKIE_NAME } from '../../../../lib/auth';

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 200 });

  const session = await prisma.session.findFirst({
    where: {
      token,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
    select: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          birthDate: true,
          address: true,
          country: true,
          taxId: true,
        },
      },
      expiresAt: true,
    },
  });

  if (!session) return NextResponse.json({ authenticated: false }, { status: 200 });

  return NextResponse.json({ authenticated: true, user: session.user, expiresAt: session.expiresAt });
}

