import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
      avatarUrl: true,
      profileCompletion: true,
      twoFactorEnabled: true,
      emailVerified: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) return NextResponse.json({ authenticated: false }, { status: 200 });

  return NextResponse.json({ 
    authenticated: true, 
    user: {
      ...user,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    },
    expiresAt: session.expires 
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const body = await request.json() as { user?: Record<string, unknown> };
    const userData = body.user;

    if (!userData || typeof userData !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Fetch current email to detect changes
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    // Map profile fields to Prisma fields
    const updateData: Record<string, unknown> = {};
    if ('name' in userData) updateData.name = userData.name;
    if ('email' in userData) {
      // If email changed, reset verification status
      if (currentUser && userData.email !== currentUser.email) {
        updateData.emailVerified = false;
        updateData.emailVerifiedAt = null;
      }
      updateData.email = userData.email;
    }
    if ('phone' in userData) updateData.phone = userData.phone;
    if ('dateOfBirth' in userData) updateData.birthDate = userData.dateOfBirth ? new Date(userData.dateOfBirth as string) : null;
    if ('nationality' in userData) updateData.country = userData.nationality;
    if ('taxIdNumber' in userData) updateData.taxId = userData.taxIdNumber;
    if ('address' in userData) updateData.address = userData.address;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
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
        avatarUrl: true,
        twoFactorEnabled: true,
        profileCompletion: true,
      },
    });

    // Auto-calculate profile completion (weighted: name/email=2x, others=1x)
    const fields: [unknown, number][] = [
      [updatedUser.name, 2],
      [updatedUser.email, 2],
      [updatedUser.phone, 1],
      [updatedUser.birthDate, 1],
      [updatedUser.country, 1],
      [updatedUser.address, 1],
    ];
    const totalWeight = fields.reduce((s, [, w]) => s + w, 0);
    const filledWeight = fields.reduce((s, [v, w]) => s + (v ? w : 0), 0);
    const completion = Math.round((filledWeight / totalWeight) * 100);

    if (completion !== updatedUser.profileCompletion) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { profileCompletion: completion },
      });
    }

    return NextResponse.json({ authenticated: true, user: { ...updatedUser, profileCompletion: completion } });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

