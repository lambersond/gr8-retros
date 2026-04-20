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
  it('should show desktop nav links', () => {
    mockUsePathname.mockReturnValue('/')
    const { getByText } = render(<AppBar />)

    expect(getByText('Plans')).toBeInTheDocument()
    expect(getByText('Boards')).toBeInTheDocument()
  })

  it('should show mobile sidebar trigger', () => {
    mockUsePathname.mockReturnValue('/')
    const { getByTestId } = render(<AppBar />)

    expect(getByTestId('sidebar__button')).toBeInTheDocument()
  })
})
