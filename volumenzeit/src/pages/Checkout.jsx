import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual'
import Modal from '../components/Modal'
import { ItemMeta } from '../components/CartDrawer'
import { BoxIcon, CheckIcon, ChevronDown } from '../components/Icons'
import { COUNTRIES, COUPONS, money, SHIPPING } from '../data'
import { useStore } from '../store'

const digits = (s) => s.replace(/\D/g, '')

function Section({ n, title, open, done, onOpen, children }) {
  return (
    <section className={`co-section ${open ? 'open' : ''}`}>
      <button type="button" className="co-head" onClick={onOpen} disabled={!done && !open}>
        <span>{done && !open ? <CheckIcon width={16} /> : n}. {title}</span>
        <ChevronDown style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && <div className="co-body">{children}</div>}
    </section>
  )
}

export function ThanksModal({ order, onClose }) {
  return (
    <Modal open={!!order} onClose={onClose} label="Thanks for ordering" className="thanks">
      <h2 className="display">Thanks For Ordering</h2>
      <p className="muted">Your order <b>{order?.id}</b> has been placed. We'll send updates to <b>{order?.customer.email}</b>.</p>
      <Link to="/" className="btn btn-primary" onClick={onClose}>Return to Homepage</Link>
      <svg viewBox="0 0 400 160" className="thanks-art" aria-hidden="true">
        {Array.from({ length: 40 }, (_, i) => (
          <rect key={i} x={(i * 97) % 400} y={(i * 53) % 90} width="6" height="12" rx="2"
            fill={['#6c5dff', '#111', '#ff5fa2', '#2fd4c8'][i % 4]} transform={`rotate(${i * 37} ${(i * 97) % 400} ${(i * 53) % 90})`} />
        ))}
        {[60, 140, 220, 300].map((x, i) => (
          <g key={x} transform={`translate(${x} 160) rotate(${(i - 1.5) * 12})`}>
            <path d="M-18 0 V-70 a18 18 0 0 1 36 0 V0" fill="#fff" stroke="#111" strokeWidth="3" />
            <rect x="-14" y="-52" width="28" height="12" rx="3" fill="#6c5dff" />
            <path d="M-18 -70 l-8 -30 M-6 -88 v-34 M6 -88 v-38 M18 -70 l6 -32" stroke="#111" strokeWidth="6" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </Modal>
  )
}

export default function Checkout() {
  const { cart, cartSubtotal, user, placeOrder } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [maxStep, setMaxStep] = useState(1)
  const [info, setInfo] = useState(() => ({
    email: user?.email ?? '', firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', phone: user?.phone ?? '',
    address1: '', address2: '', city: '', zip: '', country: '',
  }))
  const [shipping, setShipping] = useState('standard')
  const [method, setMethod] = useState('card')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' })
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)

  if (cart.length === 0 && !order) {
    return (
      <>
        <section className="page-banner center"><h1 className="display">Checkout</h1></section>
        <div className="container empty-state">
          <BoxIcon width={48} height={48} />
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary">Browse watches</Link>
        </div>
        <ThanksModal order={order} onClose={() => navigate('/')} />
      </>
    )
  }

  const ship = SHIPPING.find((s) => s.id === shipping)
  const discount = coupon ? Math.round(cartSubtotal * COUPONS[coupon] * 100) / 100 : 0
  const total = cartSubtotal - discount + ship.price
  const field = (key) => ({ value: info[key], onChange: (e) => { setInfo({ ...info, [key]: e.target.value }); setMaxStep(1) } })
  const go = (n) => {
    setStep(n)
    setMaxStep((m) => Math.max(m, n))
    setError('')
  }

  const applyCoupon = (e) => {
    e.preventDefault()
    const code = couponInput.trim().toUpperCase()
    if (COUPONS[code]) {
      setCoupon(code)
      setCouponError('')
    } else {
      setCoupon(null)
      setCouponError('Invalid coupon code')
    }
  }

  const pay = (e) => {
    e.preventDefault()
    if (method === 'card') {
      const [mm, yy] = card.expiry.split('/').map((x) => Number(x))
      if (digits(card.number).length < 13) return setError('Enter a valid card number')
      if (!mm || mm > 12 || yy === undefined || isNaN(yy)) return setError('Expiry date must be MM/YY')
      const now = new Date()
      if (2000 + yy < now.getFullYear() || (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1)) return setError('This card has expired')
      if (!/^\d{3,4}$/.test(card.cvc)) return setError('CVC must be 3 or 4 digits')
    }
    const placed = placeOrder({
      items: cart,
      customer: info,
      shipping: ship,
      payment: method === 'card' ? `Card •••• ${digits(card.number).slice(-4)}` : 'PayPal',
      coupon,
      subtotal: cartSubtotal,
      discount,
      total,
    })
    setOrder(placed)
  }

  return (
    <>
      <section className="page-banner center"><h1 className="display">Checkout</h1></section>
      <div className="container checkout">
        <div className="co-forms">
          <Section n={1} title="Basic Info" open={step === 1} done={maxStep > 1} onOpen={() => go(1)}>
            <form className="form-grid" onSubmit={(e) => { e.preventDefault(); go(2) }}>
              <input className="input span2" type="email" placeholder="Email" required {...field('email')} />
              <input className="input span2" placeholder="First Name" required {...field('firstName')} />
              <input className="input span2" placeholder="Last Name" required {...field('lastName')} />
              <input className="input span2" type="tel" placeholder="Phone Number" required pattern="[0-9+()\s-]{7,}" {...field('phone')} />
              <input className="input span2" placeholder="Address 1" required {...field('address1')} />
              <input className="input span2" placeholder="Address 2" {...field('address2')} />
              <input className="input" placeholder="City" required {...field('city')} />
              <input className="input" placeholder="Zip Code" required {...field('zip')} />
              <select className="input span2" required {...field('country')}>
                <option value="">Country</option>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <button className="btn btn-primary span2">Continue</button>
            </form>
          </Section>

          <Section n={2} title="Shipping" open={step === 2} done={maxStep > 2} onOpen={() => go(2)}>
            {SHIPPING.map((s) => (
              <label key={s.id} className={`ship-option ${shipping === s.id ? 'on' : ''}`}>
                <input type="radio" name="ship" checked={shipping === s.id} onChange={() => setShipping(s.id)} />
                <span><b>{s.name}</b><small>{s.note}</small></span>
                <strong>{s.price ? money(s.price) : 'Free'}</strong>
              </label>
            ))}
            <button className="btn btn-primary btn-block" onClick={() => go(3)}>Continue</button>
          </Section>

          <Section n={3} title="Payment" open={step === 3} done={false} onOpen={() => go(3)}>
            <form onSubmit={pay} className="form-grid">
              <label className="check span2"><input type="radio" name="pm" checked={method === 'card'} onChange={() => setMethod('card')} />Credit Card
                <span className="cards">{['VISA', 'MC', 'AMEX', 'UPAY', 'HUMO'].map((c) => <i key={c}>{c}</i>)}</span>
              </label>
              <label className="check span2"><input type="radio" name="pm" checked={method === 'paypal'} onChange={() => setMethod('paypal')} />PayPal</label>
              {method === 'card' ? (
                <>
                  <input className="input span2" inputMode="numeric" placeholder="Card Number" autoComplete="cc-number"
                    value={card.number} onChange={(e) => setCard({ ...card, number: digits(e.target.value).slice(0, 19).replace(/(.{4})/g, '$1 ').trim() })} />
                  <input className="input" placeholder="Expiry Date (MM/YY)" autoComplete="cc-exp" value={card.expiry}
                    onChange={(e) => { const d = digits(e.target.value).slice(0, 4); setCard({ ...card, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }) }} />
                  <input className="input" placeholder="CVC / CVV" inputMode="numeric" autoComplete="cc-csc" value={card.cvc}
                    onChange={(e) => setCard({ ...card, cvc: digits(e.target.value).slice(0, 4) })} />
                </>
              ) : (
                <p className="muted span2">You will confirm the payment in PayPal after placing the order.</p>
              )}
              <p className="muted small span2">Demo store: no real payment is processed.</p>
              {error && <p className="form-error span2">{error}</p>}
              <button className="btn btn-primary span2">Complete Payment</button>
              <p className="muted small span2">By placing your order you agree to our <Link to="/delivery">Terms and Conditions</Link>.</p>
            </form>
          </Section>
        </div>

        <aside className="co-summary">
          <div className="summary-card">
            {cart.map((item) => (
              <div key={item.key} className="summary-item">
                <div className="cart-thumb"><ProductVisual item={item} /></div>
                <div>
                  <strong>{item.name}{item.qty > 1 && ` × ${item.qty}`}</strong>
                  <small>{item.subtitle}</small>
                  <span className="cart-price">{money(item.price * item.qty)}</span>
                  <ItemMeta item={item} />
                </div>
              </div>
            ))}
            <div className="summary-row"><span>Shipping</span><span>{ship.price ? money(ship.price) : 'Free'}</span></div>
            {coupon && <div className="summary-row"><span>Coupon {coupon}</span><span>−{money(discount)}</span></div>}
            <div className="summary-total"><span>{money(total)}</span><small>Total cost</small></div>
          </div>
          <form className="coupon" onSubmit={applyCoupon}>
            <label className="f-label" htmlFor="coupon">Apply Coupon</label>
            <div className="coupon-row">
              <input id="coupon" className="input" placeholder="Coupon Code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
              <button className="btn btn-dark">Apply</button>
            </div>
            {couponError && <p className="form-error">{couponError}</p>}
            {coupon && <p className="form-ok">Coupon applied: −{COUPONS[coupon] * 100}%</p>}
            <p className="muted small">Try <b>VOLUME10</b> for 10% off.</p>
          </form>
        </aside>
      </div>
      <ThanksModal order={order} onClose={() => navigate('/')} />
    </>
  )
}
