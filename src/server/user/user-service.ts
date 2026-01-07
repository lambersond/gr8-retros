import * as repository from './user-repository'

export async function getBoardPermissions(
  userId: string,
  boardSettingsId: string,
) {
  return repository.getBoardPermissions(userId, boardSettingsId)
}
