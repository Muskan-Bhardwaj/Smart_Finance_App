import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { useAuth } from './hooks/useAuth';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

function App() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard'); // State to switch pages

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  if (!user) return <Login />;

  return (
    <FinanceProvider>
      {/* Simple Navigation Bar */}
      <nav style={{ background: '#1e293b', padding: '10px 40px', display: 'flex', gap: '20px' }}>
        <button 
          onClick={() => setActivePage('dashboard')}
          style={{ background: 'none', border: 'none', color: activePage === 'dashboard' ? '#10b981' : 'white', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActivePage('analytics')}
          style={{ background: 'none', border: 'none', color: activePage === 'analytics' ? '#10b981' : 'white', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Analytics
        </button>
      </nav>

      {/* Page Content */}
      {activePage === 'dashboard' ? <Dashboard /> : <Analytics />}
    </FinanceProvider>
  );
}

export default App;