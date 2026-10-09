import { act, renderHook, screen, waitFor } from '@test-utils'
import { useModals } from './use-modals'
import { ModalProvider } from '@/components/modals/modal-provider'
import type { Modal } from '@/types/modals'

jest.mock('next/navigation', () => ({
  useParams: () => ({
    name: 'test-application',
  }),
}))

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

// Opening any modal lazy-loads the whole modal barrel, which includes the PDF
// previewer. @react-pdf/renderer (via yoga-layout's top-level await) can't load
// under Jest, and these tests don't exercise it.
jest.mock('@/components/modals/pdf-previewer-modal', () => ({
  PDFPreviewerModal: () => {},
}))

describe('hooks/use-modals', () => {
  it('should throw error if not wrapped in provider', () => {
    expect(() => renderHook(() => useModals())).toThrow(
      'useModals must be used within a ModalProvider',
    )
  })

  it.each([
    ['ConfirmModal', 'Confirmation'],
    ['GoodRetroModal', 'What Makes a Good Retro?'],
  ] as [Modal, string][])('should open modal - %s', async (modal, title) => {
    const { result } = renderHook(() => useModals(), {
      wrapper: ModalProvider,
    })

    act(() => {
      result.current.openModal(modal, {} as any)
    })

    expect(await screen.findByTestId('modal')).toHaveTextContent(title)
  })

  it('should close modal', async () => {
    const { result } = renderHook(() => useModals(), {
      wrapper: ModalProvider,
    })

    act(() => {
      result.current.openModal('ConfirmModal', {} as any)
    })

    expect(await screen.findByTestId('modal')).toBeInTheDocument()

    act(() => {
      result.current.closeModal('ConfirmModal')
    })

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    })
  })
})
