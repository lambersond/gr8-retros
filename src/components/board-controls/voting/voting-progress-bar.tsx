import { useVotingProgress } from './use-voting-progress'

// A thin bar hugging the bottom of the board-controls pill, filling as
// participants submit their votes. Meant to sit inside a `relative
// overflow-hidden` container so its ends clip to the pill's rounded corners.
export function VotingProgressBar() {
  const { percentage } = useVotingProgress()

  return (
    <div
      aria-hidden
      className='absolute bottom-0 left-0 right-0 h-1 bg-text-secondary/10'
    >
      <div
        style={{ width: `${Math.min(percentage, 100)}%` }}
        className='h-full bg-success transition-[width] duration-300'
      />
    </div>
  )
}
