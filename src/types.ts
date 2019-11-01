declare const brandingSymbol: unique symbol;
type Branded<T, Brand extends string> = T & { [brandingSymbol]: Brand }

export type Promille = Branded<number, 'promille'>

export const promille = (promille: number): Promille => promille as any

export type Milliliter = Branded<number, 'milliliter'>

export const ml = (ml: number): Milliliter => ml as any
