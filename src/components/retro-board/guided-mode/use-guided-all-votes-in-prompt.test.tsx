import { useEffect } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useGuidedAllVotesInPrompt } from './use-guided-all-votes-in-prompt'
import { PROMPT_SETTLE_MS } from '@/components/board-controls/voting/use-all-votes-in-prompt'
import { ModalProvider } from '@/components/modals/modal-provider'
import { GuidedPhase, VotingState } from '@/enums'
import { useModals } from '@/hooks/use-modals'

const mockSetGuidedPhase = jest.fn()
let mockControls: {
  guided?: { isActive: boolean; phase: GuidedPhase }
  voting: { state: VotingState }
  chosenFacilitatorId?: string
}
let mockProgress: { voted: number; votingMembers: number }

jest.mock('@/providers/retro-board/controls', () => ({
  useBoardControlsState: (selector: (s: unknown) => unknown) =>
    selector({ boardControls: mockControls }),
  useBoardControlsActions: (selector: (a: unknown) => unknown) =>
    selector({ setGuidedPhase: mockSetGuidedPhase }),
}))

jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: { id: 'me' } }),
}))

jest.mock('@/components/board-controls/voting/use-voting-progress', () => ({
  useVotingProgress: () => mockProgress,
}))

// The real registry lazy-loads every modal, which drags in modules that need
// the generated Prisma enums; the prompt only ever uses ConfirmModal.
jest.mock('@/modals', () => ({
  MODALS: {
    ConfirmModal: jest.requireActual(
      '@/components/modals/confirm-modal/confirm-modal',
    ).ConfirmModal,
  },
}))

function Harness() {
  useGuidedAllVotesInPrompt()
  return <></>
}

// Stands in for any other confirmation the user already has open.
function WithOtherConfirm() {
  const { openModal } = useModals()
  useEffect(() => {
    openModal('ConfirmModal', { title: 'Delete card?', onConfirm: jest.fn() })
  }, [openModal])
  useGuidedAllVotesInPrompt()
  return <></>
}

const PROMPT =
  'All 3 participants have submitted their votes. Ready to discuss the cards?'

// The prompt opens PROMPT_SETTLE_MS after everyone is in; give the lazy modal
// time to load on top of that.
const findPrompt = (text = PROMPT) =>
  screen.findByText(text, undefined, { timeout: PROMPT_SETTLE_MS + 1000 })

// Outlasts the settle delay, so a prompt that was (wrongly) scheduled has
// opened by the time the test looks.
const settle = () =>
  act(() => new Promise(resolve => setTimeout(resolve, PROMPT_SETTLE_MS + 100)))

function setup() {
  const view = render(<Harness />, { wrapper: ModalProvider })
  const rerender = () => view.rerender(<Harness />)
  return { rerender }
}

describe('components/retro-board/guided-mode/use-guided-all-votes-in-prompt', () => {
  beforeEach(() => {
    mockControls = {
      guided: { isActive: true, phase: GuidedPhase.VOTE },
      voting: { state: VotingState.OPEN },
      chosenFacilitatorId: 'me',
    }
    mockProgress = { voted: 3, votingMembers: 3 }
  })

  it('prompts the chosen facilitator and moves to Discuss on confirm', async () => {
    setup()

    expect(await findPrompt()).toBeInTheDocument()
    expect(screen.getByText('All votes are in')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Discuss Cards'))

    expect(mockSetGuidedPhase).toHaveBeenCalledWith(GuidedPhase.DISCUSS)
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
    ['nobody can vote', () => (mockProgress = { voted: 0, votingMembers: 0 })],
    [
      'the session is not in the Vote phase',
      () =>
        (mockControls.guided = { isActive: true, phase: GuidedPhase.GROUP }),
    ],
    [
      'the session is not guided',
      () =>
        (mockControls.guided = { isActive: false, phase: GuidedPhase.VOTE }),
    ],
    [
      'voting is not open',
      () => (mockControls.voting = { state: VotingState.CLOSED }),
    ],
  ])('does not prompt when %s', async (_, arrange) => {
    arrange()
    setup()

    await settle()
    expect(screen.queryByText('All votes are in')).not.toBeInTheDocument()
  })

  it('stays dismissed after Stay in Voting while everyone is still in', async () => {
    const { rerender } = setup()
    await findPrompt()
    await userEvent.click(screen.getByText('Stay in Voting'))

    rerender()
    await settle()

    expect(screen.queryByText('All votes are in')).not.toBeInTheDocument()
    expect(mockSetGuidedPhase).not.toHaveBeenCalled()
  })

  it('takes the prompt down when a vote goes missing and re-prompts once all are in', async () => {
    const { rerender } = setup()
    expect(await findPrompt()).toBeInTheDocument()

    mockProgress = { voted: 3, votingMembers: 4 }
    rerender()
    await waitFor(() =>
      expect(screen.queryByText('All votes are in')).not.toBeInTheDocument(),
    )

    mockProgress = { voted: 4, votingMembers: 4 }
    rerender()
    expect(
      await findPrompt(
        'All 4 participants have submitted their votes. Ready to discuss the cards?',
      ),
    ).toBeInTheDocument()
  })

  it('takes the prompt down when someone else moves the session to Discuss', async () => {
    const { rerender } = setup()
    expect(await findPrompt()).toBeInTheDocument()

    mockControls.guided = { isActive: true, phase: GuidedPhase.DISCUSS }
    rerender()

    await waitFor(() =>
      expect(screen.queryByText('All votes are in')).not.toBeInTheDocument(),
    )
    expect(mockSetGuidedPhase).not.toHaveBeenCalled()
  })

  it('takes the prompt down when the session ends under it', async () => {
    // The header drops GuidedControls (and this hook) when guided mode ends.
    const view = render(<Harness />, { wrapper: ModalProvider })
    expect(await findPrompt()).toBeInTheDocument()

    view.rerender(<></>)

    await waitFor(() =>
      expect(screen.queryByText('All votes are in')).not.toBeInTheDocument(),
    )
  })

  it('waits for a confirmation already on screen instead of replacing it', async () => {
    mockProgress = { voted: 2, votingMembers: 3 }
    const view = render(<WithOtherConfirm />, { wrapper: ModalProvider })
    expect(await screen.findByText('Delete card?')).toBeInTheDocument()

    mockProgress = { voted: 3, votingMembers: 3 }
    view.rerender(<WithOtherConfirm />)
    await settle()
    expect(screen.getByText('Delete card?')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Cancel'))
    expect(await findPrompt()).toBeInTheDocument()
  })

  it('never opens when the session moves on before the votes settle', async () => {
    // e.g. the facilitator just accepted "Not everyone has voted" as the last
    // vote landed; the move to Discuss arrives over Ably a moment later.
    // Checking part-way through the settle delay, not just at the end: the
    // take-down would hide a prompt that flashed up in between.
    const { rerender } = setup()
    await act(() => new Promise(resolve => setTimeout(resolve, 100)))
    expect(screen.queryByText('All votes are in')).not.toBeInTheDocument()

    mockControls.guided = { isActive: true, phase: GuidedPhase.DISCUSS }
    rerender()
    await settle()

    expect(screen.queryByText('All votes are in')).not.toBeInTheDocument()
  })
})
