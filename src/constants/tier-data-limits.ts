import { PaymentTier } from '@/enums'

export const MAX_BOARDS_PER_SUBSCRIPTION = {
  [PaymentTier.FREE]: 3,
  [PaymentTier.BELIEVER]: 10,
  [PaymentTier.SUPPORTER]: 50,
  [PaymentTier.CHAMPION]: 50, // Unlimited boards within their organization
}

export const MAX_CARD_RETENTION: Record<PaymentTier, number> = {
  [PaymentTier.FREE]: 14,
  [PaymentTier.BELIEVER]: 30,
  [PaymentTier.SUPPORTER]: 90,
  [PaymentTier.CHAMPION]: -1,
}

export const DEFAULT_BOARD_RETENTION_DAYS = 30
export const DEFAULT_CARD_RETENTION_DAYS = 7

export const RETENTION_POLICY = {
  [PaymentTier.FREE]: {
    boardDays: 60,
    defaultCardDays: DEFAULT_CARD_RETENTION_DAYS,
  },
  [PaymentTier.BELIEVER]: {
    boardDays: 180,
    defaultCardDays: DEFAULT_CARD_RETENTION_DAYS,
  },
  [PaymentTier.SUPPORTER]: {
    boardDays: 365,
    defaultCardDays: DEFAULT_CARD_RETENTION_DAYS,
  },
  [PaymentTier.CHAMPION]: {
    boardDays: Infinity,
    defaultCardDays: DEFAULT_CARD_RETENTION_DAYS,
  },
  UNDEFINED: {
    boardDays: DEFAULT_BOARD_RETENTION_DAYS,
    defaultCardDays: DEFAULT_CARD_RETENTION_DAYS,
  },
} as const
