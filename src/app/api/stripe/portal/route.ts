import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/clients/prisma'
import { withUser } from '@/lib/auth-handlers'
import { stripe } from '@/lib/stripe'

export const POST = withUser(
  async (req: NextRequest, _context: unknown, user: { id: string }) => {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    })

    if (!dbUser?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active subscription' },
        { status: 400 },
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      // eslint-disable-next-line camelcase
      return_url: `${req.nextUrl.origin}/me`,
    })

    return NextResponse.json({ url: session.url })
  },
)
