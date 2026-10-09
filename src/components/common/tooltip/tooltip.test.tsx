import { render, useUser } from '@test-utils'
import { Tooltip } from './tooltip'

describe('components/common/tooltip', () => {
  it('should match the snapshot', () => {
    expect(
      render(<Tooltip title='title'>Hover</Tooltip>).asFragment(),
    ).toMatchSnapshot()
  })

  it('should show the title on hover - asChild component', async () => {
    const { user, getByText, findByRole, queryByRole } = useUser(
      <Tooltip title='title' asChild>
        <p>Hover</p>
      </Tooltip>,
    )

    // asChild uses the child as the trigger instead of wrapping it in a button
    expect(queryByRole('button')).toBeNull()

    await user.hover(getByText('Hover'))

    // The tooltip opens after a hover delay, so wait for it
    expect(await findByRole('tooltip')).toHaveTextContent('title')
  })

  it('should show the title on hover - text child', async () => {
    const { user, getByRole, findByRole } = useUser(
      <Tooltip title='title'>Hover</Tooltip>,
    )

    await user.hover(getByRole('button', { name: 'Hover' }))

    // The tooltip opens after a hover delay, so wait for it
    expect(await findByRole('tooltip')).toHaveTextContent('title')
  })
})
