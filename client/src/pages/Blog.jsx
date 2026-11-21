import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatDate } from '../api'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ title: '', content: '' })
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { api('/blog/posts').then(setPosts) }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const p = await api('/blog/posts', { method: 'POST', body: form })
      setPosts([p, ...posts])
      setForm({ title: '', content: '' })
      setOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>📝 Blog</h2>
        <button className="btn" onClick={() => setOpen(!open)}>{open ? 'Bekor qilish' : '+ Yangi post'}</button>
      </div>
      {open && (
        <form className="card stack" onSubmit={submit}>
          <input placeholder="Sarlavha" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea rows={6} placeholder="Matn..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          {error && <div className="error">{error}</div>}
          <button className="btn">Nashr qilish</button>
        </form>
      )}
      {!posts.length && <div className="card muted">Hali post yo'q. Birinchisini yozing!</div>}
      {posts.map((p) => (
        <Link key={p.id} to={`/blog/${p.id}`} className="card post-card">
          <h3>{p.title}</h3>
          <p className="muted">{p.content.length > 200 ? `${p.content.slice(0, 200)}...` : p.content}</p>
          <div className="muted small">✍️ {p.author} · {formatDate(p.created_at)} · 💬 {p.comment_count}</div>
        </Link>
      ))}
    </div>
  )
}
