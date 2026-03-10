export type CreateBoardFormProps = {
  onSubmit({ boardId, boardName }: { boardId: string; boardName: string }): void
}
