import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../../lib/prisma';
import { auth } from '@/auth';

type PreferencePayload = Record<string, unknown>;

async function getAuthenticatedUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return NextResponse.json({ authenticated: false }, { status: 401 });

  const preference = await prisma.userPreference.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
      budgetRangeMin: true,
      budgetRangeMax: true,
      preferredAccommodationType: true,
      favoriteActivities: true,
      favoriteDestinationTypes: true,
      dietaryRestrictions: true,
      pacePreference: true,
      travelStyle: true,
      aiSettings: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ authenticated: true, preference });
}

export async function PUT(req: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return NextResponse.json({ authenticated: false }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { preferences?: PreferencePayload };
  const prefs = body.preferences;
  if (!prefs || typeof prefs !== 'object') {
    return NextResponse.json({ success: false, message: 'Invalid preferences payload' }, { status: 400 });
  }

  const budgetRange = Array.isArray(prefs.budgetRange) ? prefs.budgetRange : null;
  const budgetMin = typeof budgetRange?.[0] === 'number' ? budgetRange[0] : null;
  const budgetMax = typeof budgetRange?.[1] === 'number' ? budgetRange[1] : null;

  const preferredDestinations = Array.isArray(prefs.preferredDestinations)
    ? prefs.preferredDestinations.filter((v): v is string => typeof v === 'string')
    : [];
  const travelStyles = Array.isArray(prefs.travelStyles)
    ? prefs.travelStyles.filter((v): v is string => typeof v === 'string')
    : [];
  const accommodationType = Array.isArray(prefs.accommodationType)
    ? prefs.accommodationType.filter((v): v is string => typeof v === 'string')
    : null;
  const dietaryRestrictions = Array.isArray(prefs.dietaryRestrictions)
    ? prefs.dietaryRestrictions.filter((v): v is string => typeof v === 'string')
    : [];

  const jsonPrefs = JSON.parse(JSON.stringify(prefs)) as Prisma.InputJsonValue;

  const saved = await prisma.userPreference.upsert({
    where: { userId },
    create: {
      userId,
      budgetRangeMin: budgetMin,
      budgetRangeMax: budgetMax,
      favoriteDestinationTypes: preferredDestinations,
      favoriteActivities: Array.isArray(prefs.activityTypes)
        ? prefs.activityTypes.filter((v): v is string => typeof v === 'string')
        : [],
      travelStyle: travelStyles[0] ?? null,
      pacePreference: typeof prefs.pacePreference === 'string' ? prefs.pacePreference : null,
      preferredAccommodationType: accommodationType ?? undefined,
      dietaryRestrictions,
      aiSettings: jsonPrefs,
    },
    update: {
      budgetRangeMin: budgetMin,
      budgetRangeMax: budgetMax,
      favoriteDestinationTypes: preferredDestinations,
      favoriteActivities: Array.isArray(prefs.activityTypes)
        ? prefs.activityTypes.filter((v): v is string => typeof v === 'string')
        : [],
      travelStyle: travelStyles[0] ?? null,
      pacePreference: typeof prefs.pacePreference === 'string' ? prefs.pacePreference : null,
      preferredAccommodationType: accommodationType ?? undefined,
      dietaryRestrictions,
      aiSettings: jsonPrefs,
    },
    select: {
      id: true,
      userId: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ success: true, saved });
}

