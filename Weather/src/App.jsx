import React from 'react';
import {Routes, Route} from 'react-router-dom';
import './App.css'; // Import the main CSS file for global styles
import SearchPage from './pages/searchPage';
import ResultPage from './pages/resultPage';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<SearchPage />} />
        <Route path='/result' element={<ResultPage />} />
      </Routes>
    </div>
  )
}
