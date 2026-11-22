import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CloseIcon, TrashIcon } from './Icons'
import ProductVisual from './ProductVisual'
import { byId, CASE_COLORS, DIAL_COLORS, money, PRODUCTS, STRAPS } from '../data'
import { useStore } from '../store'
import { cartItemFromProduct } from './ProductCard'

export function ItemMeta({ item }) {
  if (item.kind === 'strap') return <div className="item-meta"><span className="dot" style={{ background: strapColor(item.strap) }} />Strap</div>
  const kase = byId(CASE_COLORS, item.config.caseColor)
  const dial = byId(DIAL_COLORS, item.config.dialColor)
  return (
    <div className="item-meta">
      <span><span className="dot" style={{ background: kase.dark }} />{kase.name} case</span>
      <span><span className="dot" style={{ background: dial.base }} />{dial.name.split(' ')[0]} dial</span>
    </div>
  )
}

const strapColor = (id) => {
  const c = byId(STRAPS, id).color
  return c === 'rainbow' ? 'linear-gradient(135deg,#ff5fa2,#7b5cff,#2fd4c8)' : c
}

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, cartSubtotal, addToCart } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [cartOpen, setCartOpen])

  const strapsInCart = new Set(cart.filter((i) => i.kind === 'strap').map((i) => i.strap))
  const suggestions = PRODUCTS.filter((p) => p.kind === 'strap' && !strapsInCart.has(p.strap)).slice(0, 2)

  return (
    <>
      <div className={`drawer-backdrop ${cartOpen ? 'show' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen} aria-label="Your cart">
        <div className="drawer-head">
          <h2 className="display">Your Cart</h2>
          <button className="icon-btn" aria-label="Close cart" onClick={() => setCartOpen(false)}><CloseIcon /></button>
        </div>
        {cart.length === 0 ? (
          <div className="drawer-empty">
            <p>Your cart is empty.</p>
            <button className="btn btn-primary" onClick={() => { setCartOpen(false); navigate('/products') }}>Browse watches</button>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.key} className="cart-item">
                  <div className="cart-thumb"><ProductVisual item={item} /></div>
                  <div className="cart-item-body">
                    <strong>{item.name}</strong>
                    <small>{item.subtitle}</small>
                    <span className="cart-price">{money(item.price)}</span>
                    <ItemMeta item={item} />
                    {item.extras?.engraving && <small className="muted">Engraving: “{item.extras.engraving}”</small>}
                    {item.extras?.giftBox && <small className="muted">Gift box included</small>}
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty">
                      <button aria-label="Decrease" onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button aria-label="Increase" onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                    </div>
                    <button className="icon-btn" aria-label="Remove" onClick={() => updateQty(item.key, 0)}><TrashIcon width={16} /></button>
                  </div>
                </li>
              ))}
            </ul>
            {suggestions.length > 0 && (
              <div className="cart-suggest">
                <p className="label">Add a matching strap</p>
                <div className="suggest-row">
                  {suggestions.map((p) => (
                    <button key={p.id} className="suggest" onClick={() => addToCart(cartItemFromProduct(p), { open: false })}>
                      <ProductVisual item={p} />
                      <span>{money(p.price)}</span>
                      <small>+ Add</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="drawer-foot">
              <div className="row"><span>Shipping & Delivery</span><span>from $0</span></div>
              <div className="row"><span>Subtotal</span><span>{money(cartSubtotal)}</span></div>
              <div className="row total"><span>Total</span><span>{money(cartSubtotal)}</span></div>
              <button className="btn btn-primary btn-block" onClick={() => { setCartOpen(false); navigate('/checkout') }}>
                Go To Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
