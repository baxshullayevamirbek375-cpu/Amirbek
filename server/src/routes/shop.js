const router = require('express').Router();
const db = require('../db');
const { requireAuth, requireAdmin } = require('../auth');

router.get('/products', (req, res) => {
  res.json(db.prepare('SELECT * FROM products ORDER BY id').all());
});

router.post('/products', requireAuth, requireAdmin, (req, res) => {
  const { name, description = '', price, image = '📦', stock = 0 } = req.body || {};
  if (!name?.trim() || !(Number(price) >= 0) || !(Number.isInteger(Number(stock)) && Number(stock) >= 0)) {
    return res.status(400).json({ error: "Nom, narx va zaxirani to'g'ri kiriting" });
  }
  const info = db
    .prepare('INSERT INTO products (name, description, price, image, stock) VALUES (?, ?, ?, ?, ?)')
    .run(name.trim(), description, Number(price), image || '📦', Number(stock));
  res.status(201).json(db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid));
});

router.patch('/products/:id', requireAuth, requireAdmin, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Mahsulot topilmadi' });
  const next = { ...product, ...req.body };
  db.prepare('UPDATE products SET name = ?, description = ?, price = ?, image = ?, stock = ? WHERE id = ?').run(
    next.name, next.description, Number(next.price), next.image, Number(next.stock), product.id,
  );
  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(product.id));
});

router.delete('/products/:id', requireAuth, requireAdmin, (req, res) => {
  const used = db.prepare('SELECT COUNT(*) AS c FROM order_items WHERE product_id = ?').get(req.params.id).c;
  if (used) return res.status(409).json({ error: "Buyurtmalarda ishlatilgan mahsulotni o'chirib bo'lmaydi" });
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).json({ error: 'Mahsulot topilmadi' });
  res.status(204).end();
});

const withItems = (order) => ({
  ...order,
  items: db
    .prepare(`SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`)
    .all(order.id),
});

router.post('/orders', requireAuth, (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!items.length) return res.status(400).json({ error: "Savatcha bo'sh" });
  try {
    const orderId = db.transaction(() => {
      let total = 0;
      const lines = items.map(({ productId, qty }) => {
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
        const q = Number(qty);
        if (!product || !Number.isInteger(q) || q <= 0) throw new Error("Noto'g'ri mahsulot");
        if (product.stock < q) throw new Error(`"${product.name}" zaxirada yetarli emas`);
        total += product.price * q;
        return { product, q };
      });
      const { lastInsertRowid } = db.prepare('INSERT INTO orders (user_id, total) VALUES (?, ?)').run(req.user.id, total);
      for (const { product, q } of lines) {
        db.prepare('INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)').run(lastInsertRowid, product.id, q, product.price);
        db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(q, product.id);
      }
      return lastInsertRowid;
    })();
    res.status(201).json(withItems(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId)));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/orders', requireAuth, (req, res) => {
  const all = req.user.role === 'admin' && req.query.all === '1';
  const rows = all
    ? db.prepare('SELECT o.*, u.name AS user_name FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.id DESC').all()
    : db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
  res.json(rows.map(withItems));
});

router.patch('/orders/:id', requireAuth, requireAdmin, (req, res) => {
  const { status } = req.body || {};
  if (!['new', 'shipped', 'delivered', 'cancelled'].includes(status)) return res.status(400).json({ error: "Noto'g'ri holat" });
  const info = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  if (!info.changes) return res.status(404).json({ error: 'Buyurtma topilmadi' });
  res.json(withItems(db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id)));
});

module.exports = router;
