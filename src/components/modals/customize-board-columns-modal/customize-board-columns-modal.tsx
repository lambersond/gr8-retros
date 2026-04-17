'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Lock, Plus, X } from 'lucide-react'
import {
  ColorModeToggle,
  ColorsSection,
  ColumnListItem,
  ColumnPreview,
  SaveButton,
} from './components'
import { makeNewColumn } from './utils'
import { PaymentTierBadge } from '@/components/badges'
import {
  Dropdown,
  IconButton,
  Input,
  Modal,
  Tooltip,
} from '@/components/common'
import { EmojiPickerButton } from '@/components/emoji-completion'
import { RETRO_THEMES } from '@/constants'
import { PaymentTier } from '@/enums'
import { useModals } from '@/hooks/use-modals'
import type { ColorMode, CustomizeBoardColumnsModalProps } from './types'
import type { Column } from '@/types'

const TIER_ORDER: Record<PaymentTier, number> = {
  [PaymentTier.FREE]: 0,
  [PaymentTier.SUPPORTER]: 1,
  [PaymentTier.BELIEVER]: 2,
  [PaymentTier.CHAMPION]: 3,
}

function hasTier(current: PaymentTier, required: PaymentTier) {
  return TIER_ORDER[current] >= TIER_ORDER[required]
}

const STANDARD_THEME_ID = 'standard'

const PRESET_LOOKUP = new Map<
  string,
  (typeof RETRO_THEMES)[number]['columns'][number]
>(
  RETRO_THEMES.flatMap(theme =>
    theme.columns.map(col => [`${theme.id}::${col.columnType}`, col]),
  ),
)

export function CustomizeBoardColumnsModal({
  open = true,
  title = 'Customize Board Columns',
  initialColumns,
  boardTier,
  onSave,
}: Readonly<CustomizeBoardColumnsModalProps>) {
  const { closeModal } = useModals()
  const themesUnlocked = hasTier(boardTier, PaymentTier.BELIEVER)

  const themeOptions = useMemo(
    () =>
      RETRO_THEMES.map(theme => {
        const locked = !themesUnlocked && theme.id !== STANDARD_THEME_ID
        return {
          id: theme.id,
          label: locked ? (
            <span className='flex items-center gap-1 opacity-50'>
              {theme.name}
              <Lock className='size-3 text-primary' />
            </span>
          ) : (
            theme.name
          ),
          value: theme.id,
        }
      }),
    [themesUnlocked],
  )

  const presetOptions = useMemo(
    () =>
      RETRO_THEMES.flatMap(theme =>
        theme.columns.map(col => {
          const locked = !themesUnlocked && theme.id !== STANDARD_THEME_ID
          const key = `${theme.id}::${col.columnType}`
          return {
            id: key,
            label: locked ? (
              <span className='flex items-center gap-1 opacity-50'>
                {`${col.emoji} ${col.label}`.trimStart()}
                <Lock className='size-3 text-primary' />
              </span>
            ) : (
              `${col.emoji} ${col.label}`.trimStart()
            ),
            value: key,
          }
        }),
      ),
    [themesUnlocked],
  )

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
      if (trimmedLabel.length < 3) {
        err.label = 'Must be more than 2 characters'
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
    const preset = PRESET_LOOKUP.get(key)
    if (!preset) return
    setColumns(prev =>
      prev.map(c =>
        c.id === selectedId ? { ...c, ...preset, id: c.id, index: c.index } : c,
      ),
    )
  }

  const applyTheme = (themeId: string) => {
    const theme = RETRO_THEMES.find(t => t.id === themeId)
    if (!theme) return
    const newColumns = theme.columns.map((col, i) => ({
      ...col,
      id: String(Date.now() + i),
      index: i,
      isNew: true,
    })) as any as Column[]
    setColumns(newColumns)
    setSelectedId(newColumns[0]?.id ?? '')
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
              <div className='px-3 pb-3'>
                <Dropdown
                  label='Load theme'
                  size='sm'
                  placeholder='Choose a theme...'
                  defaultEmpty
                  clearAfterSelect
                  options={themeOptions}
                  onSelect={option => {
                    if (!themesUnlocked && option.value !== STANDARD_THEME_ID)
                      return
                    applyTheme(option.value!)
                  }}
                />
                {!themesUnlocked && (
                  <Tooltip
                    title={
                      <span className='text-sm text-text-primary flex items-center gap-1'>
                        Requires{' '}
                        <PaymentTierBadge
                          tier={PaymentTier.BELIEVER}
                          redirectToPlans
                        />{' '}
                        plan or higher for additional themes.
                      </span>
                    }
                    asChild
                  >
                    <p className='mt-1 flex cursor-pointer items-center gap-1 text-[10px] text-text-secondary'>
                      <Lock className='size-3 text-primary' />
                      Additional themes require upgrade
                    </p>
                  </Tooltip>
                )}
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
                    options={presetOptions}
                    onSelect={option => {
                      if (
                        !themesUnlocked &&
                        !String(option.value).startsWith(
                          `${STANDARD_THEME_ID}::`,
                        )
                      )
                        return
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
                    <div className='flex items-start gap-4'>
                      <div className='flex flex-col gap-1'>
                        <span className='text-[10px] font-semibold text-text-secondary uppercase tracking-widest'>
                          Emoji
                        </span>
                        <div className='cursor-pointer flex h-[42px] w-[72px] items-center rounded-md border border-border-light bg-paper'>
                          <EmojiPickerButton
                            id='emoji-picker'
                            className='flex flex-1 h-full items-center justify-center cursor-pointer'
                            onEmojiSelect={emoji => updateField('emoji', emoji)}
                          >
                            <span className='text-xl leading-none'>
                              {selected.emoji}
                            </span>
                          </EmojiPickerButton>
                          {selected.emoji && (
                            <button
                              type='button'
                              aria-label='Clear emoji'
                              className='cursor-pointer flex items-center justify-center rounded p-0.5 mr-1.5 text-text-secondary hover:text-danger hover:bg-hover'
                              onClick={() => updateField('emoji', '')}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <Input
                        label='label'
                        value={selected.label}
                        onChange={e => updateField('label', e.target.value)}
                        error={columnErrors[selected.id]?.label}
                      />
                    </div>
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
