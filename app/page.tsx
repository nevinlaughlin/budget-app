"use client"

import { useState, useEffect } from "react"
//components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { CategoryChart } from "@/components/category-chart"
//icons
import { Plus, TrendingDown, TrendingUp, DollarSign } from "lucide-react"
import { expenseDB, type Expense } from "@/lib/indexeddb"

export default function BudgetApp() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const savedExpenses = await expenseDB.getAllExpenses()
        setExpenses(savedExpenses)
      } catch (error) {
        console.error("Failed to load expenses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadExpenses()
  }, [])

  const addExpense = async (expense: Omit<Expense, "id">) => {

    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    }
    try {
      await expenseDB.addExpense(newExpense)
      setExpenses([newExpense, ...expenses])
      setShowAddForm(false)
    } catch (error) {
      console.error("Failed to add expense:", error)
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      await expenseDB.deleteExpense(id)
      setExpenses(expenses.filter((exp) => exp.id !== id))
    } catch (error) {
      console.error("Failed to delete expense:", error)
    }
  }

  const totalIncome = (3613.38 * 2) + (1579 * 2)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const thisMonthExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date)
      const now = new Date()
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading your expenses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="font-heading font-black text-3xl md:text-4xl text-gray-900 mb-2">Monthly Budget</h1>
          <p className="text-gray-600 font-sans">Track expenses and build better spending habits</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sans font-medium text-gray-600">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-black text-gray-900">${totalIncome.toLocaleString("en-US")}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sans font-medium text-gray-600">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-black text-gray-900">${totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sans font-medium text-gray-600">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-black text-gray-900">${thisMonthExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sans font-medium text-gray-600">Transactions</CardTitle>
              <TrendingDown className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-black text-gray-900">{expenses.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Add Expense */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart expenses={expenses} />

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading font-bold text-xl text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showAddForm ? (
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="w-full bg-blue-700 hover:bg-blue-600 text-white font-sans font-medium"
                  size="lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              ) : (
                <ExpenseForm onSubmit={addExpense} onCancel={() => setShowAddForm(false)} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses */}
        <ExpenseList expenses={expenses} onDelete={deleteExpense} />
      </div>
    </div>
  )
}
