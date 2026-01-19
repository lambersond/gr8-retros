export type UpsertActionItemFormProps = {
  onSubmit(content: string | undefined, assignedToId?: string): void
  defaultContent?: string
  defaultAssignedToId?: string
  placeholder?: string
  availableUsers?: {
    id: string
    label: React.ReactNode
    value: string
  }[]
}
