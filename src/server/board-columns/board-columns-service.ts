'use server'

import * as repository from './board-columns-repository'
import * as cardRepository from '@/server/card/card-repository'
import type { UpdateBoardColumn } from './types'

export async function saveBoardColumns(
  inputColumns: UpdateBoardColumn[],
  originalColumns: UpdateBoardColumn[],
  boardSettingsId: string,
  boardId: string,
) {
  const updatedColumnIds = new Set(
    inputColumns
      .map(col => String(col.id))
      .filter(id => id !== '' && id !== 'new'),
  )
  const columnsToDelete = originalColumns.filter(
    col =>
      String(col.id) !== '' &&
      String(col.id) !== 'new' &&
      !updatedColumnIds.has(String(col.id)),
  )

  const deleteOperations = columnsToDelete.map(col => String(col.id))
  const createOperations = inputColumns
    .filter(col => col.isNew)
    .map(col => ({
      boardSettingsId,
      index: col.index,
      columnType: col.columnType,
      label: col.label,
      emoji: col.emoji,
      tagline: col.tagline,
      placeholder: col.placeholder,
      lightBg: col.lightBg,
      lightBorder: col.lightBorder,
      lightTitleBg: col.lightTitleBg,
      lightTitleText: col.lightTitleText,
      darkBg: col.darkBg,
      darkBorder: col.darkBorder,
      darkTitleBg: col.darkTitleBg,
      darkTitleText: col.darkTitleText,
    }))
  const updateOperations = inputColumns
    .filter(col => !col.isNew)
    .map(col => ({
      id: String(col.id),
      data: {
        index: col.index,
        columnType: col.columnType,
        label: col.label,
        emoji: col.emoji,
        tagline: col.tagline,
        placeholder: col.placeholder,
        lightBg: col.lightBg,
        lightBorder: col.lightBorder,
        lightTitleBg: col.lightTitleBg,
        lightTitleText: col.lightTitleText,
        darkBg: col.darkBg,
        darkBorder: col.darkBorder,
        darkTitleBg: col.darkTitleBg,
        darkTitleText: col.darkTitleText,
      },
    }))

  const originalColumnTypeById = new Map(
    originalColumns.map(col => [String(col.id), col.columnType]),
  )
  const cardColumnMigrations = updateOperations
    .filter(op => originalColumnTypeById.get(op.id) !== op.data.columnType)
    .map(op => ({
      from: originalColumnTypeById.get(op.id)!,
      to: op.data.columnType,
    }))

  await Promise.all([
    repository.deleteManyByIds(deleteOperations),
    repository.createMany(createOperations),
    repository.updateMany(updateOperations),
    cardRepository.updateManyCardColumnTypes(boardId, cardColumnMigrations),
  ])
  const allColumns = await repository.findManyByBoardSettingsId(boardSettingsId)

  return {
    columns: allColumns.toSorted((a, b) => a.index - b.index),
    cardColumnMigrations,
  }
}
