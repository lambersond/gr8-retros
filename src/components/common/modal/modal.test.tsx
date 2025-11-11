import { render, screen, useClick } from '@test-utils'
import { Modal } from './modal'

describe('components/common/modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Modal Title',
  }

  it('should render the modal when isOpen is true', () => {
    const { getByText } = render(<Modal {...defaultProps}>Modal Content</Modal>)

    expect(getByText('Modal Title')).toBeInTheDocument()
    expect(getByText('Modal Content')).toBeInTheDocument()
  })

  it('should not render the modal when isOpen is false', () => {
    const { queryByText } = render(
      <Modal {...defaultProps} isOpen={false}>
        Modal Content
      </Modal>,
    )

    expect(queryByText('Modal Title')).not.toBeInTheDocument()
  })

  it.each(['modal__backdrop', 'CloseIcon'])(
    'calls onClose when the %s is clicked',
    async testId => {
      const onCloseMock = jest.fn()
      const click = useClick(
        <Modal {...defaultProps} onClose={onCloseMock}>
          Modal Content
        </Modal>,
      )

      await click(screen.getByTestId(testId))

      expect(onCloseMock).toHaveBeenCalledTimes(1)
    },
  )
})
