import { useEffect, useMemo, useState } from 'react'

type FeatureFlags = Record<string, boolean>

type FeatureFlagsResponse = {
  featureFlags: FeatureFlags
}

let cachedFlags: FeatureFlags | undefined
let inflight: Promise<FeatureFlags> | undefined

async function fetchFlags(): Promise<FeatureFlags> {
  const res = await fetch('/api/feature-flags', {
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

    // A single shared request across all consumers. It is deliberately NOT tied
    // to an AbortController: this promise is shared, so one consumer unmounting
    // (e.g. React StrictMode's mount/unmount/mount in dev) must not abort it —
    // doing so rejected the shared promise for the surviving mount too, leaving
    // flags empty forever and making the whole app look logged-out.
    inflight ??= fetchFlags()
      .then(result => {
        cachedFlags = result
        return result
      })
      .finally(() => {
        inflight = undefined
      })

    let active = true
    setIsLoading(true)
    inflight
      .then(result => {
        if (!active) return
        setFlags(result)
        setError(undefined)
      })
      .catch(error_ => {
        if (active) setError(error_)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
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
