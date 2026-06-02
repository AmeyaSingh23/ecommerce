import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post('/users/login', { email, password })
      login(data)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }} />
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__brand">Vendora</span>
          <h1 className="auth-card__title">Sign In</h1>
          <p className="auth-card__sub">Welcome back — let's pick up where you left off.</p>
        </div>

        <form onSubmit={submitHandler} className="auth-card__form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              className="input-field"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="input-field"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login