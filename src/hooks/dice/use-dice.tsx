'use client'

import { useRef } from 'react'
import { useDiceBox } from './use-dice-box'

/** NOTE
 * The @ts-ignores are due to the fact that the 3d Dice Box library
 * does not have TypeScript types available.
 */

const HIDE_CLASS_NAME = 'hide-dice'

type DiceNotation = string | string[]
type VoidPromiseFunction = () => Promise<void>
type UseDiceBox = {
  isInitialized: boolean
  show: VoidPromiseFunction
  roll: (notation: DiceNotation) => Promise<number[]>
  hide: VoidPromiseFunction
}

/**
 * useDice is a hook that provides functionality for rolling dice using the 3D Dice Box library.
 * It allows you to roll dice with a specific notation and manages the visibility of the dice box.
 *
 * @returns {UseDiceBox} An object containing:
 * - isInitialized: A boolean indicating if the dice box is initialized.
 * - rollDice: A function to roll dice with a given notation.
 */
export function useDice(): UseDiceBox {
  const dicebox = useDiceBox()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialized = !!dicebox

  async function roll(notation: DiceNotation, timeout = 2000) {
    assert(
      isInitialized,
      'DiceBox is not initialized. Please ensure the dice box is set up correctly.',
    )

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // @ts-ignore
    dicebox.show()
    // @ts-ignore
    await dicebox.roll(notation)

    // @ts-ignore
    const results = dicebox.getRollResults()
    timeoutRef.current = setTimeout(() => {
      // @ts-ignore
      dicebox.hide(HIDE_CLASS_NAME)
      // @ts-ignore
      dicebox.clear()
    }, timeout)

    // @ts-ignore
    return results.map((result: { value: number }) => result?.value ?? 0)
  }

  return {
    isInitialized,
    roll,
    // @ts-ignore
    show: dicebox?.show?.(),
    // @ts-ignore
    hide: dicebox?.hide?.(HIDE_CLASS_NAME),
  }
}

function assert(check: boolean, message: string) {
  if (!check) throw new Error(message)
}
