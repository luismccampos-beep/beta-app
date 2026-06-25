import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

type Handler = (req: Request, ctx: { params: Promise<Record<string, string>> }) => Promise<Response>;
type HandlerWithBody<T> = (req: Request, ctx: { params: Promise<Record<string, string>>; body: T }) => Promise<Response>;

export function apiHandler(fn: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      console.error('[API Error]', e);

      if (e instanceof ZodError) {
        return NextResponse.json(
          { ok: false, error: 'Validation failed', issues: e.issues },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { ok: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  };
}

export function apiHandlerWithBody<T>(schema: { parse: (data: unknown) => T }, fn: HandlerWithBody<T>): Handler {
  return async (req, ctx) => {
    try {
      let body: T;
      try {
        const raw = await req.json();
        body = schema.parse(raw);
      } catch (e) {
        if (e instanceof ZodError) {
          return NextResponse.json(
            { ok: false, error: 'Validation failed', issues: e.issues },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { ok: false, error: 'Invalid JSON body', code: 'INVALID_JSON' },
          { status: 400 }
        );
      }
      return await fn(req, { params: ctx.params, body });
    } catch (e) {
      console.error('[API Error]', e);
      return NextResponse.json(
        { ok: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  };
}
