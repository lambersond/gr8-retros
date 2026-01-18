import { useChannel } from 'ably/react'
import { BOARD_SETTINGS_ACTION_TYPES } from '../constants'
import { useBoardSettings } from './use-board-settings'
import { useBoardSettingsDispatcher } from './use-board-settings-dispatcher'
import { useBoardMemberships } from '@/providers/board-memberships'
import { copyTextToClipboard } from '@/utils/copy-text-to-clipboard'
import type { BoardSettings } from '@/types'

export function useBoardSettingsActions() {
  const { boardId, id } = useBoardSettings()
  const { openSidebar, closeSidebar } = useBoardSettingsDispatcher()
  const { ensureBoardInCache } = useBoardMemberships()
  const { publish } = useChannel({ channelName: boardId })

  function openSidebarWithSettings() {
    openSidebar()
  }

  function updateBoardSetting<T extends keyof BoardSettings>(
    key: T,
    value: BoardSettings[T],
  ) {
    return async function updateSetting() {
      const resp = await fetch(`/api/board-settings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [key]: value }),
      })

      if (!resp.ok) {
        throw new Error('Failed to update board setting')
      }

      const updatedSetting: BoardSettings = await resp.json()
      publish({
        data: {
          type: BOARD_SETTINGS_ACTION_TYPES.UPDATE_BOARD_SETTINGS,
          payload: updatedSetting,
        },
      })
    }
  }

  async function claimBoardSettings() {
    const resp = await fetch(`/api/board-settings/${id}/claim`, {
      method: 'PUT',
    })

    if (!resp.ok) {
      throw new Error('Failed to claim board settings')
    }

    const updatedSetting: BoardSettings = await resp.json()

    publish('claim-board', {
      type: BOARD_SETTINGS_ACTION_TYPES.UPDATE_BOARD_SETTINGS,
      payload: updatedSetting,
    })
    void ensureBoardInCache(boardId)
  }

  async function createInvitationLink() {
    const response = await fetch('/api/invite', {
      method: 'POST',
      body: JSON.stringify({ boardSettingsId: id }),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to create invitation link')
    }

    const data = await response.json()
    copyTextToClipboard(
      `${globalThis.location.origin}/invite/${data.inviteCode}`,
    )
    publish({
      data: {
        type: BOARD_SETTINGS_ACTION_TYPES.CREATE_INVITATION_LINK,
        payload: data,
      },
    })
  }

  async function revokeInvitationLink() {
    const resp = await fetch(`/api/board-settings/${id}/invite/revoke`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!resp.ok) {
      throw new Error('Failed to revoke invitation link')
    }

    publish({
      data: {
        type: BOARD_SETTINGS_ACTION_TYPES.REVOKE_INVITATION_LINK,
      },
    })
  }

  return {
    openSidebar: openSidebarWithSettings,
    closeSidebar,
    updateBoardSetting,
    claimBoardSettings,
    createInvitationLink,
    revokeInvitationLink,
    publish,
  }
}
