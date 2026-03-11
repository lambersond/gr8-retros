export type CreateBoardFormProps = {
  onSubmit({ boardName }: { boardName: string }): void
}

export type Availability = 'available' | 'unavailable' | 'checking' | 'idle'
