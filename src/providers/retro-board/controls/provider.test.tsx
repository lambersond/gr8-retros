import { render } from '@testing-library/react'
import { RetroBoardControlsProvider } from './provider'
import { useBoardControlsActions } from './selectors'
import { GuidedPhase, VotingMode, VotingState } from '@/enums'
import type { RetroBoardControls, RetroBoardControlsActions } from './types'

let mockControls: RetroBoardControls
let mockFacilitatorModeEnabled: boolean
const mockUpdateBoardControls = jest.fn()

jest.mock('@/hooks/use-channel-state', () => ({
  useBoardControlsLiveMap: () => ({
    boardControls: mockControls,
    updateBoardControls: mockUpdateBoardControls,
  }),
}))

jest.mock('@/providers/retro-board/board-settings', () => ({
  useBoardSettings: () => ({
    settings: {
      facilitatorMode: { enabled: mockFacilitatorModeEnabled },
      timer: { subsettings: { defaultDuration: { value: 300 } } },
      voting: {
        subsettings: {
          votingMode: { choice: 'MULTI' },
          limit: { value: 3 },
        },
      },
    },
  }),
}))

jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: { id: 'me' } }),
}))

const mockNoop = () => {}

jest.mock('@/hooks/use-countdown-timer', () => ({
  useCountdownTimer: () => ({
    formatted: '05:00',
    isRunning: false,
    start: mockNoop,
    pause: mockNoop,
    setSeconds: mockNoop,
    secondsLeft: 300,
  }),
}))

jest.mock('@/hooks/use-music', () => ({
  useMusic: () => ({
    musicRef: { current: undefined },
    dingRef: { current: undefined },
    tickingRef: { current: undefined },
    isPlaying: false,
    startMusic: mockNoop,
    pauseMusic: mockNoop,
    changeTrackById: mockNoop,
    selectedTrackOption: { id: 'track', label: 'Track' },
    startTicking: mockNoop,
    stopTicking: mockNoop,
    playDing: mockNoop,
  }),
}))

jest.mock('@/hooks/use-voting', () => ({
  useVoting: () => ({
    votes: [],
    hasVoted: false,
    canVote: true,
    addMyVote: mockNoop,
    removeMyVote: mockNoop,
    clearMyVotes: mockNoop,
    updateHasVoted: mockNoop,
    submitVotes: async () => {},
  }),
}))

let actions: RetroBoardControlsActions

function Actions() {
  actions = useBoardControlsActions(a => a)
  return <></>
}

const openVoting = (
  collectedVotes: Record<string, string[]>,
): RetroBoardControls['voting'] => ({
  state: VotingState.OPEN,
  mode: VotingMode.MULTI,
  limit: 3,
  results: {},
  collectedVotes,
})

// A fresh element each time, so a rerender re-runs the provider (and its
// board read) rather than bailing out on identical props.
const tree = () => (
  <RetroBoardControlsProvider boardId='board'>
    <Actions />
  </RetroBoardControlsProvider>
)

function setup() {
  const view = render(tree())
  // Every write the provider makes on mount (default syncing etc.) is noise
  // for these tests; only the action under test should be recorded.
  mockUpdateBoardControls.mockClear()
  return { rerender: () => view.rerender(tree()) }
}

describe('providers/retro-board/controls/provider', () => {
  beforeEach(() => {
    mockUpdateBoardControls.mockReset()
    mockFacilitatorModeEnabled = true
    mockControls = {
      timer: {
        startedAt: undefined,
        remaining: 300,
        isPlaying: false,
        isCompleted: false,
      },
      music: { shouldPlay: false, isPlaying: false, trackId: undefined },
      voting: openVoting({ ann: ['card-1'] }),
      facilitatorMode: { isActive: false, skippedIds: [] },
      guided: { isActive: false, phase: GuidedPhase.REFLECT },
      chosenFacilitatorId: 'me',
    }
  })

  describe('closeVotingAndDiscuss', () => {
    it('closes voting with the latest tally and starts facilitation in one write', () => {
      const { rerender } = setup()
      // Captured the way a confirm modal's onConfirm is, then a vote lands.
      const captured = actions.closeVotingAndDiscuss
      mockControls = {
        ...mockControls,
        voting: openVoting({ ann: ['card-1'], bob: ['card-1', 'card-2'] }),
      }
      rerender()

      captured()

      expect(mockUpdateBoardControls).toHaveBeenCalledTimes(1)
      expect(mockUpdateBoardControls).toHaveBeenCalledWith({
        voting: {
          ...mockControls.voting,
          state: VotingState.CLOSED,
          results: { 'card-1': ['ann', 'bob'], 'card-2': ['bob'] },
        },
        facilitatorMode: { isActive: true, skippedIds: [] },
      })
    })

    it('only closes voting when the board has Facilitator Mode turned off', () => {
      mockFacilitatorModeEnabled = false
      setup()

      actions.closeVotingAndDiscuss()

      expect(mockUpdateBoardControls).toHaveBeenCalledTimes(1)
      expect(mockUpdateBoardControls).toHaveBeenCalledWith({
        voting: {
          ...mockControls.voting,
          state: VotingState.CLOSED,
          results: { 'card-1': ['ann'] },
        },
      })
    })

    it.each([
      [
        'voting has already been closed',
        () =>
          (mockControls = {
            ...mockControls,
            voting: { ...mockControls.voting, state: VotingState.CLOSED },
          }),
      ],
      [
        'a guided session has started',
        () =>
          (mockControls = {
            ...mockControls,
            guided: { isActive: true, phase: GuidedPhase.VOTE },
          }),
      ],
    ])('does nothing once %s', (_, arrange) => {
      const { rerender } = setup()
      const captured = actions.closeVotingAndDiscuss
      arrange()
      rerender()
      mockUpdateBoardControls.mockClear()

      captured()

      expect(mockUpdateBoardControls).not.toHaveBeenCalled()
    })
  })

  describe('closeVoting', () => {
    it('tallies the latest votes from a callback captured earlier', () => {
      const { rerender } = setup()
      const captured = actions.closeVoting
      mockControls = {
        ...mockControls,
        voting: openVoting({ ann: ['card-1'], bob: ['card-2'] }),
      }
      rerender()

      captured()

      expect(mockUpdateBoardControls).toHaveBeenCalledWith({
        voting: {
          ...mockControls.voting,
          state: VotingState.CLOSED,
          results: { 'card-1': ['ann'], 'card-2': ['bob'] },
        },
      })
    })

    it('does nothing once voting is no longer open', () => {
      const { rerender } = setup()
      const captured = actions.closeVoting
      mockControls = {
        ...mockControls,
        voting: { ...mockControls.voting, state: VotingState.IDLE },
      }
      rerender()
      mockUpdateBoardControls.mockClear()

      captured()

      expect(mockUpdateBoardControls).not.toHaveBeenCalled()
    })
  })
})
