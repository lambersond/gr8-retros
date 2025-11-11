import { renderHook, screen, waitFor } from '@test-utils'
import { useModals } from './use-modals'
import { ModalProvider } from '@/components/modals/modal-provider'
import { MODALS } from '@/modals'

jest.mock('next/navigation', () => ({
  useParams: () => ({
    name: 'test-application',
  }),
}))

describe('hooks/use-modals', () => {
  it('should throw error if not wrapped in provider', () => {
    expect(() => renderHook(() => useModals())).toThrow(
      'useModals must be used within a ModalProvider',
    )
  })

  it.each([
    ['AddCharacterModal', {}],
    ['ConfirmModal', {}],
  ] as [keyof typeof MODALS, object][])(
    'should open modal - %s',
    async (modal, props) => {
      const { result } = renderHook(() => useModals(), {
        wrapper: ModalProvider,
      })

      await waitFor(() => {
        result.current.openModal(modal, props as any)
      })

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument()
      })
    },
  )

  it('should close modal', async () => {
    const { result } = renderHook(() => useModals(), {
      wrapper: ModalProvider,
    })

    await waitFor(() => {
      result.current.openModal('ConfirmModal', {} as any)
    })

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    await waitFor(() => {
      result.current.closeModal('ConfirmModal')
    })

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    })
  })
})
