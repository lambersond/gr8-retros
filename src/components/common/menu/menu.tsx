import { Group } from './group'
import { Options } from './options'
import { isGroupType } from './utils'
import type { MenuProps } from './types'

export function Menu({ options }: Readonly<MenuProps>) {
  const hasGroups = isGroupType(options)

  return (
    <div className='min-w-48 bg-paper rounded-lg flex flex-col border border-slate-200 shadow-md min-w-28 overflow-hidden'>
      {hasGroups ? (
        options.map(({ key, ...groupOptions }) => (
          <Group key={`group-${key}`} {...groupOptions} />
        ))
      ) : (
        <Options options={options} />
      )}
    </div>
  )
}
