import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const { token, password } = ResetPasswordSchema.parse(await req.json());

    const user = await prisma.user.findFirst({
      where: { passwordResetToken: token, passwordResetExpires: { gte: new Date() } },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        passwordChangedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    console.error('[reset-password] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
