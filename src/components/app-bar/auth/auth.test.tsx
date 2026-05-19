import { render } from '@test-utils'
import { Auth } from './auth'
import { ModalProvider } from '@/components/modals/modal-provider'

const mockUseAuth = jest.fn()

jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => mockUseAuth(),
}))

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// The badges package transitively imports prisma-backed enums, which the test
// runtime doesn't populate. Stub it out so the auth tree mounts cleanly.
jest.mock('@/components/badges', () => ({
  PaymentTierBadge: () => null,
  BoardRoleBadge: () => null,
}))

// Same reason — bypass the prisma-enum chain pulled in by the memberships provider.
jest.mock('@/providers/board-memberships', () => ({
  useBoardMemberships: () => ({ boards: [] }),
}))

describe('components/app-bar/auth', () => {
  it('renders a sign-in trigger when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isEnabled: true,
      isAuthenticated: false,
      signIn: jest.fn(),
      user: { name: 'Guest' },
    })

    const { getByRole } = render(<Auth />, {
      wrapper: ModalProvider,
    })

    expect(getByRole('button')).toBeInTheDocument()
  })

  it('renders the account avatar trigger when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isEnabled: true,
      isAuthenticated: true,
      signOut: jest.fn(),
      user: {
        name: 'User',
        email: 'user@example.com',
        image: '/no-image.jpg',
        paymentTier: 'FREE',
      },
    })

    const { getByLabelText } = render(<Auth />, {
      wrapper: ModalProvider,
    })

    expect(getByLabelText('Account menu')).toBeInTheDocument()
  })
})
