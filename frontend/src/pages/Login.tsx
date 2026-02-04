import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function Login() {
    const url = import.meta.env.VITE_API_URL
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            navigate("/")
        }
    }, [])

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        fetch(`${url}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) return response.json()
            throw new Error("Invalid username or password")
        })
        .then(data => {
            localStorage.setItem("token", data.access_token)
            navigate("/")
        })
        .catch(err => setError(err.message))
    }

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Login</button>
                {error && <p className="error-msg">{error}</p>}
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    )
}

export default Login