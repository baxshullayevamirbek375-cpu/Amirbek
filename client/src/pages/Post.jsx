import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, formatDate } from '../api'
import { useAuth } from '../AuthContext'

export default function Post() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { api(`/blog/posts/${id}`).then(setPost).catch((e) => setError(e.message)) }, [id])

  const addComment = async (e) => {
    e.preventDefault()
    const c = await api(`/blog/posts/${id}/comments`, { method: 'POST', body: { content: comment } })
    setPost({ ...post, comments: [...post.comments, c] })
    setComment('')
  }
  const remove = async () => {
    if (!confirm("Postni o'chirasizmi?")) return
    await api(`/blog/posts/${id}`, { method: 'DELETE' })
    navigate('/blog')
  }

  if (error) return <div className="error">{error}</div>
  if (!post) return <p>Yuklanmoqda...</p>

  return (
    <div>
      <Link to="/blog" className="muted">← Blogga qaytish</Link>
      <article className="card">
        <div className="page-head">
          <h2>{post.title}</h2>
          {(post.user_id === user.id || user.role === 'admin') && <button className="btn ghost" onClick={remove}>O'chirish</button>}
        </div>
        <div className="muted small">✍️ {post.author} · {formatDate(post.created_at)}</div>
        <p className="post-content">{post.content}</p>
      </article>
      <div className="card">
        <h3>Izohlar ({post.comments.length})</h3>
        {post.comments.map((c) => (
          <div key={c.id} className="comment">
            <b>{c.author}</b> <span className="muted small">{formatDate(c.created_at)}</span>
            <div>{c.content}</div>
          </div>
        ))}
        <form className="row-form flat" onSubmit={addComment}>
          <input placeholder="Izoh yozing..." value={comment} onChange={(e) => setComment(e.target.value)} required />
          <button className="btn">Yuborish</button>
        </form>
      </div>
    </div>
  )
}
