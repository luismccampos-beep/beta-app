import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { z } from 'zod';

import { prisma } from '../../../../lib/prisma';
import { signIn } from '@/auth';
import { apiHandler } from '@/lib/api/handler';
import { sendVerificationEmail } from '../../../../lib/email';

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
  const passwordHash = await bcrypt.hash(body.password, 12);

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return NextResponse.json({ ok: false, error: 'Email already in use', code: 'EMAIL_EXISTS' }, { status: 409 });
  }

  let birthDate: Date | undefined;
  if (body.birthDate) {
    const [y, m, d] = body.birthDate.split('-').map(Number);
    if (y && m && d) birthDate = new Date(Date.UTC(y, m - 1, d));
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      name: body.name?.trim() ?? null,
      phone: body.phone?.trim() ?? null,
      birthDate,
      termsAccepted: true,
      acceptedTermsDate: new Date(),
    },
    select: { id: true, email: true, name: true },
  });

  await signIn('credentials', { email, password: body.password, redirect: false });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const verificationToken = crypto.randomBytes(32).toString('hex');
  void prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token: verificationToken,
      email: user.email,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  }).then(() => sendVerificationEmail({ to: user.email, token: verificationToken, baseUrl }));

  return NextResponse.json({ ok: true, user });
});

