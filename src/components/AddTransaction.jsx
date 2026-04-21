import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const AddTransaction = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return alert("Please fill in all fields");

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('transactions')
      .insert([{ 
        title, 
        amount: parseFloat(amount), 
        type, 
        user_id: user.id,
        category: 'General',
        tag: 'essential' 
      }]);

    if (error) {
      alert(error.message);
    } else {
      setTitle('');
      setAmount('');
      onAdd(); // This refreshes the dashboard data
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      display: 'flex', 
      gap: '10px', 
      background: '#f8fafc', 
      padding: '20px', 
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    }}>
      <input 
        placeholder="Expense Name (e.g. Coffee)" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
      />
      <input 
        type="text" 
        placeholder="Amount" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
        style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
      />
      <select 
        value={type} 
        onChange={(e) => setType(e.target.value)}
        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <button type="submit" style={{ 
        padding: '10px 20px', 
        backgroundColor: '#10b981', 
        color: 'white', 
        border: 'none', 
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Add
      </button>
    </form>
  );
};

export default AddTransaction;
