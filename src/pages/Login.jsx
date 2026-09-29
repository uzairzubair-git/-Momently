import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/groups'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login({ email, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError('Could not log in. Check your email and password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10 bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">📸</div>
          <h1 className="text-2xl font-bold text-gray-800">EventShare</h1>
          <p className="text-gray-500 mt-1">Log in to see your groups</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-1"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          New here?{' '}
          <Link to="/signup" state={location.state} className="text-brand-600 font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
