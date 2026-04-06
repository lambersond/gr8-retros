import type { BoardSettingsMessageType } from '../enums'
import type { BoardRole, PaymentTier } from '@/enums'
import type {
  BoardInvite,
  BoardSettings,
  MessageStruct,
  MessageStructRequiredPayload,
} from '@/types'

export type BoardSettingsMessageData =
  | MessageStructRequiredPayload<
      BoardSettingsMessageType.UPDATE_BOARD_SETTINGS,
      Partial<BoardSettings>
    >
  | MessageStructRequiredPayload<
      BoardSettingsMessageType.CREATE_INVITATION_LINK,
      BoardInvite
    >
  | MessageStruct<BoardSettingsMessageType.REVOKE_INVITATION_LINK>
  | MessageStructRequiredPayload<
      BoardSettingsMessageType.NEW_MEMBER_ADDED,
      {
        role: BoardRole
        permissionMask: number
        user: { id: string; name: string; image: string | undefined }
      }
    >
  | MessageStructRequiredPayload<
      BoardSettingsMessageType.MEMBER_REMOVED,
      { userId: string }
    >
  | MessageStructRequiredPayload<
      BoardSettingsMessageType.UPDATE_MEMBER_ROLE,
      { userId: string; newRole: BoardRole }
    >
  | MessageStructRequiredPayload<
      BoardSettingsMessageType.TRANSFER_BOARD,
      {
        previousOwnerId: string
        newOwnerId: string
        newOwnerTier: PaymentTier
        settingsPatch: Record<string, boolean>
      }
    >

export type BoardSettingsMessage = { data: BoardSettingsMessageData }
