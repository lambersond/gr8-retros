import { renderHook } from '@testing-library/react'
import { useGuidedPhaseTransition } from './use-guided-phase-transition'
import { GuidedPhase } from '@/enums'

let mockPhase: GuidedPhase
let mockSetGuidedPhase: jest.Mock

jest.mock('@/providers/retro-board/controls', () => ({
  useBoardControlsState: (selector: (s: unknown) => unknown) =>
    selector({
      boardControls: { guided: { isActive: true, phase: mockPhase } },
    }),
  useBoardControlsActions: (selector: (a: unknown) => unknown) =>
    selector({ setGuidedPhase: mockSetGuidedPhase }),
}))

describe('components/retro-board/guided-mode/use-guided-phase-transition', () => {
  beforeEach(() => {
    mockPhase = GuidedPhase.VOTE
    mockSetGuidedPhase = jest.fn()
  })

  it('moves to the target phase from the current one', () => {
    const { result } = renderHook(() => useGuidedPhaseTransition())

    result.current(GuidedPhase.VOTE, GuidedPhase.DISCUSS)

    expect(mockSetGuidedPhase).toHaveBeenCalledWith(GuidedPhase.DISCUSS)
  })

  it('calls the latest setGuidedPhase from a callback captured earlier', () => {
    const { result, rerender } = renderHook(() => useGuidedPhaseTransition())
    const captured = result.current
    const stale = mockSetGuidedPhase

    // A vote lands: the provider hands out a new setGuidedPhase closing over
    // the updated collectedVotes.
    mockSetGuidedPhase = jest.fn()
    rerender()
    captured(GuidedPhase.VOTE, GuidedPhase.DISCUSS)

    expect(stale).not.toHaveBeenCalled()
    expect(mockSetGuidedPhase).toHaveBeenCalledWith(GuidedPhase.DISCUSS)
  })

  it('does nothing once the session has left the from phase', () => {
    const { result, rerender } = renderHook(() => useGuidedPhaseTransition())
    const captured = result.current

    mockPhase = GuidedPhase.DISCUSS
    rerender()
    captured(GuidedPhase.VOTE, GuidedPhase.DISCUSS)

    expect(mockSetGuidedPhase).not.toHaveBeenCalled()
  })

  it('does nothing once unmounted, e.g. after the session was ended', () => {
    const { result, unmount } = renderHook(() => useGuidedPhaseTransition())
    const captured = result.current

    unmount()
    captured(GuidedPhase.VOTE, GuidedPhase.DISCUSS)

    expect(mockSetGuidedPhase).not.toHaveBeenCalled()
  })
})
