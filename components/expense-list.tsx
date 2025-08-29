"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart, Car, Home, Utensils, Coffee, Heart, GraduationCap, DollarSign, HandPlatter, PaintBucket, Clapperboard, HeartHandshake, Filter } from "lucide-react"
import { useState, useMemo } from "react"
import { currencyFormatter, dateFormatter } from "@/lib/utils"

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
  home: PaintBucket,
  tithe: HeartHandshake
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
  home: "Home Maintenance",
  tithe: "Tithe"
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {

  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredExpenses = useMemo(() => {
    if (selectedCategory === "all") return expenses
    return expenses.filter((expense) => expense.category === selectedCategory)
  }, [expenses, selectedCategory])

  const availableCategories = useMemo(() => {
    const categories = Array.from(new Set(expenses.map((expense) => expense.category)))
    return categories.sort()
  }, [expenses])

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
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="font-heading font-bold text-xl text-gray-900">Recent Expenses</CardTitle>
          <CardTitle className="font-heading font-semibold text-md text-gray-400 mt-1 mr-auto">{expenses.length} transactions</CardTitle>
          {availableCategories.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white font-sans"
              >
                <option value="all">All Categories</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category as keyof typeof categoryLabels] || category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredExpenses.map((expense) => {

            const Icon = categoryIcons[expense.category as keyof typeof categoryIcons] || Utensils
            const categoryLabel = categoryLabels[expense.category as keyof typeof categoryLabels] || expense.category
            const date = new Date(expense.date);

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
                    <div className="font-sans font-medium text-gray-900">{categoryLabel}</div>
                    {expense.description && (
                      <div className="text-sm text-gray-600 font-sans">{expense.description}</div>
                    )}
                    <div className="text-xs text-gray-500 font-sans">{dateFormatter.format(date)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-heading font-bold text-lg text-gray-900">{currencyFormatter.format(expense.amount)}</div>
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
        {filteredExpenses.length === 0 && expenses.length > 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Filter className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-gray-600 font-sans">No expenses found for this category</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
