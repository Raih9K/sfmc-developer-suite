import { NextResponse } from 'next/server';
import { sfmcClient } from '@/lib/sfmc-client';

export async function GET() {
  try {
    const dataExtensions = await sfmcClient.getDataExtensions();
    const logs = sfmcClient.getExecutionLogs();
    const isMock = sfmcClient.isMockMode();

    return NextResponse.json({
      success: true,
      mode: isMock ? 'MOCK_SANDBOX' : 'LIVE_SFMC',
      dataExtensions,
      recentActivityLogs: logs,
      stats: {
        totalDataExtensions: dataExtensions.length,
        totalRecords: dataExtensions.reduce((acc, curr) => acc + curr.rowCount, 0),
        activityExecutionsCount: logs.length
      }
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch SFMC schema';
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}
