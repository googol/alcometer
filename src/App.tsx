import React from 'react';
import './App.css';
import { DatabaseProvider } from './Database'
import { RecordDrink } from './RecordDrink'

const App: React.FC = () => {
  return (
    <DatabaseProvider>
      <div className="App">
        <header className="App-header">
          <h1>Simple in-browser alcometer</h1>
        </header>
        <main>
          <RecordDrink />
        </main>
      </div>
    </DatabaseProvider>
  );
}

export default App;
