import React, { Component } from 'react';
import './App.css';
import Gomoku from './Gomoku.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Gomoku
          </p>
          <Gomoku />
        </header>
      </div>
    );
  }
}

export default App;