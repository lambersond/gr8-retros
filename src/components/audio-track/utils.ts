import { clamp01 } from '@/utils/clamp01'

export function getStoredVolume(key: string, fallback = 0.6): number {
  if (globalThis.window === undefined) return fallback
  const stored = localStorage.getItem(key)
  const parsed = stored ? Number(stored) : Number.NaN
  return Number.isFinite(parsed) ? clamp01(parsed) : fallback
}
