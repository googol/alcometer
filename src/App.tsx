import React, { useState, useEffect } from 'react';
import './App.css';
import { DatabaseProvider } from './Database'

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
