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
  
  // Generate month data for the current year
  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(currentYear, index, 1);
    const monthExpenses = expenses.filter(expense => 
      expense.date.getMonth() === index && expense.date.getFullYear() === currentYear
    );
    
    return {
      month: month.toLocaleString('default', { month: 'short' }),
      fullMonth: month.toLocaleString('default', { month: 'long' }),
      total: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      count: monthExpenses.length
    };
  });

  const totalYearly = monthlyData.reduce((sum, month) => sum + month.total, 0);
  const maxMonthlySpending = Math.max(...monthlyData.map(month => month.total));
  const averageMonthly = totalYearly / 12;

  return (
    <div className="space-y-6">
      <Card className="expense-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            {currentYear} Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold amount-negative mb-1">
                ${totalYearly.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Total spent this year</p>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly avg</span>
                <span className="font-medium">${averageMonthly.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="expense-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Monthly Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyData.map((monthData, index) => {
              const heightPercentage = maxMonthlySpending > 0 ? (monthData.total / maxMonthlySpending) * 100 : 0;
              const isCurrentMonth = index === new Date().getMonth();
              
              return (
                <div key={monthData.month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isCurrentMonth ? 'text-primary' : ''}`}>
                        {monthData.fullMonth}
                      </span>
                      {isCurrentMonth && (
                        <Badge variant="outline" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold amount-negative">
                        ${monthData.total.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {monthData.count} transactions
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
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="expense-card">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">Spending Insights</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Highest month:</span>
                <span className="font-medium">
                  {monthlyData.find(m => m.total === maxMonthlySpending)?.fullMonth || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peak spending:</span>
                <span className="font-medium amount-negative">
                  ${maxMonthlySpending.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};