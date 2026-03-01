import { useCallback, useEffect, useState } from 'react'
import { VotingMode, VotingState } from '@/enums'

type UseVotingParams = {
  state: VotingState
  mode: VotingMode
  limit: number
  onSubmit?: (votes: string[]) => Promise<void>
}

export function useVoting({ state, mode, limit, onSubmit }: UseVotingParams) {
  const [votes, setVotes] = useState<string[]>([])
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    if (state !== VotingState.OPEN) {
      setVotes([])
      setHasVoted(false)
    }
  }, [state])

  const addMyVote = useCallback(
    (itemId: string) => {
      if (state !== VotingState.OPEN || hasVoted) return

      setVotes(prev => {
        if (prev.length >= limit) return prev
        // In SINGLE mode, prevent duplicate card selections.
        if (mode === VotingMode.SINGLE && prev.includes(itemId)) return prev
        return [...prev, itemId]
      })
    },
    [state, hasVoted, limit, mode],
  )

  const removeMyVote = useCallback(
    (itemId: string) => {
      if (state !== VotingState.OPEN || hasVoted) return
      setVotes(prev => prev.filter(id => id !== itemId))
    },
    [state, hasVoted],
  )

  const clearMyVotes = useCallback(() => {
    setVotes([])
    setHasVoted(false)
  }, [])

  const updateHasVoted = useCallback((newStatus: boolean) => {
    setHasVoted(newStatus)
  }, [])

  const submitVotes = useCallback(async () => {
    if (state !== VotingState.OPEN || hasVoted) return
    await onSubmit?.(votes)
    setHasVoted(true)
  }, [state, hasVoted, votes, onSubmit])

  return {
    votes,
    hasVoted,
    canVote: state === VotingState.OPEN && !hasVoted,
    addMyVote,
    removeMyVote,
    clearMyVotes,
    updateHasVoted,
    submitVotes,
  }
}
