import { Pause, Play } from 'lucide-react'

export const TIMER_PLAY_BUTTON_PROPS = {
  1: {
    icon: Pause,
    tooltip: 'Pause Timer',
    intent: 'primary' as const,
  },
  0: {
    icon: Play,
    tooltip: 'Play Timer',
    intent: 'info' as const,
  },
}
