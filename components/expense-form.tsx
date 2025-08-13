"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, Car, Home, Utensils, Coffee, Gamepad2, Heart, GraduationCap } from "lucide-react"

interface ExpenseFormProps {
  onSubmit: (expense: { amount: number; category: string; description: string; date: string }) => void
  onCancel: () => void
}

const categories = [
  { value: "food", label: "Food & Dining", icon: Utensils },
  { value: "transport", label: "Transportation", icon: Car },
  { value: "shopping", label: "Shopping", icon: ShoppingCart },
  { value: "bills", label: "Bills & Utilities", icon: Home },
  { value: "entertainment", label: "Entertainment", icon: Gamepad2 },
  { value: "coffee", label: "Coffee & Drinks", icon: Coffee },
  { value: "health", label: "Health & Fitness", icon: Heart },
  { value: "education", label: "Education", icon: GraduationCap },
]

export function ExpenseForm({ onSubmit, onCancel }: ExpenseFormProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) return

    onSubmit({
      amount: Number.parseFloat(amount),
      category,
      description,
      date,
    })

    setAmount("")
    setCategory("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount" className="font-sans font-medium text-gray-700">
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-lg font-heading font-bold"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="font-sans font-medium text-gray-700">
          Category
        </Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-indigo-500" />
                    <span className="font-sans">{cat.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="font-sans font-medium text-gray-700">
          Date
        </Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-sans font-medium text-gray-700">
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          placeholder="Add a note about this expense..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="font-sans"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1 bg-indigo-500 hover:bg-indigo-600 font-sans font-medium">
          Add Expense
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="font-sans font-medium bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
