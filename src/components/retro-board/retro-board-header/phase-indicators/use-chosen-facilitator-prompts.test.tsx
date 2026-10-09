import { useEffect } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useChosenFacilitatorPrompts } from './use-chosen-facilitator-prompts'
import { PROMPT_SETTLE_MS } from '@/components/board-controls/voting/use-all-votes-in-prompt'
import { ModalProvider } from '@/components/modals/modal-provider'
import { GuidedPhase, VotingState } from '@/enums'
import { useModals } from '@/hooks/use-modals'

const mockCloseVotingAndDiscuss = jest.fn()
const mockToggleFacilitatorMode = jest.fn()
let mockControls: {
  guided?: { isActive: boolean; phase: GuidedPhase }
  voting: { state: VotingState }
  facilitatorMode: { isActive: boolean }
  chosenFacilitatorId?: string
}
let mockProgress: { voted: number; votingMembers: number }
let mockFacilitatorModeEnabled: boolean

jest.mock('@/providers/retro-board/controls', () => ({
  useBoardControlsState: (selector: (s: unknown) => unknown) =>
    selector({ boardControls: mockControls }),
  useBoardControlsActions: (selector: (a: unknown) => unknown) =>
    selector({
      closeVotingAndDiscuss: mockCloseVotingAndDiscuss,
      toggleFacilitatorMode: mockToggleFacilitatorMode,
    }),
}))

jest.mock('@/providers/retro-board/board-settings', () => ({
  useBoardSettings: () => ({
    settings: { facilitatorMode: { enabled: mockFacilitatorModeEnabled } },
  }),
}))

jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: { id: 'me' } }),
}))

jest.mock('@/components/board-controls/voting/use-voting-progress', () => ({
  useVotingProgress: () => mockProgress,
}))

// The real registry lazy-loads every modal, which drags in modules that need
// the generated Prisma enums; the prompts only ever use ConfirmModal.
jest.mock('@/modals', () => ({
  MODALS: {
    ConfirmModal: jest.requireActual(
      '@/components/modals/confirm-modal/confirm-modal',
    ).ConfirmModal,
  },
}))

function Harness() {
  useChosenFacilitatorPrompts()
  return <></>
}

// Stands in for any other confirmation the user already has open.
function WithOtherConfirm({ title = 'Delete card?' }: { title?: string }) {
  const { openModal } = useModals()
  useEffect(() => {
    openModal('ConfirmModal', { title, onConfirm: jest.fn() })
  }, [openModal, title])
  useChosenFacilitatorPrompts()
  return <></>
}

const ALL_IN = 'Discuss voted on topics?'
const START_DISCUSSIONS =
  'Voting is closed. As the chosen facilitator, would you like to start discussions and begin reviewing the cards?'

// The all-votes-in prompt opens PROMPT_SETTLE_MS after everyone is in; give
// the lazy modal time to load on top of that.
const find = (text: string) =>
  screen.findByText(text, undefined, { timeout: PROMPT_SETTLE_MS + 1000 })

// Outlasts the settle delay, so a prompt that was (wrongly) scheduled has
// opened by the time the test looks.
const settle = () =>
  act(() => new Promise(resolve => setTimeout(resolve, PROMPT_SETTLE_MS + 100)))

const expectNoPrompts = () => {
  expect(screen.queryByText(ALL_IN)).not.toBeInTheDocument()
  expect(screen.queryByText(START_DISCUSSIONS)).not.toBeInTheDocument()
}

// A board update landing over Ably.
function setVoting(state: VotingState, isFacilitatorMode = false) {
  mockControls = {
    ...mockControls,
    voting: { state },
    facilitatorMode: { isActive: isFacilitatorMode },
  }
}

function setup() {
  const view = render(<Harness />, { wrapper: ModalProvider })
  const rerender = () => view.rerender(<Harness />)
  return { rerender }
}

