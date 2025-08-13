interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

class ExpenseDB {
  private dbName = "ExpenseTracker"
  private version = 1
  private storeName = "expenses"

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "id" })
          store.createIndex("date", "date", { unique: false })
          store.createIndex("category", "category", { unique: false })
        }
      }
    })
  }

  async addExpense(expense: Expense): Promise<void> {
    const db = await this.openDB()
    const transaction = db.transaction([this.storeName], "readwrite")
    const store = transaction.objectStore(this.storeName)

    return new Promise((resolve, reject) => {
      const request = store.add(expense)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getAllExpenses(): Promise<Expense[]> {
    const db = await this.openDB()
    const transaction = db.transaction([this.storeName], "readonly")
    const store = transaction.objectStore(this.storeName)

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        // Sort by date descending (newest first)
        const expenses = request.result.sort(
          (a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        resolve(expenses)
      }
    })
  }

  async deleteExpense(id: string): Promise<void> {
    const db = await this.openDB()
    const transaction = db.transaction([this.storeName], "readwrite")
    const store = transaction.objectStore(this.storeName)

    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async updateExpense(expense: Expense): Promise<void> {
    const db = await this.openDB()
    const transaction = db.transaction([this.storeName], "readwrite")
    const store = transaction.objectStore(this.storeName)

    return new Promise((resolve, reject) => {
      const request = store.put(expense)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

export const expenseDB = new ExpenseDB()
export type { Expense }
