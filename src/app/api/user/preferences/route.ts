import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../../lib/prisma';
import { auth } from '@/auth';
import { apiHandler } from '@/lib/api/handler';

const UpdatePreferencesSchema = z.object({
  preferences: z.object({
    budgetRange: z.array(z.number()).length(2).optional(),
    preferredDestinations: z.array(z.string()).optional(),
    travelStyles: z.array(z.string()).optional(),
    accommodationType: z.array(z.string()).optional(),
    dietaryRestrictions: z.array(z.string()).optional(),
    activityTypes: z.array(z.string()).optional(),
    pacePreference: z.string().optional(),
  }),
});

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

export const PUT = apiHandler(async (req: Request) => {
  const userId = await getAuthenticatedUserId();
  if (!userId) return NextResponse.json({ authenticated: false }, { status: 401 });

  const { preferences: prefs } = UpdatePreferencesSchema.parse(await req.json());

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
});

