import { useEffect, useState } from 'react'
import { api, formatMoney } from '../api'
import { useCart } from '../CartContext'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [added, setAdded] = useState(null)
  const { add, items } = useCart()

  useEffect(() => { api('/shop/products').then(setProducts) }, [])

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
  const inCart = (id) => items.find((i) => i.id === id)?.qty || 0

  return (
    <div>
      <div className="page-head">
        <h2>🛒 Onlayn do'kon</h2>
        <input className="search" placeholder="Qidirish..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="grid products">
        {filtered.map((p) => (
          <div key={p.id} className="card product">
            <div className="product-img">{p.image}</div>
            <h3>{p.name}</h3>
            <p className="muted small">{p.description}</p>
            <div className="product-foot">
              <b>{formatMoney(p.price)}</b>
              <span className="muted small">{p.stock > 0 ? `Zaxira: ${p.stock}` : 'Tugagan'}</span>
            </div>
            <button
              className="btn"
              disabled={p.stock === 0 || inCart(p.id) >= p.stock}
              onClick={() => { add(p); setAdded(p.id); setTimeout(() => setAdded(null), 1000) }}
            >
              {added === p.id ? "✓ Qo'shildi" : inCart(p.id) ? `Savatchada: ${inCart(p.id)} (+1)` : "Savatchaga qo'shish"}
            </button>
          </div>
        ))}
      </div>
      {!filtered.length && <p className="muted">Mahsulot topilmadi</p>}
    </div>
  )
}
