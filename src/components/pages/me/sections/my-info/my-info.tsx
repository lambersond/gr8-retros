import Image from 'next/image'
import { PAYMENT_TIER_META } from './constants'
import { initials } from './utils'
import { SectionCard } from '@/components/section-card'
import { PaymentTier } from '@/enums'
import type { MyInfoProps } from './types'

export async function MyInfo({ myInfo }: Readonly<MyInfoProps>) {
  const data = await myInfo
  const tier = PAYMENT_TIER_META[data?.paymentTier || PaymentTier.FREE]
  return (
    <SectionCard className='flex items-center gap-5'>
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
          <h1 className='text-lg font-semibold text-slate-800 truncate'>
            {data?.name}
          </h1>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tier.bg} ${tier.text} ${tier.border}`}
          >
            {tier.label}
          </span>
        </div>
        <p className='text-sm text-slate-400 truncate mt-0.5'>{data?.email}</p>
      </div>
    </SectionCard>
  )
}
