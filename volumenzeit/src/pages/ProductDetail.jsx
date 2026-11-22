import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual'
import Modal from '../components/Modal'
import { ArIcon } from '../components/Icons'
import { cartItemFromProduct } from '../components/ProductCard'
import { byId, configSpecs, img, money, PHOTOS, PRODUCTS, STRAPS } from '../data'
import { useStore } from '../store'
import NotFound from './NotFound'

export function ArModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} label="Try on in AR">
      <div className="center ar-modal">
        <ArIcon width={56} height={56} />
        <h3 className="display">Try on in AR</h3>
        <p>Scan this code with your phone camera to see the watch on your wrist. AR try-on is launching together with our online store.</p>
        <div className="fake-qr" aria-hidden="true">
          {Array.from({ length: 81 }, (_, i) => <span key={i} className={(i * 7 + (i % 5)) % 3 === 0 ? 'on' : ''} />)}
        </div>
        <button className="btn btn-primary" onClick={onClose}>Got it</button>
      </div>
    </Modal>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const product = PRODUCTS.find((p) => p.id === id)
  const { addToCart } = useStore()
  const [ar, setAr] = useState(false)
  const [zoom, setZoom] = useState(null)
  if (!product) return <NotFound />

  const isWatch = product.kind === 'watch'
  const specs = isWatch
    ? configSpecs(product.config)
    : [['Type', byId(STRAPS, product.strap).type], ['Width', '22mm'], ['Release', 'Quick release pins'], ['Fits', 'All Volumenzeit 42mm cases']]
  const photos = isWatch ? PHOTOS.lifestyle.slice(0, 5) : PHOTOS.lifestyle.slice(3, 5)
  const designLink = isWatch ? `/design?${new URLSearchParams(product.config)}` : '/design'

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1 className="display">Products</h1>
          <p><Link to="/products">Products</Link> / {product.name}</p>
        </div>
      </section>
      <section className="container detail">
        <div className="gallery">
          <button className="gallery-item tile-visual" onClick={() => setZoom('visual')} aria-label="Zoom product">
            <ProductVisual item={product} live />
          </button>
          {photos.map((p) => (
            <button key={p} className="gallery-item" onClick={() => setZoom(p)} aria-label="Zoom photo">
              <img src={img(p, 600, 600)} alt="Volumenzeit lifestyle" loading="lazy" />
            </button>
          ))}
        </div>
        <div className="detail-info">
          <h2>{product.name}</h2>
          <p className="muted">{product.subtitle}</p>
          <p className="detail-desc">
            {isWatch
              ? 'A volumetric 3D dial framed by a 42mm anodized steel case. Sapphire crystal, Swiss movement and quick-release straps make it an everyday watch that never looks the same twice.'
              : 'Swap your look in seconds. Quick-release pins fit every Volumenzeit case without tools.'}
          </p>
          <dl className="spec-table">
            {specs.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <div className="order-row">
            <button className="btn btn-primary" onClick={() => addToCart(cartItemFromProduct(product))}>Place an Order</button>
            <span className="price">{money(product.price)}</span>
          </div>
          <button className="btn btn-outline btn-block" onClick={() => setAr(true)}><ArIcon /> Try on in AR Online</button>
          <Link to={designLink} className="btn btn-primary btn-block">Design Your Watch</Link>
        </div>
      </section>
      <ArModal open={ar} onClose={() => setAr(false)} />
      <Modal open={!!zoom} onClose={() => setZoom(null)} className="modal-zoom" label="Photo">
        {zoom === 'visual' ? <ProductVisual item={product} className="zoom-svg" live /> : zoom && <img src={img(zoom, 1200)} alt="Volumenzeit lifestyle" />}
      </Modal>
    </>
  )
}
