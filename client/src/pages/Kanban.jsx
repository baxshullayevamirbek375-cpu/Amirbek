import { useEffect, useState } from 'react'
import { api } from '../api'

const COLUMNS = [
  { id: 'todo', title: 'Qilinadi', color: '#64748b' },
  { id: 'doing', title: 'Jarayonda', color: '#f59e0b' },
  { id: 'done', title: 'Bajarildi', color: '#10b981' },
]
const PRIORITY = { low: 'Past', medium: "O'rta", high: 'Yuqori' }

export default function Kanban() {
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' })
  const [dragOver, setDragOver] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/tasks').then(setTasks).catch((e) => setError(e.message))
  }, [])

  const add = async (e) => {
    e.preventDefault()
    try {
      const t = await api('/tasks', { method: 'POST', body: form })
      setTasks([t, ...tasks])
      setForm({ title: '', description: '', priority: 'medium' })
    } catch (err) {
      setError(err.message)
    }
  }
  const move = async (id, status) => {
    const updated = await api(`/tasks/${id}`, { method: 'PATCH', body: { status } })
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }
  const remove = async (id) => {
    await api(`/tasks/${id}`, { method: 'DELETE' })
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div>
      <h2>📋 Vazifalar doskasi</h2>
      <form className="card row-form" onSubmit={add}>
        <input placeholder="Yangi vazifa..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Tavsif (ixtiyoriy)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button className="btn">Qo'shish</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="kanban">
        {COLUMNS.map((col) => {
          const list = tasks.filter((t) => t.status === col.id)
          return (
            <div
              key={col.id}
              className={`kanban-col ${dragOver === col.id ? 'over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(col.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => {
                setDragOver(null)
                const id = Number(e.dataTransfer.getData('text/plain'))
                if (tasks.find((t) => t.id === id)?.status !== col.id) move(id, col.id)
              }}
            >
              <div className="kanban-head" style={{ borderColor: col.color }}>
                {col.title} <span className="muted">{list.length}</span>
              </div>
              {list.map((t) => (
                <div key={t.id} className="task" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', String(t.id))}>
                  <div className="task-top">
                    <b>{t.title}</b>
                    <button className="icon-btn" title="O'chirish" onClick={() => remove(t.id)}>✕</button>
                  </div>
                  {t.description && <div className="muted small">{t.description}</div>}
                  <div className="task-bottom">
                    <span className={`pill ${t.priority}`}>{PRIORITY[t.priority]}</span>
                    <select value={t.status} onChange={(e) => move(t.id, e.target.value)}>
                      {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {!list.length && <div className="empty">Bu yerga sudrab tashlang</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
