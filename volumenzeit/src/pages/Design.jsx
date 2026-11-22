import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Watch from '../components/Watch'
import { ArrowLeft, ArIcon, BoxIcon, MoneyIcon, ShieldIcon } from '../components/Icons'
import { ArModal } from './ProductDetail'
import {
  byId, CASE_COLORS, configPrice, configSpecs, DIAL_COLORS, DIAL_DESIGNS, GIFT_BOX_PRICE, money, STRAPS,
} from '../data'
import { useStore } from '../store'

const VIEWS = ['full', 'dial', 'strap']
const pick = (list, id) => (list.some((x) => x.id === id) ? id : list[0].id)

function Swatch({ active, title, style, onClick, children }) {
  return (
    <button type="button" className={`swatch big ${active ? 'on' : ''}`} title={title} aria-label={title} aria-pressed={active} style={style} onClick={onClick}>
      {children}
      <span className="tip">{title}</span>
    </button>
  )
}

const strapBg = (s) =>
  s.color === 'rainbow'
    ? 'linear-gradient(135deg,#ff5fa2,#7b5cff,#2fd4c8,#f6c945)'
    : s.type === 'steel'
      ? `repeating-linear-gradient(90deg, ${s.color} 0 6px, rgba(255,255,255,.35) 6px 7px)`
      : s.type === 'milanese'
        ? `repeating-linear-gradient(0deg, ${s.color} 0 2px, rgba(255,255,255,.3) 2px 3px)`
        : s.color

