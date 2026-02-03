import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "../App.css"

function Register() {
    const url = "http://localhost:8000"
    
    
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            navigate("/")
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        fetch(`${url}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => {
            if (response.ok) {
                navigate("/login")
            } else {
                return response.json().then(err => {
                    setError(err.detail)
                })
            }
        })
    }

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <label>Username:
                    <input value={username} onChange={e => setUsername(e.target.value)} />
                </label>
                <label>Email:
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label>Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <label>Confirm Password:
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </label>
                <button type="submit">Register</button>
                {error && <p className="error-msg">{error}</p>}
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    )
}

export default Register