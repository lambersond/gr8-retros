import { ActionItemsList } from './action-items-list'
import type { MyActionItemsProps } from './types'

export async function MyActionItems({
  myActionItems,
}: Readonly<MyActionItemsProps>) {
  const actionItemsData = await myActionItems
  return <ActionItemsList items={actionItemsData} />
}
