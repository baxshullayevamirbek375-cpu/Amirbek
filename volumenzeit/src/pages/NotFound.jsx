import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="notfound">
      <h1 className="display">Oops, Something<br />Went Wrong</h1>
      <div className="nf-art" aria-label="404">
        <span>4</span>
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <path d="M70 20 h60 l8 30 h-76z M70 180 h60 l8 -30 h-76z" fill="#fff" stroke="#111" strokeWidth="4" strokeLinejoin="round" />
          <circle cx="100" cy="100" r="62" fill="#fff" stroke="#111" strokeWidth="4" />
          <circle cx="100" cy="100" r="50" fill="#6c5dff" stroke="#111" strokeWidth="4" />
          <rect x="160" y="92" width="12" height="16" rx="3" fill="#fff" stroke="#111" strokeWidth="4" />
          <path d="M100 100 V62 M100 100 L126 112" stroke="#111" strokeWidth="5" strokeLinecap="round" className="nf-hands" />
          <circle cx="100" cy="100" r="5" fill="#111" />
        </svg>
        <span>4</span>
      </div>
      <Link to="/" className="btn btn-primary">Return to Homepage</Link>
    </section>
  )
}
