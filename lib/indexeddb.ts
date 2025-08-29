interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

interface Savings {
  id: string
  amount: number
  description: string
  date: string
}

interface Income {
  id: string
  amount: number
  description: string
  date: string
}

class ExpenseDB {
  private dbName = "ExpenseTracker"
  private version = 3 // Incremented version for new income store
  private storeName = "expenses"
  private savingsStoreName = "savings"
  private incomeStoreName = "income" // Added income store name

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

        if (!db.objectStoreNames.contains(this.savingsStoreName)) {
          const savingsStore = db.createObjectStore(this.savingsStoreName, { keyPath: "id" })
          savingsStore.createIndex("date", "date", { unique: false })
        }

        if (!db.objectStoreNames.contains(this.incomeStoreName)) {
          const incomeStore = db.createObjectStore(this.incomeStoreName, { keyPath: "id" })
          incomeStore.createIndex("date", "date", { unique: false })
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

  async updateSavings(amount: number, description: string): Promise<void> {
    const db = await this.openDB()
    const transaction = db.transaction([this.savingsStoreName], "readwrite")
    const store = transaction.objectStore(this.savingsStoreName)

    return new Promise((resolve, reject) => {
      const getAllRequest = store.getAll()

      getAllRequest.onerror = () => reject(getAllRequest.error)
      getAllRequest.onsuccess = () => {
        const existingRecords = getAllRequest.result
        const existingRecord = existingRecords.length > 0 ? existingRecords[0] : null

        const savingsRecord: Savings = {
          id: existingRecord?.id || "savings-main",
          amount: amount,
          description: description,
          date: new Date().toISOString(),
        }

        const putRequest = store.put(savingsRecord)
        putRequest.onerror = () => reject(putRequest.error)
        putRequest.onsuccess = () => resolve()
      }
    })
  }

  async getAllSavings(): Promise<Savings[]> {
    const db = await this.openDB()
    const transaction = db.transaction([this.savingsStoreName], "readonly")
    const store = transaction.objectStore(this.savingsStoreName)

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const savings = request.result
        // Return array with single record for compatibility
        resolve(savings.length > 0 ? [savings[0]] : [])
      }
    })
  }

  async updateIncome(amount: number, description: string): Promise<void> {
    const db = await this.openDB()
    const transaction = db.transaction([this.incomeStoreName], "readwrite")
    const store = transaction.objectStore(this.incomeStoreName)

    return new Promise((resolve, reject) => {
      const getAllRequest = store.getAll()

      getAllRequest.onerror = () => reject(getAllRequest.error)
      getAllRequest.onsuccess = () => {
        const existingRecords = getAllRequest.result
        const existingRecord = existingRecords.length > 0 ? existingRecords[0] : null

        const incomeRecord: Income = {
          id: existingRecord?.id || "income-main",
          amount: amount,
          description: description,
          date: new Date().toISOString(),
        }

        const putRequest = store.put(incomeRecord)
        putRequest.onerror = () => reject(putRequest.error)
        putRequest.onsuccess = () => resolve()
      }
    })
  }

  async getAllIncome(): Promise<Income[]> {
    const db = await this.openDB()
    const transaction = db.transaction([this.incomeStoreName], "readonly")
    const store = transaction.objectStore(this.incomeStoreName)

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const income = request.result
        // Return array with single record for compatibility
        resolve(income.length > 0 ? [income[0]] : [])
      }
    })
  }

  async getIncomeRecord(): Promise<Income | null> {
    const db = await this.openDB()
    const transaction = db.transaction([this.incomeStoreName], "readonly")
    const store = transaction.objectStore(this.incomeStoreName)

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const records = request.result
        resolve(records.length > 0 ? records[0] : null)
      }
    })
  }
}

export const expenseDB = new ExpenseDB()
export type { Expense, Savings, Income } // Added Income to exports
