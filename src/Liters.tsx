import React from 'react'
import { Milliliter } from './types'

interface LitersProps {
  value: Milliliter
}

export const Liters: React.FC<LitersProps> = ({value}) => (
  <span>{ value / 1000 }</span>
)
