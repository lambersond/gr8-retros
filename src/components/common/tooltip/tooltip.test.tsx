import { render, useUser } from '@test-utils'
import { Tooltip } from './tooltip'

describe('components/common/tooltip', () => {
  it('should match the snapshot', () => {
    expect(
      render(<Tooltip title='title'>Hover</Tooltip>).asFragment(),
    ).toMatchSnapshot()
  })

  it('should match the snapshot with placement - asChild component', async () => {
    const { user, getByText } = useUser(
      <Tooltip title='title' asChild>
        <p>Hover</p>
      </Tooltip>,
    )

    await user.hover(getByText('Hover'))

    expect(getByText('title')).toBeInTheDocument()
  })

  it('should match the snapshot with placement - text chilc', async () => {
    const { user, getByText } = useUser(<Tooltip title='title'>Hover</Tooltip>)

    await user.hover(getByText('Hover'))

    expect(getByText('title')).toBeInTheDocument()
  })
})
