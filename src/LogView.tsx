import React, { useState, useEffect, useMemo } from 'react'
import { Database, useDatabase } from './Database'
import { liters, toUnit, Milliliter, Promille } from './types'
import { Abv } from './Abv'
import { Liters } from './Liters'
import { preventingDefault } from './eventHelpers'
import { Units, toUnits } from './Units'
import { format, startOfDay } from 'date-fns'

export const LogView: React.FC = () => {
  const db = useDatabase()
  const [currentDrinks, setCurrentDrinks] = useState<Database['drinks']['value'][]>([])
  const [currentLogEntries, setCurrentLogEntries] = useState<Database['log']['value'][]>([])

  const [currentDrink, setCurrentDrink] = useState<''|number>('')
  const [currentServingSize, setCurrentServingSize] = useState(0.5)

  const currentLogEntriesByDate = useMemo(() => {
    const result: Map<number, Database['log']['value'][]> = new Map()
    for (const logEntry of currentLogEntries) {
      const date = startOfDay(logEntry.timestamp).valueOf()
      if (result.has(date)) {
        result.get(date)!.push(logEntry)
      } else {
        result.set(date, [logEntry])
      }
    }
    return Array.from(result.entries()).sort((x, y) => x[0] === y[0] ? 0 : x[0] < y[0] ? -1 : 1)
  }, [currentLogEntries])

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
        { currentLogEntriesByDate.map(([date, logs]) => (
          <div>
          <h3>{format(date, 'cccc dd.MM.yyyy')}: total ({logs.reduce((sum, log) => sum + toUnits(log.serving, log.abv), 0).toFixed(2)})</h3>
          {logs.map((log) =>
          <li><strong>{log.drinkName}</strong> (<Liters value={log.serving} />/<Abv value={log.abv} />): <strong><Units serving={log.serving} abv={log.abv} /></strong></li>
        )}
        </div>))}
      </ul>
    </div>
  )
}
