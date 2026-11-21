import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { formatDate, getToken } from '../api'
import { useAuth } from '../AuthContext'

export default function Chat() {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)
  const [rooms, setRooms] = useState([])
  const [room, setRoom] = useState('umumiy')
  const [messages, setMessages] = useState([])
  const [online, setOnline] = useState([])
  const [typing, setTyping] = useState('')
  const [text, setText] = useState('')
  const bottom = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    const s = io({ auth: { token: getToken() } })
    s.on('rooms', setRooms)
    s.on('online', setOnline)
    s.on('history', setMessages)
    s.on('message', (m) => setMessages((prev) => [...prev, m]))
    s.on('typing', (name) => {
      setTyping(name)
      clearTimeout(typingTimer.current)
      typingTimer.current = setTimeout(() => setTyping(''), 1500)
    })
    setSocket(s)
    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket) return
    const join = () => socket.emit('join', room)
    join()
    socket.on('connect', join)
    return () => socket.off('connect', join)
  }, [socket, room])

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    socket.emit('message', { room, content: text })
    setText('')
  }

  return (
    <div className="chat">
      <div className="card chat-side">
        <h3>Xonalar</h3>
        {rooms.map((r) => (
          <button key={r} className={`room ${r === room ? 'active' : ''}`} onClick={() => setRoom(r)}># {r}</button>
        ))}
        <h3>Onlayn ({online.length})</h3>
        {online.map((n) => <div key={n} className="online"><span className="dot" /> {n}</div>)}
      </div>
      <div className="card chat-main">
        <div className="chat-head"># {room}</div>
        <div className="messages">
          {!messages.length && <div className="empty">Hali xabar yo'q. Birinchi bo'lib yozing!</div>}
          {messages.map((m) => (
            <div key={m.id} className={`msg ${m.user_id === user.id ? 'mine' : ''}`}>
              <div className="msg-meta">{m.author} · {formatDate(m.created_at)}</div>
              <div className="bubble">{m.content}</div>
            </div>
          ))}
          <div ref={bottom} />
        </div>
        <div className="typing">{typing && `${typing} yozmoqda...`}</div>
        <form className="row-form flat" onSubmit={send}>
          <input placeholder="Xabar yozing..." value={text} onChange={(e) => { setText(e.target.value); socket?.emit('typing', room) }} />
          <button className="btn">Yuborish</button>
        </form>
      </div>
    </div>
  )
}
