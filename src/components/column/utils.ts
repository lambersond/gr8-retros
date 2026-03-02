import clsx from 'classnames'
import { BAD, GOOD, MEH, SHOUTOUT } from '@/constants'

function isGood(type: string): type is typeof GOOD {
  return type === GOOD
}

function isMeh(type: string): type is typeof MEH {
  return type === MEH
}

function isBad(type: string): type is typeof BAD {
  return type === BAD
}

function isShoutout(type: string): type is typeof SHOUTOUT {
  return type === SHOUTOUT
}

export function getWrapperClasses(type: string) {
  return clsx(
    {
      'bg-green-50 border-green-200': isGood(type),
      'bg-yellow-50 border-yellow-200': isMeh(type),
      'bg-red-50 border-red-200': isBad(type),
      'bg-blue-50 border-blue-200': isShoutout(type),
    },
    'flex flex-col min-h-0 h-full rounded-lg border-2 relative',
  )
}

export function getTitleClasses(type: string) {
  return clsx(
    {
      'bg-green-100 text-green-700': isGood(type),
      'bg-yellow-100 text-yellow-700': isMeh(type),
      'bg-red-100 text-red-700': isBad(type),
      'bg-blue-100 text-blue-700': isShoutout(type),
    },
    'text-xl tracking-tight font-semibold w-full text-left p-3',
  )
}
