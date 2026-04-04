'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { PlanCard } from './plans-card'
import { PLANS } from '@/constants/plans'

type Billing = 'monthly' | 'yearly'

export function PlansGrid() {
  const [billing, setBilling] = useState<Billing>('monthly')
  const isYearly = billing === 'yearly'

  return (
    <div>
      {/* Billing toggle */}
      <div className='mb-4 flex justify-center'>
        <div className='inline-flex items-center gap-3 rounded-full border border-border-light bg-card p-1 shadow-sm'>
          <button
            onClick={() => setBilling('monthly')}
            className={clsx(
              'cursor-pointer rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200',
              {
                'bg-primary text-white shadow-sm': !isYearly,
                'text-text-secondary hover:text-text-primary': isYearly,
              },
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={clsx(
              'flex cursor-pointer items-center gap-2 rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200',
              {
                'bg-primary text-white shadow-sm': isYearly,
                'text-text-secondary hover:text-text-primary': !isYearly,
              },
            )}
          >
            Yearly{' '}
            <span
              className={clsx(
                'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors duration-200',
                {
                  'bg-white/20 text-white': isYearly,
                  'bg-primary text-white': !isYearly,
                },
              )}
            >
              Save up to 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className='relative mx-auto min-w-0 px-8 md:px-16 lg:max-w-7xl xl:min-w-2xl xl:max-w-[1640px]'>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4'>
          {[...PLANS.values()].map(plan => (
            <PlanCard key={plan.id} plan={plan} isYearly={isYearly} />
          ))}
        </div>
      </div>
    </div>
  )
}
