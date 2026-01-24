export type UpsertActionItemFormProps = {
  onSubmit(content: string | undefined, assignedToId?: string): void
  defaultContent?: string
  defaultAssignedToId?: string
  placeholder?: string
  onDelete?(event: React.MouseEvent<HTMLButtonElement>): void
  showDelete?: boolean
  availableUsers?: {
    id: string
    label: React.ReactNode
    value: string
  }[]
}
