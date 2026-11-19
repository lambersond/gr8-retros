import { renderHook } from '@test-utils'
import {
  clearFreshConnectionReload,
  reloadWithFreshConnection,
} from './recovery'
import { useAblyIdentityGuard } from './use-ably-identity-guard'

const mockAbly = {
  auth: { clientId: undefined as string | undefined },
  connection: { on: jest.fn(), off: jest.fn() },
}
const mockUseAuth = jest.fn()

jest.mock('ably/react', () => ({ useAbly: () => mockAbly }))
jest.mock('@/hooks/use-auth', () => ({ useAuth: () => mockUseAuth() }))
jest.mock('./recovery', () => ({
  clearFreshConnectionReload: jest.fn(),
  reloadWithFreshConnection: jest.fn(() => true),
}))

const signedInAs = (id: string) =>
  mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { id } })

describe('providers/ably/useAblyIdentityGuard', () => {
  beforeEach(() => {
    mockAbly.auth.clientId = undefined
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('reloads on a fresh connection when the connection identity is stale', () => {
    signedInAs('user-1')
    mockAbly.auth.clientId = 'anonymous-id'

    renderHook(() => useAblyIdentityGuard())

    expect(reloadWithFreshConnection).toHaveBeenCalledTimes(1)
  })

  it('confirms a matching identity without reloading', () => {
    signedInAs('user-1')
    mockAbly.auth.clientId = 'user-1'

    renderHook(() => useAblyIdentityGuard())

    expect(reloadWithFreshConnection).not.toHaveBeenCalled()
    expect(clearFreshConnectionReload).toHaveBeenCalled()
  })

  it('ignores anonymous users, whose connection is meant to be anonymous', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, user: { id: 'a' } })
    mockAbly.auth.clientId = 'b'

    renderHook(() => useAblyIdentityGuard())

    expect(reloadWithFreshConnection).not.toHaveBeenCalled()
  })

  it('checks again once the connection is established', () => {
    signedInAs('user-1')

    renderHook(() => useAblyIdentityGuard())
    expect(reloadWithFreshConnection).not.toHaveBeenCalled()

    const [event, onConnected] = mockAbly.connection.on.mock.calls[0]
    mockAbly.auth.clientId = 'anonymous-id'
    onConnected()

    expect(event).toBe('connected')
    expect(reloadWithFreshConnection).toHaveBeenCalledTimes(1)
  })

  it('stops after one reload if the mismatch persists', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.mocked(reloadWithFreshConnection).mockReturnValueOnce(false)
    signedInAs('user-1')
    mockAbly.auth.clientId = 'anonymous-id'

    renderHook(() => useAblyIdentityGuard())

    expect(error).toHaveBeenCalled()
  })
})
