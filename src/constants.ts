import { PaymentTier } from '@/enums'
import type { ColumnType, SidebarActionType } from './types'

export const MAX_BOARDS_PER_SUBSCRIPTION = {
  [PaymentTier.FREE]: 3,
  [PaymentTier.SUPPORTER]: 10,
  [PaymentTier.BELIEVER]: 50,
  [PaymentTier.CHAMPION]: 50, // Unlimited boards within their organization
}

export const COOKIE_KEY_USER_ID = 'gr8retros.userId'
export const COOKIE_KEY_USER_NAME = 'gr8retros.userName'

export const GOOD: ColumnType = 'GOOD'
export const MEH: ColumnType = 'MEH'
export const BAD: ColumnType = 'BAD'
export const SHOUTOUT: ColumnType = 'SHOUTOUT'

export const COLUMN_TYPES: ColumnType[] = [GOOD, MEH, BAD, SHOUTOUT]

export const MUSIC = {
  lofi: {
    name: 'Lo-Fi Beats',
    url: 'https://cdn.freesound.org/previews/687/687006_13228046-lq.mp3',
    author: 'https://freesound.org/people/Seth_Makes_Sounds/',
  },
  easyGoing: {
    name: 'Easy Going',
    url: 'https://cdn.freesound.org/previews/691/691837_13228046-lq.mp3',
    author: 'https://freesound.org/people/Seth_Makes_Sounds/',
  },
  healing: {
    name: 'Healing Tones',
    url: 'https://cdn.freesound.org/previews/668/668092_13228046-lq.mp3',
    author: 'https://freesound.org/people/Seth_Makes_Sounds/',
  },
  fruitLoops: {
    name: 'Fruit Loops',
    url: 'https://cdn.freesound.org/previews/660/660452_13228046-lq.mp3',
    author: 'https://freesound.org/people/Seth_Makes_Sounds/',
  },
  wonders: {
    name: 'Wonders',
    url: 'https://cdn.freesound.org/previews/814/814843_13228046-lq.mp3',
    author: 'https://freesound.org/people/Seth_Makes_Sounds/',
  },
  ageOfFire: {
    name: 'Age of Fire',
    url: 'https://cdn.freesound.org/previews/662/662777_13228046-lq.mp3',
    author: 'https://freesound.org/people/Seth_Makes_Sounds/',
  },
} as const

export const MUSIC_OPTIONS = Object.entries(MUSIC).map(([key, music]) => ({
  id: key,
  label: music.name,
  value: music.url,
}))

export const SIDEBAR_ACTION_TYPES: SidebarActionType = {
  OPEN_SIDEBAR: 'OPEN_SIDEBAR',
  CLOSE_SIDEBAR: 'CLOSE_SIDEBAR',
}
