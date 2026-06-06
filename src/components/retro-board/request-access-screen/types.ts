export type AccessRequestStatusValue = 'NONE' | 'PENDING' | 'REJECTED'

export type BoardAccessContext = {
  settingsId: string
  boardId: string
  boardName: string
  requestStatus: AccessRequestStatusValue
}

export type RequestAccessScreenProps = {
  access: BoardAccessContext
  isAuthenticated: boolean
}
