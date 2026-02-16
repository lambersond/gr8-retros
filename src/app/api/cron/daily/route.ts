import { NextRequest, NextResponse } from 'next/server'
import { dailyCleanup } from '@/server/cleanup-service'

export async function GET(request: NextRequest) {
  // Verify the request is from the cron job (add your own authentication)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dailyCleanup()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to clean up cards:', error)
    return NextResponse.json(
      { error: 'Failed to clean up cards' },
      { status: 500 },
    )
  }
}
