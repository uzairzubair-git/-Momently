import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/groups'

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }
    setBusy(true)
    try {
      await signup({ name, email, password, phone })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('That email is already registered. Try logging in instead.')
      } else {
        setError('Could not create your account. Please try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10 bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800">Join EventShare</h1>
          <p className="text-gray-500 mt-1">Share photos & chat with your crew</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Your name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field mt-1"
              placeholder="Ali Khan"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Phone number (optional)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field mt-1"
              placeholder="+92 300 1234567"
            />
          </div>
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
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="text-brand-600 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
