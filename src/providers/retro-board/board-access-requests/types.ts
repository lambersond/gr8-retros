export type AccessRequestItem = {
  status: 'PENDING' | 'REJECTED'
  createdAt: string
  user: { id: string; name: string | null; image: string | null }
}

export type BoardAccessRequestsContextValue = {
  pending: AccessRequestItem[]
  declined: AccessRequestItem[]
  refetch: () => Promise<void>
}
