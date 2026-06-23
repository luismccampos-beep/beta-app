import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '../../../../../lib/prisma';
import { sendVerificationEmail } from '../../../../../lib/email';
import crypto from 'crypto';

// POST /api/auth/me/verify-email — send a verification email to the current user
export async function POST() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      emailVerified: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.emailVerified) {
    return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
  }

  // Generate a verification token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Upsert: delete any existing tokens for this user, then create a new one
  await prisma.emailVerificationToken.deleteMany({
    where: { userId },
  });

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      token,
      email: user.email,
      expiresAt,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

  // Send verification email via Resend
  const result = await sendVerificationEmail({
    to: user.email,
    token,
    baseUrl,
  });

  if (!result.success) {
    // In dev, still return success with the URL so the user can verify manually
    if (process.env.NODE_ENV !== 'production') {
      const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}`;
      console.log(`[DEV] Email send failed, verification URL: ${verifyUrl}`);
      return NextResponse.json({
        success: true,
        message: 'Email sending unavailable in development. Use the verify URL.',
        verifyUrl,
      });
    }
    return NextResponse.json(
      { error: 'Failed to send verification email. Please try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Verification email sent',
  });
}
