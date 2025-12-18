import { PLAY_BUTTON_PROPS } from './constants'
import { IconButton } from '@/components/common'

export function MusicPlayButton({
  play,
  toggleMusic,
}: Readonly<{
  play: boolean
  toggleMusic: () => void
}>) {
  return (
    <IconButton
      onClick={toggleMusic}
      size='lg'
      {...PLAY_BUTTON_PROPS[+play as 0 | 1]}
    />
  )
}
