import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET /api/auth/verify-email/[token] — validate token and mark email as verified
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  if (!token || typeof token !== 'string') {
    return NextResponse.redirect(
      new URL('/auth/verify-email?status=invalid', request.url),
    );
  }

  // Look up the token
  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { token },
    select: {
      tokenId: true,
      userId: true,
      email: true,
      expiresAt: true,
    },
  });

  // Token not found
  if (!verificationToken) {
    return NextResponse.redirect(
      new URL('/auth/verify-email?status=invalid', request.url),
    );
  }

  // Token expired
  if (new Date() > verificationToken.expiresAt) {
    // Clean up expired token
    await prisma.emailVerificationToken.delete({
      where: { tokenId: verificationToken.tokenId },
    });

    return NextResponse.redirect(
      new URL('/auth/verify-email?status=expired', request.url),
    );
  }

  // Verify the email in a transaction: update user + delete token
  await prisma.$transaction([
    prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.emailVerificationToken.delete({
      where: { tokenId: verificationToken.tokenId },
    }),
  ]);

  return NextResponse.redirect(
    new URL('/auth/verify-email?status=success', request.url),
  );
}
