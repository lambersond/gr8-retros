import type { DropdownOption } from '@/components/common'
import type { BoardRole } from '@/enums'

export const ROLES = {
  ADMIN: { id: 2, label: 'Admin', value: 'ADMIN' },
  FACILITATOR: { id: 3, label: 'Facilitator', value: 'FACILITATOR' },
  MEMBER: { id: 4, label: 'Member', value: 'MEMBER' },
} as Record<string, DropdownOption<number, BoardRole>>
