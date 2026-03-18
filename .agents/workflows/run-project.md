---
description: How to run the portfolio project (frontend + AI backend)
---

# Run Portfolio Project

## Prerequisites
- Node.js 18+
- npm

## Step 1 — Install Frontend Dependencies
```bash
cd /home/dimas/Documents/portofolio
npm install
```

## Step 2 — Install Backend Dependencies
```bash
cd /home/dimas/Documents/portofolio/backend
npm install
```

## Step 3 — Start Backend (Terminal 1)
```bash
cd /home/dimas/Documents/portofolio/backend
npm run start:dev
```
> Backend jalan di `http://localhost:3001`
> Pastikan muncul: `🤖 AI Backend running on http://localhost:3001`

## Step 4 — Start Frontend (Terminal 2)
```bash
cd /home/dimas/Documents/portofolio
npm run dev
```
> Frontend jalan di `http://localhost:3000`

## Step 5 — Buka di Browser
```
http://localhost:3000
```

## Troubleshooting

### AI gak jalan?
- Pastikan backend running di terminal terpisah
- Cek `.env` di `/backend/.env` ada `GEMINI_API_KEY`
- Test manual: `curl -X POST http://localhost:3001/chat -H "Content-Type: application/json" -d '{"message":"hi","context":"hero"}'`

### Port conflict?
- Frontend: edit `package.json` → `"dev": "next dev -p 3002"`
- Backend: edit `backend/.env` → `PORT=3003` + update `next.config.ts` rewrite destination
