import type { GroupOption, Option } from './types'

export const handleOnClick =
  (onClickHandler: Option['onClick']) =>
  (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onClickHandler(event)
  }

export function isGroupType(options: any[]): options is GroupOption[] {
  return !!options?.[0]?.options
}
