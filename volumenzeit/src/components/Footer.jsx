import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Logo size="lg" />
        <nav className="footer-links" aria-label="Footer">
          <Link to="/products">Watches</Link>
          <Link to="/design">Design your watch</Link>
          <Link to="/delivery">Delivery</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/account">Account</Link>
        </nav>
      </div>
      <div className="footer-copy">© Copyright {new Date().getFullYear()} volumenzeit – All rights reserved.</div>
    </footer>
  )
}
