import { Hammer, Move } from 'lucide-react'
import { BoardRoleBadge } from '@/components/badges'
import { BoardRole } from '@/enums'

export default function RetroActions() {
  return (
    <>
      <h1 className='pt-8'>Retro Actions</h1>
      <p>
        Retro actions are accessed from the board header via the{' '}
        <Hammer size={16} className='inline-block align-text-bottom' /> hammer
        icon. They provide tools for managing cards, exporting data, sorting,
        filtering, and running facilitated sessions.
      </p>

      <p className='text-sm text-text-secondary italic'>
        Note: The hammer menu is available to{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.FACILITATOR} /> and
        above on claimed boards. On unclaimed boards it is visible to everyone.
      </p>

      <p className='text-sm text-text-secondary italic'>
        Note: During a guided session the hammer menu stays in the header, just
        to the left of the <strong>Next</strong> and <strong>End</strong>{' '}
        buttons. Sort and Filter are only available outside guided mode, since
        the guided phases decide which cards show and in what order.
      </p>

      <h2>Hammer Menu</h2>
      <p>
        The <Hammer size={16} className='inline-block align-text-bottom' />{' '}
        hammer menu contains the following actions:
      </p>

      <h3>Show / Hide Quick Controls</h3>
      <p>
        Brings up the round quick-controls remote (timer start/pause, music, +1
        minute, reset, and a time-limit picker) for you when you aren&rsquo;t
        the chosen facilitator, or hides it again. Only your own board is
        affected, and your choice is remembered in your browser. The chosen
        facilitator always has the remote, so they don&rsquo;t see this option.
        Drag the remote&rsquo;s{' '}
        <Move size={16} className='inline-block align-text-bottom' /> move
        handle to put it anywhere on screen; see{' '}
        <strong>Board Controls &rarr; Quick Controls</strong>.
      </p>

      <h3>Clear All Cards</h3>
      <p>
        Permanently remove every card from the board. You are asked to confirm
        first, with <strong>Yes, clear board</strong>. Only available to{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.ADMIN} /> and above.
      </p>

      <h3>Clear Only Completed Items</h3>
      <p>
        Remove all cards that have been marked as discussed and cards with
        completed action items. You are asked to confirm first, with{' '}
        <strong>Yes, clear completed</strong>.
      </p>

      <h3>Export Options</h3>
      <p>The hammer menu includes export capabilities:</p>
      <ul>
        <li>
          <strong>Report Details</strong> &mdash; generate a PDF report of the
          board&rsquo;s current state including all columns, cards, and
          statistics.
        </li>
        <li>
          <strong>AI Summary Report</strong> &mdash; generate an AI-powered
          summary of discussion points and themes, along with session data. Only
          available when AI Summaries are enabled in board settings.
        </li>
      </ul>

      <h2>Sort</h2>
      <p>
        The sort button lets you reorder cards within each column. Available
        sort options:
      </p>
      <ul>
        <li>
          <strong>By Discussed Status</strong> &mdash; undiscussed cards first.
        </li>
        <li>
          <strong>By Most Upvotes</strong> &mdash; highest upvoted cards first.
        </li>
        <li>
          <strong>By Most Comments</strong> &mdash; cards with the most comments
          first.
        </li>
        <li>
          <strong>By Most Action Items</strong> &mdash; cards with the most
          action items first.
        </li>
        <li>
          <strong>By Most Votes</strong> &mdash; only available after a voting
          session has closed.
        </li>
      </ul>

      <h2>Filter</h2>
      <p>
        The filter button appears after a voting session has closed. It lets you
        narrow the visible cards:
      </p>
      <ul>
        <li>
          <strong>Show All Cards</strong> &mdash; display every card.
        </li>
        <li>
          <strong>Show Only Cards With Votes</strong> &mdash; hide cards that
          received no votes.
        </li>
        <li>
          <strong>Show Cards Without Votes</strong> &mdash; show only cards that
          received no votes.
        </li>
      </ul>

      <h2>Choose Facilitator</h2>
      <p>
        Choose Facilitator lives with the viewing members on the left of the
        header, not in the hammer menu. When Facilitator Mode is enabled in
        board settings, a dashed <strong>?</strong> placeholder appears in front
        of the member avatars.{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.FACILITATOR} /> and
        above (everyone on unclaimed boards) can click it to open{' '}
        <strong>Choose Facilitator</strong>, then either pick one of the
        facilitators currently viewing the board or{' '}
        <strong>Roll for Facilitator</strong> to let participants roll dice for
        it. The chosen facilitator&rsquo;s avatar then takes that spot with a
        crown; right-click it to <strong>Re-choose Facilitator</strong> or{' '}
        <strong>Clear Facilitator</strong>.
      </p>
      <p>
        The chosen facilitator is also the one prompted when every vote is in:
        an <strong>All votes are in</strong> popup offers to close the vote and
        start discussing, and <strong>Start Discussions</strong> is offered when
        a vote is closed another way. See Moving On to Discussion in Board
        Controls for the details.
      </p>
    </>
  )
}
