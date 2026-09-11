import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  console.log('[SFMC Lifecycle Event Received]:', request.url, body);
  
  // Journey Builder expects a 200 OK
  return NextResponse.json({
    status: 'ok',
    message: 'Activity lifecycle event successfully handled'
  });
}
