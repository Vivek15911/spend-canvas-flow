import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  name: string;
  amount: number;
  date: Date;
}

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

export const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !name || !amount) {
      console.log('Form validation failed:', { category, name, amount });
      return;
    }
    
    const expenseData = {
      category,
      name,
      amount: parseFloat(amount)
    };
    console.log('Adding expense:', expenseData);
    onAddExpense(expenseData);
    
    setName('');
    setAmount('');
  };

  return (
    <Card className="expense-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Add Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Coffee, Gas, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <Button type="submit" className="w-full gradient-primary text-white transition-bounce hover:scale-105">
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};