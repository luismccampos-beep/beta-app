import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional().default(''),
  subject: z.string().min(1).max(100),
  message: z.string().min(1).max(5000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // In production, send to email/Slack/CRM here
    console.log('[Contact]', {
      ...data,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      message: 'Mensagem recebida com sucesso. Responderemos em breve.',
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: 'Validation failed', issues: e.issues },
        { status: 400 },
      );
    }
    console.error('[Contact Error]', e);
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
