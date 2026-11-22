import { Link } from 'react-router-dom'

const SECTIONS = [
  ['Delivery', [
    'Every Volumenzeit watch is assembled to order. Once your order is confirmed, our workshop builds and tests your watch, then hands it over to UPS together with a tracking number that we send to your email.',
    'We ship to the USA, the European Union, the United Kingdom, Central Asia and the Middle East. Duties and import taxes outside the EU are paid by the recipient unless stated otherwise at checkout.',
  ]],
  ['Delivery Time', [
    'UPS Express: 1–3 working days after assembly. UPS Standard: 5–10 working days after assembly. Assembly of a custom watch takes up to 72 hours.',
    'Orders placed on weekends or public holidays are processed on the next working day. During giveaways and launches, processing can take up to 2 extra days — we will always tell you in advance.',
  ]],
  ['Delivery Damage', [
    'All parcels are insured for their full value. If your parcel arrives damaged, please keep the packaging, take photos and contact us within 7 days of delivery.',
    'We will send you a replacement or refund the full amount, including shipping costs, as soon as the claim is confirmed by the carrier.',
  ]],
  ['Returns & Warranty', [
    'You can return an unworn watch within 30 days. Engraved watches can be returned only if they are faulty.',
    'Every watch comes with a 2-year warranty covering the movement, case and crystal against manufacturing defects.',
  ]],
]

export default function Delivery() {
  return (
    <section className="legal">
      <h1 className="display center">Delivery</h1>
      <div className="legal-band hex-bg" />
      <article className="legal-card">
        {SECTIONS.map(([title, paras]) => (
          <div key={title}>
            <h2>{title}</h2>
            {paras.map((p) => <p key={p}>{p}</p>)}
          </div>
        ))}
      </article>
      <div className="legal-cta hex-bg">
        <h2>Can't Find The Answer?</h2>
        <p>Get in touch with our professional team and we will get your answer in less than 24h</p>
        <Link to="/contact" className="btn btn-dark">Contact Us</Link>
      </div>
    </section>
  )
}
