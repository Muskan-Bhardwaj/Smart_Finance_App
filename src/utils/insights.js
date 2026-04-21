export const generateInsights = (transactions, stats) => {
  const insights = [];
  
  // Guard: if stats isn't loaded yet
  if (!stats) return insights;

  if (stats.expenses > stats.income && stats.income > 0) {
    insights.push({ type: 'danger', message: "Warning: You are spending more than you earn!" });
  }

  if (stats.balance > 10000) {
    insights.push({ type: 'success', message: "Great job! Your savings are growing." });
  }

  const foodExpenses = transactions
    .filter(t => t.category?.toLowerCase() === 'food' || t.title?.toLowerCase().includes('food'))
    .reduce((acc, t) => acc + Number(t.amount), 0);

  if (foodExpenses > (stats.expenses * 0.4) && stats.expenses > 0) {
    insights.push({ 
      type: 'warning', 
      message: "Insight: Over 40% of your budget is going to Food. Try meal prepping!" 
    });
  }

  return insights;
};

export const getMonthlyForecast = (transactions, stats) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0 || !stats) return null;

  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const dailyAverage = stats.expenses / currentDay;
  const projectedTotal = dailyAverage * daysInMonth;

  return {
    projectedTotal: projectedTotal.toFixed(2),
    isOverBudget: projectedTotal > stats.income && stats.income > 0
  };
};

// 🚀 THIS WAS MISSING - Adding it now to fix the blank page!
export const getSpendingVelocity = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return { dailyAvg: 0, status: 'Stable', color: '#10b981' };
  }

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const thisWeekTotal = transactions
    .filter(t => t.type === 'expense' && new Date(t.date) > oneWeekAgo)
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const dailyAvg = (thisWeekTotal / 7).toFixed(0);
  
  return {
    dailyAvg: dailyAvg,
    status: dailyAvg > 1500 ? 'Aggressive' : 'Stable',
    color: dailyAvg > 1500 ? '#ef4444' : '#10b981'
  };
};