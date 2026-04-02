import { Lock } from 'lucide-react'
import { PaymentTierBadge } from '@/components/badges'
import { Checkbox, Tooltip } from '@/components/common'
import {
  SettingsToggle,
  SubsettingsContainer,
} from '@/components/settings-toggle'
import { PaymentTier } from '@/enums'
import {
  useBoardPermissions,
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'

const TIER_ORDER: Record<PaymentTier, number> = {
  [PaymentTier.FREE]: 0,
  [PaymentTier.SUPPORTER]: 1,
  [PaymentTier.BELIEVER]: 2,
  [PaymentTier.CHAMPION]: 3,
}

function hasTier(current: PaymentTier, required: PaymentTier) {
  return TIER_ORDER[current] >= TIER_ORDER[required]
}

export function DragAndDropSettings() {
  const { updateBoardSetting } = useBoardSettingsActions()
  const {
    boardTier,
    settings: {
      dragAndDrop: { subsettings, ...setting },
    },
  } = useBoardSettings()
  const { userPermissions } = useBoardPermissions()

  const groupingUnlocked = hasTier(boardTier, PaymentTier.SUPPORTER)
  const aiNamingUnlocked = hasTier(boardTier, PaymentTier.BELIEVER)

  return (
    <SettingsToggle
      title={setting.title}
      Icon={setting.icon}
      canEdit={setting.canEdit}
      isEnabled={setting.enabled}
      isUnlocked={setting.isUnlocked}
      onToggle={updateBoardSetting(setting.key, !setting.enabled)}
    >
      <SubsettingsContainer show={setting.enabled}>
        {groupingUnlocked ? (
          <Checkbox
            checked={subsettings.grouping.enabled}
            label={subsettings.grouping.title}
            size='sm'
            disabled={
              !setting.enabled || !userPermissions['dragAndDrop.grouping']
            }
            onChange={updateBoardSetting(
              subsettings.grouping.key,
              !subsettings.grouping.enabled,
            )}
          />
        ) : (
          <LockedSubsetting
            label={subsettings.grouping.title}
            requiredTier={PaymentTier.SUPPORTER}
          />
        )}
        {aiNamingUnlocked ? (
          <Checkbox
            checked={subsettings.aiNaming.enabled}
            label={subsettings.aiNaming.title}
            size='sm'
            disabled={
              !setting.enabled ||
              !subsettings.grouping.enabled ||
              !userPermissions['dragAndDrop.grouping.aiNaming']
            }
            onChange={updateBoardSetting(
              subsettings.aiNaming.key,
              !subsettings.aiNaming.enabled,
            )}
          />
        ) : (
          <LockedSubsetting
            label={subsettings.aiNaming.title}
            requiredTier={PaymentTier.BELIEVER}
          />
        )}
      </SubsettingsContainer>
    </SettingsToggle>
  )
}

function LockedSubsetting({
  label,
  requiredTier,
}: Readonly<{ label: string; requiredTier: PaymentTier }>) {
  return (
    <div className='flex items-center justify-between'>
      <p className='text-sm text-text-primary opacity-50'>{label}</p>
      <Tooltip
        title={
          <span className='text-sm text-text-primary flex items-center gap-1'>
            Requires at least{' '}
            <PaymentTierBadge tier={requiredTier} redirectToPlans /> plan.
          </span>
        }
        asChild
      >
        <Lock className='size-4 text-primary cursor-pointer' />
      </Tooltip>
    </div>
  )
}
