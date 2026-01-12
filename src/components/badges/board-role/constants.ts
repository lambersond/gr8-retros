import { BoardRole } from '@/enums'

export const BOARD_ROLE_MAP = {
  [BoardRole.OWNER]: {
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-800',
  },
  [BoardRole.ADMIN]: {
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    textColor: 'text-green-800',
  },
  [BoardRole.FACILITATOR]: {
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-800',
  },
  [BoardRole.MEMBER]: {
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-800',
  },
  [BoardRole.VIEWER]: {
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-800',
  },
}
