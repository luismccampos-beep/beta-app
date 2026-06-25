import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  url.pathname = url.pathname.replace('/api/travel/', '/api/travel/v1/');
  return NextResponse.redirect(url, 301);
}
