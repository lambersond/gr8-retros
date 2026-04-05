import { PaymentTierBadge } from '@/components/badges'
import { SettingsToggle } from '@/components/settings-toggle'
import { PaymentTier } from '@/enums'
import {
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

export function FacilitatorModeSettings() {
  const { updateBoardSetting } = useBoardSettingsActions()
  const {
    boardTier,
    settings: { facilitatorMode: setting },
  } = useBoardSettings()

  const isUnlocked = hasTier(boardTier, PaymentTier.SUPPORTER)

  return (
    <SettingsToggle
      title={setting.title}
      Icon={setting.icon}
      canEdit={setting.canEdit}
      isEnabled={setting.enabled}
      isUnlocked={isUnlocked}
      hint={
        <span className='text-sm text-text-primary flex items-center gap-1'>
          Upgrade to{' '}
          <PaymentTierBadge tier={PaymentTier.SUPPORTER} redirectToPlans /> to
          unlock this setting
        </span>
      }
      onToggle={updateBoardSetting(setting.key, !setting.enabled)}
    />
  )
}
