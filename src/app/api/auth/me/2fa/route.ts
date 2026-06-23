import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '../../../../../lib/prisma';
import * as OTPAuth from 'otpauth';

const APP_NAME = 'AKMLEVA';

// GET /api/auth/me/2fa — returns current 2FA status and setup info
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      twoFactorEnabled: true,
      email: true,
      twoFactorBackupCode: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.twoFactorEnabled) {
    // Already enabled — return status only (no secret)
    return NextResponse.json({
      enabled: true,
      hasBackupCodes: Array.isArray(user.twoFactorBackupCode) && (user.twoFactorBackupCode as string[]).length > 0,
    });
  }

  // Not enabled — generate a new TOTP secret for setup
  const totp = new OTPAuth.TOTP({
    issuer: APP_NAME,
    label: user.email ?? 'user',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: new OTPAuth.Secret({ size: 20 }),
  });

  const uri = totp.toString();
  const secretBase32 = totp.secret.base32;

  // Store the secret temporarily (not yet verified/enabled)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorSecret: secretBase32 },
  });

  return NextResponse.json({
    enabled: false,
    secret: secretBase32,
    uri,
  });
}

// POST /api/auth/me/2fa — enable 2FA after verifying a TOTP code
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json() as { code?: string };
    const { code } = body;

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit code' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorSecret: true,
        twoFactorEnabled: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is already enabled' },
        { status: 400 },
      );
    }

    if (!user.twoFactorSecret) {
      return NextResponse.json(
        { error: 'No pending 2FA setup. Please request a new secret first.' },
        { status: 400 },
      );
    }

    // Verify the code against the stored secret
    const totp = new OTPAuth.TOTP({
      issuer: APP_NAME,
      label: user.email ?? 'user',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
    });

    const delta = totp.validate({ token: code, window: 1 });

    if (delta === null) {
      return NextResponse.json(
        { error: 'Invalid code. Please check your authenticator app and try again.' },
        { status: 400 },
      );
    }

    // Generate backup codes
    const backupCodes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase(),
    );

    // Enable 2FA
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorBackupCode: backupCodes,
      },
    });

    return NextResponse.json({
      success: true,
      backupCodes,
    });
  } catch (error) {
    console.error('2FA enable failed:', error);
    return NextResponse.json(
      { error: 'Failed to enable 2FA' },
      { status: 500 },
    );
  }
}

// DELETE /api/auth/me/2fa — disable 2FA (requires password verification)
export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json() as { password?: string };
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required to disable 2FA' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        password: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is not enabled' },
        { status: 400 },
      );
    }

    // Verify password before disabling
    const bcrypt = await import('bcryptjs');
    if (!user.password) {
      return NextResponse.json(
        { error: 'Cannot verify password for this account' },
        { status: 400 },
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCode: [],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('2FA disable failed:', error);
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 },
    );
  }
}
