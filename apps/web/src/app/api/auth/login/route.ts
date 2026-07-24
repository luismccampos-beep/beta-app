import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { apiHandler } from '@/lib/api/handler';
import { z } from 'zod';
import { headers } from 'next/headers';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const POST = apiHandler(async (req: Request) => {
  const body = LoginSchema.parse(await req.json());

  try {
    await auth.api.signInEmail({
      body: {
        email: body.email,
        password: body.password,
      },
      headers: await headers(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
      { status: 401 },
    );
  }
});
