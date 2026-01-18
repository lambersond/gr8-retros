import { useContext } from 'react'
import { BoardMembershipContext } from '../provider'

export function useBoardMemberships() {
  const context = useContext(BoardMembershipContext)
  if (!context) {
    throw new Error(
      'useBoardMembership must be used within BoardMembershipProvider',
    )
  }
  return context
}
