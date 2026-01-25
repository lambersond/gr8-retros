import type { ColumnType } from '@/types'

export const GOOD: ColumnType = 'GOOD'
export const MEH: ColumnType = 'MEH'
export const BAD: ColumnType = 'BAD'
export const SHOUTOUT: ColumnType = 'SHOUTOUT'

export const COLUMN_TYPES: ColumnType[] = [GOOD, MEH, BAD, SHOUTOUT]

// TODO: Move the column colors in here as well in prep for customizations
// print colors are green, yellow, red, blue 200 & 400 shades
const GOOD_COLUMN_SETTINGS = {
  title: 'Went Well',
  emoji: '😊',
  printTextColor: '#0000007d',
  printColor: '#b9f8cf',
  printBorderColor: '#05df72',
  position: 0,
}

const MEH_COLUMN_SETTINGS = {
  title: 'Could Be Better',
  emoji: '😐',
  printTextColor: '#0000007d',
  printColor: '#fff085',
  printBorderColor: '#fcc800',
  position: 1,
}

const BAD_COLUMN_SETTINGS = {
  title: 'Frustrating',
  emoji: '😞',
  printTextColor: '#0000007d',
  printColor: '#ffc9c9',
  printBorderColor: '#ff6467',
  position: 2,
}

const SHOUTOUT_COLUMN_SETTINGS = {
  title: 'Shoutout',
  emoji: '🎉',
  printTextColor: '#0000007d',
  printColor: '#bedbff',
  printBorderColor: '#51a2ff',
  position: 3,
}

export const DEFAULT_COLUMN_SETTINGS: Record<
  ColumnType,
  typeof GOOD_COLUMN_SETTINGS
> = {
  [GOOD]: GOOD_COLUMN_SETTINGS,
  [MEH]: MEH_COLUMN_SETTINGS,
  [BAD]: BAD_COLUMN_SETTINGS,
  [SHOUTOUT]: SHOUTOUT_COLUMN_SETTINGS,
}
