'use client'

import { useCallback, useState } from 'react'
import clsx from 'clsx'
import { Move, Pause, Play, TimerReset } from 'lucide-react'
import { MusicStatus } from '../indicators'
import { QuickTimeSetter } from './quick-time-setter'
import { useFacilitatorRemote } from './use-facilitator-remote'
import { useRemotePosition } from './use-remote-position'
import { Popover, Tooltip } from '@/components/common'
import { useBoardSettings } from '@/providers/retro-board/board-settings'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

type Side = 'top' | 'right' | 'bottom' | 'left'

const HUB_CLASSES =
  'pointer-events-auto absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full border border-border-light bg-paper font-mono text-xs text-text-primary lg:size-16 lg:text-sm'

// A "remote control" for running the session: a dial (120px, 160px on large
// screens) with timer start/pause (north), music play/pause (east), +1 minute
// (south), and timer reset (west). The countdown in the center opens a quick
// time-limit picker. Together they skip the board-controls popover. It starts
// in the bottom-right corner, and the handle on its rim moves it anywhere on
// screen, remembered per browser (see useRemotePosition). The chosen
// facilitator always gets it; other facilitators can show it from Facilitator
// Actions (see useFacilitatorRemote). Each section still honors the board's
// timer/music settings and restrictions.
export function FacilitatorRemote() {
  const { isVisible, timerBlocked, musicBlocked, timerEnabled } =
    useFacilitatorRemote()

  if (!isVisible) return
  return (
    <RemoteDial
      timerBlocked={timerBlocked}
      musicBlocked={musicBlocked}
      timerEnabled={timerEnabled}
    />
  )
}

// Split from the gate above so only people who see the remote subscribe to the
// ticking timer state.
function RemoteDial({
  timerBlocked,
  musicBlocked,
  timerEnabled,
}: Readonly<{
  timerBlocked: string | undefined
  musicBlocked: string | undefined
  timerEnabled: boolean
}>) {
  const {
    settings: {
      timer: {
        subsettings: {
          defaultDuration: { value: defaultDuration },
        },
      },
    },
  } = useBoardSettings()
  const { formatted, secondsLeft, isRunning, isMusicPlaying } =
    useBoardControlsState(s => ({
      formatted: s.formatted,
      secondsLeft: s.secondsLeft,
      isRunning: s.isRunning,
      isMusicPlaying: s.play,
    }))
  const { togglePlay, reset, addOneMinute, toggleMusic } =
    useBoardControlsActions(a => ({
      togglePlay: a.togglePlay,
      reset: a.reset,
      addOneMinute: a.addOneMinute,
      toggleMusic: a.toggleMusic,
    }))

  // Nothing to reset while the timer sits idle at its default duration.
  const canReset = isRunning || secondsLeft !== defaultDuration

  return (
    <RemoteFrame>
      {/* A 2x2 grid turned 45° inside the circle, so its cells become the
          north / east / south / west sections and the two divider lines
          become an X. Each section counter-rotates its content. Tooltips
          prefer the space above and to the left, which is open from the
          default bottom-right corner; once the remote is moved near another
          edge, the shared Tooltip / Popover flip and shift them on screen. */}
      <div className='pointer-events-auto absolute inset-0 grid rotate-45 grid-cols-2 grid-rows-2 overflow-hidden rounded-full'>
        <RemoteButton
          className='col-start-1 row-start-1'
          side='top'
          label={timerBlocked ?? (isRunning ? 'Pause timer' : 'Start timer')}
          disabled={!!timerBlocked}
          active={isRunning}
          onClick={togglePlay}
        >
          {isRunning ? (
            <Pause className='size-5 lg:size-6' />
          ) : (
            <Play className='size-5 lg:size-6' />
          )}
        </RemoteButton>
        <RemoteButton
          className='col-start-2 row-start-1'
          side='top'
          label={
            musicBlocked ?? (isMusicPlaying ? 'Pause music' : 'Play music')
          }
          disabled={!!musicBlocked}
          active={isMusicPlaying}
          onClick={toggleMusic}
        >
          <MusicStatus />
        </RemoteButton>
        <RemoteButton
          className='col-start-2 row-start-2'
          side='left'
          label={timerBlocked ?? 'Add 1 minute'}
          disabled={!!timerBlocked}
          onClick={addOneMinute}
        >
          <span className='text-sm font-semibold lg:text-base'>+1</span>
        </RemoteButton>
        <RemoteButton
          className='col-start-1 row-start-2'
          side='left'
          label={timerBlocked ?? 'Reset timer'}
          disabled={!!timerBlocked || !canReset}
          onClick={reset}
        >
          <TimerReset className='size-5 lg:size-6' />
        </RemoteButton>
        <span
          aria-hidden
          className='pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border-light'
        />
        <span
          aria-hidden
          className='pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border-light'
        />
      </div>
      {/* Hub: the countdown, readable where the facilitator is acting, and the
          way in to setting a new time limit. It also covers the sections'
          pointed tips, where a tap would be ambiguous. */}
      {timerBlocked ? (
        <div className={HUB_CLASSES}>{timerEnabled && formatted}</div>
      ) : (
        <Popover
          asChild
          placement='top-end'
          content={<QuickTimeSetter initialSeconds={secondsLeft} />}
        >
          <button
            type='button'
            aria-label='Set time limit'
            title='Set time limit'
            className={clsx(
              HUB_CLASSES,
              'cursor-pointer outline-none transition-shadow hover:ring-2 hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-primary/60',
            )}
          >
            {formatted}
          </button>
        </Popover>
      )}
    </RemoteFrame>
  )
}

