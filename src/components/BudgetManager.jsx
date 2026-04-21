import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useFinance } from '../context/FinanceContext';

const BudgetManager = () => {
  const { stats } = useFinance();
  const [monthlyLimit, setMonthlyLimit] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Calculate percentage used
  const percentUsed = monthlyLimit > 0 ? (stats.expenses / monthlyLimit) * 100 : 0;
  const isOver = stats.expenses > monthlyLimit;

  return (
    <div style={{ 
      background: 'white', 
      padding: '24px', 
      borderRadius: '16px', 
      border: '1px solid #e2e8f0',
      marginBottom: '30px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Monthly Budget Goal</h3>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
            Set Limit
          </button>
        ) : (
          <div>
            <input 
              type="number" 
              onChange={(e) => setMonthlyLimit(e.target.value)}
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '5px' }}
              placeholder="Enter limit..."
            />
            <button onClick={() => setIsEditing(false)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>
              Save
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar UI */}
      <div style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
        <div style={{ 
          width: `${Math.min(percentUsed, 100)}%`, 
          height: '100%', 
          background: isOver ? '#ef4444' : percentUsed > 80 ? '#f59e0b' : '#10b981',
          transition: 'width 0.5s ease-in-out'
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
        <span>Spent: ₹{stats.expenses.toLocaleString()}</span>
        <span>Goal: ₹{Number(monthlyLimit).toLocaleString()}</span>
      </div>

      {isOver && (
        <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '10px', fontWeight: '600' }}>
          ⚠️ Budget Exceeded! You are ₹{(stats.expenses - monthlyLimit).toLocaleString()} over your limit.
        </p>
      )}
    </div>
  );
};

export default BudgetManager;