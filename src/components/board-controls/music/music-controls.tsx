import { Dropdown } from '../../common'
import { MusicPlayButton } from '.'
import { MUSIC_OPTIONS } from '@/constants'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

export function MusicControls() {
  const { selectedTrackOption, play } = useBoardControlsState(s => ({
    selectedTrackOption: s.selectedTrackOption,
    play: s.play,
  }))
  const { toggleMusic, changeTrack } = useBoardControlsActions(s => ({
    toggleMusic: s.toggleMusic,
    changeTrack: s.changeTrack,
  }))

  return (
    <>
      <Dropdown
        width='w-44'
        options={MUSIC_OPTIONS}
        selected={selectedTrackOption}
        onSelect={changeTrack}
      />
      <MusicPlayButton play={play} toggleMusic={toggleMusic} />
    </>
  )
}
