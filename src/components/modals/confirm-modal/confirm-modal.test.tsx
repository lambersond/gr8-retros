import { renderWithModalProvider, screen, useUser } from '@test-utils'
import { ModalProvider } from '../modal-provider'
import { ConfirmModal } from './confirm-modal'

const mockCloseModal = jest.fn()

jest.mock('../../../hooks/use-modals', () => ({
  useModals: () => ({
    closeModal: mockCloseModal,
  }),
}))

describe('components/modals/confirm-modal', () => {
  it('should render defaults', () => {
    expect(
      renderWithModalProvider(
        <ConfirmModal open onConfirm={jest.fn()} />,
      ).asFragment(),
    ).toMatchSnapshot()
  })

  it('should render with passed props', () => {
    expect(
      renderWithModalProvider(
        <ConfirmModal
          open
          title='Test title'
          message='Test message'
          onConfirm={jest.fn()}
        />,
      ).asFragment(),
    ).toMatchSnapshot()
  })

  it('should call onConfirm and close the modal when confirm button is clicked', async () => {
    const onConfirm = jest.fn()

    const { getByText, user } = useUser(
      <ConfirmModal open onConfirm={onConfirm} />,
      { wrapper: ModalProvider },
    )

    await user.click(getByText('Confirm'))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(mockCloseModal).toHaveBeenCalledWith('ConfirmModal')
  })

  it('should close the modal without confirming when cancel button is clicked', async () => {
    const onConfirm = jest.fn()

    const { getByText, user } = useUser(
      <ConfirmModal open onConfirm={onConfirm} />,
      { wrapper: ModalProvider },
    )

    await user.click(getByText('Cancel'))

    expect(mockCloseModal).toHaveBeenCalledWith('ConfirmModal')
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it.each([
    ['the cancel button', () => screen.getByText('Cancel')],
    [
      'the close button',
      () => screen.getByTestId('modal').querySelector('.lucide-x')!,
    ],
    ['the backdrop', () => screen.getByTestId('modal__backdrop')],
  ])('should call onCancel when dismissed with %s', async (_, target) => {
    const onConfirm = jest.fn()
    const onCancel = jest.fn()

    const { user } = useUser(
      <ConfirmModal open onConfirm={onConfirm} onCancel={onCancel} />,
      { wrapper: ModalProvider },
    )

    await user.click(target())

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
    expect(mockCloseModal).toHaveBeenCalledWith('ConfirmModal')
  })

  it('should not call onCancel when confirmed', async () => {
    const onCancel = jest.fn()

    const { getByText, user } = useUser(
      <ConfirmModal open onConfirm={jest.fn()} onCancel={onCancel} />,
      { wrapper: ModalProvider },
    )

    await user.click(getByText('Confirm'))

    expect(onCancel).not.toHaveBeenCalled()
  })
})
