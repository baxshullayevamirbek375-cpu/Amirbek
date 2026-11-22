import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'

export default function Newsletter() {
  const { subscribe, notify } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    subscribe(email)
    setDone(true)
    notify(`Thanks ${name.split(' ')[0]}! You're on the list.`)
  }

  return (
    <section className="newsletter hex-bg">
      <div className="container narrow center">
        <h2 className="newsletter-title">Don't Miss Your Chance To Get Free Giveaway<br />Sign Up To Our Newsletter</h2>
        <p className="newsletter-text">We will inform you about coming Giveaways, Offers, Online Store preparation progress and start of sales</p>
        {done ? (
          <p className="newsletter-done">You're subscribed with <b>{email}</b>. Watch your inbox!</p>
        ) : (
          <form className="newsletter-form" onSubmit={submit}>
            <input aria-label="Name" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
            <input aria-label="Email" placeholder="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn btn-dark">Sign Up</button>
          </form>
        )}
        <p className="newsletter-terms">You agree to our <Link to="/delivery">Terms and Conditions</Link></p>
      </div>
    </section>
  )
}
