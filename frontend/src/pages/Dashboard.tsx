import React, { useState, useEffect } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom'

type Category = 
    | "food"
    | "transportation"
    | "housing"
    | "utilities"
    | "entertainment"
    | "shopping"
    | "healthcare"
    | "salary"
    | "other"

type Type =
    | "income"
    | "expense"

interface Transaction {
  id: number
  name: string
  description: string | null
  category: Category
  type: Type
  amount: number
  transaction_date: string
}

interface Summary {
  total_income: number
  total_expense: number
  net_balance: number
}

function Dashboard() {
    const url = import.meta.env.VITE_API_URL + "/transactions"
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }
  
    const [editingId, setEditingId] = useState<number | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [summary, setSummary] = useState<Summary>({
        total_income: 0,
        total_expense: 0,
        net_balance: 0,
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState(0)
    const itemsPerPage = 15
    
    const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
    const [filterCategory, setFilterCategory] = useState<string>("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")


    // transaction form
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("other")
    const [type, setType] = useState<"income" | "expense">("income")
    const [amount, setAmount] = useState("")
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0])

    const [message, setMessage] = useState("")

    const handleDelete = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return
        fetch(`${url}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
        })
        .then(() => {
        fetchTransactions()
        fetch(`${url}/summary`, { headers: { "Authorization": `Bearer ${token}` } }).then(r => r.json()).then(data => setSummary(data))
        const newTotal = transactions.length -1
        const maxPage = Math.ceil(newTotal / itemsPerPage) || 1
        if (currentPage > maxPage) {
            setCurrentPage(maxPage)
        }
        })
    }

    const handleEdit = (transaction: Transaction) => {
        setName(transaction.name)
        setDescription(transaction.description || "")
        setCategory(transaction.category)
        setType(transaction.type)
        setAmount(String(transaction.amount))
        setTransactionDate(transaction.transaction_date)
        setEditingId(transaction.id)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        fetch(editingId ? `${url}/${editingId}` : `${url}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        body: JSON.stringify({
            name: name,
            description: description,
            category: category,
            type: type,
            amount: parseFloat(amount),
            transaction_date: transactionDate
        })
        })
        .then((response) => {
        if (response.ok) {
            fetchTransactions()
            fetch(`${url}/summary`, { headers: { "Authorization": `Bearer ${token}` } }).then(r => r.json()).then(data => setSummary(data))
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
        setTransactionDate(new Date().toISOString().split("T")[0])
        setEditingId(null)
        setTimeout(() => setMessage(""), 3000)
    }

    const fetchTransactions = () => {
        const params = new URLSearchParams()
        params.append("skip", String((currentPage - 1) * itemsPerPage))
        params.append("limit", String(itemsPerPage))
        if (filterType && filterType !== "all") params.append("type", filterType)
        if (filterCategory) params.append("category", filterCategory)
        if (startDate) params.append("start_date", startDate)
        if (endDate) params.append("end_date", endDate)

        fetch(`${url}?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            setTransactions(data.transactions)
            setTotal(data.total)
        })
    }

    useEffect(() => {
        fetchTransactions()
    }, [currentPage, filterType, filterCategory, startDate, endDate])

    useEffect(() => {
        fetch(`${url}/summary`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => setSummary(data))
    }, []
    )
    
    
    return (
        <>
        <div className='container'>
        <header>
            <h1>Budget Tracker</h1>
            <button className='logout-btn' onClick={handleLogout}>Logout</button>
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
                <input type='text' value={name} required onChange={(e) => setName(e.target.value)}/>
                </label>
                <label>Description: 
                <input type='text' value={description} onChange={(e) => setDescription(e.target.value)}/>
                </label>
                <label>Category:
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="food">Food</option>
                    <option value="transportation">Transportation</option>
                    <option value="housing">Housing</option>
                    <option value="utilities">Utilities</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="shopping">Shopping</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="salary">Salary</option>
                    <option value="other">Other</option>
                </select>
                </label>
                <label>Type: 
                <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
                    <option>income</option>
                    <option>expense</option>
                </select>
                </label>
                <label>Amount:
                <input type="number" value={amount} min="0.01" step="0.01" onChange={(e) => setAmount(e.target.value)} />
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
            <div className='filters'>
                <h3>filters</h3>
                <label>Type:
                    <select value={filterType} onChange={(e) => { setFilterType(e.target.value as "all" | "income" | "expense"); setCurrentPage(1)}}>
                        <option>all</option>
                        <option>income</option>
                        <option>expense</option>
                    </select>
                </label>
                <label>Category:
                    <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1)}}>
                        <option value="">All</option>
                        <option value="food">Food</option>
                        <option value="transportation">Transportation</option>
                        <option value="housing">Housing</option>
                        <option value="utilities">Utilities</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="shopping">Shopping</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="salary">Salary</option>
                        <option value="other">Other</option>
                    </select>
                </label>
                <label>Start Date:
                    <input type='date' value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1)}} />
                </label>
                <label>End Date:
                    <input type='date' value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1)}} />
                </label>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                    <td>{transaction.name}</td>
                    <td className='description'>{transaction.description}</td>
                    <td style={{ color: transaction.type === "income" ? "var(--income)" : "var(--expense)", fontWeight: "bold"}}>{transaction.type === "income" ? "+ " : "- "}€{transaction.amount}</td>
                    <td>{new Date(transaction.transaction_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }).replace(/\//g, '-')}</td>
                    <td className='trans-cat'>{transaction.category}</td>
                    <td className='actions'>
                        <button className='edit' onClick={() => handleEdit(transaction)}>
                        EDIT
                        </button>
                        <button className='delete' onClick={() => handleDelete(transaction.id)}>
                        DELETE
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className='pagination'>
                <button disabled={currentPage === 1} className='tableButton' onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                <button disabled={currentPage * itemsPerPage >= total} className='tableButton' onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                <span style={{width: '100%', textAlign: 'center'}}>Page {currentPage} of {Math.ceil(total / itemsPerPage)}</span>
            </div>
            </section>
        </div>
        </div>
        </>
    ) 
}

export default Dashboard