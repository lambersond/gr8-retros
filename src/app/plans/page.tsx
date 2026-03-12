'use client'

import { useState } from 'react'
import clsx from 'classnames'
import { Check } from 'lucide-react'
import { PLANS } from '@/constants/plans'

type Billing = 'monthly' | 'yearly'

export default function PlansPage() {
  const [billing, setBilling] = useState<Billing>('monthly')
  const isYearly = billing === 'yearly'

  return (
    <div
      className='bg-page py-12 max-h-[calc(100vh_-_--spacing(23))] min-h-[calc(100vh_-_--spacing(23))] overflow-y-auto'
      style={{
        backgroundImage:
          'linear-gradient(to right, #e2e8f05d 1px, transparent 1px), linear-gradient(to bottom, #e2e8f05d 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <div className='mx-auto mb-16 max-w-2xl text-center'>
        <p className='mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500'>
          Pricing
        </p>
        <h1 className='mb-4 text-5xl font-black leading-none tracking-tight text-slate-900'>
          Retros that fit
          <br />
          <span className='text-amber-500'>every team.</span>
        </h1>
        <p className='text-base text-slate-500'>
          Start free with no account. Scale only when you need to. Cancel
          anytime.
        </p>

        {/* Billing toggle */}
        <div className='mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1 shadow-sm'>
          <button
            onClick={() => setBilling('monthly')}
            className={clsx(
              'rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer',
              {
                'text-slate-500 hover:text-slate-700': isYearly,
                'bg-amber-500 text-white shadow-sm': !isYearly,
              },
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={clsx(
              'flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer',
              {
                'bg-amber-500 text-white shadow-sm': isYearly,
                'text-slate-500 hover:text-slate-700': !isYearly,
              },
            )}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className='relative mx-auto min-w-0 xl:min-w-2xl px-8 md:px-16 lg:max-w-7xl xl:max-w-[1640px] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {PLANS.map(plan => {
          const displayPrice =
            isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price
          const displayNote =
            isYearly && plan.yearlyPriceNote
              ? plan.yearlyPriceNote
              : plan.priceNote

          return (
            <div
              key={plan.id}
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
                  <span className='text-4xl font-black tracking-tight text-slate-900'>
                    {displayPrice}
                  </span>
                  {displayNote && (
                    <span className='mb-1 text-sm text-slate-400'>
                      {displayNote}
                    </span>
                  )}
                </div>

                {/* Savings badge — only shown on yearly for paid plans */}
                {isYearly && plan.yearlySavings ? (
                  <p className='mt-1 text-xs font-semibold text-emerald-600 h-5'>
                    {plan.yearlySavings}
                  </p>
                ) : (
                  <p className='mt-1 text-sm text-slate-500 h-5'>
                    {plan.tagline}
                  </p>
                )}
              </div>

              <button
                className={clsx(
                  'mb-6 w-full rounded-xl py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:shadow-sm',
                  plan.buttonColor,
                )}
              >
                Get started
              </button>

              <div className='mb-4 border-t border-slate-100' />

              {plan.inheritLabel && (
                <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400'>
                  {plan.inheritLabel}
                </p>
              )}

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
                    <span className='text-sm leading-snug text-slate-600'>
                      {feature.label}
                      {feature.soon && (
                        <span className='ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400'>
                          Soon
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <p className='mt-12 text-center text-xs text-slate-400'>
        Champion tier organizations require all teammates to hold an active
        Believer plan or above.&nbsp;&nbsp;·&nbsp;&nbsp;Prices in USD.
      </p>
    </div>
  )
}
