"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
//icons
import { Trash2, ShoppingCart, Car, Home, Utensils, Coffee, Gamepad2, Heart, GraduationCap, DollarSign, HandPlatter, PaintBucket, Clapperboard } from "lucide-react"

interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

const categoryIcons = {
  food: Utensils,
  dining: HandPlatter,
  gas: Car,
  shopping: ShoppingCart,
  bills: Home,
  entertainment: Clapperboard,
  coffee: Coffee,
  health: Heart,
  education: GraduationCap,
  subscriptions: DollarSign,
  home: PaintBucket
}

const categoryLabels = {
  food: "Grocery",
  dining: "Dining",
  gas: "Gas",
  shopping: "Shopping",
  bills: "Bills & Utilities",
  entertainment: "Entertainment",
  coffee: "Coffee & Drinks",
  health: "Health & Fitness",
  education: "Education",
  subscriptions: "Subscriptions",
  home: "Home Maintenance"
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="py-12 text-center">
          <div className="text-gray-400 mb-4">
            <Utensils className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">No expenses yet</h3>
          <p className="text-gray-600 font-sans">Start building your financial picture by adding your first expense</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading font-bold text-xl text-gray-900">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses.map((expense) => {
            const Icon = categoryIcons[expense.category as keyof typeof categoryIcons] || Utensils
            const categoryLabel = categoryLabels[expense.category as keyof typeof categoryLabels] || expense.category

            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-indigo-100">
                    <Icon className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <div className="font-sans font-medium text-gray-900">{categoryLabel}, {expense.category}</div>
                    {expense.description && (
                      <div className="text-sm text-gray-600 font-sans">{expense.description}</div>
                    )}
                    <div className="text-xs text-gray-500 font-sans">{new Date(expense.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-heading font-bold text-lg text-gray-900">${expense.amount.toFixed(2)}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(expense.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
