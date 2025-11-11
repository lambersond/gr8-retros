import { render } from '@test-utils'
import { Auth } from './auth'
import { ModalProvider } from '@/components/modals/modal-provider'

const mockUseAuth = jest.fn()

jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => mockUseAuth(),
}))

jest.mock('@/components/sidebars/account-sidebar', () => ({
  AccountSidebar: () => <div data-testid='account-sidebar' />,
}))

describe('components/app-bar/auth', () => {
  it('should render login button if not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isEnabled: true,
      isAuthenticated: false,
      signIn: jest.fn(),
      user: { name: 'Guest' },
    })

    const { getByText } = render(<Auth />, {
      wrapper: ModalProvider,
    })

    expect(getByText(/Sign In/)).toBeInTheDocument()
  })

  it('should render logout button if authenticated', () => {
    mockUseAuth.mockReturnValue({
      isEnabled: true,
      isAuthenticated: true,
      signOut: jest.fn(),
      user: { name: 'User' },
    })

    const { getByTestId } = render(<Auth />, {
      wrapper: ModalProvider,
    })

    expect(getByTestId('account-sidebar')).toBeInTheDocument()
  })
})
