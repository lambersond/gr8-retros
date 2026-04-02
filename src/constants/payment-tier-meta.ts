import type { PaymentTier } from '@/enums'

export const PAYMENT_TIER_META = {
  FREE: {
    label: 'Free',
    bg: 'bg-slate-100 dark:bg-slate-700/30',
    text: 'text-slate-500 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-600',
  },
  SUPPORTER: {
    label: 'Supporter',
    bg: 'bg-violet-100 dark:bg-violet-700/30',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-200 dark:border-violet-600',
  },
  BELIEVER: {
    label: 'Believer',
    bg: 'bg-pink-100 dark:bg-pink-700/30',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200 dark:border-pink-600',
  },
  CHAMPION: {
    label: 'Champion',
    bg: 'bg-yellow-100 dark:bg-yellow-700/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-600',
  },
} satisfies Record<
  PaymentTier,
  { label: string; bg: string; text: string; border: string }
>