export default function Design() {
  const [params] = useSearchParams()
  const { addToCart } = useStore()
  const [config, setConfig] = useState(() => ({
    caseColor: pick(CASE_COLORS, params.get('caseColor')),
    dialDesign: pick(DIAL_DESIGNS, params.get('dialDesign')),
    dialColor: pick(DIAL_COLORS, params.get('dialColor')),
    strap: pick(STRAPS, params.get('strap') ?? 'leather-blue'),
  }))
  const [view, setView] = useState(0)
  const [giftBox, setGiftBox] = useState(true)
  const [engrave, setEngrave] = useState(false)
  const [engraving, setEngraving] = useState('')
  const [ar, setAr] = useState(false)
  const groups = useRef([])
  const step = Number(params.get('step'))

  useEffect(() => {
    const el = groups.current[step - 1]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('pulse')
      const t = setTimeout(() => el.classList.remove('pulse'), 1600)
      return () => clearTimeout(t)
    }
  }, [step])

  const set = (key) => (id) => setConfig((c) => ({ ...c, [key]: id }))
  const price = configPrice(config) + (giftBox ? GIFT_BOX_PRICE : 0)
  const name = `Custom ${byId(DIAL_DESIGNS, config.dialDesign).name}`

  const order = () => {
    addToCart({
      kind: 'watch',
      name,
      subtitle: `${byId(CASE_COLORS, config.caseColor).name} · ${byId(DIAL_COLORS, config.dialColor).name}`,
      price,
      config,
      extras: { giftBox, engraving: engrave ? engraving.trim() : '' },
    })
  }

  return (
    <>
      <section className="container builder">
        <div className="builder-left">
          <h1 className="builder-title">Build your Watch</h1>
          <div className="builder-stage">
            <Watch config={config} view={VIEWS[view]} live className="builder-watch" />
          </div>
          <div className="builder-thumbs">
            {VIEWS.map((v, i) => (
              <button key={v} className={view === i ? 'on' : ''} onClick={() => setView(i)} aria-label={`${v} view`}>
                <Watch config={config} view={v} />
              </button>
            ))}
          </div>
          <div className="builder-arrows">
            <button aria-label="Previous view" onClick={() => setView((view + 2) % 3)}>‹</button>
            <button aria-label="Next view" onClick={() => setView((view + 1) % 3)}>›</button>
          </div>
          <h3>About The Product</h3>
          <p className="muted">
            Your watch is assembled to order in our workshop. The volumetric dial is milled from a solid aluminium block, anodized in the
            color you choose and set under a domed sapphire crystal. The 316L stainless steel case is chamfered, brushed and mirror-polished by
            hand, then fitted with a Swiss RONDA quartz movement. Straps use quick-release pins, so you can change your style in seconds.
          </p>
        </div>

        <div className="builder-right">
          <Link to="/" className="btn btn-outline back-btn"><ArrowLeft width={22} /> Back To Home</Link>
          <div className="builder-panel">
            <div className="opt-group" ref={(el) => (groups.current[0] = el)}>
              <p className="f-label">1. Case Color</p>
              <div className="swatches">
                {CASE_COLORS.map((c) => (
                  <Swatch key={c.id} title={c.name} active={config.caseColor === c.id} onClick={() => set('caseColor')(c.id)}
                    style={{ background: `linear-gradient(135deg, ${c.light}, ${c.dark})` }} />
                ))}
              </div>
            </div>
            <div className="opt-group" ref={(el) => (groups.current[1] = el)}>
              <p className="f-label">2. Dial Design</p>
              <div className="swatches">
                {DIAL_DESIGNS.map((d) => (
                  <Swatch key={d.id} title={`${d.name}${d.price ? ` (+${money(d.price)})` : ''}`} active={config.dialDesign === d.id} onClick={() => set('dialDesign')(d.id)}>
                    <Watch config={{ ...config, dialDesign: d.id }} view="dial" />
                  </Swatch>
                ))}
              </div>
            </div>
            <div className="opt-group" ref={(el) => (groups.current[2] = el)}>
              <p className="f-label">3. Dial Color</p>
              <div className="swatches">
                {DIAL_COLORS.map((d) => (
                  <Swatch key={d.id} title={`${d.name}${d.price ? ` (+${money(d.price)})` : ''}`} active={config.dialColor === d.id} onClick={() => set('dialColor')(d.id)}
                    style={{ background: `linear-gradient(135deg, ${d.light}, ${d.base} 50%, ${d.dark})` }} />
                ))}
              </div>
            </div>
            <div className="opt-group" ref={(el) => (groups.current[3] = el)}>
              <p className="f-label">4. Strap Design</p>
              <div className="swatches wrap">
                {STRAPS.map((s) => (
                  <Swatch key={s.id} title={`${s.name}${s.price ? ` (+${money(s.price)})` : ''}`} active={config.strap === s.id} onClick={() => set('strap')(s.id)}
                    style={{ background: strapBg(s) }} />
                ))}
              </div>
            </div>
            <div className="opt-group">
              <label className="check"><input type="checkbox" checked={giftBox} onChange={(e) => setGiftBox(e.target.checked)} />Gift Box (+{money(GIFT_BOX_PRICE)})</label>
              <label className="check"><input type="checkbox" checked={engrave} onChange={(e) => setEngrave(e.target.checked)} />Free Engraving</label>
              {engrave && (
                <input className="input" maxLength={20} placeholder="Engraving text (max 20)" value={engraving} onChange={(e) => setEngraving(e.target.value)} />
              )}
            </div>
            <div className="order-row">
              <span className="price">{money(price)}</span>
              <button className="btn btn-primary" onClick={order} disabled={engrave && !engraving.trim()}>Place an Order</button>
            </div>
            <button className="btn btn-outline btn-block" onClick={() => setAr(true)}><ArIcon /> Try on in AR Online</button>
          </div>
          <div className="builder-panel">
            <h3>Specifications</h3>
            <dl className="spec-table">
              {configSpecs(config).map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
            </dl>
          </div>
        </div>
      </section>
      <section className="perks">
        <div className="container perks-grid">
          <div><BoxIcon width={34} height={34} /><div><h4>72h Delivery Time</h4><p>We have delivery time up to 72 hours anywhere in the USA and EU</p></div></div>
          <div><MoneyIcon width={34} height={34} /><div><h4>Money Back</h4><p>If the product is damaged or something is missing</p></div></div>
          <div><ShieldIcon width={34} height={34} /><div><h4>Warranty</h4><p>We offer 2 years warranty on every watch ordered on our site</p></div></div>
        </div>
      </section>
      <ArModal open={ar} onClose={() => setAr(false)} />
    </>
  )
}
