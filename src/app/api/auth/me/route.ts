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
    },
  });

  if (!user) return NextResponse.json({ authenticated: false }, { status: 200 });

  return NextResponse.json({ 
    authenticated: true, 
    user, 
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

    // Map profile fields to Prisma fields
    const updateData: Record<string, unknown> = {};
    if ('name' in userData) updateData.name = userData.name;
    if ('email' in userData) updateData.email = userData.email;
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
      },
    });

    return NextResponse.json({ authenticated: true, user: updatedUser });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

