'use server'

import * as repository from './comment-repository'

export async function addComment(data: {
  content: string
  cardId: string
  creatorId: string
  creatorName: string
}) {
  return repository.addComment(data)
}

export async function deleteCommentByIdAndCreatorId(
  id: string,
  creatorId: string,
) {
  return repository.deleteCommentByIdAndCreatorId(id, creatorId)
}

export async function updateComment(
  id: string,
  userId: string,
  content: string,
) {
  return repository.updateComment(id, userId, content)
}

export async function getCommentsByCardId(cardId: string | null) {
  if (!cardId) {
    return []
  }

  return repository.getCommentsByCardId(cardId)
}
