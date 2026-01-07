'use server'

import * as repository from './board-settings-repository'

export async function updateSettingById(
  id: string,
  userId: string,
  patch: Record<string, any>,
) {
  return repository.updateSettingById(id, userId, patch)
}

export async function claimBoardSettings(settingsId: string, userId: string) {
  return repository.claimBoardSettings(settingsId, userId)
}
