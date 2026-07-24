import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { z } from 'zod';

import { prisma } from '../../../../lib/prisma';
import { auth } from '@/lib/auth/auth';
import { apiHandler } from '@/lib/api/handler';
import { sendVerificationEmail } from '../../../../lib/email';
import { headers } from 'next/headers';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  agreeToTerms: z.literal(true),
});

export const POST = apiHandler(async (req: Request) => {
  const body = RegisterSchema.parse(await req.json());
  const email = body.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return NextResponse.json({ ok: false, error: 'Email already in use', code: 'EMAIL_EXISTS' }, { status: 409 });
  }

  let birthDate: Date | undefined;
  if (body.birthDate) {
    const [y, m, d] = body.birthDate.split('-').map(Number);
    if (y && m && d) birthDate = new Date(Date.UTC(y, m - 1, d));
  }

  await auth.api.signUpEmail({
    body: {
      email,
      password: body.password,
      name: body.name?.trim() ?? '',
    },
    headers: await headers(),
  });

  await prisma.user.update({
    where: { email },
    data: {
      phone: body.phone?.trim() ?? null,
      birthDate,
      termsAccepted: true,
      acceptedTermsDate: new Date(),
    },
  });

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const verificationToken = crypto.randomBytes(32).toString('hex');
  void prisma.emailVerificationToken.create({
    data: {
      userId: user!.id,
      token: verificationToken,
      email: user!.email,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  }).then(() => sendVerificationEmail({ to: user!.email, token: verificationToken, baseUrl }));

  return NextResponse.json({ ok: true, user });
});
