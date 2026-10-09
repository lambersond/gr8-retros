import { mockFetch, render, waitFor } from '@test-utils'
import { Auth } from './auth'
import { ModalProvider } from '@/components/modals/modal-provider'
import { ChangelogProvider } from '@/providers/changelog'
import type { ReactNode } from 'react'

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
  PaymentTierBadge: () => {},
  BoardRoleBadge: () => {},
}))

// Same reason — bypass the prisma-enum chain pulled in by the memberships provider.
jest.mock('@/providers/board-memberships', () => ({
  useBoardMemberships: () => ({ boards: [] }),
}))

// Auth reads the unviewed changelog count, so mount it under the real
// ChangelogProvider (which fetches /api/changelog once signed in).
function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ModalProvider>
      <ChangelogProvider>{children}</ChangelogProvider>
    </ModalProvider>
  )
}

const authenticatedUser = {
  isEnabled: true,
  isAuthenticated: true,
  signOut: jest.fn(),
  user: {
    name: 'User',
    email: 'user@example.com',
    image: '/no-image.jpg',
    paymentTier: 'FREE',
  },
}

describe('components/app-bar/auth', () => {
  it('renders a sign-in trigger when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isEnabled: true,
      isAuthenticated: false,
      signIn: jest.fn(),
      user: { name: 'Guest' },
    })

    const { getByRole, queryByLabelText } = render(<Auth />, {
      wrapper: Providers,
    })

    expect(getByRole('button')).toBeInTheDocument()
    expect(queryByLabelText('Account menu')).not.toBeInTheDocument()
  })

  it('renders the account avatar trigger when authenticated', async () => {
    mockUseAuth.mockReturnValue(authenticatedUser)
    mockFetch({ responseData: { items: [] } })

    const { getByLabelText, queryByLabelText } = render(<Auth />, {
      wrapper: Providers,
    })

    expect(getByLabelText('Account menu')).toBeInTheDocument()
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/changelog')
    })
    // An empty changelog leaves nothing unviewed, so the avatar has no dot.
    expect(
      queryByLabelText(/unviewed changelog updates/),
    ).not.toBeInTheDocument()
  })

  it('flags unviewed changelog updates on the avatar trigger', async () => {
    mockUseAuth.mockReturnValue(authenticatedUser)
    mockFetch({
      responseData: {
        items: [
          { id: 1, title: 'First', date: '2026-10-01', excerpt: '' },
          { id: 2, title: 'Second', date: '2026-10-02', excerpt: '' },
        ],
      },
    })

    const { findByLabelText, getByLabelText } = render(<Auth />, {
      wrapper: Providers,
    })

    expect(
      await findByLabelText('2 unviewed changelog updates'),
    ).toBeInTheDocument()
    expect(getByLabelText('Account menu')).toContainElement(
      getByLabelText('2 unviewed changelog updates'),
    )
  })
})
