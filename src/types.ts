declare const brandingSymbol: unique symbol;
type Branded<T, Brand extends string> = T & { [brandingSymbol]: Brand }

export type Promille = Branded<number, 'promille'>

export const promille = (promille: number): Promille => promille as any
export const percent = (percent: number): Promille => promille(percent * 10)

export const toUnit = (promille: Promille): number => promille / 1000

export type Milliliter = Branded<number, 'milliliter'>

export const ml = (ml: number): Milliliter => ml as any
export const liters = (l: number): Milliliter => ml(l * 1000)
