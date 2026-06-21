import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullname: '', email: '', school: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      setSuccess('Account created! Redirecting to login…')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg)',
    }}>
      <div className="fade-in" style={{ width: '100%', maxWidth: 400 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 10,
            background: 'var(--accent-dim)',
            border: '1px solid rgba(99,102,241,0.3)',
            marginBottom: 16,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 22V12M2 7l10 5 10-5" stroke="var(--accent)" strokeWidth="1.5"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Create account
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Join AuthAPI today
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}
          {success && <div className="alert alert-success" style={{ marginBottom: 20 }}>{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Full name</label>
              <input
                className="input-field"
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                className="input-field"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">School</label>
              <input
                className="input-field"
                type="text"
                name="school"
                value={form.school}
                onChange={handleChange}
                placeholder="Your university or school"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                className="input-field"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                required
                autoComplete="new-password"
              />
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <><span className="spinner" />&nbsp; Creating account…</> : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
