import React from 'react'
import { liters, toUnit, Milliliter, Promille } from './types'

export function Units({ serving, abv }: { serving: Milliliter, abv: Promille }) {
  return (
    <span>{toUnits(serving, abv).toFixed(2)}</span>
  )
}

export function toUnits(serving: Milliliter, abv: Promille): number {
  const ethanolDensity = 0.78924

  const alcoholRatio = toUnit(abv)
  const alcoholVolume = serving * alcoholRatio
  const alcoholWeight = alcoholVolume * ethanolDensity

  return alcoholWeight / 12
}

