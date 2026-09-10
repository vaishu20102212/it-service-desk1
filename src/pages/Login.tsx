import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck, AtSign, Lock, Eye, EyeOff, LogIn } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }
    setSubmitting(true)
    try {
      await login(email, password)
      nav('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={28} strokeWidth={2.2} />
          </div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
            IT Service Desk
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
            Sign in to continue
          </p>
        </div>

        <label>
          Email
          <div className="input-with-icon">
            <AtSign size={16} className="input-icon" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="username"
              placeholder="name@company.com"
            />
          </div>
        </label>

        <label>
          Password
          <div className="input-with-icon">
            <Lock size={16} className="input-icon" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        {error && <div className="error">{error}</div>}

        <button
          className="primary"
          disabled={submitting}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '18px',
          }}
        >
          <LogIn size={18} />
          <span>{submitting ? 'Signing in...' : 'Login'}</span>
        </button>

        <small>
          Demo accounts (password: <b>password123</b>):<br />
          Admin: admin@example.com<br />
          Support Agent: agent@example.com<br />
          Employee: employee@example.com
        </small>
      </form>
    </div>
  )
}

