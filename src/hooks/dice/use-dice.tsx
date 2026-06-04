'use client'

import { useCallback } from 'react'
import { CUSTOM_COLORSET_KEY, themeToBoxConfig } from '@lambersond/3d-dice-core'
import { useDiceRenderer } from '@lambersond/3d-dice-react'

// Maps onto DiceRendererConfig (camelCase). Textures and sounds are served
// from /3d-dice/ in the public folder.
const RENDERER_CONFIG = {
  assetPath: '/3d-dice/',
  sounds: true,
  shadows: true,
  surface: 'green-felt',
  colorset: 'white',
  material: 'glass',
  gravityMultiplier: 400,
  lightIntensity: 0.8,
  strength: 1,
}

// Dwell before a settled throw fades off the table.
const REMOVAL_DWELL_MS = 1250

type DiceNotation = string | string[]
type RollOptions = { themeColor?: string }
type UseDice = {
  isInitialized: boolean
  roll: (notation: DiceNotation, options?: RollOptions) => Promise<number[]>
}

export function useDice(): UseDice {
  const renderer = useDiceRenderer(RENDERER_CONFIG)

  // Per-throw theme replaces the old global updateConfig color race: each roll
  // carries its own custom colorset so concurrent rolls keep their colors.
  const roll = useCallback(
    async (notation: DiceNotation, options?: RollOptions) => {
      if (!renderer.isReady) return []

      const theme = options?.themeColor
        ? themeToBoxConfig({
            colorset: CUSTOM_COLORSET_KEY,
            material: 'glass',
            customColor: options.themeColor,
          })
        : undefined

      const value = Array.isArray(notation) ? notation.join('+') : notation
      return renderer.roll(value, {
        theme,
        removal: { style: 'fade', dwellMs: REMOVAL_DWELL_MS },
      })
    },
    [renderer],
  )

  return { isInitialized: renderer.isReady, roll }
}
