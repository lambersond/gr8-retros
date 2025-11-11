import { useEffect, useState } from 'react'

const defaultEnv = {
  keycloakClientId: '',
  roles: {
    isse: '',
    admin: '',
  },
} as const

export type Env = typeof defaultEnv

export function useEnv() {
  const [env, setEnv] = useState(defaultEnv)

  useEffect(() => {
    async function fetchEnv() {
      try {
        const response = await fetch('/api/env')
        if (!response.ok) {
          throw new Error('Failed to fetch environment variables')
        }
        const data = await response.json()
        setEnv(data)
      } catch (error) {
        console.error('Error fetching environment variables:', error)
      }
    }

    fetchEnv()
  }, [])

  return env
}
