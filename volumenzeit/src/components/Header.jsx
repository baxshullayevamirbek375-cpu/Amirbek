import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { CartIcon, CloseIcon, MenuIcon, UserIcon } from './Icons'
import { useStore } from '../store'

const NAV = [
  { to: '/products', label: 'Watches', end: true },
  { to: '/products?type=strap', label: 'Accessories' },
  { to: '/#about', label: 'Brand' },
  { to: '/delivery', label: 'Delivery' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const { cartCount, setCartOpen, user, logout, notify } = useStore()
  const [menu, setMenu] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    setMenu(false)
    setUserOpen(false)
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setUserOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const isActive = (item) => {
    const [path, query] = item.to.split('?')
    if (path.startsWith('/#')) return false
    if (path !== location.pathname && !(path === '/products' && location.pathname.startsWith('/products/'))) return false
    const type = new URLSearchParams(location.search).get('type')
    if (path === '/products') return query ? type === 'strap' : type !== 'strap'
    return true
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className={`main-nav ${menu ? 'open' : ''}`} aria-label="Main">
          {NAV.map((item) => (
            <NavLink key={item.label} to={item.to} className={() => (isActive(item) ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
          <Link to="/design" className="btn btn-primary nav-cta">Design your watch</Link>
        </nav>
        <div className="header-actions">
          <div className="user-menu" ref={ref}>
            <button className="icon-btn" aria-label="Account menu" aria-expanded={userOpen} onClick={() => setUserOpen((o) => !o)}>
              <UserIcon />
            </button>
            {userOpen && (
              <div className="dropdown">
                {user ? (
                  <>
                    <p className="dropdown-hello">Hi, {user.firstName}</p>
                    <Link to="/account" className="btn btn-dark btn-block">My Account</Link>
                    <button
                      className="btn btn-outline btn-block"
                      onClick={() => {
                        logout()
                        notify('You have been logged out')
                        navigate('/')
                      }}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-dark btn-block">Login</Link>
                    <Link to="/register" className="btn btn-outline btn-block">Sign Up</Link>
                  </>
                )}
              </div>
            )}
          </div>
          <button className="icon-btn cart-btn" aria-label={`Cart, ${cartCount} items`} onClick={() => setCartOpen(true)}>
            <CartIcon />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
          <button className="icon-btn burger" aria-label="Menu" onClick={() => setMenu((m) => !m)}>
            {menu ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
