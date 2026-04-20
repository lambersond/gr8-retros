import { CirclePause, CirclePlay, CircleStop } from 'lucide-react'
import { BoardRoleBadge } from '@/components/badges'
import { BoardRole } from '@/enums'

export default function BoardControls() {
  return (
    <>
      <h1 className='pt-8'>Board Controls</h1>
      <p>
        Board Controls are located at the top-center of the retro board and are
        typically viewed as a timer. The controls give facilitators and
        participants quick access to the timer, music, voting, and facilitation
        features.
      </p>

      <p className='text-sm text-text-secondary italic'>
        Note: If the overall setting for a board control is turned off, its
        related icon will not appear in the control bar indicators and the
        control will not be available when the panel is expanded.
      </p>

      <h2>Timer</h2>
      <p>
        The timer provides a shared countdown visible to everyone on the board.
        Use it to time-box phases of your retrospective.
      </p>
      <ul>
        <li>
          Set the duration using the time input. The default duration is
          configured in board settings (5 minutes by default).
        </li>
        <li>
          Press <strong>Play</strong> to start the countdown. Press again to{' '}
          <strong>Pause</strong>.
        </li>
        <li>
          Use <strong>+1 min</strong> to extend the timer on the fly.
        </li>
        <li>
          Press <strong>Reset</strong> (visible while running) to return to the
          configured default duration.
        </li>
        <li>
          A time-remaining indicator is always visible in the control bar so
          participants can see the countdown at a glance.
        </li>
      </ul>
      <p>
        When the timer is restricted, only{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.FACILITATOR} /> and
        above can start, pause, or reset it. All participants can still see the
        countdown.
      </p>

      <h2>Music</h2>
      <p>
        Background music helps set the mood during writing and brainstorming
        phases. The music controls let you pick a track and manage playback.
      </p>
      <ul>
        <li>
          Open the track picker to choose from the available ambient tracks.
        </li>
        <li>
          Use{' '}
          <CirclePlay size={16} className='inline-block align-text-bottom' />{' '}
          <strong>Play</strong>,{' '}
          <CirclePause size={16} className='inline-block align-text-bottom' />{' '}
          <strong>Pause</strong>, and{' '}
          <CircleStop size={16} className='inline-block align-text-bottom' />{' '}
          <strong>Stop</strong> to control playback.
        </li>
        <li>Adjust the volume with the volume slider.</li>
        <li>
          A music status indicator in the control bar shows whether music is
          currently playing.
        </li>
        <li>
          If music is playing when a timer ends, the music will also stop
          automatically.
        </li>
      </ul>
      <p>
        When music is restricted, only{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.FACILITATOR} /> and
        above can change the track, start, or stop playback.
      </p>

      <h2>Voting</h2>
      <p>
        The board supports two forms of voting: <strong>Upvoting</strong> for
        quick, lightweight signaling and <strong>Structured Voting</strong> for
        formal prioritization. Both can be enabled simultaneously.
      </p>

      <h3>Upvoting</h3>
      <p>
        Upvoting is a lightweight alternative to structured voting. Each
        participant can cast a single upvote per card at any time (when the
        feature is enabled) to signal agreement or importance. Unlike structured
        voting, upvoting does not have open/close phases &mdash; it is always
        available.
      </p>
      <ul>
        <li>Click the upvote button on a card to add your vote.</li>
        <li>
          The upvote count is displayed directly on the card for everyone to
          see.
        </li>
        <li>
          An optional upvote limit can cap how many upvotes each participant can
          give across the board.
        </li>
      </ul>

      <h3>Structured Voting</h3>
      <p>
        Structured voting lets the team formally prioritize discussion topics. A
        voting session moves through three phases. With structured voting, if
        multi-mode is enabled a single participant can place multiple votes on
        the same card, unlike upvoting where each participant gets one vote per
        card.
      </p>

      <h4>1. Start Vote</h4>
      <p>
        Before opening a vote, configure the session. Set the number of votes
        per participant and choose the voting mode:
      </p>
      <ul>
        <li>
          <strong>Single mode:</strong> Each participant can vote for a card at
          most once.
        </li>
        <li>
          <strong>Multi mode:</strong> Participants can place multiple votes on
          the same card.
        </li>
      </ul>
      <p>
        Click <strong>Start Voting</strong> to open the vote. All eligible
        participants will see vote indicators appear on cards.
      </p>

      <h4>2. Active Vote</h4>
      <p>While voting is open:</p>
      <ul>
        <li>
          Participants click cards to cast votes. A badge shows how many votes
          they have placed on each card.
        </li>
        <li>
          Votes can be removed before submitting by clicking the card again.
        </li>
        <li>
          Once all votes are placed, click <strong>Submit</strong> to lock in
          the ballot.
        </li>
        <li>
          A progress bar in the controls shows how many participants have
          submitted their votes.
        </li>
        <li>
          The facilitator can end the vote early by clicking{' '}
          <strong>End Vote</strong>.
        </li>
      </ul>

      <h4>3. Closed Vote</h4>
      <p>
        After voting ends, the total vote count is displayed. Cards are
        annotated with their vote tallies so the team can see which items were
        prioritized. Click <strong>Reset Votes</strong> to clear results and
        return to the start state.
      </p>

      <h3>Upvoting &amp; Voting Together</h3>
      <p>
        When both upvoting and structured voting are enabled, they work in
        harmony. When a vote is started, cards within each column are
        automatically ordered from most to least upvotes so the team can use
        upvote signals to inform their structured vote.
      </p>

      <h2>Facilitation</h2>
      <p>
        When Facilitator Mode is enabled in board settings, a{' '}
        <strong>Facilitate Session</strong> button appears in the board
        controls. Clicking it activates a presenter-style view that transforms
        the board into a guided discussion.
      </p>
      <ul>
        <li>
          The multi-column layout is replaced with a single-card focus view.
        </li>
        <li>
          The top undiscussed card is displayed prominently, with upcoming cards
          visible as a stacked preview behind it.
        </li>
        <li>
          Cards are shown in order, sorted by votes and filtered by any active
          filters.
        </li>
        <li>A counter shows how many items remain to discuss.</li>
        <li>
          When the team is done discussing a card, it is marked as discussed and
          the next card moves to the front.
        </li>
        <li>
          Drag and drop and card editing are disabled during facilitated
          sessions to keep the focus on discussion.
        </li>
      </ul>

      <h3>Facilitate a Session</h3>
      <ul>
        <li>
          The multi-column layout is replaced with a single-card focus view.
        </li>
        <li>
          The top undiscussed card is displayed prominently, with upcoming cards
          visible as a stacked preview behind it.
        </li>
        <li>
          Cards are shown in order, sorted by votes and filtered by any active
          filters.
        </li>
        <li>A counter shows how many items remain to discuss.</li>
        <li>
          When the team is done discussing a card, it is marked as discussed and
          the next card moves to the front.
        </li>
        <li>
          Drag and drop and card editing are disabled during facilitated
          sessions to keep the focus on discussion.
        </li>
      </ul>
      <p>
        Click <strong>End Session</strong> to return to the normal board view.
      </p>

      <p className='text-sm text-text-secondary italic'>
        Note: Facilitation cannot be started while a voting session is active.
        End or reset the current vote before beginning a facilitation session.
      </p>

      <h2>Control Bar Indicators</h2>
      <p>
        Even when the controls panel is closed, the control bar shows
        at-a-glance status indicators:
      </p>
      <ul>
        <li>
          <strong>Time remaining</strong> &mdash; live countdown in mm:ss
          format.
        </li>
        <li>
          <strong>Music status</strong> &mdash; play/pause icon for the current
          track.
        </li>
        <li>
          <strong>Votes remaining</strong> &mdash; how many votes the current
          user has left to cast.
        </li>
        <li>
          <strong>Facilitation</strong> &mdash; when a facilitation session is
          active, its icon appears in the control bar. If the voting session is
          closed, the facilitation icon replaces the voting indicator.
        </li>
      </ul>
    </>
  )
}
