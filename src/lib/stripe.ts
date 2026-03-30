/* eslint-disable unicorn/no-null */

import Stripe from 'stripe'
import { logger } from './logger'
import prisma from '@/clients/prisma'
import { PaymentTier } from '@/enums'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function getTierFromProduct(
  product: Stripe.Product | Stripe.DeletedProduct | string | null | undefined,
): Promise<PaymentTier | undefined> {
  if (!product) return undefined

  const resolved =
    typeof product === 'string'
      ? await stripe.products.retrieve(product)
      : product

  if (resolved.deleted) return undefined

  return resolved.metadata?.PAYMENT_TIER as PaymentTier | undefined
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const userId = session.client_reference_id
  if (!userId) {
    logger.warn(
      '[stripe] checkout.session.completed missing client_reference_id',
    )
    return
  }

  const expanded = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items.data.price.product'],
  })

  const tier = await getTierFromProduct(
    expanded.line_items?.data[0]?.price?.product,
  )

  if (!tier) {
    logger.warn(
      '[stripe] Could not resolve PAYMENT_TIER from product metadata',
      session.id,
    )
    return
  }

  const subscriptionId = session.subscription as string | null

  if (subscriptionId) {
    await stripe.subscriptions.update(subscriptionId, {
      metadata: { userId },
    })
  }

  const subscription = subscriptionId
    ? ((await stripe.subscriptions.retrieve(
        subscriptionId,
      )) as Stripe.Subscription)
    : null

  await prisma.user.update({
    where: { id: userId },
    data: {
      paymentTier: tier,
      stripeCustomerId: session.customer as string,
      currentPeriodEnd: subscription
        ? new Date(subscription.items.data[0].current_period_end * 1000)
        : null,
      pendingPaymentTier: null,
    },
  })

  logger.info(`[stripe] User ${userId} subscribed to ${tier}`)
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  previousAttributes: Partial<Stripe.Subscription>,
) {
  const userId = subscription.metadata?.userId
  if (!userId) {
    logger.warn(
      '[stripe] customer.subscription.updated missing userId in metadata',
    )
    return
  }

  // Ignore updates that aren't price changes (e.g. trial end, metadata
  // updates, billing anchor changes)
  if (previousAttributes?.items === undefined) return

  const expanded = (await stripe.subscriptions.retrieve(subscription.id, {
    expand: ['items.data.price.product'],
  })) as Stripe.Subscription

  const newTier = await getTierFromProduct(
    expanded.items.data[0]?.price?.product,
  )

  if (!newTier) {
    logger.warn(
      '[stripe] Could not resolve PAYMENT_TIER from product metadata',
      subscription.id,
    )
    return
  }

  const currentPeriodEnd = new Date(
    subscription.items.data[0].current_period_end * 1000,
  )

  // Scheduled = downgrade queued for period end; immediate = upgrade now
  const isScheduled = subscription.schedule !== null

  if (isScheduled) {
    await prisma.user.update({
      where: { id: userId },
      data: { currentPeriodEnd, pendingPaymentTier: newTier },
    })
    logger.info(
      `[stripe] User ${userId} downgrade to ${newTier} scheduled for ${currentPeriodEnd.toISOString()}`,
    )
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: {
        paymentTier: newTier,
        currentPeriodEnd,
        pendingPaymentTier: null,
      },
    })
    logger.info(`[stripe] User ${userId} plan changed to ${newTier}`)
  }
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
) {
  const userId = subscription.metadata?.userId
  if (!userId) {
    logger.warn(
      '[stripe] customer.subscription.deleted missing userId in metadata',
    )
    return
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      paymentTier: PaymentTier.FREE,
      currentPeriodEnd: null,
      pendingPaymentTier: null,
    },
  })

  logger.info(`[stripe] Subscription ended for user ${userId} — reset to FREE`)
}
