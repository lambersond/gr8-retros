import { NextRequest, NextResponse } from 'next/server'
import { getSession } from 'next-auth/react'

export async function GET(req: NextRequest) {
  const session = await getSession()
  const link = req.nextUrl.searchParams.get('link')

  // Guard: missing session or link — bounce back to plans
  if (!session?.user || !link) {
    return NextResponse.redirect(new URL('/plans', req.url))
  }

  // Validate that the link points to Stripe — prevents open-redirect abuse
  let stripeUrl: URL
  try {
    stripeUrl = new URL(link)
    if (stripeUrl.hostname !== 'buy.stripe.com') {
      return NextResponse.redirect(new URL('/plans', req.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/plans', req.url))
  }

  // Prefill the user's email and ID so Stripe can associate the checkout
  // with their account and the webhook can find them by client_reference_id
  if (session.user.email) {
    stripeUrl.searchParams.set('prefilled_email', session.user.email)
  }
  if (session.user.id) {
    stripeUrl.searchParams.set('client_reference_id', session.user.id)
  }

  return NextResponse.redirect(stripeUrl.toString())
}
