import { useEffect, useState } from 'react'

export function useFeatureFlags() {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchFeatureFlags() {
      try {
        const response = await fetch('/api/feature-flags')
        if (!response.ok) {
          throw new Error('Failed to fetch feature flags')
        }
        const data = await response.json()
        setFeatureFlags(data.featureFlags)
      } catch (error) {
        console.error('Error fetching feature flags:', error)
      }
    }

    fetchFeatureFlags()
  }, [])

  return featureFlags
}
