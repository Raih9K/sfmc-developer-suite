import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  console.log('[SFMC Activity Publish Received]:', body);
  return NextResponse.json({ status: 'ok' });
}
