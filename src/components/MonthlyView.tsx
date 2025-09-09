import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Edit3, Check, X } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  name: string;
  amount: number;
  date: Date;
}

interface MonthlyViewProps {
  expenses: Expense[];
  monthlyBudget?: number;
}

export const MonthlyView = ({ expenses, monthlyBudget = 2000 }: MonthlyViewProps) => {
  const [budget, setBudget] = useState(monthlyBudget);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget.toString());

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budget - totalSpent;
  const budgetPercentage = (totalSpent / budget) * 100;

  const handleSaveBudget = () => {
    const newBudget = parseFloat(tempBudget);
    if (!isNaN(newBudget) && newBudget > 0) {
      setBudget(newBudget);
    } else {
      setTempBudget(budget.toString());
    }
    setIsEditingBudget(false);
  };

  const handleCancelEdit = () => {
    setTempBudget(budget.toString());
    setIsEditingBudget(false);
  };

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = { total: 0, count: 0 };
    }
    acc[expense.category].total += expense.amount;
    acc[expense.category].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b.total - a.total);

  return (
    <div className="space-y-6">
      <Card className="expense-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {currentMonth}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Budget</span>
              {isEditingBudget ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="h-7 w-20 text-xs"
                  />
                  <Button size="sm" variant="ghost" onClick={handleSaveBudget} className="h-6 w-6 p-0">
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">₹{budget.toFixed(2)}</span>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingBudget(true)} className="h-6 w-6 p-0">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Spent</span>
              <span className="font-semibold amount-negative">₹{totalSpent.toFixed(2)}</span>
            </div>
            
            <Progress value={budgetPercentage} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Remaining</span>
              <span className={`font-semibold ${remainingBudget >= 0 ? 'amount-positive' : 'amount-negative'}`}>
                ₹{remainingBudget.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="expense-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedCategories.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No expenses this month</p>
            ) : (
              sortedCategories.map(([category, data]) => {
                const percentage = (data.total / totalSpent) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{category}</span>
                        <Badge variant="secondary" className="text-xs">
                          {data.count} items
                        </Badge>
                      </div>
                      <span className="text-sm font-semibold amount-negative">
                        ₹{data.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={percentage} className="flex-1 h-1" />
                      <span className="text-xs text-muted-foreground min-w-[3rem]">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};