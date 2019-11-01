import React, { useState, useEffect, useContext } from 'react';
import * as idb from 'idb'
import { Milliliter, Promille } from './types'

export interface Database extends idb.DBSchema {
  drinks: {
    key: number
    value: {
      id?: number
      name: string
      abv: Promille
    }
    indexes: {
      name: string
    }
  }
  log: {
    key: number
    value: {
      id?: number
      timestamp: Date
      drinkName: string
      abv: Promille
      serving: Milliliter
    }
    indexes: {
      date: Date
    }
  }
}

const DatabaseContext = React.createContext<idb.IDBPDatabase<Database> | undefined>(undefined)

export const DatabaseProvider: React.FC = ({ children }) => {
  const [currentDb, setDb] = useState<idb.IDBPDatabase<Database> | undefined>(undefined);

  useEffect(() => {
    idb.openDB<Database>('alcometer-db', 1, {
      upgrade: async (db, oldVersion, newVersion, transaction) => {
        const drinksStore = db.createObjectStore('drinks', { keyPath: 'id', autoIncrement: true })
        drinksStore.createIndex('name', 'name')
        const logStore = db.createObjectStore('log', { keyPath: 'id', autoIncrement: true })
        logStore.createIndex('date', 'date')
      },
    }).then((db) => setDb(db))
  }, [])

  return (
    <DatabaseContext.Provider value={ currentDb }>
      {children}
    </DatabaseContext.Provider>
  )
}

export function useDatabase() {
  return useContext(DatabaseContext)
}
