import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Social } from '../components/Icons'
import { useStore } from '../store'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function LoginForm() {
  const { login, notify } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const u = await login(email, password)
      notify(`Welcome back, ${u.firstName}!`)
      navigate(location.state?.from ?? '/account')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <h1 className="display">Welcome Back</h1>
      <p className="muted center">Sign in to your account to track orders, save designs and check out faster.</p>
      <input className="input" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      <input className="input" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      <div className="auth-row">
        <label className="check"><input type="checkbox" defaultChecked />Remember me</label>
        <button type="button" className="link-btn" onClick={() => notify('Password reset is not available in the demo store')}>Forgot Password</button>
      </div>
      {error && <p className="form-error center">{error}</p>}
      <button className="btn btn-primary auth-submit" disabled={busy}>Sign In</button>
      <p className="center"><b>Express sign in</b></p>
      <div className="express">
        <button type="button" className="btn btn-dark" onClick={() => notify('Facebook sign-in is not configured in the demo')}><Social.Facebook width={14} /> Sign In</button>
        <button type="button" className="btn btn-dark" onClick={() => notify('Google sign-in is not configured in the demo')}><Social.Google width={14} /> Sign In</button>
      </div>
    </form>
  )
}

function RegisterForm() {
  const { register, notify } = useStore()
  const navigate = useNavigate()
  const [f, setF] = useState({
    firstName: '', lastName: '', month: '', day: '', phone: '', email: '', email2: '', password: '', password2: '', newsletter: true,
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const bind = (k) => ({ value: f[k], onChange: (e) => setF({ ...f, [k]: e.target.value }) })

  const submit = async (e) => {
    e.preventDefault()
    if (f.email.trim().toLowerCase() !== f.email2.trim().toLowerCase()) return setError('Emails do not match')
    if (f.password.length < 6) return setError('Password must be at least 6 characters')
    if (f.password !== f.password2) return setError('Passwords do not match')
    setBusy(true)
    try {
      const u = await register({ ...f, birth: f.month && f.day ? `${f.month} ${f.day}` : '' })
      notify(`Welcome to Volumenzeit, ${u.firstName}!`)
      navigate('/account')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <h1 className="display">New To Volumenzeit?</h1>
      <p className="muted center">Create a new account</p>
      <input className="input" placeholder="First Name" required {...bind('firstName')} autoComplete="given-name" />
      <input className="input" placeholder="Last Name" required {...bind('lastName')} autoComplete="family-name" />
      <p className="f-label">Date of birth</p>
      <div className="two">
        <select className="input" {...bind('month')} aria-label="Birth month">
          <option value="">Month</option>
          {MONTHS.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select className="input" {...bind('day')} aria-label="Birth day">
          <option value="">Day</option>
          {Array.from({ length: 31 }, (_, i) => <option key={i}>{i + 1}</option>)}
        </select>
      </div>
      <input className="input" type="tel" placeholder="Phone Number" {...bind('phone')} autoComplete="tel" />
      <div className="two">
        <input className="input" type="email" placeholder="Email" required {...bind('email')} autoComplete="email" />
        <input className="input" type="email" placeholder="Confirm Email" required {...bind('email2')} />
      </div>
      <div className="two">
        <input className="input" type="password" placeholder="Password" required {...bind('password')} autoComplete="new-password" />
        <input className="input" type="password" placeholder="Confirm Password" required {...bind('password2')} autoComplete="new-password" />
      </div>
      <label className="check"><input type="checkbox" checked={f.newsletter} onChange={(e) => setF({ ...f, newsletter: e.target.checked })} />Sign up to receive the latest updates and promotions</label>
      {error && <p className="form-error center">{error}</p>}
      <button className="btn btn-primary auth-submit" disabled={busy}>Create Account</button>
    </form>
  )
}

export default function Auth({ mode }) {
  return (
    <section className="auth-page">
      <div className="auth-band hex-bg" />
      <div className="auth-card">
        <div className="tabs">
          <Link to="/login" className={mode === 'login' ? 'on' : ''}>Login</Link>
          <Link to="/register" className={mode === 'register' ? 'on' : ''}>Create Account</Link>
        </div>
        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </section>
  )
}
