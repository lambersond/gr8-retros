export { BoardRole, PaymentTier, VotingMode } from '@prisma/client'

export enum SidebarActions {
  OPEN_SIDEBAR = 'OPEN_SIDEBAR',
  CLOSE_SIDEBAR = 'CLOSE_SIDEBAR',
}

export enum VotingState {
  IDLE = 'idle',
  OPEN = 'open',
  CLOSED = 'closed',
}
