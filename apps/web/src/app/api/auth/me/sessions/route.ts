import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { prisma } from '../../../../../lib/prisma';
import { apiHandler } from '@/lib/api/handler';

const RevokeSessionSchema = z.object({
  sessionId: z.string().optional(),
});

// GET /api/auth/me/sessions — list all active sessions for the current user
export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessions = await prisma.session.findMany({
    where: {
      userId,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      deviceInfo: true,
      ipAddress: true,
      createdAt: true,
      lastUsedAt: true,
      lastActivityAt: true,
      expiresAt: true,
    },
    orderBy: { lastActivityAt: 'desc' },
  });

  // The most recently active session is considered "current" since JWT strategy
  // doesn't expose session tokens on the auth() object.
  const mostRecentId = sessions.length > 0 ? sessions[0].id : null;

  return NextResponse.json({
    sessions: sessions.map((s) => ({
      id: s.id,
      device: s.deviceInfo ?? {},
      ipAddress: s.ipAddress,
      createdAt: s.createdAt.toISOString(),
      lastUsedAt: s.lastUsedAt.toISOString(),
      lastActivityAt: s.lastActivityAt.toISOString(),
      expiresAt: s.expiresAt.toISOString(),
      isCurrent: s.id === mostRecentId,
    })),
  });
}

// DELETE /api/auth/me/sessions — revoke sessions
// Body: { sessionId?: string } — if provided, revoke that session; otherwise revoke ALL except current
export const DELETE = apiHandler(async (req: Request) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId } = RevokeSessionSchema.parse(await req.json());

  if (sessionId) {
    const targetSession = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    });

    if (!targetSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 },
      );
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, revoked: [sessionId] });
  }

  const userId = session.user.id;
  const sessions = await prisma.session.findMany({
    where: { userId, isRevoked: false },
    select: { id: true },
    orderBy: { lastActivityAt: 'desc' },
  });

  if (sessions.length === 0) {
    return NextResponse.json({ success: true, revokedCount: 0 });
  }

  const currentSessionId = sessions[0].id;
  const result = await prisma.session.updateMany({
    where: {
      userId,
      isRevoked: false,
      NOT: { id: currentSessionId },
    },
    data: {
      isRevoked: true,
      revokedAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    revokedCount: result.count,
  });
});
