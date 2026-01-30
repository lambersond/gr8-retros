import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BoardSettingsMessageType } from '../enums'
import { useBoardSettingsDispatch } from '../provider'
import { useAuth } from '@/hooks/use-auth'
import { useBoardMemberships } from '@/providers/board-memberships'

export function useBoardSettingsMessageHandlers() {
  const dispatch = useBoardSettingsDispatch()
  const { fetchBoards } = useBoardMemberships()
  const router = useRouter()
  const { user } = useAuth()

  const handlers = useMemo(() => {
    const h: Partial<
      Record<BoardSettingsMessageType, (data: any, name?: string) => void>
    > = {
      [BoardSettingsMessageType.UPDATE_BOARD_SETTINGS]: data => {
        dispatch({
          type: BoardSettingsMessageType.UPDATE_BOARD_SETTINGS,
          payload: data.payload,
        })
      },
      [BoardSettingsMessageType.CREATE_INVITATION_LINK]: data => {
        dispatch({
          type: BoardSettingsMessageType.CREATE_INVITATION_LINK,
          payload: data.payload,
        })
      },
      [BoardSettingsMessageType.REVOKE_INVITATION_LINK]: () => {
        dispatch({
          type: BoardSettingsMessageType.REVOKE_INVITATION_LINK,
        })
      },
      [BoardSettingsMessageType.NEW_MEMBER_ADDED]: data => {
        dispatch({
          type: BoardSettingsMessageType.NEW_MEMBER_ADDED,
          payload: data.payload,
        })
      },
      [BoardSettingsMessageType.MEMBER_REMOVED]: data => {
        dispatch({
          type: BoardSettingsMessageType.MEMBER_REMOVED,
          payload: data.payload,
        })
        if (data.payload.userId === user?.id) {
          router.push('/')
        }
      },
      [BoardSettingsMessageType.UPDATE_MEMBER_ROLE]: data => {
        dispatch({
          type: BoardSettingsMessageType.UPDATE_MEMBER_ROLE,
          payload: data.payload,
        })
        if (data.payload.userId === user?.id) {
          fetchBoards(true)
        }
      },
    }
    return h
  }, [dispatch, fetchBoards, user?.id, router])

  return handlers
}
