import type { BoardRole, PaymentTier } from '@/enums'

export interface MyBoardsProps {
  userInfo: Promise<{
    id: string
    email: string
    name: string | null
    image: string | null
    paymentTier: PaymentTier
  } | null>
  myBoards: Promise<{
    boards: {
      role: BoardRole
      settings: {
        retroSession: {
          id: string
          name: string | null
        }
      }
    }[]
  } | null>
}
