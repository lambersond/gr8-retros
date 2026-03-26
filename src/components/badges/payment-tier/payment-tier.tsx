import clsx from 'classnames'
import { PAYMENT_TIER_META } from '@/constants'
import { PaymentTier as PaymentTierEnum } from '@/enums'

export function PaymentTier({
  tier = PaymentTierEnum.FREE,
}: Readonly<{ tier?: PaymentTierEnum }>) {
  const tierMeta = PAYMENT_TIER_META[tier]
  const classes = clsx(
    'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
    tierMeta.bg,
    tierMeta.text,
    tierMeta.border,
  )
  return <span className={classes}>{tierMeta.label}</span>
}
