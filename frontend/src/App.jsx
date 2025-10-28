import { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { supabase } from './lib/supabaseClient';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setCurrentView('dashboard');
      }
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setCurrentView('dashboard');
      } else {
        setUser(null);
        setCurrentView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    setCurrentView('auth');
  };

  const handleAuthSuccess = (user) => {
    setUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentView === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
      {currentView === 'auth' && <AuthPage onAuthSuccess={handleAuthSuccess} />}
      {currentView === 'dashboard' && <Dashboard user={user} onLogout={handleLogout} />}
    </>
  );
}

export default App;

