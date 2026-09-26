export {
  BoardRole,
  PaymentTier,
  VotingMode,
  AccessRequestStatus,
} from '@prisma/client'

export enum SidebarActions {
  OPEN_SIDEBAR = 'OPEN_SIDEBAR',
  CLOSE_SIDEBAR = 'CLOSE_SIDEBAR',
}

export enum VotingState {
  IDLE = 'idle',
  OPEN = 'open',
  CLOSED = 'closed',
}

// Ordered phases of the facilitator-driven guided (Parabol-style) retro. The
// order here defines Next/Back progression in the guided shell.
export enum GuidedPhase {
  REFLECT = 'reflect',
  GROUP = 'group',
  VOTE = 'vote',
  DISCUSS = 'discuss',
}

export const GUIDED_PHASE_ORDER = [
  GuidedPhase.REFLECT,
  GuidedPhase.GROUP,
  GuidedPhase.VOTE,
  GuidedPhase.DISCUSS,
] as const
