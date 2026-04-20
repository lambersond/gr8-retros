import Image from 'next/image'
import Link from 'next/link'
import { LinkedAccounts } from './linked-accounts'
import { ManageSubscriptionButton } from './manage-subscription-button'
import { initials } from './utils'
import { PaymentTierBadge } from '@/components/badges'
import { SectionCard } from '@/components/section-card'
import { PaymentTier } from '@/enums'
import type { MyInfoProps } from './types'

export async function MyInfo({ myInfo }: Readonly<MyInfoProps>) {
  const data = await myInfo
  const tier = data?.paymentTier || PaymentTier.FREE
  return (
    <SectionCard className='relative flex items-center gap-5'>
      <div className='absolute top-4 right-4'>
        {data?.stripeCustomerId ? (
          <ManageSubscriptionButton />
        ) : (
          <Link
            href='/plans'
            className='text-sm text-text-secondary hover:text-text-primary transition-colors'
          >
            View Subscription Levels
          </Link>
        )}
      </div>
      <div className='relative flex-shrink-0'>
        {data?.image ? (
          <Image
            src={data?.image || '/default-avatar.png'}
            alt='User Avatar'
            className='w-24 h-24 rounded-full mx-auto mb-4'
            width={96}
            height={96}
          />
        ) : (
          <div
            className='w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ring-2 ring-white/10'
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {initials(data?.name)}
          </div>
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 flex-wrap'>
          <h1 className='text-lg font-semibold text-text-primary truncate'>
            {data?.name}
          </h1>
          <PaymentTierBadge tier={tier} />
        </div>
        <p className='text-sm text-text-secondary truncate mt-0.5'>
          {data?.email}
        </p>
        <LinkedAccounts />
      </div>
    </SectionCard>
  )
}
