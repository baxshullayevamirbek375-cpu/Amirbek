import { useCallback, useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api, formatMoney } from '../api'

const CATEGORIES = { expense: ['Ovqat', 'Transport', 'Uy-joy', "Ko'ngilochar", "Sog'liq", 'Kiyim', 'Boshqa'], income: ['Maosh', 'Frilans', "Sovg'a", 'Boshqa'] }
const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#a855f7', '#64748b']
const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Expenses() {
  const [list, setList] = useState([])
  const [summary, setSummary] = useState(null)
  const [form, setForm] = useState({ type: 'expense', amount: '', category: 'Ovqat', note: '', date: today() })
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const [l, s] = await Promise.all([api('/expenses'), api('/expenses/summary')])
    setList(l)
    setSummary(s)
  }, [])
  useEffect(() => { load() }, [load])

  const add = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api('/expenses', { method: 'POST', body: form })
      setForm({ ...form, amount: '', note: '' })
      load()
    } catch (err) {
      setError(err.message)
    }
  }
  const remove = async (id) => {
    await api(`/expenses/${id}`, { method: 'DELETE' })
    load()
  }
  const setType = (type) => setForm({ ...form, type, category: CATEGORIES[type][0] })

  return (
    <div>
      <h2>💰 Xarajatlar hisobchisi</h2>
      {summary && (
        <div className="grid three">
          <div className="card"><div className="muted small">Daromad</div><div className="stat-value green">{formatMoney(summary.income)}</div></div>
          <div className="card"><div className="muted small">Xarajat</div><div className="stat-value red">{formatMoney(summary.expense)}</div></div>
          <div className="card"><div className="muted small">Balans</div><div className="stat-value">{formatMoney(summary.balance)}</div></div>
        </div>
      )}
      <form className="card row-form" onSubmit={add}>
        <div className="tabs compact">
          <button type="button" className={form.type === 'expense' ? 'active' : ''} onClick={() => setType('expense')}>Xarajat</button>
          <button type="button" className={form.type === 'income' ? 'active' : ''} onClick={() => setType('income')}>Daromad</button>
        </div>
        <input type="number" min="1" placeholder="Summa" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES[form.type].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input placeholder="Izoh" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <button className="btn">Qo'shish</button>
      </form>
      {error && <div className="error">{error}</div>}
      {summary && (summary.byMonth.length > 0) && (
        <div className="grid two">
          <div className="card chart">
            <h3>Oylik dinamika</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={summary.byMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" width={70} tickFormatter={(v) => (v >= 1e6 ? `${v / 1e6} mln` : v >= 1e3 ? `${v / 1e3} ming` : v)} />
                <Tooltip formatter={(v) => formatMoney(v)} contentStyle={{ background: '#1e293b', border: 'none' }} />
                <Legend />
                <Bar dataKey="income" name="Daromad" fill="#10b981" />
                <Bar dataKey="expense" name="Xarajat" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card chart">
            <h3>Xarajatlar kategoriya bo'yicha</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={summary.byCategory} dataKey="total" nameKey="category" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {summary.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatMoney(v)} contentStyle={{ background: '#1e293b', border: 'none' }} itemStyle={{ color: '#e2e8f0' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      <div className="card">
        <h3>Tranzaksiyalar</h3>
        {!list.length ? <p className="muted">Hali tranzaksiya yo'q</p> : (
          <table>
            <thead><tr><th>Sana</th><th>Kategoriya</th><th>Izoh</th><th className="right">Summa</th><th></th></tr></thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td className="muted">{t.note}</td>
                  <td className={`right ${t.type === 'income' ? 'green' : 'red'}`}>{t.type === 'income' ? '+' : '−'}{formatMoney(t.amount)}</td>
                  <td><button className="icon-btn" onClick={() => remove(t.id)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
