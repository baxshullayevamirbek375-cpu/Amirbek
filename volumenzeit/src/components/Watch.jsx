import { useEffect, useId, useMemo, useState } from 'react'
import { byId, CASE_COLORS, DIAL_COLORS, STRAPS } from '../data'

const CX = 100
const CY = 150
const DIAL_R = 58

function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function dialShapes(design, c) {
  const shapes = []
  const r = rng(design.length * 7919 + 13)
  if (design === 'cubes') {
    const s = 9
    const h = s * Math.sqrt(3)
    for (let row = -1; row < 16; row++) {
      for (let col = -1; col < 9; col++) {
        const x = CX - 70 + col * h + (row % 2 ? h / 2 : 0)
        const y = CY - 70 + row * s * 1.5
        const top = `${x},${y} ${x + h / 2},${y + s / 2} ${x},${y + s} ${x - h / 2},${y + s / 2}`
        const left = `${x - h / 2},${y + s / 2} ${x},${y + s} ${x},${y + 2 * s} ${x - h / 2},${y + 1.5 * s}`
        const right = `${x + h / 2},${y + s / 2} ${x},${y + s} ${x},${y + 2 * s} ${x + h / 2},${y + 1.5 * s}`
        shapes.push(['p', top, c.light], ['p', left, c.base], ['p', right, c.dark])
      }
    }
  } else if (design === 'towers') {
    shapes.push(['r', [CX - 70, CY - 70, 140, 140], c.dark])
    for (let i = 0; i < 26; i++) {
      const w = 6 + r() * 8
      const x = CX - 66 + r() * 120
      const y = CY - 66 + r() * 110
      const hgt = 14 + r() * 26
      const d = 3 + r() * 3
      shapes.push(['p', `${x},${y} ${x + d},${y - d} ${x + w + d},${y - d} ${x + w},${y}`, c.light])
      shapes.push(['p', `${x + w},${y} ${x + w + d},${y - d} ${x + w + d},${y + hgt - d} ${x + w},${y + hgt}`, c.dark])
      shapes.push(['r', [x, y, w, hgt], c.base])
    }
  } else if (design === 'pyramids') {
    const s = 14
    for (let y = CY - 70; y < CY + 70; y += s) {
      for (let x = CX - 70; x < CX + 70; x += s) {
        const mx = x + s / 2
        const my = y + s / 2
        shapes.push(['p', `${x},${y} ${x + s},${y} ${mx},${my}`, c.light])
        shapes.push(['p', `${x + s},${y} ${x + s},${y + s} ${mx},${my}`, c.base])
        shapes.push(['p', `${x},${y + s} ${x + s},${y + s} ${mx},${my}`, c.dark])
        shapes.push(['p', `${x},${y} ${x},${y + s} ${mx},${my}`, c.base])
      }
    }
  } else {
    shapes.push(['r', [CX - 70, CY - 70, 140, 140], c.base])
    for (let y = CY - 70; y < CY + 70; y += 10) {
      let x = CX - 70 - r() * 12
      while (x < CX + 70) {
        const w = 8 + r() * 18
        const pick = r()
        const fill = pick < 0.33 ? c.light : pick < 0.66 ? c.base : c.dark
        shapes.push(['r', [x + 1, y + 1, w - 2, 8], fill])
        shapes.push(['r', [x + 1, y + 8, w - 2, 1.5], c.dark])
        x += w
      }
    }
  }
  return shapes
}

function useClock(live) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    if (!live) return
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [live])
  return live ? now : null
}

