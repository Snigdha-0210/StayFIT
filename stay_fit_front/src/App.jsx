import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WellnessProvider } from './context/WellnessContext';
import Layout from './components/Layout';
import CommandCenter from './pages/CommandCenter';
import NeuralSync from './pages/NeuralSync';
import Forecast from './pages/Forecast';
import Analytics from './pages/Analytics';
import AICoach from './pages/AICoach';
import { testFirebase } from './firebase/testFirebase';

function App() {
  useEffect(() => {
    testFirebase();
  }, []);
  return (
    <WellnessProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CommandCenter />} />
            <Route path="sync" element={<NeuralSync />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="coach" element={<AICoach />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WellnessProvider>
  );
}

export default App;
