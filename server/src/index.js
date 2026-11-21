const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const { requireAuth } = require('./auth');
const { setupChat } = require('./chat');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', requireAuth, require('./routes/tasks'));
app.use('/api/expenses', requireAuth, require('./routes/expenses'));
app.use('/api/shop', require('./routes/shop'));
app.use('/api/blog', require('./routes/blog'));

const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^\/(?!api|socket\.io).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

const server = http.createServer(app);
setupChat(new Server(server, { cors: { origin: '*' } }));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server http://localhost:${PORT}`));
