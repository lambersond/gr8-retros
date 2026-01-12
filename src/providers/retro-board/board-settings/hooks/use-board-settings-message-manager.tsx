import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BOARD_SETTINGS_ACTION_TYPES } from '../constants'
import { useBoardSettingsDispatch } from '../provider'
import { useAblyMessageManager } from '@/hooks/use-ably-message-manager'
import { useAuth } from '@/hooks/use-auth'
import { useBoardMembership } from '@/providers/board-memberships'
import type { BoardSettingsMessage, BoardSettingsMessageData } from '../types'

export function useBoardSettingsManager(boardId: string) {
  const dispatch = useBoardSettingsDispatch()
  const { fetchBoards } = useBoardMembership()
  const router = useRouter()
  const { user } = useAuth()

  const handlers = useMemo(() => {
    const h: Partial<
      Record<
        BoardSettingsMessageData['type'],
        (data: any, name?: string) => void
      >
    > = {
      [BOARD_SETTINGS_ACTION_TYPES.UPDATE_BOARD_SETTINGS]: data => {
        dispatch({
          type: BOARD_SETTINGS_ACTION_TYPES.UPDATE_BOARD_SETTINGS,
          payload: data.payload,
        })
      },
      [BOARD_SETTINGS_ACTION_TYPES.CREATE_INVITATION_LINK]: data => {
        dispatch({
          type: BOARD_SETTINGS_ACTION_TYPES.CREATE_INVITATION_LINK,
          payload: data.payload,
        })
      },
      [BOARD_SETTINGS_ACTION_TYPES.REVOKE_INVITATION_LINK]: () => {
        dispatch({
          type: BOARD_SETTINGS_ACTION_TYPES.REVOKE_INVITATION_LINK,
        })
      },
      [BOARD_SETTINGS_ACTION_TYPES.NEW_MEMBER_ADDED]: data => {
        dispatch({
          type: BOARD_SETTINGS_ACTION_TYPES.NEW_MEMBER_ADDED,
          payload: data.payload,
        })
      },
      [BOARD_SETTINGS_ACTION_TYPES.MEMBER_REMOVED]: data => {
        dispatch({
          type: BOARD_SETTINGS_ACTION_TYPES.MEMBER_REMOVED,
          payload: data.payload,
        })
        if (data.payload.userId === user?.id) {
          router.push('/')
        }
      },
      [BOARD_SETTINGS_ACTION_TYPES.UPDATE_MEMBER_ROLE]: data => {
        dispatch({
          type: BOARD_SETTINGS_ACTION_TYPES.UPDATE_MEMBER_ROLE,
          payload: data.payload,
        })
        if (data.payload.userId === user?.id) {
          fetchBoards(true)
        }
      },
    }
    return h
  }, [dispatch, fetchBoards, user?.id, router])

  useAblyMessageManager<BoardSettingsMessageData['type'], BoardSettingsMessage>(
    boardId,
    handlers,
  )
}
