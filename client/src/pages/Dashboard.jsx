import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatMoney } from '../api'
import { useAuth } from '../AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    Promise.all([api('/tasks'), api('/expenses/summary'), api('/shop/orders'), api('/blog/posts')]).then(
      ([tasks, money, orders, posts]) =>
        setStats({
          open: tasks.filter((t) => t.status !== 'done').length,
          done: tasks.filter((t) => t.status === 'done').length,
          balance: money.balance,
          orders: orders.length,
          posts: posts.length,
        }),
    )
  }, [])

  const cards = stats && [
    { to: '/kanban', icon: '📋', title: 'Vazifalar', value: `${stats.open} ochiq`, sub: `${stats.done} ta bajarilgan` },
    { to: '/expenses', icon: '💰', title: 'Balans', value: formatMoney(stats.balance), sub: 'Daromad − xarajat' },
    { to: '/orders', icon: '📦', title: 'Buyurtmalar', value: stats.orders, sub: "Do'kondan" },
    { to: '/blog', icon: '📝', title: 'Blog postlari', value: stats.posts, sub: 'Barcha mualliflar' },
    { to: '/chat', icon: '💬', title: 'Chat', value: 'Jonli', sub: 'Real-vaqt xonalar' },
  ]

  return (
    <div>
      <h2>Salom, {user.name}! 👋</h2>
      <p className="muted">Bugungi holatingiz:</p>
      {!stats ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <div className="grid">
          {cards.map((c) => (
            <Link key={c.to} to={c.to} className="card stat-card">
              <div className="stat-icon">{c.icon}</div>
              <div className="muted small">{c.title}</div>
              <div className="stat-value">{c.value}</div>
              <div className="muted small">{c.sub}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
