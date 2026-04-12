import { useContext } from 'react'
import { SessionStatsContext } from './provider'

export function useSessionStats() {
  const context = useContext(SessionStatsContext)
  if (!context) {
    throw new Error('useSessionStats must be used within SessionStatsProvider')
  }
  return context
}
