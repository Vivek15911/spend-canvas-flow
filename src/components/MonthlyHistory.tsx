import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, TrendingDown, TrendingUp } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  name: string;
  amount: number;
  date: Date;
}

interface MonthlyHistoryProps {
  expenses: Expense[];
}

export const MonthlyHistory = ({ expenses }: MonthlyHistoryProps) => {
  // Get last 12 months data
  const currentDate = new Date();
  const monthsData = [];

  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = monthDate.toLocaleString('default', { month: 'short', year: '2-digit' });
    
    // Filter expenses for this month
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === monthDate.getMonth() && 
             expenseDate.getFullYear() === monthDate.getFullYear();
    });

    const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const expenseCount = monthExpenses.length;

    if (totalAmount > 0) {
      monthsData.push({
        month: monthName,
        amount: totalAmount,
        count: expenseCount,
        date: monthDate
      });
    }
  }

  return (
    <Card className="expense-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          12-Month History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {monthsData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No expense history yet</p>
          ) : (
            monthsData.map((monthData, index) => {
              const isCurrentMonth = index === monthsData.length - 1;
              const prevAmount = index > 0 ? monthsData[index - 1].amount : 0;
              const isIncrease = monthData.amount > prevAmount;
              
              return (
                <div key={monthData.month} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isCurrentMonth ? 'text-primary' : ''}`}>
                      {monthData.month}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {monthData.count} items
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold amount-negative">
                      ₹{monthData.amount.toFixed(0)}
                    </span>
                    {index > 0 && monthData.amount !== prevAmount && (
                      <div className="flex items-center">
                        {isIncrease ? (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    )}
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