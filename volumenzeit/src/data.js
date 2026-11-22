export const img = (id, w = 900, h) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=80`

export const PHOTOS = {
  hero: '1526045431048-f857369baa09',
  mission: '1534528741775-53994a69daeb',
  about: '1614164185128-e4ec99c436d7',
  contact: '1529626455594-4ff0802cfb7e',
  lifestyle: [
    '1519085360753-af0119f7cbe7',
    '1434056886845-dac89ffe9b56',
    '1506794778202-cad84cf45f1d',
    '1495704907664-81f74a7efd9b',
    '1539571696357-5a69c17a67c6',
    '1508685096489-7aacd43bd3b1',
  ],
}

export const CASE_COLORS = [
  { id: 'black', name: 'Black', light: '#4a4a52', dark: '#0c0c0f', price: 0 },
  { id: 'silver', name: 'Silver', light: '#ffffff', dark: '#8a8b93', price: 0 },
  { id: 'blue', name: 'Blue', light: '#6fc3ff', dark: '#1a4c8f', price: 400 },
]

export const DIAL_DESIGNS = [
  { id: 'cubes', name: 'Cubes', price: 0 },
  { id: 'towers', name: 'Towers', price: 600 },
  { id: 'pyramids', name: 'Pyramids', price: 900 },
  { id: 'blocks', name: 'Blocks', price: 1200 },
]

export const DIAL_COLORS = [
  { id: 'blue', name: 'Blue Metallic', light: '#5c9dff', base: '#2348c9', dark: '#0b1a63', price: 0 },
  { id: 'chameleon', name: 'Color Shifting Green-Purple', light: '#79f2b0', base: '#2c8f86', dark: '#5a2b8c', price: 700 },
  { id: 'black', name: 'Black Metallic', light: '#7c7f8a', base: '#33353c', dark: '#0d0e12', price: 0 },
  { id: 'pink', name: 'Pink-Gold', light: '#ffb3d1', base: '#d9467f', dark: '#6e1640', price: 500 },
]

export const STRAPS = [
  { id: 'leather-blue', name: 'Blue Leather', type: 'leather', color: '#2b4fc4', price: 0 },
  { id: 'leather-black', name: 'Black Leather', type: 'leather', color: '#1b1b1f', price: 0 },
  { id: 'leather-brown', name: 'Cognac Leather', type: 'leather', color: '#9a5a2f', price: 150 },
  { id: 'leather-pink', name: 'Pink Leather', type: 'leather', color: '#e0457f', price: 150 },
  { id: 'leather-green', name: 'Forest Leather', type: 'leather', color: '#1f6b4f', price: 150 },
  { id: 'leather-sand', name: 'Sand Leather', type: 'leather', color: '#d8b98f', price: 150 },
  { id: 'steel-silver', name: 'Silver Steel Bracelet', type: 'steel', color: '#c9cad1', price: 900 },
  { id: 'steel-black', name: 'Black Steel Bracelet', type: 'steel', color: '#2a2b31', price: 900 },
  { id: 'steel-blue', name: 'Blue Steel Bracelet', type: 'steel', color: '#2d6fd0', price: 1100 },
  { id: 'steel-rainbow', name: 'Rainbow Steel Bracelet', type: 'steel', color: 'rainbow', price: 1500 },
  { id: 'milanese-silver', name: 'Silver Milanese Mesh', type: 'milanese', color: '#b8bac2', price: 700 },
  { id: 'milanese-black', name: 'Black Milanese Mesh', type: 'milanese', color: '#25262b', price: 700 },
]

export const BASE_PRICE = 14990
export const GIFT_BOX_PRICE = 25

export const byId = (list, id) => list.find((x) => x.id === id) ?? list[0]

export function configPrice(config) {
  return (
    BASE_PRICE +
    byId(CASE_COLORS, config.caseColor).price +
    byId(DIAL_DESIGNS, config.dialDesign).price +
    byId(DIAL_COLORS, config.dialColor).price +
    byId(STRAPS, config.strap).price
  )
}

export function configSpecs(config) {
  const strap = byId(STRAPS, config.strap)
  return [
    ['Case', '316L Stainless steel'],
    ['Coating', 'Color anodized anti-scratch'],
    ['Glass', 'Sapphire Crystal'],
    ['Strap', strap.type === 'leather' ? `22mm ${strap.name}` : `22mm ${strap.name}`],
    ['Case Size', '42mm'],
    ['Case Color', `${byId(CASE_COLORS, config.caseColor).name}, chamfered brush with mirror polish`],
    ['Dial Design', byId(DIAL_DESIGNS, config.dialDesign).name + ' 3D relief'],
    ['Dial Color', byId(DIAL_COLORS, config.dialColor).name],
    ['Water Resistance', '5 ATM / 50 meters'],
    ['Straps', 'Quick release'],
    ['Movement', 'Swiss Parts RONDA 762E'],
    ['Instantaneous rate', '-10 / +20 sec/month'],
    ['Standard Battery life', '3 years'],
  ]
}

const watch = (id, name, subtitle, caseColor, dialDesign, dialColor, strap, extra = 0) => {
  const config = { caseColor, dialDesign, dialColor, strap }
  return { id, kind: 'watch', name, subtitle, config, price: configPrice(config) + extra }
}

export const PRODUCTS = [
  watch('s1', 'Volumenzeit S1', 'Midnight Cube', 'black', 'cubes', 'black', 'steel-black', 598),
  watch('s2', 'Volumenzeit S2', 'Ocean Leather', 'black', 'cubes', 'blue', 'leather-blue', 2000),
  watch('s3', 'Urban Eagle', 'Lavender Spark', 'silver', 'towers', 'chameleon', 'steel-rainbow', 2400),
  watch('s4', 'Volumenzeit S4', 'Arctic Steel', 'silver', 'pyramids', 'blue', 'steel-silver', 1000),
  watch('s5', 'Volumenzeit S5', 'Rose Milanese', 'silver', 'blocks', 'pink', 'milanese-silver'),
  watch('s6', 'Volumenzeit S6', 'Chameleon', 'blue', 'cubes', 'chameleon', 'steel-rainbow', 1588),
  watch('s7', 'Volumenzeit S7', 'Deep Blue', 'blue', 'towers', 'blue', 'steel-blue'),
  watch('s8', 'Volumenzeit S8', 'Flamingo', 'blue', 'blocks', 'pink', 'leather-pink', 3000),
  watch('s9', 'Nightfall', 'Carbon Towers', 'black', 'towers', 'black', 'milanese-black', 800),
  watch('s10', 'Forest Walker', 'Emerald Pyramids', 'black', 'pyramids', 'chameleon', 'leather-green'),
  watch('s11', 'Desert Rose', 'Sand & Gold', 'silver', 'cubes', 'pink', 'leather-sand', 500),
  watch('s12', 'Cognac Classic', 'Heritage Blue', 'silver', 'cubes', 'blue', 'leather-brown', 300),
  ...STRAPS.filter((_, i) => i % 2 === 0).map((s) => ({
    id: `strap-${s.id}`,
    kind: 'strap',
    name: s.name,
    subtitle: 'Quick-release 22mm strap',
    strap: s.id,
    price: 190 + s.price,
  })),
]

export const STRAP_FILTER_COLORS = [
  { id: 'brown', color: '#9a5a2f', match: ['leather-brown', 'leather-sand'] },
  { id: 'green', color: '#1f6b4f', match: ['leather-green'] },
  { id: 'purple', color: 'linear-gradient(135deg,#7b5cff,#e0457f)', match: ['leather-pink', 'steel-rainbow'] },
  { id: 'blue', color: '#2b4fc4', match: ['leather-blue', 'steel-blue'] },
  { id: 'gray', color: '#55565d', match: ['leather-black', 'steel-black', 'milanese-black', 'steel-silver', 'milanese-silver'] },
]

export const COUNTRIES = [
  'Uzbekistan', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkey', 'Germany', 'Austria',
  'Switzerland', 'United Kingdom', 'United States', 'Canada', 'United Arab Emirates', 'Japan', 'South Korea',
]

export const COUPONS = { VOLUME10: 0.1, WELCOME5: 0.05 }

export const SHIPPING = [
  { id: 'express', name: 'UPS Express', note: 'UPS Express 1-3 working days', price: 49.99 },
  { id: 'standard', name: 'UPS Standard', note: 'UPS Standard 5-10 working days', price: 0 },
]

export const money = (n) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })
