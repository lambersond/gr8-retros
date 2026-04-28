import * as Ably from 'ably'
import { NextResponse } from 'next/server'
import { getSessionUserIdOrCookie } from '@/lib/auth-handlers'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://gr8-retros.app',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(undefined, { status: 204, headers: corsHeaders })
}

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

  return NextResponse.json(tokenRequest, { headers: corsHeaders })
}
