"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

interface CategoryChartProps {
  expenses: Expense[]
}

const categoryLabels = {
  food: "Food & Dining",
  transport: "Transportation",
  shopping: "Shopping",
  bills: "Bills & Utilities",
  entertainment: "Entertainment",
  coffee: "Coffee & Drinks",
  health: "Health & Fitness",
  education: "Education",
}

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#84cc16"]

export function CategoryChart({ expenses }: CategoryChartProps) {
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: categoryLabels[category as keyof typeof categoryLabels] || category,
    value: amount,
  }))

  if (expenses.length === 0) {
    return (
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading font-bold text-xl text-gray-900">Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <div className="text-gray-400 mb-4">
            <PieChart className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-600 font-sans">Add expenses to see your spending breakdown</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading font-bold text-xl text-gray-900">Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
              labelStyle={{ fontFamily: "var(--font-open-sans)" }}
              contentStyle={{ fontFamily: "var(--font-open-sans)" }}
            />
            <Legend wrapperStyle={{ fontFamily: "var(--font-open-sans)", fontSize: "14px" }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