describe('components/retro-board/retro-board-header/phase-indicators/use-chosen-facilitator-prompts', () => {
  beforeEach(() => {
    mockCloseVotingAndDiscuss.mockReset()
    mockToggleFacilitatorMode.mockReset()
    mockControls = {
      guided: { isActive: false, phase: GuidedPhase.REFLECT },
      voting: { state: VotingState.OPEN },
      facilitatorMode: { isActive: false },
      chosenFacilitatorId: 'me',
    }
    mockProgress = { voted: 3, votingMembers: 3 }
    mockFacilitatorModeEnabled = true
  })

  it('prompts the chosen facilitator once all votes are in and closes voting to discuss on confirm', async () => {
    setup()

    expect(await find(ALL_IN)).toBeInTheDocument()
    expect(screen.getByText('All votes are in')).toBeInTheDocument()
    expect(screen.getByText('No, Leave me Alone')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Yes, Start Discussing'))

    expect(mockCloseVotingAndDiscuss).toHaveBeenCalledTimes(1)
    expect(screen.queryByText(ALL_IN)).not.toBeInTheDocument()
  })

  it.each([
    [
      'no facilitator is chosen',
      () => (mockControls.chosenFacilitatorId = undefined),
    ],
    [
      'someone else is the chosen facilitator',
      () => (mockControls.chosenFacilitatorId = 'other'),
    ],
    [
      'votes are still missing',
      () => (mockProgress = { voted: 2, votingMembers: 3 }),
    ],
    [
      'a guided session is running',
      () => (mockControls.guided = { isActive: true, phase: GuidedPhase.VOTE }),
    ],
    ['voting is not open', () => setVoting(VotingState.IDLE)],
  ])('does not prompt when %s', async (_, arrange) => {
    arrange()
    setup()

    await settle()
    expectNoPrompts()
  })

  it.each([
    [true, true],
    [false, false],
  ])(
    'never follows Yes with Start Discussions (Facilitator Mode enabled: %s)',
    async (enabled, startsFacilitation) => {
      mockFacilitatorModeEnabled = enabled
      const { rerender } = setup()
      await find(ALL_IN)
      await userEvent.click(screen.getByText('Yes, Start Discussing'))

      // Voting still reads open until the write comes back over Ably.
      rerender()
      await settle()
      expectNoPrompts()

      // The one write lands: closed, and facilitating when the board allows.
      setVoting(VotingState.CLOSED, startsFacilitation)
      rerender()
      await settle()
      expectNoPrompts()
    },
  )

  it.each([
    ['No, Leave me Alone', () => screen.getByText('No, Leave me Alone')],
    ['the backdrop', () => screen.getByTestId('modal__backdrop')],
  ])(
    'stays quiet for the rest of the round once dismissed with %s',
    async (_, target) => {
      const { rerender } = setup()
      await find(ALL_IN)
      await userEvent.click(target())
      await waitFor(() =>
        expect(screen.queryByText(ALL_IN)).not.toBeInTheDocument(),
      )

      // A vote reset and resubmitted would re-arm an unanswered prompt.
      mockProgress = { voted: 2, votingMembers: 3 }
      rerender()
      mockProgress = { voted: 3, votingMembers: 3 }
      rerender()
      await settle()
      expectNoPrompts()

      // Someone else closes the vote: no Start Discussions either.
      setVoting(VotingState.CLOSED)
      rerender()
      await settle()
      expectNoPrompts()
      expect(mockCloseVotingAndDiscuss).not.toHaveBeenCalled()

      // The next round prompts again.
      setVoting(VotingState.IDLE)
      rerender()
      setVoting(VotingState.OPEN)
      rerender()
      expect(await find(ALL_IN)).toBeInTheDocument()
    },
  )

  it('prompts again when a dismissed vote is reopened', async () => {
    const { rerender } = setup()
    await find(ALL_IN)
    await userEvent.click(screen.getByText('No, Leave me Alone'))

    setVoting(VotingState.CLOSED)
    rerender()
    setVoting(VotingState.OPEN)
    rerender()

    expect(await find(ALL_IN)).toBeInTheDocument()
  })

  it('swaps the prompt for Start Discussions when the vote closes under it', async () => {
    const { rerender } = setup()
    await find(ALL_IN)

    setVoting(VotingState.CLOSED)
    rerender()

    // One at a time: the unanswered prompt goes before the offer opens.
    await waitFor(() =>
      expect(screen.queryByText(ALL_IN)).not.toBeInTheDocument(),
    )
    expect(await find(START_DISCUSSIONS)).toBeInTheDocument()
    expect(screen.queryByText(ALL_IN)).not.toBeInTheDocument()
    expect(mockCloseVotingAndDiscuss).not.toHaveBeenCalled()

    await userEvent.click(screen.getAllByText('Start Discussions').at(-1)!)
    expect(mockToggleFacilitatorMode).toHaveBeenCalledTimes(1)
  })

  it('still offers Start Discussions when the vote closes before everyone is in', async () => {
    mockProgress = { voted: 2, votingMembers: 3 }
    const { rerender } = setup()

    setVoting(VotingState.CLOSED)
    rerender()

    expect(await find(START_DISCUSSIONS)).toBeInTheDocument()
  })

  it('waits for a confirmation already on screen before offering Start Discussions', async () => {
    mockProgress = { voted: 2, votingMembers: 3 }
    const view = render(<WithOtherConfirm />, { wrapper: ModalProvider })
    expect(await screen.findByText('Delete card?')).toBeInTheDocument()

    setVoting(VotingState.CLOSED)
    view.rerender(<WithOtherConfirm />)
    await settle()
    expect(screen.getByText('Delete card?')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Cancel'))
    expect(await find(START_DISCUSSIONS)).toBeInTheDocument()
  })

  it.each([
    [
      'no facilitator is chosen',
      () => (mockControls.chosenFacilitatorId = undefined),
    ],
    [
      'someone else is the chosen facilitator',
      () => (mockControls.chosenFacilitatorId = 'other'),
    ],
    [
      'facilitation is already running',
      () => setVoting(VotingState.CLOSED, true),
    ],
  ])(
    'does not offer Start Discussions on a closed vote when %s',
    async (_, arrange) => {
      setVoting(VotingState.CLOSED)
      arrange()
      setup()

      await settle()
      expectNoPrompts()
    },
  )

  it('leaves Start Discussions closed after Later', async () => {
    setVoting(VotingState.CLOSED)
    setup()
    await find(START_DISCUSSIONS)

    await userEvent.click(screen.getByText('Later'))
    await settle()

    expectNoPrompts()
    expect(mockToggleFacilitatorMode).not.toHaveBeenCalled()
  })

  it.each([
    ['the vote is reset', () => setVoting(VotingState.IDLE)],
    ['the vote is reopened', () => setVoting(VotingState.OPEN)],
    ['facilitation starts', () => setVoting(VotingState.CLOSED, true)],
    [
      'someone else becomes the chosen facilitator',
      () => (mockControls.chosenFacilitatorId = 'other'),
    ],
  ])(
    'takes an unanswered Start Discussions down when %s',
    async (_, change) => {
      mockProgress = { voted: 1, votingMembers: 3 }
      setVoting(VotingState.CLOSED)
      const { rerender } = setup()
      await find(START_DISCUSSIONS)

      change()
      rerender()

      await waitFor(() =>
        expect(screen.queryByText(START_DISCUSSIONS)).not.toBeInTheDocument(),
      )
      expect(mockToggleFacilitatorMode).not.toHaveBeenCalled()
    },
  )

  it('does not queue the next round behind a stale Start Discussions', async () => {
    mockProgress = { voted: 1, votingMembers: 3 }
    setVoting(VotingState.CLOSED)
    const { rerender } = setup()
    await find(START_DISCUSSIONS)

    // Another facilitator resets and reopens the vote; everyone gets in.
    setVoting(VotingState.IDLE)
    rerender()
    setVoting(VotingState.OPEN)
    mockProgress = { voted: 3, votingMembers: 3 }
    rerender()

    expect(await find(ALL_IN)).toBeInTheDocument()
    expect(screen.queryByText(START_DISCUSSIONS)).not.toBeInTheDocument()
    expect(mockToggleFacilitatorMode).not.toHaveBeenCalled()
  })

  it('takes Start Discussions down when it unmounts', async () => {
    // Starting a guided session drops PhaseIndicators, and this hook with it.
    setVoting(VotingState.CLOSED)
    const view = render(<Harness />, { wrapper: ModalProvider })
    await find(START_DISCUSSIONS)

    view.rerender(<></>)

    await waitFor(() =>
      expect(screen.queryByText(START_DISCUSSIONS)).not.toBeInTheDocument(),
    )
  })

  it('holds the prompt back while a just-accepted close is on its way', async () => {
    // The last vote lands while "Close Voting Early?" is open; the facilitator
    // accepts it, and the close arrives over Ably a moment later. The settle
    // delay is what keeps "All votes are in" from flashing up in between.
    mockProgress = { voted: 2, votingMembers: 3 }
    const view = render(<WithOtherConfirm title='Close Voting Early?' />, {
      wrapper: ModalProvider,
    })
    expect(await screen.findByText('Close Voting Early?')).toBeInTheDocument()

    mockProgress = { voted: 3, votingMembers: 3 }
    view.rerender(<WithOtherConfirm title='Close Voting Early?' />)
    await userEvent.click(screen.getByText('Confirm'))
    await act(() => new Promise(resolve => setTimeout(resolve, 100)))
    expect(screen.queryByText(ALL_IN)).not.toBeInTheDocument()

    setVoting(VotingState.CLOSED)
    view.rerender(<WithOtherConfirm title='Close Voting Early?' />)
    expect(await find(START_DISCUSSIONS)).toBeInTheDocument()
    expect(screen.queryByText(ALL_IN)).not.toBeInTheDocument()
  })

  it('does not offer Start Discussions when the board has Facilitator Mode turned off', async () => {
    mockFacilitatorModeEnabled = false
    mockProgress = { voted: 2, votingMembers: 3 }
    const { rerender } = setup()

    setVoting(VotingState.CLOSED)
    rerender()
    await settle()

    expectNoPrompts()
  })
})
