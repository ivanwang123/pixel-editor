import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Editor from './components/Editor'

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" component={Editor} />
      </Router>
    </div>
  );
}

export default App;
