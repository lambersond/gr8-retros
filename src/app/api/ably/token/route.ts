import * as Ably from 'ably'
import { NextResponse } from 'next/server'
import { getSessionUserIdOrCookie } from '@/lib/auth-handlers'

export async function GET() {
  const apiKey = process.env.ABLY_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing ABLY_API_KEY' }, { status: 500 })
  }

  const client = new Ably.Rest(apiKey)
  const clientId = await getSessionUserIdOrCookie()

  const tokenRequest = await client.auth.createTokenRequest({
    clientId,
  })

  return NextResponse.json(tokenRequest)
}
