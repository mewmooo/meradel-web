# 🏡 Meradel — Our Little Pixel World

**Meradel** adalah aplikasi web privat untuk pasangan (*private couple web app*) bergaya **Pixel Art 16-bit** yang hangat, romantis, dan mengutamakan privasi. Dirancang dengan pendekatan *mobile-first*, setiap dunia di Meradel hanya dapat dihuni oleh tepat **dua akun pasangan** yang saling terhubung melalui kode undangan terenkripsi.

---

## ✨ Fitur Utama Meradel

1. **🔐 Autentikasi Publik & Atomic Couple Pairing**
   - Pendaftaran akun mandiri dengan pemilihan peran/gender (Perempuan/Laki-laki) dan karakter avatar pixel 16-bit.
   - Pembuatan dunia pasangan baru beserta kode undangan unik (`MRDL-XXXX-XXXX`) yang berlaku selama 24 jam dan hanya dapat digunakan satu kali.
   - Kapasitas dunia dikunci maksimal 2 anggota aktif.

2. **🌸 Period & Mood Tracker (Berdasarkan Peran & Izin Granular)**
   - **Akun Perempuan**: Dilengkapi kalender siklus bulanan, pencatatan tanggal mulai/selesai menstruasi, dan estimasi siklus berikutnya menggunakan perhitungan **Median Interval** (minimal 3 interval siklus valid) disertai informasi ketidakpastian non-medis.
   - **Akun Laki-laki**: Tidak menampilkan form pencatatan menstruasi pribadi; berfokus pada *Mood & Energi Check-In* harian serta tampilan pendamping untuk melihat ringkasan siklus pasangan (apabila pasangan mengaktifkan izin berbagi).
   - **Kontrol Privasi Granular**: Pemilik data memegang kendali penuh untuk membagikan atau menyembunyikan kalender siklus, ringkasan mood, dan catatan jurnal bebas secara terpisah.

3. **✨ Shared Wishlist (Daftar Keinginan Bersama)**
   - Menyimpan ide kencan, kuliner, perjalanan, dan barang impian berdua.
   - Dilengkapi validasi tautan aman (hanya menerima protokol `http://` dan `https://`, menolak `javascript:` atau `data:`).
   - Wishlist yang telah terwujud (*Completed*) memberikan **+10 Poin Kasih** dan dapat langsung dikonversi menjadi **Memory** bersama (**+15 Poin Kasih**).

4. **📖 Timeline Memories (Kenangan Bersama & Pribadi)**
   - Menyimpan cerita dan foto momen berharga berdasarkan urutan tanggal kejadian.
   - Mendukung visibilitas **Bersama (`shared`)** maupun **Pribadi (`private`)** yang hanya dapat dilihat oleh pembuatnya.

5. **💌 Love Notes & Kapsul Waktu**
   - Mengirim surat cinta langsung ke kotak masuk pasangan atau menjadwalkan waktu buka di masa depan (`open_at`).
   - Surat terjadwal dikunci secara ketat hingga tanggal dan jam yang ditentukan tiba.

6. **🐾 Cozy Sanctuary — Rumah Pohon & Peliharaan Pixel**
   - Ruang virtual bersama berukuran 5×5 petak dengan 4 suasana jendela interaktif (*Pagi Cerah*, *Senja Hangat*, *Malam Perapian*, dan *Hujan Syahdu*).
   - Pasangan dapat menggunakan **Poin Kasih (✨)** untuk mengadopsi 6 anabul pixel (*Mochi si Kucing*, *Bubu si Kelinci*, *Piyo si Burung*, *Kuro si Rubah*, *Choco si Hamster*, *Pao si Panda Merah*) serta menata furnitur rumah pohon.
   - Peliharaan dan furnitur dapat dirawat/di-upgrade dari **Lv.1 hingga Lv.4 (❤️MAX)**.

7. **🎮 Couple Quiz Berbasis Gemini AI**
   - Kuis interaktif di mana jawaban pasangan baru terbuka setelah kedua belah pihak menjawab.
   - Terintegrasi dengan **Google Gemini AI (`gemini-3-flash-preview`)** untuk merangkai pertanyaan refleksi otomatis yang diangkat langsung dari daftar *Shared Memories* pasangan.

---

## 🛠️ Stack Teknologi

- **Frontend**: React 18, Vite 6, Tailwind CSS v4, Lucide Icons
- **Backend & Database (Cloud)**: Supabase (Auth, PostgreSQL, Row Level Security, Private Storage)
- **AI Integration**: Google Gemini API (`gemini-3-flash-preview` dengan Structured JSON Output)
- **Deployment**: Vercel (SPA Rewrite Ready)

---

## 🚀 Cara Menjalankan Proyek di Komputer Lokal

1. Pastikan **Node.js** (versi 18 atau 20+) sudah terpasang.
2. Instal seluruh dependensi:
   ```bash
   npm install
   ```
3. Salin file `.env.example` menjadi `.env` (opsional jika ingin mengaktifkan Gemini AI & Supabase):
   ```bash
   cp .env.example .env
   ```
4. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:5173` di browser Anda.

---

## 🌐 Cara Deploy ke Vercel

1. Unggah folder `meradel-web` ini ke repositori GitHub Anda.
2. Masuk ke [Vercel Dashboard](https://vercel.com), klik **Add New Project**, lalu pilih repositori `meradel-web`.
3. Masukkan variabel environment (`VITE_GEMINI_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) pada menu **Environment Variables**.
4. Klik **Deploy**. File `vercel.json` sudah dikonfigurasi agar aplikasi berjalan mulus tanpa error 404 saat halaman di-refresh.
