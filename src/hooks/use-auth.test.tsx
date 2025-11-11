import { renderHook, waitFor } from '@test-utils'
import { useAuth } from './use-auth'

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
      name: 'Test User',
      email: 'test@rms.org',
      image: 'https://example.com/image.jpg',
    }

    mockUseFeatureFlags.mockReturnValue({
      isAuthEnabled: true,
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
        session: expect.objectContaining({
          user: mockUser,
        }),
        signIn: expect.any(Function),
        signOut: expect.any(Function),
        status: 'authenticated',
        user: mockUser,
        isEnabled: true,
      })
    })
  })
})
