import { Hammer } from 'lucide-react'
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

      <h2>Hammer Menu</h2>
      <p>
        The <Hammer size={16} className='inline-block align-text-bottom' />{' '}
        hammer menu contains the following actions:
      </p>

      <h3>Choose Facilitator</h3>
      <p>
        When Facilitator Mode is enabled in board settings, a{' '}
        <strong>Choose Facilitator</strong> option appears at the top of the
        menu. Selecting it opens the dice roller where participants roll to
        determine the session facilitator.
      </p>

      <h3>Clear All Cards</h3>
      <p>
        Permanently remove every card from the board. This action requires
        confirmation and is only available to{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.ADMIN} /> and above.
      </p>

      <h3>Clear Completed Items</h3>
      <p>
        Remove all cards that have been marked as discussed and cards with
        completed action items. A confirmation prompt is shown before
        proceeding.
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
    </>
  )
}
