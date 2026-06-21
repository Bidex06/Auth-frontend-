import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '13px 0',
      borderBottom: '1px solid var(--border)',
      gap: 16,
    }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 90 }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: 'var(--text-primary)', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  )
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      padding: '24px',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Header */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
          paddingBottom: 20,
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--accent-dim)',
              border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 22V12M2 7l10 5 10-5" stroke="var(--accent)" strokeWidth="1.5"/>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>AuthAPI</span>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {user?.role === 'Admin' && (
              <Link
                to="/admin"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid rgba(99,102,241,0.3)',
                  transition: 'background 0.15s',
                }}
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="btn-ghost"
              style={{ fontSize: 13, padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-secondary)' }}
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="fade-in">
          {/* Avatar + greeting */}
          <div style={{ marginBottom: 28 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 14,
              letterSpacing: '-0.02em',
            }}>
              {user?.fullname?.[0]?.toUpperCase() ?? '?'}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Welcome back, {user?.fullname?.split(' ')[0]}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              You're authenticated and your session is active.
            </p>
          </div>

          {/* Profile card */}
          <div className="card" style={{ padding: '4px 24px 4px' }}>
            <InfoRow label="Full name" value={user?.fullname} />
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="School" value={user?.school || '—'} />
            <InfoRow label="Role" value={
              <span className={user?.role === 'Admin' ? 'badge badge-admin' : 'badge badge-user'}>
                {user?.role}
              </span>
            } />
            <InfoRow label="Account" value={
              user?.isExternalAccount
                ? <span className="badge badge-google">Google</span>
                : <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Password</span>
            } />
          </div>

          {/* Feature status — portfolio showcase */}
          <div style={{ marginTop: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Active features
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['JWT + Refresh Rotation', true],
                ['Brute-force Protection', true],
                ['Role-based Auth', true],
                ['Permission Policies', true],
                ['Google Sign-In', true],
                ['Rate Limiting', true],
                ['Serilog Logging', true],
                ['Swagger Docs', true],
              ].map(([label, active]) => (
                <div key={label} className="card-elevated" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: active ? 'var(--success)' : 'var(--text-muted)',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
