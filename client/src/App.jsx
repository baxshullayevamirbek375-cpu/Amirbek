import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useCart } from './CartContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Kanban from './pages/Kanban'
import Expenses from './pages/Expenses'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Admin from './pages/Admin'
import Blog from './pages/Blog'
import Post from './pages/Post'
import Chat from './pages/Chat'

const NAV = [
  { to: '/', label: 'Bosh sahifa', icon: '🏠', end: true },
  { to: '/kanban', label: 'Vazifalar', icon: '📋' },
  { to: '/expenses', label: 'Xarajatlar', icon: '💰' },
  { to: '/shop', label: "Do'kon", icon: '🛒' },
  { to: '/blog', label: 'Blog', icon: '📝' },
  { to: '/chat', label: 'Chat', icon: '💬' },
]

export default function App() {
  const { user, loading, logout } = useAuth()
  const { count } = useCart()

  if (loading) return <div className="center">Yuklanmoqda...</div>
  if (!user)
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">⚡ SuperApp</div>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="nav-link">
              <span>{n.icon}</span> {n.label}
            </NavLink>
          ))}
          <NavLink to="/cart" className="nav-link">
            <span>🧺</span> Savatcha {count > 0 && <b className="badge">{count}</b>}
          </NavLink>
          <NavLink to="/orders" className="nav-link">
            <span>📦</span> Buyurtmalarim
          </NavLink>
          {user.role === 'admin' && (
            <NavLink to="/admin" className="nav-link">
              <span>🛠️</span> Admin panel
            </NavLink>
          )}
        </nav>
        <div className="user-box">
          <div>
            <div className="user-name">{user.name}</div>
            <div className="muted small">{user.role === 'admin' ? 'Administrator' : 'Foydalanuvchi'}</div>
          </div>
          <button className="btn ghost" onClick={logout}>Chiqish</button>
        </div>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={user.role === 'admin' ? <Admin /> : <Navigate to="/" replace />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Post />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
