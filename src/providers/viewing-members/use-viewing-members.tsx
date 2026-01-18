import { useContext } from 'react'
import { ViewingMembersContext } from './provider'

export function useViewingMembers() {
  const context = useContext(ViewingMembersContext)
  if (!context) {
    throw new Error(
      'useViewingMembers must be used within ViewingMembersProvider',
    )
  }
  return context
}
