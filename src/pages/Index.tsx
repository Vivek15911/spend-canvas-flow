import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { MonthlyView } from '@/components/MonthlyView';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { MonthlyHistory } from '@/components/MonthlyHistory';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Wallet } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  name: string;
  amount: number;
  date: Date;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "test-1",
      category: "Food & Dining",
      name: "Test Coffee",
      amount: 5.50,
      date: new Date()
    }
  ]);

  const addExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    // Check if expense with same category and name already exists
    const existingExpenseIndex = expenses.findIndex(
      expense => expense.category === expenseData.category && expense.name === expenseData.name
    );

    if (existingExpenseIndex !== -1) {
      // Update existing expense by adding the amount
      setExpenses(prev => prev.map((expense, index) => 
        index === existingExpenseIndex 
          ? { ...expense, amount: expense.amount + expenseData.amount, date: new Date() }
          : expense
      ));
    } else {
      // Create new expense
      const newExpense: Expense = {
        ...expenseData,
        id: Date.now().toString(),
        date: new Date()
      };
      setExpenses(prev => [newExpense, ...prev]);
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-background transition-smooth">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ExpenseTracker</h1>
                <p className="text-sm text-muted-foreground">Manage your finances with ease</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Add Expenses (25%) */}
          <div className="lg:col-span-1 space-y-6">
            <ExpenseForm onAddExpense={addExpense} />
            <CategoryBreakdown expenses={expenses} />
          </div>

          {/* Middle Panel - Monthly View & Expense List (50%) */}
          <div className="lg:col-span-2 space-y-6">
            <MonthlyView expenses={expenses} />
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          </div>

          {/* Right Panel - 12-Month History (25%) */}
          <div className="lg:col-span-1">
            <MonthlyHistory expenses={expenses} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Vivek Kumar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
