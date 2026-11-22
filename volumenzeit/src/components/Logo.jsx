import { Link } from 'react-router-dom'

export default function Logo({ size = 'md' }) {
  return (
    <Link to="/" className={`logo logo-${size}`} aria-label="Volumenzeit home">
      <span className="logo-name">Volumenzeit</span>
      <span className="logo-tag">Volumetric wrist watches</span>
    </Link>
  )
}
