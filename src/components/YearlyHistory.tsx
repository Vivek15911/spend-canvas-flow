import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, History } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  name: string;
  amount: number;
  date: Date;
}

interface YearlyHistoryProps {
  expenses: Expense[];
}

export const YearlyHistory = ({ expenses }: YearlyHistoryProps) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Get months with expenses, show only current month and last month with data
  const monthsWithExpenses = Array.from({ length: 12 }, (_, index) => {
    const monthExpenses = expenses.filter(expense => 
      expense.date.getMonth() === index && expense.date.getFullYear() === currentYear
    );
    
    if (monthExpenses.length === 0 && index !== currentMonth) return null;
    
    const month = new Date(currentYear, index, 1);
    return {
      month: month.toLocaleString('default', { month: 'short' }),
      fullMonth: month.toLocaleString('default', { month: 'long' }),
      total: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      count: monthExpenses.length,
      index
    };
  }).filter(Boolean);

  // Get last month with expenses (excluding current month)
  const lastMonthWithExpenses = monthsWithExpenses
    .filter(month => month!.index !== currentMonth && month!.count > 0)
    .slice(-1)[0];

  const displayMonths = [
    ...monthsWithExpenses.filter(month => month!.index === currentMonth),
    ...(lastMonthWithExpenses ? [lastMonthWithExpenses] : [])
  ];

  const maxMonthlySpending = Math.max(...displayMonths.map(month => month!.total));

  return (
    <div className="space-y-6">
      <Card className="expense-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Recent Months
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayMonths.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No expenses yet</p>
            ) : (
              displayMonths.map((monthData) => {
                const heightPercentage = maxMonthlySpending > 0 ? (monthData!.total / maxMonthlySpending) * 100 : 0;
                const isCurrentMonth = monthData!.index === currentMonth;
                
                return (
                  <div key={monthData!.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isCurrentMonth ? 'text-primary' : ''}`}>
                          {monthData!.fullMonth}
                        </span>
                        {isCurrentMonth && (
                          <Badge variant="outline" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold amount-negative">
                          ₹{monthData!.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {monthData!.count} transactions
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-destructive to-destructive/80 rounded-full transition-all duration-500"
                          style={{ width: `${heightPercentage}%` }}
                        />
                      </div>
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