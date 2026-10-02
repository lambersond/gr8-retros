import clsx from 'clsx'
import { useVotingProgress } from '../voting/use-voting-progress'

// "Voted / can vote" beside the vote icon, so whoever runs a guided vote can
// tell exactly how many submissions are outstanding. The progress bar alone
// can't distinguish one straggler from two in a big group.
export function VotesSubmitted() {
  const { voted, votingMembers } = useVotingProgress()
  const allIn = votingMembers > 0 && voted >= votingMembers

  return (
    <span
      title={`${voted} of ${votingMembers} have cast their votes`}
      className={clsx(
        '-ml-1 text-sm font-semibold tabular-nums',
        allIn ? 'text-success' : 'text-text-secondary',
      )}
    >
      {voted}/{votingMembers}
      <span className='sr-only'> have cast their votes</span>
    </span>
  )
}
