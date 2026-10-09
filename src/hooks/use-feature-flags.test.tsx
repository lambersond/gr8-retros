import React from 'react'
import { mockFetch, renderHook, waitFor } from '@test-utils'
import type * as FeatureFlagsModule from './use-feature-flags'

let useFeatureFlags: typeof FeatureFlagsModule.useFeatureFlags

describe('hooks/use-feature-flags', () => {
  // The hook caches flags at module scope so every consumer shares one
  // request. Load a fresh copy per test so one test's cache can't leak into
  // the next, while keeping the React instance the test renderer uses.
  beforeEach(async () => {
    jest.resetModules()
    jest.doMock('react', () => React)
    ;({ useFeatureFlags } = await import('./use-feature-flags'))
  })

  it('should fetch feature flags and expose them once loaded', async () => {
    mockFetch({
      responseData: {
        featureFlags: { featureFlag1: true, featureFlag2: false },
      },
    })
    const { result } = renderHook(() => useFeatureFlags())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.flags).toEqual({})

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.flags).toEqual({
      featureFlag1: true,
      featureFlag2: false,
    })
    expect(result.current.error).toBeUndefined()
    expect(result.current.isEnabled('featureFlag1')).toBe(true)
    expect(result.current.isEnabled('featureFlag2')).toBe(false)
    expect(result.current.isEnabled('unknownFlag')).toBe(false)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/feature-flags',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('should handle fetch errors gracefully', async () => {
    mockFetch({ status: 500, responseData: {} })
    const { result } = renderHook(() => useFeatureFlags())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.error).toEqual(
      new Error('Failed to fetch feature flags (500)'),
    )
    expect(result.current.flags).toEqual({})
    expect(result.current.isEnabled('featureFlag1')).toBe(false)
  })

  it('should reuse the cached flags for later consumers without refetching', async () => {
    mockFetch({
      responseData: { featureFlags: { featureFlag1: true } },
    })
    const first = renderHook(() => useFeatureFlags())
    await waitFor(() => {
      expect(first.result.current.isLoading).toBe(false)
    })

    const second = renderHook(() => useFeatureFlags())

    expect(second.result.current.isLoading).toBe(false)
    expect(second.result.current.flags).toEqual({ featureFlag1: true })
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })
})
