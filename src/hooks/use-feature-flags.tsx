import { useEffect, useMemo, useState } from 'react'

type FeatureFlags = Record<string, boolean>

type FeatureFlagsResponse = {
  featureFlags: FeatureFlags
}

let cachedFlags: FeatureFlags | undefined
let inflight: Promise<FeatureFlags> | undefined

async function fetchFlags(signal?: AbortSignal): Promise<FeatureFlags> {
  const res = await fetch('/api/feature-flags', {
    signal,
    headers: { Accept: 'application/json' },
    cache: 'no-store', // remove if you want browser caching
  })

  if (!res.ok) throw new Error(`Failed to fetch feature flags (${res.status})`)

  const data = (await res.json()) as FeatureFlagsResponse
  return data.featureFlags ?? {}
}

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlags>(() => cachedFlags ?? {})
  const [isLoading, setIsLoading] = useState(() => cachedFlags == undefined)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    if (cachedFlags) return

    const controller = new AbortController()

    // Reuse the same request across all hook consumers.
    inflight ??= fetchFlags(controller.signal)
      .then(result => {
        cachedFlags = result
        return result
      })
      .finally(() => {
        inflight = undefined
      })

    setIsLoading(true)
    inflight
      .then(result => {
        setFlags(result)
        setError(undefined)
      })
      .catch(error_ => {
        // Ignore abort errors
        if (controller.signal.aborted) return
        setError(error_)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  const api = useMemo(() => {
    return {
      flags,
      isLoading,
      error,
      isEnabled: (key: string) => !!flags[key],
    }
  }, [flags, isLoading, error])

  return api
}
