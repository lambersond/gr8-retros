'use client'

import { useCallback } from 'react'
import { Check, Share2 } from 'lucide-react'
import { IconButton } from '@/components/common'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import { copyTextToClipboard } from '@/utils/copy-text-to-clipboard'

export function BoardShareButton({ id }: Readonly<{ id: string }>) {
  const { settings, invite } = useBoardSettings()
  const { userPermissions } = useBoardPermissions()

  const isPrivateBoard = settings.private.enabled
  const canShareInvite =
    isPrivateBoard && !!invite?.token && userPermissions['private.copyLink']
  const showShareButton = !isPrivateBoard || canShareInvite

  const handleShare = useCallback(async () => {
    const url = canShareInvite
      ? `${globalThis.location.origin}/invite/${invite?.token}`
      : `${globalThis.location.origin}/retro/${id}`
    await copyTextToClipboard(url)
  }, [canShareInvite, invite?.token, id])

  if (!showShareButton) return

  return (
    <div className='fixed top-3 right-16 z-50'>
      <IconButton
        icon={Share2}
        actionIcon={Check}
        tooltip={canShareInvite ? 'Copy Invite Link' : 'Copy Board Link'}
        intent='text-primary'
        size='xl'
        onClick={handleShare}
      />
    </div>
  )
}
