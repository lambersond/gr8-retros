import { renderHook } from '@test-utils'
import { useChooseFacilitatorModal } from './use-choose-facilitator-modal'
import { ModalStateCtx } from '@/components/modals/modal-provider'
import { BoardRole } from '@/enums'
import type { ModalState } from '@/types'
import type { ReactNode } from 'react'

const mockOpenModal = jest.fn()
let mockBoardMembers: unknown[] = []

jest.mock('@/hooks/use-modals', () => ({
  useModals: () => ({ openModal: mockOpenModal }),
}))
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: { id: 'me' } }),
}))
jest.mock('@/providers/viewing-members', () => ({
  useViewingMembers: () => ({
    viewingMembers: {
      'user-1': { name: 'Ann', image: 'ann.png', role: 'MEMBER' },
    },
  }),
}))
jest.mock('@/providers/retro-board/board-settings', () => ({
  useBoardMembers: () => mockBoardMembers,
}))
jest.mock('@/providers/retro-board/controls', () => ({
  useBoardControlsActions: () => jest.fn(),
}))
jest.mock('@/providers/retro-board/facilitator-dice', () => ({
  ...jest.requireActual('@/providers/retro-board/facilitator-dice/utils'),
  useFacilitatorDiceActions: () => ({}),
  useFacilitatorDiceState: () => ({ activeSession: undefined }),
  useRerollSelf: () => jest.fn(),
}))

const withModalOpen =
  (open: boolean) =>
  ({ children }: { children: ReactNode }) => (
    <ModalStateCtx
      value={
        { ChooseFacilitatorModal: { open, props: {} } } as unknown as ModalState
      }
    >
      {children}
    </ModalStateCtx>
  )

const ann = { id: 'user-1', name: 'Ann', image: 'ann.png' }
const lastCandidates = () => mockOpenModal.mock.lastCall?.[1].candidates

describe('useChooseFacilitatorModal', () => {
  beforeEach(() => {
    mockBoardMembers = [
      { role: BoardRole.MEMBER, user: { id: 'user-1' }, permissionMask: 0 },
    ]
  })

  it('pushes newly eligible candidates into the open modal', () => {
    const { rerender } = renderHook(() => useChooseFacilitatorModal(), {
      wrapper: withModalOpen(true),
    })
    expect(lastCandidates()).toEqual([])

    mockBoardMembers = [
      {
        role: BoardRole.FACILITATOR,
        user: { id: 'user-1' },
        permissionMask: 0,
      },
    ]
    rerender()

    expect(lastCandidates()).toEqual([ann])
  })

  it('does not open the modal on its own while it is closed', () => {
    renderHook(() => useChooseFacilitatorModal(), {
      wrapper: withModalOpen(false),
    })

    expect(mockOpenModal).not.toHaveBeenCalled()
  })

  it('opens the modal with the current candidates', () => {
    mockBoardMembers = [
      { role: BoardRole.ADMIN, user: { id: 'user-1' }, permissionMask: 0 },
    ]
    const { result } = renderHook(() => useChooseFacilitatorModal(), {
      wrapper: withModalOpen(false),
    })

    result.current()

    expect(mockOpenModal).toHaveBeenCalledWith(
      'ChooseFacilitatorModal',
      expect.objectContaining({ candidates: [ann] }),
    )
  })
})
