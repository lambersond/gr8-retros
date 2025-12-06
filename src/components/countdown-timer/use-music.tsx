import { useRef, useState } from 'react'
import { DropdownOption } from '../common'
import { MUSIC_OPTIONS } from '@/constants'

export function useMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [selectedTrackOption, setSelectedTrackOption] =
    useState<DropdownOption>(MUSIC_OPTIONS[0])
  const [play, setPlay] = useState(false)

  const toggleMusic = () => {
    if (!audioRef.current) return

    audioRef.current.src = selectedTrackOption.value!

    if (play) {
      audioRef.current.pause()
      setPlay(false)
    } else {
      audioRef.current.play()
      setPlay(true)
    }
  }

  const changeTrack = (option: DropdownOption) => {
    if (!audioRef.current) return

    audioRef.current.src = option.value!
    audioRef.current.load()
    if (play) {
      audioRef.current.play()
    }
    setSelectedTrackOption(option)
  }

  return {
    audioRef,
    changeTrack,
    play,
    selectedTrackOption,
    toggleMusic,
  }
}
