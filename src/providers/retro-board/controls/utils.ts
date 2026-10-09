export function elapsedSeconds(startedAt?: number) {
  if (!startedAt) return 0
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
}

// Turns the submissions (voter -> the ids they voted for) into results (id ->
// its voters), which is what closing a vote publishes.
export function tallyVotes(collectedVotes: Record<string, string[]>) {
  const results: Record<string, string[]> = {}
  for (const [voterId, votes] of Object.entries(collectedVotes)) {
    for (const vote of votes) {
      results[vote] ??= []
      results[vote].push(voterId)
    }
  }
  return results
}
