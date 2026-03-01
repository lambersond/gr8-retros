import type { DropdownOption } from '@/components/common'
import type { VotingMode, VotingState } from '@/enums'

export type RetroBoardControls = {
  timer: {
    startedAt: number | undefined
    remaining: number | undefined
    isPlaying: boolean
    isCompleted: boolean
  }
  music: {
    shouldPlay: boolean
    isPlaying: boolean
    trackId: string | undefined
  }
  voting: {
    state: VotingState
    mode: VotingMode
    limit: number
    results: Record<string, string[]>
    collectedVotes: Record<string, string[]>
  }
}

export type RetroBoardControlsState = {
  boardControls: RetroBoardControls
  formatted: string
  isRunning: boolean
  secondsLeft: number
  play: boolean
  musicRef: React.RefObject<HTMLAudioElement | null>
  tickingRef: React.RefObject<HTMLAudioElement | null>
  dingRef: React.RefObject<HTMLAudioElement | null>
  selectedTrackOption: DropdownOption
  votes: string[]
  hasVoted: boolean
  canVote: boolean
}

export type RetroBoardControlsActions = {
  // Timer
  togglePlay: () => void
  reset: () => void
  addOneMinute: () => void
  setSeconds: (seconds: number) => void

  // Music
  toggleMusic: () => void
  changeTrack: (option: DropdownOption) => void

  // Voting - local-level
  addMyVote: (itemId: string) => void
  removeMyVote: (itemId: string) => void
  clearMyVotes: () => void
  submitVotes: () => Promise<void>

  // Voting - board-level
  openVoting: () => void
  closeVoting: () => void
  resetVoting: () => void
  setVotingMode: (mode: VotingMode) => void
  setVotingLimit: (limit: number) => void

  updateBoardControls: (updates: Partial<RetroBoardControls>) => void
}
