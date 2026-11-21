import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, formatMoney } from '../api'
import { useCart } from '../CartContext'

export default function Cart() {
  const { items, setQty, clear, total } = useCart()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const checkout = async () => {
    setError('')
    setBusy(true)
    try {
      await api('/shop/orders', { method: 'POST', body: { items: items.map((i) => ({ productId: i.id, qty: i.qty })) } })
      clear()
      navigate('/orders')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!items.length)
    return (
      <div>
        <h2>🧺 Savatcha</h2>
        <div className="card"><p>Savatcha bo'sh. <Link to="/shop">Do'konga o'tish →</Link></p></div>
      </div>
    )

  return (
    <div>
      <h2>🧺 Savatcha</h2>
      <div className="card">
        {items.map((i) => (
          <div key={i.id} className="cart-row">
            <span className="cart-img">{i.image}</span>
            <div className="grow">
              <b>{i.name}</b>
              <div className="muted small">{formatMoney(i.price)}</div>
            </div>
            <div className="qty">
              <button className="icon-btn" onClick={() => setQty(i.id, i.qty - 1)}>−</button>
              <span>{i.qty}</span>
              <button className="icon-btn" disabled={i.qty >= i.stock} onClick={() => setQty(i.id, i.qty + 1)}>+</button>
            </div>
            <b className="cart-sum">{formatMoney(i.price * i.qty)}</b>
          </div>
        ))}
        <div className="cart-total">
          <span>Jami:</span> <b>{formatMoney(total)}</b>
        </div>
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button className="btn ghost" onClick={clear}>Tozalash</button>
          <button className="btn" onClick={checkout} disabled={busy}>{busy ? 'Kuting...' : 'Buyurtma berish'}</button>
        </div>
      </div>
    </div>
  )
}
