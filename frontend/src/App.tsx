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

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  
  useEffect(() => {
    fetch("http://localhost:8000/transactions")
    .then(response => response.json())
    .then(data => setTransactions(data))
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
          {/* summary and form will go here*/}
        </section>
        <section className='transactions'>
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
