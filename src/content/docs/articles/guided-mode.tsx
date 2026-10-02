import {
  Combine,
  Eraser,
  LogOut,
  MessagesSquare,
  NotebookPen,
  Vote,
  Waypoints,
} from 'lucide-react'
import { BoardRoleBadge, PaymentTierBadge } from '@/components/badges'
import { BoardRole, PaymentTier } from '@/enums'

export default function GuidedMode() {
  return (
    <>
      <h1 className='pt-8'>Guided Mode</h1>
      <p>
        Guided Mode is an opinionated, facilitator-led way to run a
        retrospective. Instead of everyone doing everything at once on a
        free-form board, the whole team moves together through four phases
        &mdash; <strong>Reflect</strong>, <strong>Group</strong>,{' '}
        <strong>Vote</strong>, and <strong>Discuss</strong> &mdash; one step at
        a time. A facilitator drives the flow and every participant&rsquo;s
        board advances in sync.
      </p>

      <p>
        Guided Mode reuses the board&rsquo;s existing tools &mdash; the timer,
        music, voting, card grouping, and the facilitator discussion view
        &mdash; and sequences them into a structured flow. Nothing you already
        know about the board is lost; it is simply presented one activity at a
        time.
      </p>

      <p className='text-sm text-text-secondary italic'>
        Note: Guided Mode requires the board owner to be on the{' '}
        <PaymentTierBadge tier={PaymentTier.SUPPORTER} /> plan or above. Every
        other participant can take part without a subscription.
      </p>

      <h2>Enabling Guided Mode</h2>
      <p>
        Turn on <strong>Guided Mode</strong> from the Board Settings sidebar.
        Like other feature toggles, it can be enabled by an{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.ADMIN} /> and above.
        Once enabled, any{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.FACILITATOR} /> can
        start a guided session.
      </p>

      <h2>Starting a Session</h2>
      <p>
        Open the <strong>Board Controls</strong> panel and choose{' '}
        <Waypoints size={16} className='inline-block align-text-bottom' />{' '}
        <strong>Start Guided Retro</strong>. Everyone on the board immediately
        switches into the guided layout, beginning on the Reflect phase. A phase
        timeline appears in the board header showing where the group is; the
        active phase carries an info icon with a short hint about what to do.
      </p>

      <h2>Who Drives the Flow</h2>
      <p>
        A <BoardRoleBadge variant='simple' role={BoardRole.FACILITATOR} /> and
        above steers the session with <strong>Next</strong> and{' '}
        <strong>End</strong> buttons in the header. Advancing moves everyone
        forward at the same time &mdash; participants do not navigate phases
        themselves; their boards follow the facilitator. The timer and music
        stay available throughout for the facilitator to use as needed.
      </p>

      <h2>The Phases</h2>

      <h3>
        <NotebookPen size={18} className='inline-block align-text-bottom' />{' '}
        Reflect
      </h3>
      <p>
        Everyone writes their own cards privately. To encourage independent
        thinking, other participants&rsquo; cards stay hidden &mdash; you see
        only a count of how many reflections are still hidden, and all cards are
        revealed to the group at once when the facilitator moves on to Group.
        During Reflect, cards show only <strong>Edit</strong> and{' '}
        <strong>Delete</strong>; voting, comments, and other card actions are
        set aside so the focus stays on writing.
      </p>

      <h3>
        <Combine size={18} className='inline-block align-text-bottom' /> Group
      </h3>
      <p>
        All reflections are now visible. Drag similar cards together to group
        related ideas so the team can vote on themes rather than duplicates.
        Card grouping and drag-and-drop are enabled automatically for this
        phase, even if those board settings are otherwise off.
      </p>

      <h3>
        <Vote size={18} className='inline-block align-text-bottom' /> Vote
      </h3>
      <p>
        A fresh voting session opens so the team can prioritize what to discuss.
        Cast your votes on cards, then click <strong>Cast My Votes</strong> to
        submit your ballot. A progress indicator shows how many participants
        have submitted, and whoever can move the session on also sees the exact
        count (for example <strong>3/8</strong>) beside the vote icon in the
        board controls. Changed your mind? Use{' '}
        <Eraser size={16} className='inline-block align-text-bottom' />{' '}
        <strong>Reset my votes</strong> to clear your submission and vote again.
        If the facilitator tries to advance before everyone has voted, they are
        warned first. Voting is enabled automatically for this phase, even if
        the board&rsquo;s voting setting is otherwise off.
      </p>

      <h3>
        <MessagesSquare size={18} className='inline-block align-text-bottom' />{' '}
        Discuss
      </h3>
      <p>
        The board switches to the focused facilitator view. Top-voted topics are
        presented one at a time, with a stacked preview of what&rsquo;s next.
        Work through each item, mark it discussed to advance to the next, and
        capture action items as you go. This is the same discussion experience
        described under <strong>Board Controls &rarr; Facilitation</strong>.
      </p>

      <h2>Ending a Session</h2>
      <p>
        The facilitator ends the session with the{' '}
        <LogOut size={16} className='inline-block align-text-bottom' />{' '}
        <strong>End</strong> button. A confirmation appears so no one leaves the
        flow by accident; confirming returns everyone to the standard board
        layout. Your cards, groups, and action items are all preserved &mdash;
        only the guided flow ends.
      </p>

      <p className='text-sm text-text-secondary italic'>
        Note: Because the whole team moves through the phases together, Guided
        Mode is best run live &mdash; in the room or over a call &mdash; with a
        facilitator steering the session.
      </p>
    </>
  )
}
