'use client'

import clsx from 'classnames'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { stripeLink } from '@/constants/plans'
import type { PlanCardProps } from './types'

export function PlanCard({ plan, isYearly }: Readonly<PlanCardProps>) {
  const router = useRouter()
  const { data: session } = useSession()

  const displayPrice =
    isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price
  const displayNote =
    isYearly && plan.yearlyPriceNote ? plan.yearlyPriceNote : plan.priceNote

  function handleCta() {
    switch (plan.cta) {
      case 'home': {
        router.push('/')
        break
      }

      case 'google-signin': {
        signIn('google', { callbackUrl: '/me' })
        break
      }

      case 'checkout': {
        const link = stripeLink(plan, isYearly)
        if (!link) return

        if (!session?.user) {
          // Not logged in — go through login first, then stripe redirect route
          signIn('google', {
            callbackUrl: `/api/stripe/redirect?link=${encodeURIComponent(link)}`,
          })
          return
        }

        // Already logged in — go straight to Stripe, prefilling their details
        const url = new URL(link)
        if (session.user.email) {
          url.searchParams.set('prefilled_email', session.user.email)
        }
        if (session.user.id) {
          // Comes back as client_reference_id in the webhook so we can
          // match the Stripe checkout to the correct user record
          url.searchParams.set('client_reference_id', session.user.id)
        }
        globalThis.location.href = url.toString()
        break
      }
    }
  }

  return (
    <div
      className={clsx(
        'relative flex flex-col rounded-2xl border-2 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        plan.accentColor,
      )}
    >
      {plan.highlight && (
        <div className='absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap'>
          <span className='rounded-full bg-amber-400 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm'>
            Most Popular
          </span>
        </div>
      )}

      {/* Pricing */}
      <div className='mb-5'>
        <span
          className={clsx(
            'mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest',
            plan.badgeColor,
          )}
        >
          {plan.label}
        </span>

        <div className='flex items-end gap-1'>
          <span className='text-4xl font-black tracking-tight text-text-primary'>
            {displayPrice}
          </span>
          {displayNote && (
            <span className='mb-1 text-sm text-text-secondary'>
              {displayNote}
            </span>
          )}
        </div>

        {/* Swap tagline for savings callout when yearly is active */}
        {isYearly && plan.yearlySavings ? (
          <p className='mt-1 h-5 text-xs font-semibold text-emerald-600'>
            {plan.yearlySavings}
          </p>
        ) : (
          <p className='mt-1 h-5 text-sm text-text-secondary'>{plan.tagline}</p>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={handleCta}
        className={clsx(
          'mb-6 w-full cursor-pointer rounded-xl py-2.5 text-sm font-medium transition-all duration-200 hover:shadow-sm',
          plan.buttonColor,
        )}
      >
        {plan.ctaLabel}
      </button>

      <div className='mb-4 border-t border-slate-100' />

      {plan.inheritLabel && (
        <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary'>
          {plan.inheritLabel}
        </p>
      )}

      {/* Features */}
      <ul className='flex flex-col gap-2.5'>
        {plan.features.map(feature => (
          <li key={feature.label} className='flex items-start gap-2.5'>
            <span
              className={clsx(
                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                plan.checkColor,
              )}
            >
              <Check />
            </span>
            <span className='text-sm leading-snug text-text-secondary'>
              {feature.label}
              {feature.soon && (
                <span className='ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary'>
                  Soon
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
