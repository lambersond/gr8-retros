import { Info } from '@/components/common'
import { useModals } from '@/hooks/use-modals'
import { hasMinimumRole } from '@/lib/roles'
import { useBoardSettings } from '@/providers/retro-board/board-settings'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'
import { useViewingMembers } from '@/providers/viewing-members'

export function ActiveVote() {
  const { openModal } = useModals()
  const { closeVoting } = useBoardControlsActions(a => ({
    closeVoting: a.closeVoting,
  }))
  const { membersVoted } = useBoardControlsState(s => ({
    membersVoted: s.boardControls.voting.collectedVotes,
  }))

  const {
    settings: {
      voting: {
        subsettings: {
          restricted: { enabled: membersOnly },
        },
      },
    },
  } = useBoardSettings()

  const { viewingMembers } = useViewingMembers()

  const votingMembers =
    Object.values(viewingMembers).filter(
      m => !membersOnly || hasMinimumRole(m.role, 'MEMBER'),
    )?.length ?? 0
  const voted = Object.keys(membersVoted).length
  const percentage =
    votingMembers > 0 ? Math.round((voted / votingMembers) * 100) : 0

  const handleCloseVotingClick = () => {
    if (voted === votingMembers) {
      closeVoting()
    } else {
      openModal('ConfirmModal', {
        title: 'Close Voting Early?',
        message: `Only ${voted} out of ${votingMembers} have voted. Are you sure you want to close the vote?`,
        confirmButtonText: 'Yes, close it',
        color: 'danger',
        cancelButtonText: 'No, keep it open',
        onConfirm: () => closeVoting(),
      })
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <button
        onClick={handleCloseVotingClick}
        style={{ ['--progress' as any]: `${percentage}%` }}
        data-complete={percentage === 100 ? 'true' : undefined}
        className="
          relative overflow-hidden text-sm italic tracking-tight text-center text-white
          py-2 bg-secondary/10 rounded-md cursor-pointer transition w-full

          before:content-['Voting_in_progress...'] before:absolute before:top-0 before:left-0
          before:h-full before:w-full before:bg-success before:z-2 before:text-white
          before:flex before:items-center before:justify-center
          before:[clip-path:inset(0_calc(100%_-_var(--progress))_0_0)]

          after:content-['Voting_in_progress...'] after:text-text-secondary
          after:italic after:block after:animate-pulse after:relative

          hover:after:content-['End_Vote'] hover:after:text-white
          hover:after:animate-none hover:bg-danger/90 active:bg-danger/80
          hover:before:hidden

          data-[complete=true]:before:content-['All_Votes_In!'] data-[complete=true]:before:[clip-path:none]
          data-[complete=true]:after:content-['Generate_Results...'] data-[complete=true]:after:animate-none
          data-[complete=true]:hover:after:z-3 data-[complete=true]:hover:after:text-white data-[complete=true]:after:py-2 data-[complete=true]:after:-my-2 data-[complete=true]:hover:after:shadow-md
          data-[complete=true]:hover:after:bg-success/90 data-[complete=true]:hover:before:flex
          data-[complete=true]:hover:after:content-['Generate_Results...'] data-[complete=true]:hover:after:text-text-secondary
        "
      />
      <div className='flex items-start justify-around mt-1'>
        <div className='flex flex-col items-center'>
          <p className='text-3xl'>{votingMembers}</p>
          <span className='text-sm italic text-text-secondary tracking-tight -mt-1 flex items-center gap-1'>
            Voting
            <Info info='Total amount of participants' />
          </span>
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-3xl'>{voted}</p>
          <p className='text-sm italic text-text-secondary tracking-tight -mt-1 flex items-center gap-1'>
            Voted
            <Info info='Participants that have submitted their votes' />
          </p>
        </div>
      </div>
    </div>
  )
}
