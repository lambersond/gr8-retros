import { SignJWT } from 'jose'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ token: undefined })
  }

  const key = process.env.SLEEKPLAN_SSO_KEY
  if (!key) {
    return NextResponse.json({ token: undefined })
  }

  const token = await new SignJWT({
    mail: session.user.email,
    id: session.user.id,
    name:
      session.user.name?.toLowerCase().replaceAll(/[^a-z0-9]/g, '') ||
      undefined,
    img: session.user.image ?? undefined,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(key))

  return NextResponse.json({ token })
}
