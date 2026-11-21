import { useState } from 'react'
import { useAuth } from '../AuthContext'

export default function Login() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') await login(form.email, form.password)
      else await register(form.name, form.email, form.password)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h1>⚡ SuperApp</h1>
        <p className="muted">Vazifalar, xarajatlar, do'kon, blog va chat — hammasi bir joyda</p>
        <div className="tabs">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Kirish</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Ro'yxatdan o'tish</button>
        </div>
        {mode === 'register' && <input placeholder="Ism" value={form.name} onChange={set('name')} required />}
        <input type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
        <input type="password" placeholder="Parol (kamida 6 belgi)" value={form.password} onChange={set('password')} required />
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={busy}>{busy ? 'Kuting...' : mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}</button>
        {mode === 'register' && <p className="muted small">Birinchi ro'yxatdan o'tgan foydalanuvchi admin bo'ladi.</p>}
      </form>
    </div>
  )
}
