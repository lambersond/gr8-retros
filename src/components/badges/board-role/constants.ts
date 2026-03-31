import { BoardRole } from '@/enums'

export const BOARD_ROLE_MAP = {
  [BoardRole.OWNER]: {
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    borderColor: 'border-blue-300 dark:border-blue-700',
    textColor: 'text-blue-800 dark:text-blue-200',
  },
  [BoardRole.ADMIN]: {
    bgColor: 'bg-green-100 dark:bg-green-900',
    borderColor: 'border-green-300 dark:border-green-700',
    textColor: 'text-green-800 dark:text-green-200',
  },
  [BoardRole.FACILITATOR]: {
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    borderColor: 'border-purple-300 dark:border-purple-700',
    textColor: 'text-purple-800 dark:text-purple-200',
  },
  [BoardRole.MEMBER]: {
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    borderColor: 'border-orange-300 dark:border-orange-700',
    textColor: 'text-orange-800 dark:text-orange-200',
  },
  [BoardRole.VIEWER]: {
    bgColor: 'bg-gray-100 dark:bg-gray-900',
    borderColor: 'border-gray-300 dark:border-gray-700',
    textColor: 'text-gray-800 dark:text-gray-200',
  },
}
