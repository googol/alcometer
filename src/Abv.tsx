import React from 'react'
import { Promille } from './types'

export const Abv = ({ value }: { value: Promille }) => (
  <span>{value/10}%</span>
)
