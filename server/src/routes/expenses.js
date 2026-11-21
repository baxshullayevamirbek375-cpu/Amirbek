const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, id DESC').all(req.user.id));
});

router.get('/summary', (req, res) => {
  const totals = db
    .prepare(`SELECT
      COALESCE(SUM(CASE WHEN type='income' THEN amount END), 0) AS income,
      COALESCE(SUM(CASE WHEN type='expense' THEN amount END), 0) AS expense
      FROM transactions WHERE user_id = ?`)
    .get(req.user.id);
  const byCategory = db
    .prepare(`SELECT category, SUM(amount) AS total FROM transactions
      WHERE user_id = ? AND type = 'expense' GROUP BY category ORDER BY total DESC`)
    .all(req.user.id);
  const byMonth = db
    .prepare(`SELECT substr(date, 1, 7) AS month,
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expense
      FROM transactions WHERE user_id = ? GROUP BY month ORDER BY month`)
    .all(req.user.id);
  res.json({ ...totals, balance: totals.income - totals.expense, byCategory, byMonth });
});

router.post('/', (req, res) => {
  const { type, amount, category, note = '', date } = req.body || {};
  const value = Number(amount);
  if (!['income', 'expense'].includes(type) || !(value > 0) || !category?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date || '')) {
    return res.status(400).json({ error: "Tur, summa, kategoriya va sanani to'g'ri kiriting" });
  }
  const info = db
    .prepare('INSERT INTO transactions (user_id, type, amount, category, note, date) VALUES (?, ?, ?, ?, ?, ?)')
    .run(req.user.id, type, value, category.trim(), note, date);
  res.status(201).json(db.prepare('SELECT * FROM transactions WHERE id = ?').get(info.lastInsertRowid));
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (!info.changes) return res.status(404).json({ error: 'Topilmadi' });
  res.status(204).end();
});

module.exports = router;
