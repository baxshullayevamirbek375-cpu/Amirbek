const db = require('./db');
const { verifyToken } = require('./auth');

const ROOMS = ['umumiy', 'dasturlash', 'yangiliklar'];

const recent = (room) =>
  db
    .prepare(`SELECT * FROM (
      SELECT m.*, u.name AS author FROM messages m JOIN users u ON u.id = m.user_id
      WHERE m.room = ? ORDER BY m.id DESC LIMIT 50) ORDER BY id`)
    .all(room);

function setupChat(io) {
  const online = new Map();
  const broadcastOnline = () => io.emit('online', [...new Set(online.values())]);

  io.use((socket, next) => {
    try {
      socket.user = verifyToken(socket.handshake.auth?.token);
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    online.set(socket.id, socket.user.name);
    broadcastOnline();
    socket.emit('rooms', ROOMS);

    socket.on('join', (room) => {
      if (!ROOMS.includes(room)) return;
      [...socket.rooms].filter((r) => r !== socket.id).forEach((r) => socket.leave(r));
      socket.join(room);
      socket.emit('history', recent(room));
    });

    socket.on('message', (payload) => {
      const { room, content } = payload || {};
      const text = String(content || '').trim().slice(0, 1000);
      if (!ROOMS.includes(room) || !text) return;
      const info = db.prepare('INSERT INTO messages (room, user_id, content) VALUES (?, ?, ?)').run(room, socket.user.id, text);
      const msg = db
        .prepare('SELECT m.*, u.name AS author FROM messages m JOIN users u ON u.id = m.user_id WHERE m.id = ?')
        .get(info.lastInsertRowid);
      io.to(room).emit('message', msg);
    });

    socket.on('typing', (room) => {
      if (ROOMS.includes(room)) socket.to(room).emit('typing', socket.user.name);
    });

    socket.on('disconnect', () => {
      online.delete(socket.id);
      broadcastOnline();
    });
  });
}

module.exports = { setupChat };
