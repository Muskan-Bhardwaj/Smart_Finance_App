import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Make sure this path is correct!

const FinanceContext = createContext();

const financeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS': 
      return { ...state, transactions: action.payload, loading: false };
    case 'ADD_TRANSACTION': 
      return { ...state, transactions: [action.payload, ...state.transactions] };
    default: 
      return state;
  }
};

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, {
    transactions: [],
    loading: true,
  });

  // 🚀 NEW: Function to get data from Supabase
  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (!error) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: data });
    } else {
      console.error("Error fetching transactions:", error.message);
    }
  };

  // 🚀 NEW: Run this automatically when the app loads
  useEffect(() => {
    fetchTransactions();
  }, []);

  const stats = useMemo(() => {
    const income = state.transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + Number(t.amount), 0);
    const expenses = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + Number(t.amount), 0);
    return { income, expenses, balance: income - expenses };
  }, [state.transactions]);

  // We add fetchTransactions to the "value" so the Dashboard can call it to refresh
  return (
    <FinanceContext.Provider value={{ state, dispatch, stats, fetchTransactions }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);