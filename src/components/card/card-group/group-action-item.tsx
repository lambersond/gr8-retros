import * as actionItemUtils from '../../action-items/utils'
import { Avatar } from '../../avatar'
import { IconButton, Tooltip } from '../../common'
import { useCard } from '../use-card'
import { useBoardPermissions } from '@/providers/retro-board/board-settings'
import type { GroupActionItemProps } from './types'

export function GroupActionItem({
  actionItem,
}: Readonly<GroupActionItemProps>) {
  const cardActions = useCard({ cardId: actionItem.cardId })
  const { userPermissions } = useBoardPermissions()
  const canManage = userPermissions['actionItems.restricted.canManage']

  return (
    <div className='flex items-start gap-1 pl-2 z-0'>
      {canManage && (
        <IconButton
          {...actionItemUtils.getIconButtonProps(actionItem.isDone)}
          intent='custom'
          className='text-ai-checkbox hover:bg-ai-checkbox/10'
          onClick={cardActions.handleToggleDoneActionItem(
            actionItem.id,
            !actionItem.isDone,
          )}
        />
      )}
      {actionItem.assignedTo && (
        <Tooltip title={actionItem.assignedTo.name}>
          <Avatar
            alt={actionItem.assignedTo.name}
            src={actionItem.assignedTo.image}
          />
        </Tooltip>
      )}
      <button
        onClick={cardActions.handleUpdateActionItem(
          actionItem.id,
          actionItem.content,
          actionItem.assignedTo?.id,
        )}
        disabled={!canManage}
        style={{ zIndex: -1 }}
        className={actionItemUtils.getActionItemClassNames(
          actionItem.isDone,
          +!!actionItem.assignedTo + +canManage,
        )}
      >
        {actionItem.content}
      </button>
    </div>
  )
}
