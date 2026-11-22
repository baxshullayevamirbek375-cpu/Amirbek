import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const StoreContext = createContext(null)

function usePersisted(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key || e.storageArea !== localStorage) return
      try {
        setValue(e.newValue ? JSON.parse(e.newValue) : initial)
      } catch {
        /* ignore malformed value */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key, initial])
  return [value, setValue]
}

const toHex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 210000 },
    key,
    256,
  )
  return toHex(bits)
}

const SESSION_KEY = 'vz.session'

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY) ?? 'null')
  } catch {
    return null
  }
}

export const itemKey = (item) => JSON.stringify([item.name, item.config ?? null, item.strap ?? null, item.extras ?? null])

export function StoreProvider({ children }) {
  const [cart, setCart] = usePersisted('vz.cart', [])
  const [users, setUsers] = usePersisted('vz.users', [])
  const [session, setSessionState] = useState(readSession)
  const setSession = useCallback((email, remember = true) => {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    if (email) (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(email))
    setSessionState(email)
  }, [])
  const [orders, setOrders] = usePersisted('vz.orders', [])
  const [subscribers, setSubscribers] = usePersisted('vz.subscribers', [])
  const [messages, setMessages] = usePersisted('vz.messages', [])
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const notify = useCallback((text) => {
    setToast({ text, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const addToCart = useCallback(
    (item, { open = true } = {}) => {
      const key = itemKey(item)
      setCart((c) => {
        const existing = c.find((x) => x.key === key)
        if (existing) return c.map((x) => (x.key === key ? { ...x, qty: x.qty + 1 } : x))
        return [...c, { ...item, key, qty: 1 }]
      })
      if (open) setCartOpen(true)
    },
    [setCart],
  )

  const updateQty = useCallback(
    (key, qty) => setCart((c) => (qty <= 0 ? c.filter((x) => x.key !== key) : c.map((x) => (x.key === key ? { ...x, qty } : x)))),
    [setCart],
  )

  const user = users.find((u) => u.email === session) ?? null

  const register = useCallback(
    async (form) => {
      const email = form.email.trim().toLowerCase()
      if (users.some((u) => u.email === email)) throw new Error('An account with this email already exists')
      const salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
      const passwordHash = await hashPassword(form.password, salt)
      const newUser = {
        email,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        birth: form.birth,
        newsletter: form.newsletter,
        salt,
        passwordHash,
        createdAt: new Date().toISOString(),
      }
      setUsers((u) => [...u, newUser])
      if (form.newsletter) setSubscribers((s) => (s.includes(email) ? s : [...s, email]))
      setSession(email)
      return newUser
    },
    [users, setUsers, setSession, setSubscribers],
  )

  const login = useCallback(
    async (emailRaw, password, remember = true) => {
      const email = emailRaw.trim().toLowerCase()
      const found = users.find((u) => u.email === email)
      if (!found || !found.salt || found.passwordHash !== (await hashPassword(password, found.salt))) throw new Error('Wrong email or password')
      setSession(email, remember)
      return found
    },
    [users, setSession],
  )

  const logout = useCallback(() => setSession(null), [setSession])

  const updateUser = useCallback(
    (patch) => setUsers((list) => list.map((u) => (u.email === session ? { ...u, ...patch } : u))),
    [session, setUsers],
  )

  const placeOrder = useCallback(
    (details) => {
      const order = {
        id: 'VZ-' + Date.now().toString(36).toUpperCase(),
        createdAt: new Date().toISOString(),
        userEmail: session,
        status: 'Processing',
        ...details,
      }
      setOrders((o) => [order, ...o])
      setCart([])
      return order
    },
    [session, setOrders, setCart],
  )

  const subscribe = useCallback(
    (email) => setSubscribers((s) => (s.includes(email.toLowerCase()) ? s : [...s, email.toLowerCase()])),
    [setSubscribers],
  )

  const sendMessage = useCallback(
    (msg) => setMessages((m) => [...m, { ...msg, createdAt: new Date().toISOString() }]),
    [setMessages],
  )

  const value = useMemo(
    () => ({
      cart,
      cartCount: cart.reduce((n, x) => n + x.qty, 0),
      cartSubtotal: cart.reduce((n, x) => n + x.qty * x.price, 0),
      cartOpen,
      setCartOpen,
      addToCart,
      updateQty,
      user,
      register,
      login,
      logout,
      updateUser,
      orders: orders.filter((o) => o.userEmail && o.userEmail === session),
      placeOrder,
      subscribers,
      subscribe,
      messages,
      sendMessage,
      toast,
      notify,
    }),
    [cart, cartOpen, addToCart, updateQty, user, register, login, logout, updateUser, orders, session, placeOrder, subscribers, subscribe, messages, sendMessage, toast, notify],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => useContext(StoreContext)
