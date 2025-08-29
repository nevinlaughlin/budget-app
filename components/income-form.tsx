"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign } from "lucide-react"
import { expenseDB } from "@/lib/indexeddb"

interface IncomeFormProps {
  onSubmit: (amount: number, description: string) => void
  onCancel: () => void
  currentIncome?: number
}

export function IncomeForm({ onSubmit, onCancel, currentIncome = 0 }: IncomeFormProps) {
  const [amount, setAmount] = useState(currentIncome.toString())
  const [description, setDescription] = useState("")

  useEffect(() => {
    const loadExistingIncome = async () => {
      try {
        const existingRecord = await expenseDB.getIncomeRecord()
        if (existingRecord) {
          setAmount(existingRecord.amount.toString())
          setDescription(existingRecord.description)
        }
      } catch (error) {
        console.error("Failed to load existing income:", error)
      }
    }
    loadExistingIncome()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number.parseFloat(amount) < 0) return

    onSubmit(Number.parseFloat(amount), description || "Total income")

    // Don't reset form since we're updating existing amount
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5 text-blue-500" />
        <h3 className="font-heading font-bold text-lg text-gray-900">Update Income</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="income-amount" className="font-sans font-medium text-gray-700">
          Total Income Amount
        </Label>
        <Input
          id="income-amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="font-sans"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="income-description" className="font-sans font-medium text-gray-700">
          Description (optional)
        </Label>
        <Textarea
          id="income-description"
          placeholder="Salary, freelance, investments, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="font-sans resize-none"
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-sans font-medium">
          Update Amount
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 font-sans font-medium bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
