import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { tokenStore } from '../utils/token'

export default function SignupPage({ setUser }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/signup', { name, email, password })
      tokenStore.set(data.access_token)
      const me = await api.get('/auth/me')
      setUser(me.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form className="card w-full max-w-md space-y-4" onSubmit={submit}>
        <h1 className="text-xl font-semibold">Create account</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary w-full" type="submit">Sign up</button>
        <p className="text-sm text-slate-400">Already have account? <Link className="text-cyan-400" to="/login">Login</Link></p>
      </form>
    </div>
  )
}
