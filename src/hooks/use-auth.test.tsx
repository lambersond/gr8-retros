import { renderHook, waitFor } from '@test-utils'
import { useAuth } from './use-auth'
import { PaymentTier } from '@/enums'

const mockUseSession = jest.fn().mockReturnValue({})
const mockUseFeatureFlags = jest.fn()

jest.mock('./use-feature-flags', () => ({
  useFeatureFlags: () => mockUseFeatureFlags(),
}))

jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

describe('hooks/use-auth', () => {
  it('should return all info when auth is enabled', async () => {
    const mockUser = {
      id: 'user-1',
      name: 'Test User',
      email: 'test@rms.org',
      image: 'https://example.com/image.jpg',
    }

    mockUseFeatureFlags.mockReturnValue({
      flags: { isAuthEnabled: true },
    })
    mockUseSession.mockReturnValue({
      data: {
        user: mockUser,
      },
      status: 'authenticated',
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current).toEqual({
        isAuthenticated: true,
        isLoading: false,
        session: expect.objectContaining({
          user: mockUser,
        }),
        signIn: expect.any(Function),
        signOut: expect.any(Function),
        status: 'authenticated',
        user: {
          ...mockUser,
          paymentTier: PaymentTier.FREE,
        },
        isEnabled: true,
      })
    })
  })
})
