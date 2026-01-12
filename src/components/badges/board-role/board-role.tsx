import { BOARD_ROLE_MAP } from './constants'
import type { BoardRoleProps } from './types'

export function BoardRole({ role }: Readonly<BoardRoleProps>) {
  const roleData = BOARD_ROLE_MAP[role]
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${roleData.bgColor} ${roleData.textColor} ${roleData.borderColor}`}
    >
      {role}
    </span>
  )
}
