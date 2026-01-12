import type { PaymentTier } from '@/enums'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      paymentTier?: PaymentTier
    } & DefaultSession['user']
  }

  interface JWT {
    id: string
  }
}
