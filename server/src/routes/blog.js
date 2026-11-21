const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../auth');

const POST_SELECT = `SELECT p.*, u.name AS author,
  (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
  FROM posts p JOIN users u ON u.id = p.user_id`;

router.get('/posts', (req, res) => {
  res.json(db.prepare(`${POST_SELECT} ORDER BY p.created_at DESC, p.id DESC`).all());
});

router.get('/posts/:id', (req, res) => {
  const post = db.prepare(`${POST_SELECT} WHERE p.id = ?`).get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post topilmadi' });
  const comments = db
    .prepare('SELECT c.*, u.name AS author FROM comments c JOIN users u ON u.id = c.user_id WHERE c.post_id = ? ORDER BY c.id')
    .all(post.id);
  res.json({ ...post, comments });
});

router.post('/posts', requireAuth, (req, res) => {
  const { title, content } = req.body || {};
  if (!title?.trim() || !content?.trim()) return res.status(400).json({ error: 'Sarlavha va matn kiriting' });
  const info = db.prepare('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)').run(req.user.id, title.trim(), content.trim());
  res.status(201).json(db.prepare(`${POST_SELECT} WHERE p.id = ?`).get(info.lastInsertRowid));
});

router.delete('/posts/:id', requireAuth, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post topilmadi' });
  if (post.user_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: "Ruxsat yo'q" });
  db.prepare('DELETE FROM posts WHERE id = ?').run(post.id);
  res.status(204).end();
});

router.post('/posts/:id/comments', requireAuth, (req, res) => {
  const { content } = req.body || {};
  if (!content?.trim()) return res.status(400).json({ error: 'Izoh matnini kiriting' });
  if (!db.prepare('SELECT id FROM posts WHERE id = ?').get(req.params.id)) return res.status(404).json({ error: 'Post topilmadi' });
  const info = db.prepare('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)').run(req.params.id, req.user.id, content.trim());
  res.status(201).json(
    db.prepare('SELECT c.*, u.name AS author FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = ?').get(info.lastInsertRowid),
  );
});

module.exports = router;
