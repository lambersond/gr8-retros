import { VotingConfig } from './voting-config'
import { usePopover } from '@/components/common'
import { useBoardControlsActions } from '@/providers/retro-board/controls'

export function StartVote() {
  const { openVoting } = useBoardControlsActions(a => ({
    openVoting: a.openVoting,
  }))

  const popover = usePopover()

  const handleStartVoting = () => {
    openVoting()
    popover.setOpen(false)
  }

  return (
    <div className='flex flex-col gap-2'>
      <VotingConfig />
      <button
        onClick={handleStartVoting}
        className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 active:bg-primary/80 transition tracking-wide text-sm cursor-pointer'
      >
        Start Voting
      </button>
    </div>
  )
}
