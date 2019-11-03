import React, { useState } from 'react';
import './App.css';
import { DatabaseProvider } from './Database'
import { RecordDrink } from './RecordDrink'
import { LogView } from './LogView'
import { preventingDefault } from './eventHelpers'

const App: React.FC = () => {
  const [mode, setMode] = useState<'main' | 'drinks'>('main')

  return (
    <DatabaseProvider>
      <div className="App">
        <header className="App-header">
          <h1>Alkoholiannoslaskuri</h1>
        </header>
        <nav>
          <button onClick={preventingDefault(e=> setMode('main'))}>loki</button>
          <button onClick={preventingDefault(e=> setMode('drinks'))}>juomat</button>
        </nav>
        <main>
          { mode === 'main'
            ? <LogView />
            : <RecordDrink />
          }
        </main>
      </div>
    </DatabaseProvider>
  );
}

export default App;
