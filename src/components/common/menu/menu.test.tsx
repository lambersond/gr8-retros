import { useUser } from '@test-utils'
import { Menu } from './menu'

describe('components/common/menu', () => {
  const mockOnClick = jest.fn()
  const options = [{ label: 'Edit', onClick: mockOnClick }]

  it('should handle menu selection', async () => {
    const { user, getByText } = useUser(<Menu options={options} />)

    await user.click(getByText('Edit'))

    expect(mockOnClick).toHaveBeenCalled()
  })
})
