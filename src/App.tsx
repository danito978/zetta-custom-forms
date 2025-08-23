import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FormGeneratorPage from './pages/FormGenerator';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form-generator" element={<FormGeneratorPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
