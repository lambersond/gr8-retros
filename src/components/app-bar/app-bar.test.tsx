import { render } from '@test-utils'
import { AppBar } from './app-bar'

const mockUsePathname = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

jest.mock('./auth', () => ({
  Auth: () => <div>Auth Component</div>,
}))

describe('components/app-bar', () => {
  it('should show nav links when not on a retro page', () => {
    mockUsePathname.mockReturnValue('/')
    const { getByText } = render(<AppBar />)

    expect(getByText('Plans')).toBeInTheDocument()
    expect(getByText('Me')).toBeInTheDocument()
  })

  it('should not show nav links on a retro page', () => {
    mockUsePathname.mockReturnValue('/retro/some-id')
    const { queryByText } = render(<AppBar />)

    expect(queryByText('Plans')).not.toBeInTheDocument()
    expect(queryByText('Me')).not.toBeInTheDocument()
  })
})
