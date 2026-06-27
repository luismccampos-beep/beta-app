import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { prisma } from '../../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json().catch(() => ({}));

    const {
      sessionId,
      preferenceType,
      action,
      newValue,
      context,
    } = body as {
      sessionId?: string;
      preferenceType?: string;
      action?: string;
      newValue?: unknown;
      context?: unknown;
    };

    if (!preferenceType || !action) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Prisma Json fields need explicit cast for InputJsonValue compatibility
    await prisma.preferenceEvent.create({
      data: {
        userId: session?.user?.id ?? null,
        sessionId: sessionId ?? 'unknown',
        preferenceType,
        action,
        newValue: JSON.parse(JSON.stringify(newValue ?? {})),
        context: JSON.parse(JSON.stringify(context ?? {})),
      } as Record<string, unknown>,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[analytics] Failed to save preference event:', error);
    return NextResponse.json(
      { success: false, message: 'Internal error' },
      { status: 500 },
    );
  }
}
