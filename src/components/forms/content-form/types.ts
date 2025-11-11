export type ContentFormProps = {
  onSubmit(content: string | undefined): void
  defaultContent?: string
  title: string
}
