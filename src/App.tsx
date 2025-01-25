import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Backoffice from './pages/Backoffice';
import Diagnostic from './pages/Diagnostic';
import Results from './pages/Results';
import Ranking from './pages/Ranking';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <main className="py-8">
          <Routes>
            <Route path="/backoffice" element={<Backoffice />} />
            <Route path="/diagnostico" element={<Diagnostic />} />
            <Route path="/resultados" element={<Results />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/" element={<Diagnostic />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;