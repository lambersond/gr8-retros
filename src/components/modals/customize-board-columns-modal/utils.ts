export function makeNewColumn(index: number) {
  return {
    id: Date.now(),
    isNew: true,
    index,
    columnType: 'CUSTOM',
    label: 'New Column',
    emoji: '📝',
    tagline: 'Add a tagline...',
    placeholder: 'Add a card...',
    lightBg: '#f9fafb',
    lightBorder: '#e5e7eb',
    lightTitleBg: '#f3f4f6',
    lightTitleText: '#374151',
    darkBg: '#111827',
    darkBorder: '#374151',
    darkTitleBg: '#1f2937',
    darkTitleText: '#9ca3af',
  }
}
