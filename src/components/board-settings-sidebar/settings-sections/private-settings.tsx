import { format } from 'date-fns'
import { Check, Copy, Link, Unlink } from 'lucide-react'
import { Checkbox, IconButton, LoadingButton } from '@/components/common'
import {
  SettingsToggle,
  SubsettingsContainer,
} from '@/components/settings-toggle'
import {
  useBoardPermissions,
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'
import { copyTextToClipboard } from '@/utils/copy-text-to-clipboard'

export function PrivateSettings() {
  const { createInvitationLink, revokeInvitationLink, updateBoardSetting } =
    useBoardSettingsActions()
  const {
    settings: {
      private: { subsettings, ...setting },
    },
    invite,
  } = useBoardSettings()
  const { userPermissions } = useBoardPermissions()

  async function copyInvitationLink() {
    if (!invite) return

    await copyTextToClipboard(
      `${globalThis.location.origin}/invite/${invite.token}`,
    )
  }

  return (
    <SettingsToggle
      title={setting.title}
      Icon={setting.icon}
      canEdit={userPermissions.private}
      isEnabled={setting.enabled}
      isUnlocked={setting.isUnlocked}
      onToggle={updateBoardSetting(setting.key, !setting.enabled)}
    >
      <SubsettingsContainer show={setting.enabled}>
        <Checkbox
          checked={subsettings.openAccess.enabled}
          label={subsettings.openAccess.title}
          size='sm'
          disabled={!setting.enabled || !userPermissions['private.openAccess']}
          onChange={updateBoardSetting(
            subsettings.openAccess.key!,
            !subsettings.openAccess.enabled,
          )}
        />
        {invite && userPermissions['private.copyLink'] ? (
          <div className='rounded p-2 bg-tertiary/80'>
            <div className='flex items-baseline justify-between'>
              <div className='flex font-semibold text-sm items-center gap-1'>
                <p className='text-text-secondary'>Invite Link</p>
                <IconButton
                  tooltip='Copy Link'
                  icon={Copy}
                  size='sm'
                  intent='info'
                  onClick={copyInvitationLink}
                  actionIcon={Check}
                />
              </div>
              <div className='flex text-sm items-center tracking-tight gap-1 text-text-secondary'>
                <p>
                  Expires{' '}
                  {invite?.expiresAt ? format(invite.expiresAt, 'PP') : 'never'}
                </p>
                {userPermissions['private.revokeLink'] && (
                  <IconButton
                    tooltip='Revoke Link'
                    icon={Unlink}
                    intent='danger'
                    size='sm'
                    onClick={revokeInvitationLink}
                  />
                )}
              </div>
            </div>
            <div className='break-all block font-mono'>
              {globalThis.location.origin}/invite/{invite.token}
            </div>
          </div>
        ) : (
          <LoadingButton
            className='flex gap-2 items-center bg-primary-new/80 hover:bg-secondary-new rounded-lg hover:shadow-lg py-2 px-3 text-lg w-fit text-white w-full justify-center'
            Icon={<Link />}
            loadedText='Link copied'
            loadedTextDurationMs={2000}
            onClick={createInvitationLink}
            hasEdit={userPermissions['private.createLink']}
          >
            Create An Invitation Link
          </LoadingButton>
        )}
      </SubsettingsContainer>
    </SettingsToggle>
  )
}
