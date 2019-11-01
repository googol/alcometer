import React, { useState, useEffect } from 'react';
import './App.css';
import * as idb from 'idb'

type Promille = number
type Milliliter = number

interface Database extends idb.DBSchema {
  drinks: {
    key: number
    value: {
      id: number
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
      id: number
      date: Date
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

const DatabaseProvider: React.FC = ({ children }) => {
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

const App: React.FC = () => {
  return (
    <DatabaseProvider>
      <div className="App">
        <header className="App-header">
          <h1>Simple in-browser alcometer</h1>
        </header>
        <main>
        </main>
      </div>
    </DatabaseProvider>
  );
}

export default App;
