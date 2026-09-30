import { NextResponse } from 'next/server'
import { sleekplanService } from '@/server/sleekplan'

// Exposes the published changelog entries to the client (the Sleekplan API key
// stays server-side). Returns an empty list when the key is unset or the
// upstream call fails, so the UI degrades gracefully.
export async function GET() {
  const items = await sleekplanService.getChangelogUpdates()
  return NextResponse.json({ items })
}
