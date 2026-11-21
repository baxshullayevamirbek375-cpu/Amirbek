import { useCallback, useEffect, useState } from 'react'
import { api, formatMoney } from '../api'
import { ORDER_STATUS, OrderCard } from './Orders'

const EMPTY = { name: '', description: '', price: '', stock: '', image: '📦' }

export default function Admin() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const [p, o] = await Promise.all([api('/shop/products'), api('/shop/orders?all=1')])
    setProducts(p)
    setOrders(o)
  }, [])
  useEffect(() => { load() }, [load])

  const run = async (fn) => {
    setError('')
    try {
      await fn()
      load()
    } catch (err) {
      setError(err.message)
    }
  }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div>
      <h2>🛠️ Admin panel</h2>
      <div className="card">
        <h3>Yangi mahsulot</h3>
        <form className="row-form flat" onSubmit={(e) => { e.preventDefault(); run(async () => { await api('/shop/products', { method: 'POST', body: form }); setForm(EMPTY) }) }}>
          <input className="emoji-input" value={form.image} onChange={set('image')} title="Emoji" />
          <input placeholder="Nomi" value={form.name} onChange={set('name')} required />
          <input placeholder="Tavsif" value={form.description} onChange={set('description')} />
          <input type="number" min="0" placeholder="Narx" value={form.price} onChange={set('price')} required />
          <input type="number" min="0" placeholder="Zaxira" value={form.stock} onChange={set('stock')} required />
          <button className="btn">Qo'shish</button>
        </form>
        {error && <div className="error">{error}</div>}
        <table>
          <thead><tr><th></th><th>Nomi</th><th>Narx</th><th>Zaxira</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.image}</td>
                <td>{p.name}</td>
                <td>{formatMoney(p.price)}</td>
                <td>
                  <input
                    className="stock-input"
                    type="number"
                    min="0"
                    defaultValue={p.stock}
                    onBlur={(e) => Number(e.target.value) !== p.stock && run(() => api(`/shop/products/${p.id}`, { method: 'PATCH', body: { stock: Number(e.target.value) } }))}
                  />
                </td>
                <td><button className="icon-btn" title="O'chirish" onClick={() => run(() => api(`/shop/products/${p.id}`, { method: 'DELETE' }))}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Barcha buyurtmalar</h3>
      {!orders.length && <div className="card muted">Buyurtmalar yo'q</div>}
      {orders.map((o) => (
        <OrderCard key={o.id} order={o}>
          <select value={o.status} onChange={(e) => run(() => api(`/shop/orders/${o.id}`, { method: 'PATCH', body: { status: e.target.value } }))}>
            {Object.entries(ORDER_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </OrderCard>
      ))}
    </div>
  )
}