export function StrapShape({ strap, uid, y, h, flip }) {
  const x = CX - 32
  const w = 64
  const fill = strap.color === 'rainbow' ? `url(#${uid}-rainbow)` : strap.color
  const shape = flip
    ? `M${x},${y} H${x + w} V${y + h - 10} Q${CX},${y + h + 4} ${x},${y + h - 10} Z`
    : `M${x},${y + h} H${x + w} V${y + 10} Q${CX},${y - 4} ${x},${y + 10} Z`
  const links = []
  if (strap.type === 'steel') {
    for (let ly = y; ly < y + h; ly += 11) {
      links.push(<rect key={ly} x={x + 2} y={ly} width={19} height={10} rx={2} fill={`url(#${uid}-shine)`} />)
      links.push(<rect key={`m${ly}`} x={x + 22.5} y={ly} width={19} height={10} rx={2} fill={`url(#${uid}-shine)`} opacity={0.75} />)
      links.push(<rect key={`r${ly}`} x={x + 43} y={ly} width={19} height={10} rx={2} fill={`url(#${uid}-shine)`} />)
    }
  } else if (strap.type === 'milanese') {
    for (let ly = y; ly < y + h; ly += 2.2) {
      links.push(<line key={ly} x1={x} x2={x + w} y1={ly} y2={ly} stroke="#fff" strokeOpacity={0.18} strokeWidth={0.8} />)
    }
  } else {
    links.push(
      <path
        key="stitch"
        d={`M${x + 5},${y} V${y + h} M${x + w - 5},${y} V${y + h}`}
        stroke="#fff"
        strokeOpacity={0.35}
        strokeDasharray="3 3"
        strokeWidth={1}
      />,
    )
  }
  return (
    <g>
      <clipPath id={`${uid}-strap-${flip ? 'b' : 't'}`}>
        <path d={shape} />
      </clipPath>
      <g clipPath={`url(#${uid}-strap-${flip ? 'b' : 't'})`}>
        <rect x={x} y={y - 10} width={w} height={h + 20} fill={fill} />
        <rect x={x} y={y - 10} width={w} height={h + 20} fill={`url(#${uid}-strapShade)`} />
        {links}
      </g>
    </g>
  )
}

