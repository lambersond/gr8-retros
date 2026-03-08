import type { PaymentTier } from '@/enums'

export type MyInfoProps = {
  myInfo: Promise<{
    id: string
    email: string
    name: string | null
    image: string | null
    paymentTier: PaymentTier
  } | null>
}
