import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Expense {
  id: string;
  category: string;
  name: string;
  amount: number;
  date: Date;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  'Food & Dining': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
  'Transportation': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  'Shopping': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  'Entertainment': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
  'Bills & Utilities': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  'Healthcare': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  'Education': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
  'Travel': 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
  'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
};

export const ExpenseList = ({ expenses, onDeleteExpense }: ExpenseListProps) => {
  console.log('ExpenseList received expenses:', expenses);
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <Card className="expense-card">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No expenses added yet</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(expensesByCategory).map(([category, categoryExpenses]) => {
            const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            
            return (
              <Card key={category} className="expense-card hover:scale-[1.02] transition-bounce">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={categoryColors[category] || categoryColors['Other']}>
                        {category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {categoryExpenses.length} item{categoryExpenses.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-lg font-semibold amount-negative">
                      -₹{categoryTotal.toFixed(2)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {categoryExpenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{expense.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {expense.date.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold amount-negative">
                            -₹{expense.amount.toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteExpense(expense.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};