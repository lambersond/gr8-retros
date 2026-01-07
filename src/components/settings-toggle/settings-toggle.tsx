import clsx from 'classnames'
import { Lock } from 'lucide-react'
import { Switch, Tooltip } from '../common'
import type { SettingsToggleProps } from './types'

export function SettingsToggle({
  canEdit = false,
  children,
  hint = 'Upgrade to unlock this setting',
  Icon,
  isEnabled = false,
  isUnlocked = false,
  onToggle,
  title,
}: Readonly<SettingsToggleProps>) {
  return (
    <div className='space-y-2'>
      <div className='flex gap-2 items-center w-full'>
        <Icon
          className={clsx(
            'size-4 flex-shrink-0 transition-colors duration-200',
            isEnabled ? 'text-primary-new' : 'text-text-tertiary',
          )}
        />
        {isUnlocked ? (
          <Switch
            size='lg'
            labelSize='lg'
            label={title}
            name={title}
            defaultChecked={isEnabled}
            onChange={onToggle}
            disabled={!canEdit}
          />
        ) : (
          <div className='w-full flex items-center justify-between'>
            <p className='text-lg'>{title}</p>
            <Tooltip title={hint} asChild>
              <Lock className='size-5 text-text-primary' />
            </Tooltip>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
