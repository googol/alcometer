import React, { useState, useEffect } from 'react'
import { Database, useDatabase } from './Database'
import { percent, Promille } from './types'

const Abv = ({ value }: { value: Promille }) => (
  <span>{value/10}%</span>
)

export const RecordDrink: React.FC = () => {
  const db = useDatabase()
  const [currentDrinks, setCurrentDrinks] = useState<Database['drinks']['value'][]>([])
  const [currentName, setCurrentName] = useState('')
  const [currentAbv, setCurrentAbv] = useState(4.5)

  const refetchDrinks = () => {
    if (db) {
      db.getAll('drinks').then(drinks => setCurrentDrinks(drinks))
    }
  }
  useEffect(refetchDrinks, [db])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (db) {
      await db.put('drinks', {
        name: currentName,
        abv: percent(currentAbv),
      })
      refetchDrinks();
    }
    setCurrentName('')
    setCurrentAbv(4.5)
  }

  return (
    <div>
    <div>
      <form onSubmit={handleSubmit}>
        <label>Nimi: <input type="text" value={currentName} onChange={(e) => setCurrentName(e.target.value) } /></label>
        <label>Alkoholiprosentti: <input type="number" value={currentAbv} min={0} max={95} step={0.1} onChange={(e) => setCurrentAbv(Number(e.target.value)) } /></label>
        <button type="submit">Lisää</button>
      </form>
    </div>
    <ul>
      { currentDrinks.map(drink => (
        <li><strong>{drink.name}</strong> <Abv value={drink.abv} /></li>
      ))}
    </ul>
    </div>
  )
}