function Defs({ uid, kase, dial }) {
  return (
    <defs>
      <linearGradient id={`${uid}-case`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={kase.light} />
        <stop offset="0.5" stopColor={kase.dark} />
        <stop offset="1" stopColor={kase.light} />
      </linearGradient>
      <linearGradient id={`${uid}-bezel`} x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={kase.light} />
        <stop offset="1" stopColor={kase.dark} />
      </linearGradient>
      <radialGradient id={`${uid}-glass`} cx="0.3" cy="0.25" r="0.8">
        <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${uid}-strapShade`} x1="0" x2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0.35" />
        <stop offset="0.3" stopColor="#fff" stopOpacity="0.12" />
        <stop offset="0.7" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id={`${uid}-shine`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
        <stop offset="1" stopColor="#000" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id={`${uid}-rainbow`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff5fa2" />
        <stop offset="0.35" stopColor="#7b5cff" />
        <stop offset="0.65" stopColor="#2fd4c8" />
        <stop offset="1" stopColor="#f6c945" />
      </linearGradient>
      <clipPath id={`${uid}-dial`}>
        <circle cx={CX} cy={CY} r={DIAL_R} />
      </clipPath>
      <radialGradient id={`${uid}-vignette`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.7" stopColor={dial.dark} stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>
    </defs>
  )
}

const VIEWBOXES = { full: '0 0 200 300', dial: '38 88 124 124', strap: '50 150 100 150' }

export default function Watch({ config, view = 'full', live = false, className, title }) {
  const raw = useId().replace(/:/g, '')
  const uid = `w${raw}`
  const kase = byId(CASE_COLORS, config.caseColor)
  const dial = byId(DIAL_COLORS, config.dialColor)
  const strap = byId(STRAPS, config.strap)
  const shapes = useMemo(() => dialShapes(config.dialDesign, dial), [config.dialDesign, dial])
  const now = useClock(live)
  const h = now ? now.getHours() % 12 : 10
  const m = now ? now.getMinutes() : 9
  const s = now ? now.getSeconds() : 36
  const hourA = (h + m / 60) * 30
  const minA = (m + s / 60) * 6
  const secA = s * 6

  return (
    <svg
      viewBox={VIEWBOXES[view]}
      className={className}
      role="img"
      aria-label={title ?? `${kase.name} watch with ${dial.name} dial and ${strap.name}`}
    >
      <Defs uid={uid} kase={kase} dial={dial} />
      <StrapShape strap={strap} uid={uid} y={0} h={92} />
      <StrapShape strap={strap} uid={uid} y={208} h={92} flip />
      <path d={`M${CX - 36},78 h72 l-6,24 h-60 Z M${CX - 36},222 h72 l-6,-24 h-60 Z`} fill={`url(#${uid}-bezel)`} />
      <rect x={CX + 70} y={CY - 9} width={10} height={18} rx={3} fill={`url(#${uid}-bezel)`} />
      <rect x={CX + 76} y={CY - 9} width={2} height={18} fill="#000" opacity="0.25" />
      <circle cx={CX} cy={CY} r={74} fill={`url(#${uid}-case)`} />
      <circle cx={CX} cy={CY} r={67} fill={`url(#${uid}-bezel)`} />
      <circle cx={CX} cy={CY} r={63} fill="#0a0a0c" />
      <g clipPath={`url(#${uid}-dial)`}>
        {shapes.map(([t, d, fill], i) =>
          t === 'p' ? (
            <polygon key={i} points={d} fill={fill} />
          ) : (
            <rect key={i} x={d[0]} y={d[1]} width={d[2]} height={d[3]} fill={fill} />
          ),
        )}
        <circle cx={CX} cy={CY} r={DIAL_R} fill={`url(#${uid}-vignette)`} />
      </g>
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x={CX - 1.2}
          y={CY - DIAL_R + 2}
          width={2.4}
          height={i % 3 ? 5 : 9}
          fill="#fff"
          opacity={0.9}
          transform={`rotate(${i * 30} ${CX} ${CY})`}
        />
      ))}
      <text x={CX} y={CY - 26} textAnchor="middle" fontSize="5" fill="#fff" opacity="0.85" letterSpacing="1.2" fontFamily="Michroma, sans-serif">
        VOLUMENZEIT
      </text>
      <g style={{ transition: live ? 'none' : 'transform .4s' }}>
        <rect x={CX - 2} y={CY - 32} width={4} height={36} rx={2} fill="#f4f4f6" transform={`rotate(${hourA} ${CX} ${CY})`} />
        <rect x={CX - 1.4} y={CY - 50} width={2.8} height={54} rx={1.4} fill="#ffffff" transform={`rotate(${minA} ${CX} ${CY})`} />
        <rect x={CX - 0.5} y={CY - 52} width={1} height={62} fill="#7b6bff" transform={`rotate(${secA} ${CX} ${CY})`} />
      </g>
      <circle cx={CX} cy={CY} r={3.6} fill="#e9e9ee" />
      <circle cx={CX} cy={CY} r={1.6} fill="#7b6bff" />
      <circle cx={CX} cy={CY} r={63} fill={`url(#${uid}-glass)`} />
    </svg>
  )
}

export function StrapOnly({ strapId, className }) {
  const raw = useId().replace(/:/g, '')
  const uid = `s${raw}`
  const strap = byId(STRAPS, strapId)
  return (
    <svg viewBox="0 0 200 300" className={className} role="img" aria-label={strap.name}>
      <Defs uid={uid} kase={CASE_COLORS[1]} dial={DIAL_COLORS[0]} />
      <g transform="rotate(-20 100 150)">
        <StrapShape strap={strap} uid={uid} y={10} h={128} />
        <StrapShape strap={strap} uid={uid} y={162} h={128} flip />
        <rect x={64} y={136} width={72} height={6} rx={3} fill="#c9cad1" />
        <rect x={64} y={158} width={72} height={6} rx={3} fill="#c9cad1" />
      </g>
    </svg>
  )
}
