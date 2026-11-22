# ⚡ SuperApp

Bitta ilovada 5 ta modul: **Kanban vazifalar**, **Xarajatlar hisobchisi**, **Onlayn do'kon**, **Blog** va **Real-vaqt chat**.

**Stack:** React 19 + Vite · Node.js + Express · SQLite (better-sqlite3) · Socket.io · JWT · Recharts

## Imkoniyatlar

| Modul | Nimalar bor |
|---|---|
| 🔐 Auth | Ro'yxatdan o'tish / kirish (JWT, bcrypt). Birinchi foydalanuvchi — admin |
| 📋 Vazifalar | 3 ustunli Kanban doska, drag & drop, ustuvorlik |
| 💰 Xarajatlar | Daromad/xarajat, kategoriyalar, oylik va kategoriya grafiklari |
| 🛒 Do'kon | Mahsulotlar, qidiruv, savatcha, buyurtma (zaxira tekshiruvi), admin panel |
| 📝 Blog | Postlar, izohlar, o'chirish (muallif yoki admin) |
| 💬 Chat | Socket.io xonalari, onlayn foydalanuvchilar, "yozmoqda..." indikatori, tarix |

## Ishga tushirish

Node.js 20+ kerak.

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

### Production

```bash
npm run build   # client/dist yaratiladi
npm start       # Express API + frontendni 4000-portda beradi
```

Muhit o'zgaruvchilari (ixtiyoriy): `PORT`, `JWT_SECRET` (berilmasa tasodifiy kalit `server/.jwt-secret` ga saqlanadi), `DB_PATH`.

## Tuzilma

```
server/src
  index.js        Express + Socket.io
  db.js           SQLite sxemasi va boshlang'ich mahsulotlar
  auth.js         JWT middleware
  chat.js         Real-vaqt chat
  routes/         auth, tasks, expenses, shop, blog
client/src
  pages/          Dashboard, Kanban, Expenses, Shop, Cart, Orders, Admin, Blog, Post, Chat
```


## Volumenzeit

A separate watch-store frontend lives in [`volumenzeit/`](volumenzeit/README.md) (`cd volumenzeit && npm install && npm run dev`).
