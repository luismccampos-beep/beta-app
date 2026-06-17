import { NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { isNonEmptyString } from '../../../../lib/auth';

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as LoginBody;

  if (!isNonEmptyString(body.email) || !isNonEmptyString(body.password)) {
    return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
  }

  try {
    const result = await signIn('credentials', {
      email: body.email,
      password: body.password,
      redirect: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }
}

