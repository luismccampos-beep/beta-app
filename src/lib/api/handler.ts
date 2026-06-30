import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

type Handler = (req: Request, ctx: { params: Promise<Record<string, string>> }) => Promise<Response>;
type HandlerWithBody<T> = (req: Request, ctx: { params: Promise<Record<string, string>>; body: T }) => Promise<Response>;

function addCacheHeaders(response: Response, req: Request): Response {
  if (req.method !== 'GET') return response;
  if (response.headers.has('Cache-Control')) return response;

  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'private, no-store, max-age=0');
  headers.set('Vary', 'Accept-Encoding');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function apiHandler(fn: Handler): Handler {
  return async (req, ctx) => {
    try {
      const response = await fn(req, ctx);
      return addCacheHeaders(response, req);
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
      const response = await apiHandler(async (req, ctx) => {
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
      })(req, ctx);
      return response;
    } catch (e) {
      console.error('[API Error]', e);
      return NextResponse.json(
        { ok: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  };
}
