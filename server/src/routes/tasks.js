const router = require('express').Router();
const db = require('../db');

const STATUSES = ['todo', 'doing', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC, id DESC').all(req.user.id));
});

router.post('/', (req, res) => {
  const { title, description = '', status = 'todo', priority = 'medium' } = req.body || {};
  if (!title?.trim()) return res.status(400).json({ error: 'Sarlavha kiriting' });
  if (!STATUSES.includes(status) || !PRIORITIES.includes(priority)) return res.status(400).json({ error: "Noto'g'ri qiymat" });
  const info = db
    .prepare('INSERT INTO tasks (user_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)')
    .run(req.user.id, title.trim(), description, status, priority);
  res.status(201).json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid));
});

router.patch('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!task) return res.status(404).json({ error: 'Vazifa topilmadi' });
  const next = { ...task, ...req.body };
  if (!next.title?.trim() || !STATUSES.includes(next.status) || !PRIORITIES.includes(next.priority)) {
    return res.status(400).json({ error: "Noto'g'ri qiymat" });
  }
  db.prepare('UPDATE tasks SET title = ?, description = ?, status = ?, priority = ? WHERE id = ?').run(
    next.title.trim(), next.description, next.status, next.priority, task.id,
  );
  res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(task.id));
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (!info.changes) return res.status(404).json({ error: 'Vazifa topilmadi' });
  res.status(204).end();
});

module.exports = router;
