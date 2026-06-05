import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const Profile = () => {
    const { user, login, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('profile')

    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()
        if (password && password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        setSubmitting(true)
        try {
            const payload = { name, email }
            if (password) payload.password = password

            const { data } = await axios.put('/users/profile', payload)

            // update AuthContext so navbar name updates immediately
            login({ ...user, name: data.name, email: data.email })

            toast.success('Profile updated')
            setPassword('')
            setConfirmPassword('')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed')
        } finally {
            setSubmitting(false)
        }
    }

    const logoutHandler = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="page-wrapper">
            <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }} />

            <div className="page-header">
                <p className="page-header__eyebrow">Account</p>
                <h1 className="page-header__title">Dashboard</h1>
            </div>

            <div className="split-layout">
                <aside className="split-layout__aside">
                    <div className="admin-form" style={{ gap: 'var(--space-2)' }}>
                        <button 
                            className="btn btn-ghost" 
                            style={{ justifyContent: 'flex-start', backgroundColor: activeTab === 'profile' ? 'var(--bg-subtle)' : 'transparent' }}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile Settings
                        </button>
                        <button 
                            className="btn btn-ghost" 
                            style={{ justifyContent: 'flex-start', backgroundColor: activeTab === 'preferences' ? 'var(--bg-subtle)' : 'transparent' }}
                            onClick={() => setActiveTab('preferences')}
                        >
                            Preferences
                        </button>
                        <Link to="/my-orders" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>My Orders</Link>
                        {user?.role === 'admin' && (
                            <>
                                <Link to="/admin/products" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>Manage Products</Link>
                                <Link to="/admin/orders" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>Manage Orders</Link>
                            </>
                        )}
                        <hr className="divider" style={{ margin: 'var(--space-3) 0' }} />
                        <button onClick={logoutHandler} className="btn btn-danger" style={{ justifyContent: 'flex-start' }}>
                            Logout
                        </button>
                    </div>
                </aside>

                <main className="split-layout__main">
                    {activeTab === 'profile' && (
                    <form onSubmit={submitHandler} className="admin-form">
                        <h2 className="heading-md" style={{ marginBottom: 'var(--space-4)' }}>Profile Settings</h2>
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                        className="input-field"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        className="input-field"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <hr className="divider" />
                <p className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Leave password fields blank to keep your current password.
                </p>

                <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                        className="input-field"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                        className="input-field"
                        type="password"
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div>
                    <button className="btn btn-primary" type="submit" disabled={submitting}>
                        {submitting ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
                    </form>
                    )}

                    {activeTab === 'preferences' && (
                    <div className="admin-form">
                        <h2 className="heading-md" style={{ marginBottom: 'var(--space-4)' }}>Preferences</h2>
                        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                            <div>
                                <p className="form-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Theme Appearance</p>
                                <p className="form-label" style={{ fontSize: '0.8rem' }}>Switch between Light and Dark mode</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="btn btn-ghost"
                                style={{ padding: '0.5rem 1rem' }}
                                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            >
                                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                                <span style={{ marginLeft: 'var(--space-2)' }}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                            </button>
                        </div>
                    </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Profile