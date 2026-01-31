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
  const url = "http://localhost:8000"
  
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<Summary>({
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
  })
  
  // transaction form
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"income" | "expense">("income")
  const [amount, setAmount] = useState("")
  const [transactionDate, setTransactionDate] = useState("")

  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch(`${url}/transactions`, {
      method: "POST",
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
        fetch(`${url}/transactions`).then(r => r.json()).then(data => setTransactions(data))
        fetch(`${url}/transactions/summary`).then(r => r.json()).then(data => setSummary(data))
        setMessage("Transaction added!")
        setName("")
        setDescription("")
        setType("income")
        setAmount("")
        setTransactionDate("")
        setTimeout(() => setMessage(""), 3000)
      } else {
        return response.json().then(err => {
          setMessage(`Error: ${err.detail[0].msg}`)
          setTimeout(() => setMessage(""), 3000)
        })
      }
    })
  }

  useEffect(() => {
    fetch(`${url}/transactions`)
    .then(response => response.json())
    .then(data => setTransactions(data))
  }, []
)

  useEffect(() => {
    fetch(`${url}/transactions/summary`)
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
          <h2>Add Transactions</h2>
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
            <button type="submit">Add Transaction</button>
            {message && <p className={message.startsWith("Error") ? "error-msg" : "success-msg"}>{message}</p>}
          </form>
        </section>
        <section className='transactions'>
          <h2>Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.name}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.amount}</td>
                  <td>{new Date(transaction.transaction_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).replace(/\//g, '-')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
    </>
  ) 
}

export default App
