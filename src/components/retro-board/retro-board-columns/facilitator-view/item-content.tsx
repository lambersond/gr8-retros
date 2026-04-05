import { Card, CardGroup } from '@/components/card'
import type { FacilitatorItem } from './types'

export function ItemContent({
  item,
  currentUserId,
}: Readonly<{
  item: FacilitatorItem
  currentUserId?: string
}>) {
  if (item.kind === 'card') {
    return (
      <Card
        id={item.data.id}
        content={item.data.content}
        canEdit={item.data.creatorId === currentUserId}
        upvotes={item.data.upvotedBy.length}
        isUpvoted={item.data.upvotedBy.includes(currentUserId ?? '')}
        column={item.data.column}
        isDiscussed={item.data.isDiscussed}
        createdBy={item.data.createdBy}
        actionItems={item.data.actionItems}
        comments={item.data.comments}
        currentUserId={currentUserId}
      />
    )
  }
  return <CardGroup group={item.data} currentUserId={currentUserId} />
}
