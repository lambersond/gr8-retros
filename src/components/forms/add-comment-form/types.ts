export type AddCommentFormProps = {
  onSubmit(content: string | undefined, cardId?: string): void
  memberCards?: { id: string; content: string }[]
}
