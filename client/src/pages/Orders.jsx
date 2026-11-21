import { useEffect, useState } from 'react'
import { api, formatDate, formatMoney } from '../api'

export const ORDER_STATUS = { new: 'Yangi', shipped: "Jo'natildi", delivered: 'Yetkazildi', cancelled: 'Bekor qilindi' }

export function OrderCard({ order, children }) {
  return (
    <div className="card order">
      <div className="order-head">
        <b>Buyurtma #{order.id}</b>
        {order.user_name && <span className="muted">{order.user_name}</span>}
        <span className="muted small">{formatDate(order.created_at)}</span>
        <span className={`pill status-${order.status}`}>{ORDER_STATUS[order.status]}</span>
      </div>
      {order.items.map((it) => (
        <div key={it.id} className="order-item">
          <span>{it.image} {it.name} × {it.qty}</span>
          <span>{formatMoney(it.price * it.qty)}</span>
        </div>
      ))}
      <div className="order-foot">
        <b>Jami: {formatMoney(order.total)}</b>
        {children}
      </div>
    </div>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState(null)
  useEffect(() => { api('/shop/orders').then(setOrders) }, [])

  return (
    <div>
      <h2>📦 Buyurtmalarim</h2>
      {!orders ? <p>Yuklanmoqda...</p> : !orders.length ? <div className="card muted">Hali buyurtma yo'q</div> : orders.map((o) => <OrderCard key={o.id} order={o} />)}
    </div>
  )
}
