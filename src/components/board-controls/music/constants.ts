import { Pause, Play } from 'lucide-react'

export const PLAY_BUTTON_PROPS = {
  1: {
    icon: Pause,
    tooltip: 'Pause Music',
    intent: 'primary' as const,
  },
  0: {
    icon: Play,
    tooltip: 'Play Music',
    intent: 'info' as const,
  },
}
