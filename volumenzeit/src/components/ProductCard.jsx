import { Link } from 'react-router-dom'
import ProductVisual from './ProductVisual'
import { CartIcon } from './Icons'
import { money } from '../data'
import { useStore } from '../store'

export const cartItemFromProduct = (p) => ({
  productId: p.id,
  kind: p.kind,
  name: p.name,
  subtitle: p.subtitle,
  price: p.price,
  config: p.config,
  strap: p.strap,
})

export default function ProductCard({ product, showSubtitle = true, overlay = true }) {
  const { addToCart } = useStore()
  return (
    <article className="product-card">
      <div className="product-media">
        <Link to={`/products/${product.id}`} aria-label={product.name}>
          <ProductVisual item={product} />
        </Link>
        {overlay && (
          <button className="product-overlay" onClick={() => addToCart(cartItemFromProduct(product))}>
            <CartIcon width={34} height={34} />
            <span>Order {product.kind === 'strap' ? 'Strap' : 'Watch'}</span>
          </button>
        )}
      </div>
      <Link to={`/products/${product.id}`} className="product-info">
        <h3>{product.name}</h3>
        {showSubtitle && <p>{product.subtitle}</p>}
        <strong>{money(product.price)}</strong>
      </Link>
    </article>
  )
}
