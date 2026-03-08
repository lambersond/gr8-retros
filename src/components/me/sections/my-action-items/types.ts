export interface MyActionItemsProps {
  myActionItems: Promise<ActionItem[]>
}

export interface ActionItem {
  id: string
  content: string
  isDone: boolean
  card: {
    retroSessionId: string
    retroSession: { name: string | null }
    content: string
    column: string
  }
}

export interface ActionItemRowProps {
  item: ActionItem
  isDone: boolean
  onToggle: (id: string) => void
}

export interface ActionItemsListProps {
  items?: ActionItem[]
}
