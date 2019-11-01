import React, { useState, useEffect } from 'react'
import { Database, useDatabase } from './Database'
import { liters, toUnit, Milliliter, Promille } from './types'
import { Abv } from './Abv'
import { Liters } from './Liters'
import { preventingDefault } from './eventHelpers'
import { Units } from './Units'

export const LogView: React.FC = () => {
  const db = useDatabase()
  const [currentDrinks, setCurrentDrinks] = useState<Database['drinks']['value'][]>([])
  const [currentLogEntries, setCurrentLogEntries] = useState<Database['log']['value'][]>([])

  const [currentDrink, setCurrentDrink] = useState<''|number>('')
  const [currentServingSize, setCurrentServingSize] = useState(0.5)

  const refetchDrinks = () => {
    if (db) {
      db.getAll('drinks').then(drinks => setCurrentDrinks(drinks))
    }
  }
  const refetchLogEntries = () => {
    if (db) {
      db.getAll('log').then(logEntries => setCurrentLogEntries(logEntries))
    }
  }

  useEffect(() => {
    refetchDrinks()
    refetchLogEntries()
  }, [db])

  const handleSubmit = async () => {
    const drink = currentDrinks.find(d => d.id === currentDrink)
    if (db && drink) {
      const currentDateTime = new Date()
      await db.put('log', {
        timestamp: currentDateTime,
        drinkName: drink.name,
        abv: drink.abv,
        serving: liters(currentServingSize),
      })
      refetchLogEntries();
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={preventingDefault(handleSubmit)}>
          <label>Juoma: <select value={currentDrink} onChange={(e) => setCurrentDrink(e.target.value === '' ? '' : Number(e.target.value)) }>
            <option value=""></option>
            {currentDrinks.map(drink => <option key={drink.id} value={drink.id}>{drink.name}</option>)}
          </select></label>
          <label>Juoman koko: <input type="number" value={currentServingSize} min={0} max={1} step={0.01} onChange={(e) => setCurrentServingSize(Number(e.target.value)) } /></label>
          <button type="submit">Lisää</button>
        </form>
      </div>
      <ul>
        { currentLogEntries.map(log => (
          <li><strong>{log.drinkName}</strong> (<Liters value={log.serving} />/<Abv value={log.abv} />): <strong><Units serving={log.serving} abv={log.abv} /></strong></li>
        ))}
      </ul>
    </div>
  )
}