// The fieldset the dial sits in, wherever the facilitator last left it, plus
// the handle that moves it. Split from the dial so a drag re-renders only this
// frame: the dial comes in as children, which a drag doesn't change.
function RemoteFrame({ children }: Readonly<{ children: React.ReactNode }>) {
  const { remoteRef, style, isDragging, handleProps } = useRemotePosition()

  return (
    // A native fieldset groups the controls for assistive tech. The outer box
    // lets clicks through its transparent corners; the dial, hub and handle
    // opt back in. All are absolutely positioned, so the layout doesn't depend
    // on the fieldset's anonymous content box.
    <fieldset
      ref={remoteRef}
      style={style}
      className='pointer-events-none fixed z-40 size-30 rounded-full border border-border-light bg-paper shadow-lg lg:size-40'
    >
      <legend className='sr-only'>Facilitator remote</legend>
      {children}
      {/* The handle sits on the rim at the upper left, toward the open screen
          from the default corner: (1 - 1/√2) / 2 ≈ 14.6% in from each edge is
          where the rim crosses that diagonal. That keeps it inside the dial's
          bounding box, so keeping the dial on screen keeps the handle on
          screen too. The tooltip is hidden mid-drag (the shared Tooltip can't
          be closed from outside) so it doesn't trail the pointer; undefined
          keeps its default styling. */}
      <Tooltip
        title='Drag or use arrow keys to move · double-click or Home to reset'
        placement='top'
        asChild
        contentContainerClasses={isDragging ? 'hidden' : undefined}
      >
        <button
          type='button'
          aria-label='Move remote'
          {...handleProps}
          className='pointer-events-auto absolute left-[14.645%] top-[14.645%] flex size-7 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none items-center justify-center rounded-full border border-border-light bg-paper text-text-secondary shadow-md outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary/60 active:cursor-grabbing lg:size-8'
        >
          <Move className='size-3.5 lg:size-4' />
        </button>
      </Tooltip>
    </fieldset>
  )
}

function RemoteButton({
  className,
  side,
  label,
  disabled = false,
  active = false,
  onClick,
  children,
}: Readonly<{
  className: string
  side: Side
  label: string
  disabled?: boolean
  active?: boolean
  onClick: VoidFunction
  children: React.ReactNode
}>) {
  // The button turns with the dial, so its bounding box (which ignores the
  // circular clip) reaches well past the visible section. Anchoring the
  // tooltip to the upright content keeps it next to what was hovered.
  const [content, setContent] = useState<HTMLSpanElement>()
  const contentRef = useCallback(
    (node: HTMLSpanElement | null) => setContent(node ?? undefined),
    [],
  )

  // aria-disabled rather than disabled, so a dimmed section can still be
  // hovered or focused to show why it's unavailable.
  return (
    <Tooltip title={label} placement={side} anchor={content} asChild>
      <button
        type='button'
        aria-label={label}
        aria-disabled={disabled}
        onClick={disabled ? undefined : onClick}
        className={clsx(
          'flex items-center justify-center outline-none transition-colors focus-visible:bg-text-primary/10',
          {
            'cursor-not-allowed text-text-primary': disabled,
            'cursor-pointer bg-primary/10 text-primary hover:bg-primary/20':
              !disabled && active,
            'cursor-pointer text-text-primary hover:bg-text-primary/10':
              !disabled && !active,
          },
          className,
        )}
      >
        <span
          ref={contentRef}
          className={clsx(
            'flex -rotate-45 items-center justify-center',
            disabled && 'opacity-40',
          )}
        >
          {children}
        </span>
      </button>
    </Tooltip>
  )
}
