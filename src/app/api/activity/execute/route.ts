import { NextResponse } from 'next/server';
import { sfmcClient } from '@/lib/sfmc-client';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('[SFMC Journey Activity Execute Received]:', JSON.stringify(payload, null, 2));

    // SFMC provides arguments in inArguments array
    const inArgsArray = payload.inArguments || [];
    const inArgs: Record<string, unknown> = {};
    inArgsArray.forEach((argObj: Record<string, unknown>) => {
      Object.assign(inArgs, argObj);
    });

    const contactKey = (inArgs.contactKey as string) || payload.keyValue || 'UNKNOWN-CONTACT';
    const email = (inArgs.email as string) || 'unknown@domain.com';
    const cartValue = Number(inArgs.cartValue || 0);
    const channel = (inArgs.notificationChannel as string) || 'WhatsApp';

    // Business Logic: Generate dynamic reward code based on cart value
    let discount = 'WELCOME-5';
    if (cartValue > 100) {
      discount = 'VIP-25OFF';
    } else if (cartValue > 50) {
      discount = 'SPECIAL-15OFF';
    }

    // Record execution into our audit log
    const log = sfmcClient.recordExecution({
      contactKey,
      journeyName: payload.journeyName || 'Simulated E-Commerce Journey',
      activityName: 'Smart Webhook & Loyalty Rewarder',
      status: 'SUCCESS',
      inArguments: inArgs,
      outArguments: {
        messageSent: true,
        channelUsed: channel,
        rewardCode: discount,
        recipientEmail: email,
        processedAt: new Date().toISOString()
      }
    });

    // SFMC expects a 200 OK with outArguments object
    return NextResponse.json({
      status: 'ok',
      branchResult: 'success',
      outArguments: log.outArguments
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown execution error';
    console.error('[Execute Error]:', errMsg);

    return NextResponse.json(
      { status: 'error', message: errMsg },
      { status: 500 }
    );
  }
}
