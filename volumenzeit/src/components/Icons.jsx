const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const UserIcon = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none"><circle cx="12" cy="8" r="4.5" /><path d="M3.5 21c.8-4.4 4.2-7 8.5-7s7.7 2.6 8.5 7z" /></svg>
)
export const CartIcon = (p) => (
  <svg {...base} {...p}><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6" /></svg>
)
export const CloseIcon = (p) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>)
export const MenuIcon = (p) => (<svg {...base} {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>)
export const ArrowLeft = (p) => (<svg {...base} width={44} viewBox="0 0 44 24" {...p}><path d="M43 12H2M10 4l-8 8 8 8" /></svg>)
export const ArrowRight = (p) => (<svg {...base} width={44} viewBox="0 0 44 24" {...p}><path d="M1 12h41M34 4l8 8-8 8" /></svg>)
export const PlayIcon = (p) => (<svg {...base} {...p} fill="currentColor" stroke="none"><path d="M8 5v14l11-7z" /></svg>)
export const ChevronDown = (p) => (<svg {...base} {...p}><path d="M6 9l6 6 6-6" /></svg>)
export const TrashIcon = (p) => (<svg {...base} {...p}><path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" /></svg>)
export const ArIcon = (p) => (
  <svg {...base} {...p}><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z" /><path d="M12 11l8-4.5M12 11L4 6.5M12 11v9" /></svg>
)
export const PlaneIcon = (p) => (<svg {...base} {...p}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>)
export const BoxIcon = (p) => (<svg {...base} {...p}><path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" /></svg>)
export const MoneyIcon = (p) => (<svg {...base} {...p}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 10v4M18 10v4" /></svg>)
export const ShieldIcon = (p) => (<svg {...base} {...p}><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" /><path d="M9 12l2 2 4-4" /></svg>)
export const CheckIcon = (p) => (<svg {...base} {...p}><path d="M5 12l5 5 9-10" /></svg>)
export const Social = {
  Pinterest: (p) => (<svg {...base} {...p} fill="currentColor" stroke="none"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.7 2-2.7.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.3 1.1.5 2 1.6 2 1.9 0 3.4-2 3.4-5 0-2.6-1.9-4.4-4.5-4.4-3.1 0-4.9 2.3-4.9 4.7 0 .9.4 1.9.8 2.5l.1.4-.3 1.2c0 .2-.2.3-.4.2-1.4-.7-2.2-2.7-2.2-4.3 0-3.5 2.5-6.7 7.3-6.7 3.8 0 6.8 2.7 6.8 6.4 0 3.8-2.4 6.9-5.8 6.9-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.3 1-1 2.2-1.4 2.9A10 10 0 1 0 12 2z" /></svg>),
  Facebook: (p) => (<svg {...base} {...p} fill="currentColor" stroke="none"><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7H17l.5-4h-4V9c0-.6.4-1 1-1z" /></svg>),
  Twitter: (p) => (<svg {...base} {...p} fill="currentColor" stroke="none"><path d="M22 5.9c-.7.3-1.5.6-2.4.7.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.7a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5 0 2 1.4 3.7 3.3 4.1-.6.2-1.2.2-1.9.1.5 1.6 2 2.8 3.8 2.9A8.3 8.3 0 0 1 2 18.5 11.7 11.7 0 0 0 8.3 20.3c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.2z" /></svg>),
  Instagram: (p) => (<svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>),
  Google: (p) => (<svg {...base} {...p} fill="currentColor" stroke="none"><path d="M21.6 10.2H12v3.9h5.5c-.5 2.5-2.6 3.9-5.5 3.9a6 6 0 1 1 3.9-10.6l2.9-2.9A10 10 0 1 0 12 22c5 0 9.6-3.6 9.6-10 0-.6 0-1.2-.1-1.8z" /></svg>),
}
