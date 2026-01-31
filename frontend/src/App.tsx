import { useState, useEffect } from 'react'
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
