import React from 'react';
import Vocabulary from './components/Vocabulary';
import Test from './components/Test';
import Progress from './components/Progress';
import './App.css';

function App() {
  return (
      <div className="app-container">
        <Vocabulary />
        <Test />
        <Progress />
      </div>
  );
}

export default App;
