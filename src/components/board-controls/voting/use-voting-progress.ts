import { hasMinimumRole } from '@/lib/roles'
import { useBoardSettings } from '@/providers/retro-board/board-settings'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import { useViewingMembers } from '@/providers/viewing-members'

// A participant counts as "voted" only once their submission lands in
// collectedVotes (keyed by userId) — i.e. after they click "I'm done", not on
// each live vote click. The denominator is everyone currently viewing, narrowed
// to MEMBER+ when the board restricts voting to members.
export function useVotingProgress() {
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
      m => !membersOnly || hasMinimumRole('MEMBER', m.role),
    )?.length ?? 0
  const voted = Object.keys(membersVoted).length
  const percentage =
    votingMembers > 0 ? Math.round((voted / votingMembers) * 100) : 0

  return { voted, votingMembers, percentage }
}
