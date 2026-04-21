import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Analytics = () => {
  const { state } = useFinance();

  // 🧠 Logic: Group transactions by their "Tag" (Essential, Luxury, etc.)
  const chartData = useMemo(() => {
    const groups = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const tagName = t.tag || 'other';
        acc[tagName] = (acc[tagName] || 0) + Number(t.amount);
        return acc;
      }, {});

    return Object.keys(groups).map(name => ({
      name: name.toUpperCase(),
      value: groups[name]
    }));
  }, [state.transactions]);

  // Modern SaaS Color Palette
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Spending Intelligence Breakdown</h2>

      {chartData.length > 0 ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h4 style={{ color: '#64748b', marginBottom: '15px' }}>Detailed Breakdown:</h4>
            {chartData.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: COLORS[i % COLORS.length] }}>{item.name}</span>
                <span>₹{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '100px' }}>
          <p>No expense data available for analysis.</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;