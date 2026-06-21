import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(null)

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users')
      setUsers(data)
    } catch {
      setError('Could not load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const toggleRole = async (user) => {
    const newRole = user.role === 'Admin' ? 'User' : 'Admin'
    setUpdating(user.id)
    try {
      await api.patch(`/auth/users/${user.id}/role`, { role: newRole })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u))
    } catch {
      setError('Role update failed.')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '24px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* Header */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
          paddingBottom: 20,
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>User Management</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Admin panel</p>
          </div>
          <Link
            to="/dashboard"
            style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none',
              padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 6 }}
          >
            ← Back
          </Link>
        </header>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
          </div>
        ) : (
          <div className="fade-in">
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
              {users.length} registered {users.length === 1 ? 'user' : 'users'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {users.map(user => (
                <div
                  key={user.id}
                  className="card"
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 9,
                      background: 'linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#fff',
                      flexShrink: 0,
                    }}>
                      {user.fullname?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.fullname}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    {user.isExternalAccount && (
                      <span className="badge badge-google">Google</span>
                    )}
                    <span className={user.role === 'Admin' ? 'badge badge-admin' : 'badge badge-user'}>
                      {user.role}
                    </span>
                    <button
                      className="btn-ghost"
                      style={{
                        fontSize: 12,
                        padding: '5px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        color: 'var(--text-secondary)',
                        minWidth: 80,
                      }}
                      disabled={updating === user.id}
                      onClick={() => toggleRole(user)}
                    >
                      {updating === user.id
                        ? <span className="spinner" />
                        : user.role === 'Admin' ? 'Demote' : 'Promote'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
