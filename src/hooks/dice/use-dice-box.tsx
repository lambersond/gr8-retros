'use client'

import { useEffect, useState } from 'react'
// @ts-ignore
import DiceBox3D from '@3d-dice/dice-box'

export function useDiceBox() {
  const [diceBox, setDiceBox] = useState()

  useEffect(() => {
    const initDiceBox = async () => {
      const temp = new DiceBox3D({
        id: 'dice-canvas',
        startingHeight: 8,
        throwForce: 6,
        spinForce: 5,
        lightIntensity: 0.9,
      })
      await temp.init()

      setDiceBox(temp)
    }

    initDiceBox()
  }, [])

  return diceBox
}
