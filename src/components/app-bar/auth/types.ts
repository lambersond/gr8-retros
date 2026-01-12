import type { PaymentTier } from '@/enums'

type AuthenticatedUser = {
  image: string
  name: string
  email: string
  paymentTier: PaymentTier
}

export type UserSectionProps =
  | {
      user: AuthenticatedUser
      isAuthenticated: true
    }
  | {
      user: {
        name: string
      }
      isAuthenticated: false
    }

export type BoardSectionProps = {
  isAuthenticated: boolean
}
