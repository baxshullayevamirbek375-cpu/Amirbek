import Watch, { StrapOnly } from './Watch'

export default function ProductVisual({ item, className = 'product-svg', view, live }) {
  if (item.kind === 'strap') return <StrapOnly strapId={item.strap} className={className} />
  return <Watch config={item.config} className={className} view={view} live={live} />
}
