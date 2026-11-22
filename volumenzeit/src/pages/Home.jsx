import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Watch from '../components/Watch'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import Modal from '../components/Modal'
import { ArrowLeft, ArrowRight, PlayIcon, Social } from '../components/Icons'
import { CASE_COLORS, DIAL_COLORS, DIAL_DESIGNS, img, PHOTOS, PRODUCTS, STRAPS } from '../data'

const STEPS = ['Case Color', 'Dial Design', 'Dial Color', 'Strap Design']

function Showreel() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => n + 1), 1400)
    return () => clearInterval(t)
  }, [])
  const config = {
    caseColor: CASE_COLORS[i % 3].id,
    dialDesign: DIAL_DESIGNS[Math.floor(i / 2) % 4].id,
    dialColor: DIAL_COLORS[i % 4].id,
    strap: STRAPS[(i * 5) % STRAPS.length].id,
  }
  return (
    <div className="showreel">
      <Watch config={config} live className="showreel-watch" />
      <div>
        <h3 className="display">48 style combinations</h3>
        <p>4 dial types · 4 dial colors · 3 case colors · 12 straps. Every Volumenzeit dial is a real 3D relief, milled and anodized by hand.</p>
        <Link to="/design" className="btn btn-primary">Design Your Watch</Link>
      </div>
    </div>
  )
}

export default function Home() {
  const rail = useRef(null)
  const [video, setVideo] = useState(false)
  const watches = PRODUCTS.filter((p) => p.kind === 'watch')
  const scroll = (dir) => {
    const el = rail.current
    if (el) el.scrollBy({ left: dir * (el.firstElementChild?.offsetWidth ?? 240) * 1.1, behavior: 'smooth' })
  }

  return (
    <>
      <section className="hero">
        <aside className="hero-social" aria-label="Follow us">
          <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest"><Social.Pinterest width={12} /></a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Social.Facebook width={12} /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><Social.Twitter width={12} /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Social.Instagram width={12} /></a>
          <span className="vertical">Follow</span>
        </aside>
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1 className="display">Find Your<br />Dream Watch</h1>
            <p>Volumetric wrist watches with real 3D dials. Pick a case, a dial and a strap — we will assemble your one-of-a-kind watch by hand in 72 hours.</p>
            <Link to="/design" className="btn btn-primary btn-lg">Design Your Watch</Link>
          </div>
          <div className="hero-visual">
            <img src={img(PHOTOS.hero, 1100)} alt="Volumenzeit wrist watch close-up" />
          </div>
        </div>
      </section>

      <section className="features container" id="features">
        <h2 className="section-title center">Features</h2>
        <div className="features-grid">
          <div className="feature f-left-top">
            <h3>Individual Style</h3>
            <ul><li>48 style combinations</li><li>Color shifting dial colors</li><li>15 strap options</li><li>Custom strap engraving</li></ul>
          </div>
          <div className="feature f-left-bottom">
            <h3>High Quality Components</h3>
            <ul><li>Case: 316L Stainless steel</li><li>Coating: Color anodized anti-scratch</li><li>Glass: Sapphire Crystal</li><li>Straps: 22mm steel bracelet, Milanese mesh, leather</li></ul>
          </div>
          <div className="features-watch">
            <div className="rings"><span /><span /><span /></div>
            <Watch config={{ caseColor: 'black', dialDesign: 'cubes', dialColor: 'black', strap: 'steel-black' }} live />
          </div>
          <div className="feature f-right">
            <h3>Features</h3>
            <ul>
              <li>Case Size: 42mm</li><li>Case Color: Silver, Black, Blue, chamfered brush with mirror polish</li>
              <li>Dial Color: Black Metallic, Color shifting Blue-Purple, Green-Purple, Pink-Gold</li>
              <li>Water Resistance: 5 ATM / 50 meters</li><li>Straps: Quick Release</li><li>Movement: Swiss Parts RONDA 762E</li>
              <li>Instantaneous rate: -10 / +20 sec/month</li><li>Standard Battery life: 3 years</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="design-steps">
        <div className="container center">
          <h2 className="section-title light">Design Your Watch</h2>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s}>
                <Link to={`/design?step=${i + 1}`} className="step-circle">{i + 1}</Link>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <Link to="/design" className="btn btn-dark">Design Your Watch</Link>
        </div>
      </section>

      <section className="mission">
        <div className="mission-photo"><img src={img(PHOTOS.mission, 900)} alt="Woman wearing a Volumenzeit watch" /></div>
        <div className="mission-copy">
          <h2 className="section-title light">Our Mission</h2>
          <p>We have invested 6 years of our lives to invent a new technology of production of 3D dials with the quality of the wristwatch industry. All we needed was to turn our imagination on to the maximum.</p>
          <p>We love out-of-the-box designs and believe there are many people who think the same.</p>
          <Link to="/design" className="btn btn-primary">Design Your Watch</Link>
        </div>
      </section>

      <section className="watches container" id="watches">
        <h2 className="section-title">Watches</h2>
        <p className="section-lead">Volumenzeit gives you a total of 48 style combinations with 4 dial types, 4 dial colors, 3 case colors, multiple stylish strap combinations, and customized engraving options.</p>
        <div className="rail" ref={rail}>
          {watches.map((p) => (
            <ProductCard key={p.id} product={p} showSubtitle={false} overlay={false} />
          ))}
        </div>
        <div className="rail-controls">
          <div>
            <button className="arrow" aria-label="Previous" onClick={() => scroll(-1)}><ArrowLeft /></button>
            <button className="arrow" aria-label="Next" onClick={() => scroll(1)}><ArrowRight /></button>
          </div>
          <Link to="/design" className="btn btn-primary">Design Your Watch</Link>
        </div>
      </section>

      <section className="about container" id="about">
        <div className="about-copy">
          <h2 className="section-title">About Us</h2>
          <p>Volumenzeit was born in a small workshop where watchmakers, engineers and designers met with one idea: a dial should not be flat. Today every watch we ship carries a dial with real depth — cubes, towers, pyramids and blocks that catch the light differently every minute of the day.</p>
          <p>Each piece is assembled to order with Swiss parts, sapphire crystal and a 316L stainless steel case.</p>
        </div>
        <button className="about-video" onClick={() => setVideo(true)} aria-label="Play showreel">
          <img src={img(PHOTOS.about, 900)} alt="Volumenzeit watches" />
          <span className="play"><PlayIcon width={34} height={34} /></span>
        </button>
      </section>

      <Newsletter />

      <Modal open={video} onClose={() => setVideo(false)} className="modal-wide" label="Showreel">
        <Showreel />
      </Modal>
    </>
  )
}
