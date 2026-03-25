import type { PaymentTier } from '@/enums'

export const PAYMENT_TIER_META = {
  FREE: {
    label: 'Free',
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    border: 'border-slate-200',
  },
  SUPPORTER: {
    label: 'Supporter',
    bg: 'bg-violet-100',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  BELIEVER: {
    label: 'Believer',
    bg: 'bg-pink-100',
    text: 'text-pink-700',
    border: 'border-pink-200',
  },
  CHAMPION: {
    label: 'Champion',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
} satisfies Record<
  PaymentTier,
  { label: string; bg: string; text: string; border: string }
>
