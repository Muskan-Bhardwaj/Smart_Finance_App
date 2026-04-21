import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import { generateInsights, getMonthlyForecast, getSpendingVelocity } from '../utils/insights.js';
import AddTransaction from '../components/AddTransaction.jsx';
import BudgetManager from '../components/BudgetManager.jsx';
import { supabase } from '../lib/supabase.js';

const Dashboard = () => {
  const { state, stats, fetchTransactions } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');

  // 🧠 Logic: Intelligence & Predictions
  const insights = generateInsights(state.transactions, stats);
  const forecast = getMonthlyForecast(state.transactions, stats);
  const velocity = getSpendingVelocity(state.transactions);

  // 🔍 Logic: Filter transactions based on Search
  const filteredTransactions = state.transactions.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 📥 Logic: Export data to CSV
  const exportToCSV = () => {
    const headers = "Date,Title,Amount,Type,Category\n";
    const rows = state.transactions.map(t => 
      `${new Date(t.date).toLocaleDateString()},"${t.title}",${t.amount},${t.type},${t.category || 'General'}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Expense_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* --- HEADER SECTION --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1>Smart Finance <span style={{ color: 'var(--accent)' }}>2.0</span></h1>
          <p style={{ opacity: 0.7 }}>Welcome back, track your spending velocity and insights.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportToCSV} className="glass" style={{ padding: '10px 20px', cursor: 'pointer', color: 'var(--accent)', fontWeight: '600' }}>
            📥 Export CSV
          </button>
          <button onClick={() => supabase.auth.signOut()} className="glass" style={{ padding: '10px 20px', cursor: 'pointer', color: '#ef4444' }}>
            Logout
          </button>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="glass" style={{ padding: '24px' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)' }}>TOTAL BALANCE</p>
          <h2 style={{ fontSize: '36px', marginTop: '10px' }}>₹{stats.balance.toLocaleString()}</h2>
        </div>
        <div className="glass" style={{ padding: '24px' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: velocity.color }}>VELOCITY ({velocity.status})</p>
          <h2 style={{ fontSize: '36px', marginTop: '10px' }}>₹{velocity.dailyAvg}<small style={{ fontSize: '14px', opacity: 0.5 }}>/day</small></h2>
        </div>
        {forecast && (
          <div className="glass" style={{ padding: '24px', borderLeft: `4px solid ${forecast.isOver ? '#ef4444' : '#10b981'}` }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold' }}>MONTH-END FORECAST</p>
            <h2 style={{ fontSize: '36px', marginTop: '10px' }}>₹{forecast.projectedTotal}</h2>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* --- LEFT COLUMN: CONTROLS & SEARCH --- */}
        <div>
          <BudgetManager />
          
          <div className="glass" style={{ padding: '24px', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Quick Record</h3>
            <AddTransaction onAdd={fetchTransactions} />
          </div>

          {/* Search Bar */}
          <div className="glass" style={{ padding: '15px 20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span>🔍</span>
            <input 
              type="text" 
              placeholder="Search by name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '16px' }}
            />
          </div>
        </div>

        {/* --- RIGHT COLUMN: INTELLIGENCE & HISTORY --- */}
        <div className="glass" style={{ padding: '24px', minHeight: '400px' }}>
          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            🧠 AI Intelligence
          </h3>
          
          {/* Insights List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
            {insights.length > 0 ? insights.map((ins, i) => (
              <div key={i} style={{ 
                padding: '12px', 
                borderRadius: '8px', 
                background: 'var(--accent-bg)', 
                borderLeft: `4px solid ${ins.type === 'danger' ? '#ef4444' : 'var(--accent)'}`,
                fontSize: '14px' 
              }}>
                {ins.message}
              </div>
            )) : <p style={{ opacity: 0.5, fontSize: '14px' }}>Everything looks stable. Keep it up!</p>}
          </div>

          <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTransactions.slice(0, 5).map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{t.title}</div>
                  <div style={{ fontSize: '11px', opacity: 0.5 }}>{new Date(t.date).toLocaleDateString()}</div>
                </div>
                <div style={{ color: t.type === 'expense' ? '#ef4444' : '#10b981', fontWeight: '700' }}>
                  {t.type === 'expense' ? '-' : '+'}₹{t.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;