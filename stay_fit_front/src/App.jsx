import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WellnessProvider, useWellness } from './context/WellnessContext';
import Layout from './components/Layout';
import CommandCenter from './pages/CommandCenter';
import NeuralSync from './pages/NeuralSync';
import Forecast from './pages/Forecast';
import Analytics from './pages/Analytics';
import AICoach from './pages/AICoach';
import Auth from './pages/Auth';
import { testFirebase } from './firebase/testFirebase';

const AuthGuard = ({ children }) => {
  const { user, loading } = useWellness();
  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-primary-fixed-dim">Initializing System...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

function App() {
  useEffect(() => {
    testFirebase();
  }, []);
  return (
    <WellnessProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
            <Route index element={<CommandCenter />} />
            <Route path="sync" element={<NeuralSync />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="coach" element={<AICoach />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WellnessProvider>
  );
}

export default App;
