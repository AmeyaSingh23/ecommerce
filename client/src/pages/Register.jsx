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
      toast.success('Account created')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <Toaster />
      <form onSubmit={submitHandler} style={styles.form}>
        <h2 style={styles.title}>Register</h2>
        <input style={styles.input} type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
        <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' },
  form: { backgroundColor: '#fff', padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', width: 'clamp(280px, 90vw, 400px)' },
  title: { margin: 0, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', textAlign: 'center' },
  input: { padding: 'clamp(0.5rem, 1.5vw, 0.75rem)', fontSize: 'clamp(0.85rem, 2vw, 1rem)', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' },
  button: { padding: 'clamp(0.5rem, 1.5vw, 0.75rem)', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '4px', fontSize: 'clamp(0.85rem, 2vw, 1rem)', cursor: 'pointer' },
  link: { textAlign: 'center', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', margin: 0 },
}

export default Register