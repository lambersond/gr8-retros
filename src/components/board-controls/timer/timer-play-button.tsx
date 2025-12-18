import { TIMER_PLAY_BUTTON_PROPS } from './constants'
import { IconButton } from '@/components/common'

export function TimerPlayButton({
  isRunning,
  onClick,
}: Readonly<{
  isRunning: boolean
  onClick: VoidFunction
}>) {
  return (
    <IconButton
      onClick={onClick}
      size='lg'
      {...TIMER_PLAY_BUTTON_PROPS[+isRunning as 0 | 1]}
    />
  )
}
