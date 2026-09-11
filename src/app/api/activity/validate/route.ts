import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  console.log('[SFMC Activity Validate Received]:', body);
  return NextResponse.json({ status: 'ok', isValid: true });
}
