import { mockFetch, renderHook, waitFor } from '@test-utils'
import { useFeatureFlags } from './use-feature-flags'

describe('hooks/use-feature-flags', () => {
  it('should fetch feature flags and return them as an object', async () => {
    mockFetch({
      responseData: {
        featureFlags: { featureFlag1: true, featureFlag2: false },
      },
    })
    const { result } = renderHook(() => useFeatureFlags())

    await waitFor(() => {
      expect(result.current).toEqual({
        featureFlag1: true,
        featureFlag2: false,
      })
    })
  })

  it('should handle fetch errors gracefully', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    mockFetch({ status: 500, responseData: {} })
    const { result } = renderHook(() => useFeatureFlags())

    await waitFor(() => {
      expect(result.current).toEqual({})
    })
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching feature flags:',
      expect.any(Error),
    )
  })
})
