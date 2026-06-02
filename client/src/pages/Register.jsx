import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post('/users/register', { name, email, password })
      login(data)
      toast.success('Account created!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
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
          <h1 className="auth-card__title">Create Account</h1>
          <p className="auth-card__sub">Join thousands of happy shoppers.</p>
        </div>

        <form onSubmit={submitHandler} className="auth-card__form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              className="input-field"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
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
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="input-field"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register