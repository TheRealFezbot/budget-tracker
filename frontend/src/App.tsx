import React, { useState, useEffect } from 'react'
import './App.css'

interface Transaction {
  id: number
  name: string
  description: string | null
  type: "income" | "expense"
  amount: number
  transaction_date: string
}

interface Summary {
  total_income: number
  total_expense: number
  net_balance: number
}

function App() {
  const url = "http://localhost:8000/transactions"
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<Summary>({
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  
  // transaction form
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"income" | "expense">("income")
  const [amount, setAmount] = useState("")
  const [transactionDate, setTransactionDate] = useState("")

  const [message, setMessage] = useState("")

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return
    fetch(`${url}/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      fetch(`${url}`).then(r => r.json()).then(data => setTransactions(data))
      fetch(`${url}/summary`).then(r => r.json()).then(data => setSummary(data))
    })
  }

  const handleEdit = (transaction: Transaction) => {
    setName(transaction.name)
    setDescription(transaction.description || "")
    setType(transaction.type)
    setAmount(String(transaction.amount))
    setTransactionDate(transaction.transaction_date)
    setEditingId(transaction.id)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch(editingId ? `${url}/${editingId}` : `${url}`, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        name: name,
        description: description,
        type: type,
        amount: parseFloat(amount),
        transaction_date: transactionDate
      })
    })
    .then((response) => {
      if (response.ok) {
        fetch(`${url}`).then(r => r.json()).then(data => setTransactions(data))
        fetch(`${url}/summary`).then(r => r.json()).then(data => setSummary(data))
        setMessage(editingId ? "Transaction Updated!" : "Transaction added!")
        resetForm()
      } else {
        return response.json().then(err => {
          setMessage(`Error: ${err.detail[0].msg}`)
          setTimeout(() => setMessage(""), 3000)
        })
      }
    })
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setType("income")
    setAmount("")
    setTransactionDate("")
    setEditingId(null)
    setTimeout(() => setMessage(""), 3000)
  }

  useEffect(() => {
    fetch(`${url}`)
    .then(response => response.json())
    .then(data => setTransactions(data))
  }, []
)

  useEffect(() => {
    fetch(`${url}/summary`)
    .then(response => response.json())
    .then(data => setSummary(data))
  }, []
)
  
  return (
    <>
    <div className='container'>
      <header>
        <h1>Budget Tracker</h1>
      </header>
      <div className='dashboard'>
        <section className='sumform'>
          <h2>Summary</h2>
          <div className='summary-item income'>
            <h3>Income</h3>
            <p>€{summary.total_income}</p>
          </div>
          <div className='summary-item expense'>
            <h3>Expenses</h3>
            <p>€{summary.total_expense}</p>
          </div>
          <div className='summary-item balance'>
            <h3>Balance</h3>
            <p style={{ color: summary.net_balance >= 0 ? 'var(--income)' : 'var(--error)'}}>€{summary.net_balance}</p>
          </div>
          <h2>{editingId ? "Edit Transaction" : "Add Transactions"}</h2>
          <form onSubmit={handleSubmit}>
            <label>Name: 
              <input type='text' value={name} onChange={(e) => setName(e.target.value)}/>
            </label>
            <label>Description: 
              <input type='text' value={description} onChange={(e) => setDescription(e.target.value)}/>
            </label>
            <label>Type: 
              <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
                <option>income</option>
                <option>expense</option>
              </select>
            </label>
            <label>Amount:
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
            <label>Date:
              <input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
            </label>
            <button type="submit">{editingId ? "Update Transaction" : "Add Transaction"}</button>
            {editingId && <button type='button' onClick={() => resetForm()}>Cancel</button>}
            {message && <p className={message.startsWith("Error") ? "error-msg" : "success-msg"}>{message}</p>}
          </form>
        </section>
        <section className='transactions'>
          <h2>Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.name}</td>
                  <td>{transaction.description}</td>
                  <td style={{ color: transaction.type === "income" ? "var(--income)" : "var(--expense)", fontWeight: "bold"}}>{transaction.type === "income" ? "+ " : "- "}€{transaction.amount}</td>
                  <td>{new Date(transaction.transaction_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).replace(/\//g, '-')}</td>
                  <td>
                    <button className='delete' onClick={() => handleDelete(transaction.id)}>
                      DELETE
                    </button>
                    <button className='edit' onClick={() => handleEdit(transaction)}>
                      EDIT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='pagination'>
            <button disabled={currentPage === 1} className='tableButton' onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            <button disabled={currentPage * itemsPerPage >= transactions.length} className='tableButton' onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        </section>
      </div>
    </div>
    </>
  ) 
}

export default App
