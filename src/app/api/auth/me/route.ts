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

