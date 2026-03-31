'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import {
  ColorModeToggle,
  ColorsSection,
  ColumnListItem,
  ColumnPreview,
  SaveButton,
} from './components'
import { makeNewColumn } from './utils'
import { Dropdown, IconButton, Input, Modal } from '@/components/common'
import { COLUMNS_MAP } from '@/constants'
import { useModals } from '@/hooks/use-modals'
import type { ColorMode, CustomizeBoardColumnsModalProps } from './types'
import type { Column } from '@/types'

const PRESETS = COLUMNS_MAP
const PRESET_OPTIONS = Object.entries(PRESETS).map(([, preset]) => ({
  value: preset.columnType,
  label: `${preset.emoji} ${preset.label}`.trimStart(),
}))

export function CustomizeBoardColumnsModal({
  open = true,
  title = 'Customize Board Columns',
  initialColumns,
  onSave,
}: Readonly<CustomizeBoardColumnsModalProps>) {
  const { closeModal } = useModals()

  const [columns, setColumns] = useState<Column[]>(
    initialColumns?.map((c, i) => ({ ...c, index: i })),
  )
  const [selectedId, setSelectedId] = useState<string>(
    initialColumns?.[0]?.id ?? '',
  )
  const [previewMode, setPreviewMode] = useState<ColorMode>('light')
  const [draggingId, setDraggingId] = useState('')
  const [dragOverId, setDragOverId] = useState('')
  const moveColumnTo = (fromId: string, toId: string) => {
    if (fromId === toId) return
    setColumns(prev => {
      const next = [...prev]
      const fromIdx = next.findIndex(c => c.id === fromId)
      const toIdx = next.findIndex(c => c.id === toId)
      const [item] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, item)
      return reindex(next)
    })
  }

  const columnErrors = useMemo(() => {
    const errors: Record<string, { columnType?: string; label?: string }> = {}
    const typeCounts = new Map<string, number>()
    for (const col of columns) {
      const t = col.columnType.trim()
      typeCounts.set(t, (typeCounts.get(t) ?? 0) + 1)
    }
    for (const col of columns) {
      const trimmedType = col.columnType.trim()
      const trimmedLabel = col.label.trim()
      const err: { columnType?: string; label?: string } = {}
      if (trimmedType.length < 2) {
        err.columnType = 'Must be more than 1 character'
      } else if ((typeCounts.get(trimmedType) ?? 0) > 1) {
        err.columnType = 'Must be unique'
      }
      if (trimmedLabel.length < 5) {
        err.label = 'Must be more than 4 characters'
      }
      if (Object.keys(err).length > 0) errors[col.id] = err
    }
    return errors
  }, [columns])

  const selected = columns.find(c => c.id === selectedId) ?? undefined

  const reindex = (cols: Column[]) => cols.map((c, i) => ({ ...c, index: i }))

  const onClose = useCallback(() => {
    setColumns(initialColumns?.map((c, i) => ({ ...c, index: i })) ?? [])
    setSelectedId(initialColumns?.[0]?.id ?? '')
    closeModal('CustomizeBoardColumnsModal')
  }, [initialColumns, closeModal])

  const addColumn = () => {
    const next = makeNewColumn(columns.length) as any
    setColumns(prev => [...prev, next])
    setSelectedId(next.id)
  }

  const removeColumn = (id: string) => {
    setColumns(prev => {
      const remaining = reindex(prev.filter(c => c.id !== id))
      if (id === selectedId) {
        setSelectedId(remaining[0]?.id ?? '')
      }
      return remaining
    })
  }

  const updateField = useCallback(
    (key: keyof Column, value: string | number) => {
      setColumns(prev =>
        prev.map(c => (c.id === selectedId ? { ...c, [key]: value } : c)),
      )
    },
    [selectedId],
  )

  const applyPreset = (key: string) => {
    const preset = PRESETS[key]
    setColumns(prev =>
      prev.map(c =>
        c.id === selectedId ? { ...c, ...preset, id: c.id, index: c.index } : c,
      ),
    )
  }

  useEffect(() => {
    if (!open) return
    setColumns(initialColumns?.map((c, i) => ({ ...c, index: i })) ?? [])
    setSelectedId(initialColumns?.[0]?.id ?? '')
    setPreviewMode('light')
  }, [open, initialColumns])

  return (
    <Modal
      title={title}
      isOpen={open}
      onClose={onClose}
      fullScreen
      disableContainerStyles
    >
      <div className='fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
        <div className='flex h-[100vh] w-full flex-col overflow-hidden bg-paper shadow-2xl'>
          <header className='flex flex-shrink-0 items-center justify-between border-b border-border-light px-6 py-4'>
            <div>
              <p className='text-base font-semibold text-text-primary'>
                {title}
              </p>
              <p className='text-xs text-text-secondary'>
                {columns.length} column{columns.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <SaveButton
                onSave={() => onSave?.(columns, initialColumns ?? [])}
                disabled={Object.keys(columnErrors).length > 0}
              />
              <IconButton onClick={onClose} icon={X} />
            </div>
          </header>
          <div className='flex min-h-0 flex-1'>
            <aside className='flex w-64 flex-shrink-0 flex-col border-r border-border-light'>
              <div className='flex items-center justify-between px-3 py-3'>
                <span className='text-xs font-semibold uppercase tracking-widest text-text-secondary'>
                  Columns
                </span>
                <IconButton
                  icon={Plus}
                  onClick={addColumn}
                  tooltip='Add column'
                />
              </div>
              <ul className='flex-1 list-none space-y-0.5 overflow-y-auto px-2 pb-4'>
                {columns.map((col, i) => (
                  <ColumnListItem
                    key={`${col.id}_${i}`}
                    column={col}
                    isSelected={col.id === selectedId}
                    isDragging={draggingId === col.id}
                    isDragOver={dragOverId === col.id}
                    onSelect={() => setSelectedId(col.id)}
                    onDelete={() => removeColumn(col.id)}
                    onDragStart={e => {
                      e.dataTransfer.effectAllowed = 'move'
                      setDraggingId(col.id)
                    }}
                    onDragOver={e => {
                      e.preventDefault()
                      setDragOverId(col.id)
                    }}
                    onDrop={e => {
                      e.preventDefault()
                      if (draggingId) moveColumnTo(draggingId, col.id)
                      setDraggingId('')
                      setDragOverId('')
                    }}
                    onDragEnd={() => {
                      setDraggingId('')
                      setDragOverId('')
                    }}
                  />
                ))}

                {columns.length === 0 && (
                  <p className='px-3 py-6 text-center text-xs text-gray-400'>
                    No columns yet.
                    <br />
                    <button
                      type='button'
                      onClick={addColumn}
                      className='mt-1 text-primary text-md cursor-pointer underline-offset-2 hover:underline'
                    >
                      Add one
                    </button>
                  </p>
                )}
              </ul>
            </aside>
            <main className='flex-1 overflow-y-auto'>
              {selected ? (
                <div className='space-y-6 p-6'>
                  <div className='flex items-center gap-3'>
                    <span className='text-2xl'>{selected.emoji}</span>
                    <div>
                      <h2 className='text-base font-semibold text-text-primary'>
                        {selected.label}
                      </h2>
                      <p className='text-xs text-text-secondary'>
                        Column {selected.index + 1}
                      </p>
                    </div>
                  </div>
                  <Dropdown
                    label='Load preset'
                    size='sm'
                    placeholder='Choose a preset...'
                    defaultEmpty
                    clearAfterSelect
                    options={PRESET_OPTIONS.map(p => ({
                      id: p.label,
                      label: p.label,
                      value: p.value,
                    }))}
                    onSelect={option => {
                      applyPreset(option.value!)
                    }}
                  />

                  <Input
                    label='column type'
                    value={selected.columnType}
                    onChange={e => updateField('columnType', e.target.value)}
                    error={columnErrors[selected.id]?.columnType}
                  />
                  <section className='space-y-3'>
                    <Input
                      label='label'
                      value={selected.label}
                      onChange={e => updateField('label', e.target.value)}
                      error={columnErrors[selected.id]?.label}
                    />
                    <Input
                      label='emoji'
                      value={selected.emoji}
                      onChange={e => updateField('emoji', e.target.value)}
                      hideError
                    />
                    <Input
                      label='tagline'
                      value={selected.tagline}
                      onChange={e => updateField('tagline', e.target.value)}
                      hideError
                    />
                    <Input
                      label='placeholder'
                      value={selected.placeholder}
                      onChange={e => updateField('placeholder', e.target.value)}
                      hideError
                    />
                  </section>
                  <section>
                    <ColorsSection
                      column={selected}
                      onChange={(key, value) => updateField(key, value)}
                    />
                  </section>
                </div>
              ) : (
                <div className='flex h-full items-center justify-center'>
                  <p className='text-sm text-text-secondary'>
                    Select a column to edit
                  </p>
                </div>
              )}
            </main>
            <aside className='flex w-72 flex-shrink-0 flex-col border-l border-border-light'>
              <div className='flex flex-shrink-0 items-center justify-between border-b border-border-light px-4 py-3'>
                <p className='text-xs font-semibold uppercase tracking-widest text-text-secondary'>
                  Preview
                </p>

                <ColorModeToggle compact onChange={setPreviewMode} />
              </div>
              <div
                className='flex-1 space-y-2 overflow-y-auto p-4'
                style={{
                  background: previewMode === 'light' ? '#fff' : '#000',
                }}
              >
                {columns.length === 0 ? (
                  <p className='py-8 text-center text-xs text-text-secondary'>
                    No columns to preview
                  </p>
                ) : (
                  columns.map(col => (
                    <ColumnPreview
                      key={col.id}
                      column={col}
                      mode={previewMode}
                      isSelected={col.id === selectedId}
                      onClick={() => setSelectedId(col.id)}
                    />
                  ))
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Modal>
  )
}
