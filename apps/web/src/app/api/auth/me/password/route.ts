import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { prisma } from '../../../../../lib/prisma';
import { sendPasswordChangeNotification } from '../../../../../lib/email';
import bcrypt from 'bcryptjs';
import { apiHandler } from '@/lib/api/handler';

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const PUT = apiHandler(async (req: Request) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { currentPassword, newPassword } = ChangePasswordSchema.parse(await req.json());

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      password: true,
      email: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!user.password) {
    return NextResponse.json(
      { error: 'This account uses social login. Password change is not available.' },
      { status: 400 },
    );
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: 'Current password is incorrect' },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  void sendPasswordChangeNotification({ to: user.email, baseUrl });

  return NextResponse.json({ success: true });
});
