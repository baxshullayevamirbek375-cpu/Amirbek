import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Newsletter from '../components/Newsletter'
import { ContactForm } from './Contact'
import { money } from '../data'
import { useStore } from '../store'

const TABS = ['Dashboard', 'Order History', 'Contact Us']
const date = (iso) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

function OrdersTable({ orders }) {
  return (
    <div className="table-wrap">
      <table className="orders">
        <thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Status</th><th>Total</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{date(o.createdAt)}</td>
              <td>{o.items.map((i) => `${i.name}${i.qty > 1 ? ` ×${i.qty}` : ''}`).join(', ')}</td>
              <td><span className="pill">{o.status}</span></td>
              <td>{money(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Account() {
  const { user, orders, logout, updateUser, notify } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  if (!user) return <Navigate to="/login" state={{ from: '/account' }} replace />

  const lastAddress = orders.find((o) => o.customer?.address1)?.customer

  return (
    <>
      <section className="page-banner center"><h1 className="display">Volumenzeit Account</h1></section>
      <section className="container account">
        <div className="tabs wide">
          {TABS.map((t, i) => <button key={t} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>{t}</button>)}
        </div>

        {tab === 0 && (
          <>
            <h2 className="hello">Hey, {user.firstName} {user.lastName}</h2>
            <p className="muted center">Welcome to your dashboard — here you can see your recent orders and manage your account details.</p>
            <div className="acc-card">
              <div className="acc-head"><h3>Recent Orders</h3><button className="link-btn" onClick={() => setTab(1)}>Show all orders</button></div>
              {orders.length ? <OrdersTable orders={orders.slice(0, 3)} /> : <p className="muted">You haven't placed any orders yet.</p>}
            </div>
            <div className="acc-card">
              <div className="acc-head">
                <h3>My Info</h3>
                <button className="link-btn" onClick={() => { setDraft({ firstName: user.firstName, lastName: user.lastName, phone: user.phone }); setEditing(!editing) }}>
                  {editing ? 'Cancel' : 'Manage Info'}
                </button>
              </div>
              {editing ? (
                <form className="form-grid" onSubmit={(e) => { e.preventDefault(); updateUser(draft); setEditing(false); notify('Your info has been updated') }}>
                  <input className="input" placeholder="First name" required value={draft.firstName} onChange={(e) => setDraft({ ...draft, firstName: e.target.value })} />
                  <input className="input" placeholder="Last name" required value={draft.lastName} onChange={(e) => setDraft({ ...draft, lastName: e.target.value })} />
                  <input className="input span2" placeholder="Phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
                  <button className="btn btn-primary span2">Save</button>
                </form>
              ) : (
                <dl className="info-list">
                  <div><dt>Name</dt><dd>{user.firstName} {user.lastName}</dd></div>
                  <div><dt>Email</dt><dd>{user.email}</dd></div>
                  {user.phone && <div><dt>Phone</dt><dd>{user.phone}</dd></div>}
                  {user.birth && <div><dt>Birthday</dt><dd>{user.birth}</dd></div>}
                </dl>
              )}
            </div>
            <div className="acc-card">
              <div className="acc-head"><h3>Address Book</h3></div>
              {lastAddress ? (
                <p>{lastAddress.firstName} {lastAddress.lastName}<br />{lastAddress.address1}{lastAddress.address2 && `, ${lastAddress.address2}`}<br />{lastAddress.zip} {lastAddress.city}, {lastAddress.country}</p>
              ) : (
                <p className="muted">You haven't saved any addresses yet. Your shipping address is saved with your first order.</p>
              )}
            </div>
            <div className="center">
              <button className="btn btn-primary" onClick={() => { logout(); notify('You have been logged out'); navigate('/') }}>Log Out</button>
            </div>
          </>
        )}

        {tab === 1 && (
          <div className="acc-card">
            <h3>Order History</h3>
            {orders.length ? <OrdersTable orders={orders} /> : <p className="muted">You haven't placed any orders yet.</p>}
          </div>
        )}

        {tab === 2 && (
          <div className="acc-card narrow-card">
            <h3>Contact Us</h3>
            <ContactForm />
          </div>
        )}
      </section>
      <Newsletter />
    </>
  )
}
