import clsx from 'clsx'
import { PAYMENT_TIER_META } from '@/constants'
import { PaymentTier as PaymentTierEnum } from '@/enums'

export function PaymentTier({
  tier = PaymentTierEnum.FREE,
  redirectToPlans = false,
}: Readonly<{ tier?: PaymentTierEnum; redirectToPlans?: boolean }>) {
  const tierMeta = PAYMENT_TIER_META[tier]
  const classes = clsx(
    'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
    tierMeta.bg,
    tierMeta.text,
    tierMeta.border,
  )

  if (redirectToPlans) {
    return (
      <a href='/plans' className={classes}>
        {tierMeta.label}
      </a>
    )
  }

  return <span className={classes}>{tierMeta.label}</span>
}
