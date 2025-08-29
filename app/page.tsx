"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryChart } from "@/components/category-chart"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { SavingsForm } from "@/components/savings-form"
import { IncomeForm } from "@/components/income-form" 
import { Plus, TrendingDown, TrendingUp, DollarSign, PiggyBank, Wallet } from "lucide-react"
import { expenseDB, type Expense, type Savings, type Income } from "@/lib/indexeddb" 
import { currencyFormatter, dateFormatter } from "@/lib/utils"

export default function BudgetApp() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [income, setIncome] = useState<Income[]>([]) // Added income state
  const [isLoading, setIsLoading] = useState(true)
  const [savings, setSavings] = useState<Savings[]>([])
  const [showSavingsForm, setShowSavingsForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false) // Added income form state

  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedExpenses, savedSavings, savedIncome] = await Promise.all([
          expenseDB.getAllExpenses(),
          expenseDB.getAllSavings(),
          expenseDB.getAllIncome(),
        ])
        setExpenses(savedExpenses)
        setSavings(savedSavings)
        setIncome(savedIncome) // Set income state
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
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

  const addSavings = async (amount: number, description: string) => {
    try {
      await expenseDB.updateSavings(amount, description)
      // Reload savings to get updated record
      const updatedSavings = await expenseDB.getAllSavings()
      setSavings(updatedSavings)
      setShowSavingsForm(false)
    } catch (error) {
      console.error("Failed to update savings:", error)
    }
  }

  const addIncome = async (amount: number, description: string) => {
    try {
      await expenseDB.updateIncome(amount, description)
      // Reload income to get updated record
      const updatedIncome = await expenseDB.getAllIncome()
      setIncome(updatedIncome)
      setShowIncomeForm(false)
    } catch (error) {
      console.error("Failed to update income:", error)
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalSavings = savings.reduce((sum, saving) => sum + saving.amount, 0)
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0)
  const remainingIncome = totalIncome - totalIncome

  // TODO fix date
  const thisMonthExpenses = expenses
    .filter((expense) => {
      const date = new Date(expense.date)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
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
              <CardTitle className="text-sm font-sans font-medium text-gray-600">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-black text-gray-900">{currencyFormatter.format(totalExpenses)}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sans font-medium text-gray-600">Monthly Income</CardTitle>
                <Wallet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-black text-blue-500">{currencyFormatter.format(totalIncome)}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sans font-medium text-gray-600">Remaining Income</CardTitle>
              <TrendingDown className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-black text-gray-900">{currencyFormatter.format(remainingIncome)}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sans font-medium text-gray-600">Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-black text-green-600">{currencyFormatter.format(totalSavings)}</div>
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
              {!showAddForm && !showSavingsForm && !showIncomeForm ? (
                <>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-sans font-medium"
                    size="lg"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                  <Button
                    onClick={() => setShowIncomeForm(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-sans font-medium"
                    size="lg"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Add Income
                  </Button>
                  <Button
                    onClick={() => setShowSavingsForm(true)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-sans font-medium"
                    size="lg"
                  >
                    <PiggyBank className="mr-2 h-4 w-4" />
                    Add Savings
                  </Button>
                </>
              ) : showAddForm ? (
                <ExpenseForm onSubmit={addExpense} onCancel={() => setShowAddForm(false)} />
              ) : showIncomeForm ? (
                <IncomeForm
                  onSubmit={addIncome}
                  onCancel={() => setShowIncomeForm(false)}
                  currentIncome={totalIncome}
                />
              ) : (
                <SavingsForm
                  onSubmit={addSavings}
                  onCancel={() => setShowSavingsForm(false)}
                  currentSavings={totalSavings}
                />
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
