import { NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { apiHandler } from '@/lib/api/handler';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const POST = apiHandler(async (req: Request) => {
  const body = LoginSchema.parse(await req.json());

  try {
    await signIn('credentials', {
      email: body.email,
      password: body.password,
      redirect: false,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
      { status: 401 },
    );
  }
});

