import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  name: string;
  amount: number;
  date: Date;
}

interface CategoryBreakdownProps {
  expenses: Expense[];
}

export const CategoryBreakdown = ({ expenses }: CategoryBreakdownProps) => {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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
  );
};