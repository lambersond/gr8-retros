export type UpsertActionItemFormProps = {
  onSubmit(
    content: string | undefined,
    assignedToId?: string,
    cardId?: string,
  ): void
  defaultContent?: string
  defaultAssignedToId?: string
  defaultCardId?: string
  placeholder?: string
  onDelete?(event: React.MouseEvent<HTMLButtonElement>): void
  showDelete?: boolean
  availableUsers?: {
    id: string
    label: React.ReactNode
    value: string
  }[]
  cardOptions?: {
    id: string
    label: React.ReactNode
    value: string
    searchText?: string
  }[]
  cardSelectionLabel?: string
}
