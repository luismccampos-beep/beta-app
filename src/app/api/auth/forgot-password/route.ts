import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prisma';
import { sendPasswordResetEmail } from '../../../../lib/email';
import crypto from 'crypto';

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const { email } = ForgotPasswordSchema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordResetToken: token, passwordResetExpires: expires },
      });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      await sendPasswordResetEmail({ to: user.email, token, baseUrl }).catch((err) =>
        console.error('[forgot-password] Failed to send email:', err),
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    console.error('[forgot-password] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
