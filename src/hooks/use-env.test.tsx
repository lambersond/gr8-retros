import { mockFetch, renderHook, waitFor } from '@test-utils'
import { useEnv } from './use-env'

describe('hooks/use-env', () => {
  it('should fetch environment variables from API', async () => {
    mockFetch({
      status: 200,
      responseData: {
        keycloakClientId: 'test-client-id',
        roles: {
          isse: 'test-isse-role',
          admin: 'test-admin-role',
        },
      },
    })

    const { result } = renderHook(() => useEnv())

    expect(result.current).toEqual({
      keycloakClientId: '',
      roles: {
        isse: '',
        admin: '',
      },
    })

    await waitFor(() => {
      expect(result.current).toEqual({
        keycloakClientId: 'test-client-id',
        roles: {
          isse: 'test-isse-role',
          admin: 'test-admin-role',
        },
      })
    })
  })

  it('should handle fetch errors gracefully', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    mockFetch({
      status: 500,
      responseData: { error: 'Internal Server Error' },
    })

    renderHook(() => useEnv())

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching environment variables:',
        expect.any(Error),
      )
    })
  })
})
