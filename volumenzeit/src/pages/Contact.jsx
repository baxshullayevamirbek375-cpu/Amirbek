import { useState } from 'react'
import { PlaneIcon } from '../components/Icons'
import { img, PHOTOS } from '../data'
import { useStore } from '../store'

export function ContactForm() {
  const { sendMessage, notify, user } = useStore()
  const empty = { name: user ? `${user.firstName} ${user.lastName}` : '', email: user?.email ?? '', message: '' }
  const [f, setF] = useState(empty)
  const submit = (e) => {
    e.preventDefault()
    sendMessage(f)
    notify('Message sent! We will reply within 24 hours.')
    setF({ ...empty, message: '' })
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <input className="input" placeholder="Full Name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <input className="input" type="email" placeholder="Email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <textarea className="input" placeholder="Message" rows={5} required value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      <button className="btn btn-primary">Send Message</button>
    </form>
  )
}

export default function Contact() {
  return (
    <section className="contact">
      <div className="contact-copy">
        <h1 className="display">Contact Us</h1>
        <p className="muted">Questions about sizing, delivery or a custom design? Write to us — a real watchmaker answers every message.</p>
        <ContactForm />
      </div>
      <div className="contact-photo">
        <img src={img(PHOTOS.contact, 1000)} alt="Smiling customer" />
        <span className="plane"><PlaneIcon width={26} height={26} /></span>
      </div>
    </section>
  )
}
