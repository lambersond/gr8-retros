import { useUser, screen } from '@test-utils'
import { Sidebar } from './sidebar'

describe('components/common/sidebar', () => {
  it('toggles sidebar on button click', async () => {
    const { user } = useUser(
      <Sidebar trigger={<button>trigger</button>}>content</Sidebar>,
    )

    expect(screen.getByTestId('sidebar')).toHaveClass('-translate-x-full')

    await user.click(screen.getByTestId('sidebar__button'))

    expect(screen.getByTestId('sidebar')).toHaveClass('translate-x-0')

    await user.click(screen.getByTestId('sidebar__overlay'))

    expect(screen.getByTestId('sidebar')).toHaveClass('-translate-x-full')
  })
})
