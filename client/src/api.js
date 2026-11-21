const TOKEN_KEY = 'superapp_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY))

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Xatolik: ${res.status}`)
  return data
}

export const formatMoney = (n) => `${Math.round(n).toLocaleString('ru-RU')} so'm`
export const formatDate = (s) => new Date(s.replace(' ', 'T') + (s.length > 10 ? 'Z' : '')).toLocaleString('uz-UZ')
