import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FromGenerator from './pages/FromGenerator';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/from-generator" element={<FromGenerator />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
