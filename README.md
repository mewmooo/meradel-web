# Meradel — Our Little Pixel World

Ruang privat pixel art (16-bit cozy) untuk dua hati. Fitur lengkap:
- Login & Register akun
- Pairing dunia pasangan (2 akun per dunia, maksimal)
- Period & Mood Tracker (hanya akun perempuan, plus view partner jika izin dibagikan)
- Shared Wishlist + convert ke Memory
- Love Notes & Kapsul Waktu (time-lock)
- Pixel Sanctuary & Pet Care (pet + furniture + Poin Kasih)
- Couple Quiz integrasi AI dari Shared Memories
- Protokol RLS Supabase (12 tabel, SHA-256 invite hash, granular mood consent)

Data berjalan **otomatis** dari `localStorage` saat ini. Untuk prod, hubungkan ke **Supabase** (lihat env vars).

---

## Struktur Folder (Vercel-Ready)

```
meradel-web/
├── index.html              # Entri Vite
├── package.json            # Dependensi Vite + React + Tailwind v4
├── vite.config.js          # Vite + React + Tailwind
├── vercel.json             # SPA rewrite (hindari 404 saat refresh)
├── .env.example            # Contoh env vars (salin ke .env.local)
├── .gitignore
├── README.md
└── src/
    ├── main.jsx            # ReactDOM entry
    ├── index.css           # Tailwind import + sharp pixel art
    └── App.tsx             # Aplikasi lengkap (5125 baris)
```

---

## Menjalankan Lokal

```bash
cd meradel-web
npm install
npm run dev        # Buka http://localhost:5173
```

Akun demo:
- `adel@meradel.id` (perempuan, owner)
- `merdi@meradel.id` (cowok, member)

---

## Deploy ke Vercel

Metode **A — GitHub + Vercel Dashboard** (rekomendasi, auto-update):

1. Upload folder `meradel-web` ke GitHub (repository *private* / namanya `meradel-web` biasa).
2. Buka [vercel.com](https://vercel.com) → **Add New** → **Project**.
3. Pilih repo `meradel-web` → framework **Vite** (deteksi otomatis).
4. Klik **Deploy**. Tunggu ~45 detik.
5. Akses: `https://meradel.vercel.app`.

Metode **B — Vercel CLI** (tanpa GitHub):

```bash
cd meradel-web
npm i -g vercel
vercel          # login, set up, deploy
npx vercel --prod   # publish ke produksi
```

---

## Environment Variables (Vercel Dashboard)

Buka project → **Settings** → **Environment Variables**, tambahkan:

| Variable | Deskripsi | Wajib |
|---|---|---|
| `VITE_SUPABASE_URL` | URL project Supabase | Opsional (fallback localStorage) |
| `VITE_SUPABASE_ANON_KEY` | Anon key Supabase | Opsional |
| `VITE_GEMINI_API_KEY` | API key Gemini (Couple Quiz AI advance) | Opsional |

Jika kosong, aplikasi tetap jalan penuh dengan data `localStorage` (demoSeed).

---

## Cara Kerja Auth & Data (Tanpa Supabase)

- Aplikasi mendeteksi `localStorage['meradel_pixel_world_db_v4']`.
- Jika ada → gunakan; jika tidak → seed demo (Adel & Merdi).
- Semua aksi direkam secara lokal. Tidak ada API call jika env vars kosong.

## Protokol RLS Supabase (Opsional)

Jalankan skrip migrasi yang terlampir di panduan asli:
- 12 tabel (`profiles`, `couples`, `couple_members`, `couple_invites`, `cycle_logs`, `cycle_sharing_settings`, `mood_entries`, `wishlist_items`, `memories`, `love_notes`, `garden_state`, `garden_events`)
- 14 kebijakan RLS
- Fungsi `public.is_active_couple_member()`
- Invite token di-hash SHA-256

---

## Pustaka Pegangan

- Panduan lengkap konfigurasi & migrasi: `panduan_lengkap_hosting_vercel_kode_konfigurasi_migrasi_supabase.md`
