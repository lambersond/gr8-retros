import { BOARD_ROLE_MAP } from './constants'
import type { BoardRoleProps } from './types'

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

export function BoardRole({
  role,
  variant = 'default',
}: Readonly<BoardRoleProps>) {
  const roleData = BOARD_ROLE_MAP[role]

  if (variant === 'simple') {
    return (
      <span
        className={`inline-block px-1 py-0.5 text-xs font-medium rounded ${roleData.simpleBgColor} ${roleData.textColor}`}
      >
        {capitalize(role)}
      </span>
    )
  }

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${roleData.bgColor} ${roleData.textColor} ${roleData.borderColor}`}
    >
      {role}
    </span>
  )
}
