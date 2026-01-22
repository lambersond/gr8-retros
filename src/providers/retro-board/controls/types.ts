import type { DropdownOption } from '@/components/common'

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
}

export type RetroBoardControlsActions = {
  togglePlay: () => void
  reset: () => void
  addOneMinute: () => void
  setSeconds: (seconds: number) => void

  toggleMusic: () => void
  changeTrack: (option: DropdownOption) => void

  updateBoardControls: (updates: Partial<RetroBoardControls>) => void
}
