import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { CASE_COLORS, PRODUCTS, STRAP_FILTER_COLORS } from '../data'

const PER_PAGE = 9
const EMPTY = { q: '', watch: true, strap: true, min: '', max: '', cases: [], straps: [] }

const filtersFromParams = (params) => {
  const type = params.get('type')
  return { ...EMPTY, q: params.get('q') ?? '', watch: type !== 'strap', strap: type !== 'watch' }
}

function applyFilters(list, f) {
  const q = f.q.trim().toLowerCase()
  return list.filter((p) => {
    if (p.kind === 'watch' && !f.watch) return false
    if (p.kind === 'strap' && !f.strap) return false
    if (q && !`${p.name} ${p.subtitle}`.toLowerCase().includes(q)) return false
    if (f.min !== '' && p.price < Number(f.min)) return false
    if (f.max !== '' && p.price > Number(f.max)) return false
    if (f.cases.length && (p.kind !== 'watch' || !f.cases.includes(p.config.caseColor))) return false
    if (f.straps.length) {
      const strapId = p.kind === 'watch' ? p.config.strap : p.strap
      if (!f.straps.some((c) => STRAP_FILTER_COLORS.find((s) => s.id === c).match.includes(strapId))) return false
    }
    return true
  })
}

const SORTS = {
  featured: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
}

export default function Products() {
  const [params, setParams] = useSearchParams()
  const paramsKey = params.toString()
  const [draft, setDraft] = useState(() => filtersFromParams(params))
  const [applied, setApplied] = useState(() => filtersFromParams(params))
  const [lastKey, setLastKey] = useState(paramsKey)
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)

  if (lastKey !== paramsKey) {
    setLastKey(paramsKey)
    setDraft(filtersFromParams(params))
    setApplied(filtersFromParams(params))
    setPage(1)
  }

  const results = useMemo(() => [...applyFilters(PRODUCTS, applied)].sort(SORTS[sort]), [applied, sort])
  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const current = results.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggle = (key, id) => setDraft((d) => ({ ...d, [key]: d[key].includes(id) ? d[key].filter((x) => x !== id) : [...d[key], id] }))
  const apply = (e) => {
    e.preventDefault()
    setApplied(draft)
    setPage(1)
  }
  const reset = () => {
    setParams({})
    setDraft(EMPTY)
    setApplied(EMPTY)
    setPage(1)
  }

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1 className="display">Products</h1>
          <p>{results.length} Total Products</p>
        </div>
      </section>
      <section className="container products-layout">
        <form className="filters" onSubmit={apply}>
          <label className="f-label" htmlFor="search">Search</label>
          <input id="search" className="input" placeholder="Type Here" value={draft.q} onChange={(e) => setDraft({ ...draft, q: e.target.value })} />

          <p className="f-label">Select Products</p>
          <label className="check"><input type="checkbox" checked={draft.watch} onChange={(e) => setDraft({ ...draft, watch: e.target.checked })} />Watches</label>
          <label className="check"><input type="checkbox" checked={draft.strap} onChange={(e) => setDraft({ ...draft, strap: e.target.checked })} />Straps</label>

          <p className="f-label">Price Range</p>
          <div className="price-range">
            <input className="input" type="number" min="0" placeholder="$0" aria-label="Minimum price" value={draft.min} onChange={(e) => setDraft({ ...draft, min: e.target.value })} />
            <span>to</span>
            <input className="input" type="number" min="0" placeholder="$50k" aria-label="Maximum price" value={draft.max} onChange={(e) => setDraft({ ...draft, max: e.target.value })} />
          </div>

          <p className="f-label">Case Color</p>
          <div className="swatches">
            {CASE_COLORS.map((c) => (
              <button
                type="button"
                key={c.id}
                title={c.name}
                aria-pressed={draft.cases.includes(c.id)}
                className={`swatch ${draft.cases.includes(c.id) ? 'on' : ''}`}
                style={{ background: `linear-gradient(135deg, ${c.light}, ${c.dark})` }}
                onClick={() => toggle('cases', c.id)}
              />
            ))}
          </div>

          <p className="f-label">Filter By Strap Colors</p>
          <div className="swatches">
            {STRAP_FILTER_COLORS.map((c) => (
              <button
                type="button"
                key={c.id}
                title={c.id}
                aria-pressed={draft.straps.includes(c.id)}
                className={`swatch ${draft.straps.includes(c.id) ? 'on' : ''}`}
                style={{ background: c.color }}
                onClick={() => toggle('straps', c.id)}
              />
            ))}
          </div>
          <button className="btn btn-primary btn-block">Apply Filters</button>
          <button type="button" className="link-btn" onClick={reset}>Reset filters</button>
        </form>

        <div className="products-main">
          <div className="products-toolbar">
            <select className="input sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
              <option value="featured">Sort By: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
          {current.length === 0 ? (
            <div className="empty-state">
              <p>No products match these filters.</p>
              <button className="btn btn-outline" onClick={reset}>Reset filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {current.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="products-foot">
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page">‹</button>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} className={page === i + 1 ? 'on' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
              <button disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Next page">›</button>
            </div>
            <Link to="/design" className="btn btn-primary btn-wide">Design Your Watch</Link>
          </div>
        </div>
      </section>
    </>
  )
}
