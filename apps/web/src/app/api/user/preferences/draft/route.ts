import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const { preferences, step } = body as {
      preferences?: unknown;
      step?: number;
    };

    // Merge draft into existing aiSettings instead of overwriting
    const existing = await prisma.userPreference.findUnique({
      where: { userId },
      select: { aiSettings: true },
    });
    const existingSettings = (existing?.aiSettings as Record<string, unknown>) ?? {};

    const mergedSettings = {
      ...existingSettings,
      draft: preferences ?? {},
      draftStep: step ?? 0,
      draftUpdatedAt: new Date().toISOString(),
    };

    await prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        aiSettings: mergedSettings,
      },
      update: {
        aiSettings: mergedSettings,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save draft:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preference = await prisma.userPreference.findUnique({
      where: { userId },
      select: {
        aiSettings: true,
      },
    });

    const settings = preference?.aiSettings as Record<string, unknown> | null;
    const draft = settings?.draft ?? null;
    const draftStep = settings?.draftStep ?? 0;
    const draftUpdatedAt = settings?.draftUpdatedAt ?? null;

    return NextResponse.json({
      draft,
      draftStep,
      draftUpdatedAt,
    });
  } catch (error) {
    console.error('Failed to load draft:', error);
    return NextResponse.json(
      { error: 'Failed to load draft' },
      { status: 500 }
    );
  }
}
