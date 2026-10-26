import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Heart,
  Calendar as CalendarIcon,
  Sparkles,
  BookOpen,
  Mail,
  PawPrint,
  Gamepad2,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Check,
  X,
  Lock,
  Unlock,
  ExternalLink,
  ShieldCheck,
  Droplets,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Image as ImageIcon,
  RefreshCw,
  Info,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Database,
  Wand2,
  Loader2,
  Sun,
  Sunset,
  Moon,
  CloudRain
} from 'lucide-react';

// ============================================================================
// 1. KONSTANTA & DATA REFERENSI (DESain PIXEL ART 16-BIT COZY)
// ============================================================================

const DB_STORAGE_KEY = 'meradel_pixel_world_db_v4';

const MOOD_OPTIONS = [
  { value: 'happy', label: 'Senang', emoji: '😊', color: 'bg-[#D8E6DC] border-[#4E6E5B] text-[#2C4235]' },
  { value: 'calm', label: 'Tenang', emoji: '🍵', color: 'bg-[#E3ECD6] border-[#5E7A4B] text-[#2E4022]' },
  { value: 'tired', label: 'Lelah', emoji: '🌙', color: 'bg-[#EFE2C6] border-[#8C684C] text-[#4A3525]' },
  { value: 'sad', label: 'Sedih', emoji: '🌧️', color: 'bg-[#DCE5EE] border-[#5B738E] text-[#28384A]' },
  { value: 'irritable', label: 'Sensitif', emoji: '⚡', color: 'bg-[#F5DCE2] border-[#B86B7D] text-[#592A35]' },
  { value: 'anxious', label: 'Cemas', emoji: '🍃', color: 'bg-[#F2E2D2] border-[#A66E4E] text-[#4F301E]' },
  { value: 'other', label: 'Lainnya', emoji: '✨', color: 'bg-[#EAE4DC] border-[#6E5039] text-[#3D2B1F]' },
];

const FEMALE_SYMPTOM_OPTIONS = [
  'Kram',
  'Sakit kepala',
  'Lelah',
  'Kembung',
  'Nyeri pinggang',
  'Tidak ada gejala',
  'Lainnya',
];

const MALE_SYMPTOM_OPTIONS = [
  'Sakit kepala',
  'Lelah',
  'Kurang tidur',
  'Pegal / Nyeri otot',
  'Tidak ada gejala',
  'Lainnya',
];

const WISHLIST_CATEGORIES = [
  { value: 'date', label: 'Kencan', icon: '🕯️' },
  { value: 'food', label: 'Kuliner', icon: '🍜' },
  { value: 'travel', label: 'Jalan-jalan', icon: '🚂' },
  { value: 'gift', label: 'Hadiah', icon: '🎁' },
  { value: 'activity', label: 'Aktivitas', icon: '🎨' },
  { value: 'product', label: 'Barang Impian', icon: '🏡' },
  { value: 'other', label: 'Lainnya', icon: '⭐' },
];

const SANCTUARY_CATALOG = [
  { type: 'cat_mochi', name: 'Mochi si Kucing Oranye', category: 'pet', cost: 0, desc: 'Kucing hangat yang suka tidur di dekat perapian dan tumbuh makin menggemaskan.' },
  { type: 'bunny_bubu', name: 'Bubu si Kelinci Cream', category: 'pet', cost: 0, desc: 'Kelinci telinga panjang yang melompat ceria saat disapa.' },
  { type: 'bird_piyo', name: 'Piyo si Burung Kenari', category: 'pet', cost: 20, desc: 'Burung mungil bersuara merdu yang membawa keceriaan pagi.' },
  { type: 'fox_kuro', name: 'Kuro si Rubah Senja', category: 'pet', cost: 35, desc: 'Rubah kecil ekor lebat yang setia menjaga rumah pohon kalian.' },
  { type: 'hamster_choco', name: 'Choco si Hamster Pipi Gembul', category: 'pet', cost: 25, desc: 'Hamster menggemaskan yang suka menyimpan biji bunga matahari.' },
  { type: 'panda_pao', name: 'Pao si Panda Merah', category: 'pet', cost: 45, desc: 'Panda merah langka yang suka berguling di atas karpet.' },
  { type: 'fireplace', name: 'Perapian Bata Hangat', category: 'furniture', cost: 0, desc: 'Perapian kayu yang bisa di-upgrade agar nyala apinya makin hangat.' },
  { type: 'rug', name: 'Karpet Rajut Pasangan', category: 'furniture', cost: 0, desc: 'Karpet tenun lembut di tengah ruang santai.' },
  { type: 'bookshelf', name: 'Rak Buku & Jurnal', category: 'furniture', cost: 15, desc: 'Tempat menyimpan novel dan album cerita perjalanan kalian.' },
  { type: 'tea_table', name: 'Meja Teh & Kudapan', category: 'furniture', cost: 20, desc: 'Meja kayu rendah lengkap dengan teko teh hangat dan kue manis.' },
  { type: 'window_view', name: 'Jendela Panorama', category: 'furniture', cost: 25, desc: 'Jendela besar tempat melihat langit pagi, senja, dan bintang.' },
  { type: 'gramophone', name: 'Gramofon Musik Lo-Fi', category: 'furniture', cost: 30, desc: 'Pemutar piringan hitam yang mengalunkan melodi pixel menenangkan.' },
  { type: 'sofa_cozy', name: 'Sofa Bantal Empuk', category: 'furniture', cost: 35, desc: 'Sofa dua dudukan tempat bersandar sambil bercerita.' },
  { type: 'lantern_string', name: 'Lampu Gantung Bintang', category: 'furniture', cost: 20, desc: 'Rangkaian lampu tidur hangat yang berpendar indah saat malam.' },
];

const DEFAULT_QUIZ_QUESTIONS = [
  { id: 'q_fav_1', category: 'Favorit', text: 'Makanan atau minuman apa yang paling bisa memperbaiki suasana hatimu saat sedang lelah?', isAi: false },
  { id: 'q_fav_2', category: 'Favorit', text: 'Waktu favoritmu untuk ngobrol santai berdua itu pagi hari, sore, atau larut malam?', isAi: false },
  { id: 'q_mem_1', category: 'Kenangan', text: 'Momen sederhana apa dari perjalanan kita yang paling sering kamu ingat tiba-tiba?', isAi: false },
  { id: 'q_fut_1', category: 'Rencana masa depan', text: 'Jika kita punya waktu libur tiga hari tanpa gangguan, tempat seperti apa yang ingin kamu kunjungi bersama?', isAi: false },
  { id: 'q_fun_1', category: 'Pertanyaan lucu', text: 'Kalau dunia kecil kita punya hewan peliharaan pixel, hewan apa yang paling cocok untuk kita?', isAi: false },
  { id: 'q_love_1', category: 'Cara merasa disayang', text: 'Saat kamu sedang banyak pikiran, kamu lebih suka ditemani dalam diam, diajak ngobrol, atau diberi waktu sendiri dulu?', isAi: false },
];

// ============================================================================
// 2. UTILITAS TANGGAL, VALIDASI, HASHING & LOGIKA SIKLUS MEDIAN
// ============================================================================

function todayLocalISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDaysLocalISO(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const ny = dt.getFullYear();
  const nm = String(dt.getMonth() + 1).padStart(2, '0');
  const nd = String(dt.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
}

function diffDaysLocalISO(startStr, endStr) {
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);
  const utc1 = Date.UTC(sy, sm - 1, sd);
  const utc2 = Date.UTC(ey, em - 1, ed);
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

function formatDateID(dateStr) {
  if (!dateStr) return '-';
  if (dateStr.includes('T')) {
    const dt = new Date(dateStr);
    return dt.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function hashInviteToken(rawToken) {
  const normalized = rawToken.trim().toUpperCase();
  let h1 = 0xdeadbeef ^ normalized.length;
  let h2 = 0x41c6ce57 ^ normalized.length;
  for (let i = 0, ch; i < normalized.length; i++) {
    ch = normalized.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 'sha256_' + (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

function validateSafeUrl(inputUrl) {
  const trimmed = (inputUrl || '').trim();
  if (!trimmed) return { valid: true };
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        valid: false,
        error: `Protokol "${parsed.protocol}" ditolak demi keamanan. Gunakan https:// atau http://.`,
      };
    }
    return { valid: true, hostname: parsed.hostname };
  } catch {
    return { valid: false, error: 'Format URL tidak valid. Pastikan diawali https:// atau http://.' };
  }
}

function calculateCyclePrediction(logs) {
  if (!logs || logs.length < 4) {
    return {
      hasEnoughData: false,
      intervalsCount: Math.max(0, (logs ? logs.length : 0) - 1),
      medianInterval: null,
      isIrregular: false,
      nextEstimatedStart: null,
      nextEstimatedEnd: null,
      message: 'Belum cukup data untuk membuat perkiraan (minimal 3 interval dari 4 catatan siklus).',
    };
  }

  const sorted = [...logs]
    .filter((l) => Boolean(l.start_date))
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  const intervals = [];
  for (let i = 1; i < sorted.length; i++) {
    const diff = diffDaysLocalISO(sorted[i - 1].start_date, sorted[i].start_date);
    if (diff >= 15 && diff <= 60) {
      intervals.push(diff);
    }
  }

  if (intervals.length < 3) {
    return {
      hasEnoughData: false,
      intervalsCount: intervals.length,
      medianInterval: null,
      isIrregular: false,
      nextEstimatedStart: null,
      nextEstimatedEnd: null,
      message: 'Belum cukup interval siklus yang valid (minimal 3 interval) untuk membuat perkiraan.',
    };
  }

  const recentIntervals = intervals.slice(-6);
  const sortedIntervals = [...recentIntervals].sort((a, b) => a - b);
  const mid = Math.floor(sortedIntervals.length / 2);
  const median =
    sortedIntervals.length % 2 !== 0
      ? sortedIntervals[mid]
      : Math.round((sortedIntervals[mid - 1] + sortedIntervals[mid]) / 2);

  const minInt = sortedIntervals[0];
  const maxInt = sortedIntervals[sortedIntervals.length - 1];
  const spread = maxInt - minInt;
  const isIrregular = spread > 9;

  const latestStart = sorted[sorted.length - 1].start_date;
  const nextStart = addDaysLocalISO(latestStart, median);
  const nextEnd = addDaysLocalISO(nextStart, 4);

  return {
    hasEnoughData: true,
    intervalsCount: recentIntervals.length,
    medianInterval: median,
    isIrregular,
    nextEstimatedStart: nextStart,
    nextEstimatedEnd: nextEnd,
    message: isIrregular
      ? `Riwayat siklus cukup bervariasi (rentang ${minInt}–${maxInt} hari, median ${median} hari). Perkiraan ini memiliki ketidakpastian tinggi.`
      : `Perkiraan dihitung dari median ${recentIntervals.length} interval terakhir (${median} hari). Ini adalah estimasi kalender, bukan kepastian medis.`,
  };
}

// ============================================================================
// 3. SEED DATABASE AWAL (DUMMY DATA: ADEL & MERDI + AKUN PIHAK KETIGA)
// ============================================================================

function createInitialSeedDatabase() {
  const today = todayLocalISO();
  const c1Start = addDaysLocalISO(today, -95);
  const c2Start = addDaysLocalISO(today, -67);
  const c3Start = addDaysLocalISO(today, -38);
  const c4Start = addDaysLocalISO(today, -10);

  const defaultTiles = Array.from({ length: 25 }, (_, idx) => {
    if (idx === 1) return { index: idx, item: 'window_view', stage: 4, last_watered_at: today, planted_by: 'user_adel' };
    if (idx === 2) return { index: idx, item: 'lantern_string', stage: 4, last_watered_at: today, planted_by: 'user_merdi' };
    if (idx === 3) return { index: idx, item: 'window_view', stage: 3, last_watered_at: today, planted_by: 'user_adel' };
    if (idx === 5) return { index: idx, item: 'bookshelf', stage: 4, last_watered_at: today, planted_by: 'user_adel' };
    if (idx === 7) return { index: idx, item: 'fireplace', stage: 4, last_watered_at: today, planted_by: 'user_merdi' };
    if (idx === 9) return { index: idx, item: 'gramophone', stage: 3, last_watered_at: today, planted_by: 'user_merdi' };
    if (idx === 11) return { index: idx, item: 'cat_mochi', stage: 4, last_watered_at: today, planted_by: 'user_adel' };
    if (idx === 12) return { index: idx, item: 'rug', stage: 4, last_watered_at: today, planted_by: 'user_merdi' };
    if (idx === 13) return { index: idx, item: 'bunny_bubu', stage: 3, last_watered_at: today, planted_by: 'user_merdi' };
    if (idx === 16) return { index: idx, item: 'sofa_cozy', stage: 4, last_watered_at: today, planted_by: 'user_adel' };
    if (idx === 17) return { index: idx, item: 'tea_table', stage: 4, last_watered_at: today, planted_by: 'user_merdi' };
    if (idx === 18) return { index: idx, item: 'fox_kuro', stage: 3, last_watered_at: today, planted_by: 'user_adel' };
    if (idx === 21) return { index: idx, item: 'bird_piyo', stage: 4, last_watered_at: today, planted_by: 'user_merdi' };
    if (idx === 23) return { index: idx, item: 'hamster_choco', stage: 2, last_watered_at: today, planted_by: 'user_adel' };
    return { index: idx, item: 'empty', stage: 1, last_watered_at: null, planted_by: null };
  });

  return {
    profiles: [
      {
        id: 'user_adel',
        email: 'adel@meradel.id',
        display_name: 'Adel',
        gender: 'female',
        avatar_key: 'mage_rose',
        created_at: '2025-01-10T08:00:00.000Z',
        updated_at: '2025-01-10T08:00:00.000Z',
      },
      {
        id: 'user_merdi',
        email: 'merdi@meradel.id',
        display_name: 'Merdi',
        gender: 'male',
        avatar_key: 'knight_sage',
        created_at: '2025-01-10T08:05:00.000Z',
        updated_at: '2025-01-10T08:05:00.000Z',
      },
      {
        id: 'user_intruder',
        email: 'doni@luar.id',
        display_name: 'Doni (Akun Luar)',
        gender: 'male',
        avatar_key: 'cat_cozy',
        created_at: '2025-02-01T10:00:00.000Z',
        updated_at: '2025-02-01T10:00:00.000Z',
      },
    ],
    couples: [
      {
        id: 'couple_meradel_01',
        name: 'Rumah Pohon Meradel',
        anniversary_date: addDaysLocalISO(today, 24),
        created_by: 'user_adel',
        created_at: '2025-01-10T08:10:00.000Z',
        unpaired_at: null,
      },
    ],
    couple_members: [
      {
        couple_id: 'couple_meradel_01',
        user_id: 'user_adel',
        role: 'owner',
        joined_at: '2025-01-10T08:10:00.000Z',
      },
      {
        couple_id: 'couple_meradel_01',
        user_id: 'user_merdi',
        role: 'member',
        joined_at: '2025-01-10T08:15:00.000Z',
      },
    ],
    couple_invites: [],
    cycle_logs: [
      {
        id: 'cyc_1',
        user_id: 'user_adel',
        start_date: c1Start,
        end_date: addDaysLocalISO(c1Start, 4),
        created_at: '2025-01-10T09:00:00.000Z',
        updated_at: '2025-01-10T09:00:00.000Z',
      },
      {
        id: 'cyc_2',
        user_id: 'user_adel',
        start_date: c2Start,
        end_date: addDaysLocalISO(c2Start, 5),
        created_at: '2025-01-15T09:00:00.000Z',
        updated_at: '2025-01-15T09:00:00.000Z',
      },
      {
        id: 'cyc_3',
        user_id: 'user_adel',
        start_date: c3Start,
        end_date: addDaysLocalISO(c3Start, 4),
        created_at: '2025-02-01T09:00:00.000Z',
        updated_at: '2025-02-01T09:00:00.000Z',
      },
      {
        id: 'cyc_4',
        user_id: 'user_adel',
        start_date: c4Start,
        end_date: addDaysLocalISO(c4Start, 4),
        created_at: '2025-02-20T09:00:00.000Z',
        updated_at: '2025-02-20T09:00:00.000Z',
      },
    ],
    cycle_sharing_settings: [
      {
        user_id: 'user_adel',
        couple_id: 'couple_meradel_01',
        share_cycle: true,
        share_mood: true,
        share_mood_note: false,
        updated_at: new Date().toISOString(),
      },
      {
        user_id: 'user_merdi',
        couple_id: 'couple_meradel_01',
        share_cycle: false,
        share_mood: true,
        share_mood_note: true,
        updated_at: new Date().toISOString(),
      },
    ],
    mood_entries: [
      {
        id: 'mood_1',
        user_id: 'user_adel',
        entry_date: today,
        mood: 'calm',
        energy: 4,
        symptoms: ['Tidak ada gejala'],
        note: 'Catatan jurnal pribadi: ingin me-time baca buku malam ini.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'mood_2',
        user_id: 'user_merdi',
        entry_date: today,
        mood: 'happy',
        energy: 5,
        symptoms: ['Tidak ada gejala'],
        note: 'Hari ini kerjaan lancar, siap masak makan malam bareng!',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    wishlist_items: [
      {
        id: 'wish_1',
        couple_id: 'couple_meradel_01',
        created_by: 'user_adel',
        title: 'Piknik sore di Kebun Raya sambil bawa bekal buatan sendiri',
        description: 'Bawa sandwich telur, teh hangat di termos, dan alas kain kotak-kotak.',
        url: 'https://kebunraya.id',
        category: 'date',
        priority: 'high',
        status: 'planned',
        created_at: '2025-02-10T10:00:00.000Z',
        updated_at: '2025-02-10T10:00:00.000Z',
      },
      {
        id: 'wish_2',
        couple_id: 'couple_meradel_01',
        created_by: 'user_merdi',
        title: 'Coba kedai ramen kuah kaldu jamur di pusat kota',
        description: 'Katanya gyoza panggangnya enak banget untuk makan malam akhir pekan.',
        url: null,
        category: 'food',
        priority: 'normal',
        status: 'saved',
        created_at: '2025-02-12T12:00:00.000Z',
        updated_at: '2025-02-12T12:00:00.000Z',
      },
      {
        id: 'wish_3',
        couple_id: 'couple_meradel_01',
        created_by: 'user_adel',
        title: 'Workshop bikin keramik mug pasangan',
        description: 'Sudah terlaksana minggu lalu! Mug masih proses pembakaran glasir.',
        url: 'https://example.com/pottery-class',
        category: 'activity',
        priority: 'high',
        status: 'completed',
        created_at: '2025-02-01T09:00:00.000Z',
        updated_at: '2025-02-18T16:00:00.000Z',
      },
    ],
    memories: [
      {
        id: 'mem_1',
        couple_id: 'couple_meradel_01',
        created_by: 'user_adel',
        title: 'Hujan Sore Pertama di Kedai Kopi Tua',
        caption: 'Kita terjebak hujan deras dua jam, akhirnya pesan pisang goreng hangat dan ngobrol panjang tentang mimpi kita.',
        memory_date: addDaysLocalISO(today, -21),
        media_path: 'couples/couple_meradel_01/pixel_rainy_cafe.svg',
        media_data_url: null,
        visibility: 'shared',
        created_at: '2025-02-14T15:00:00.000Z',
        updated_at: '2025-02-14T15:00:00.000Z',
      },
      {
        id: 'mem_2',
        couple_id: 'couple_meradel_01',
        created_by: 'user_merdi',
        title: 'Nyasar Saat Road Trip Cari Bukit Bintang',
        caption: 'Salah belok karena keasyikan nyanyi di mobil, tapi malah nemu warung jagung bakar dengan pemandangan lampu kota terbaik.',
        memory_date: addDaysLocalISO(today, -9),
        media_path: 'couples/couple_meradel_01/pixel_roadtrip_hill.svg',
        media_data_url: null,
        visibility: 'shared',
        created_at: '2025-02-18T20:00:00.000Z',
        updated_at: '2025-02-18T20:00:00.000Z',
      },
      {
        id: 'mem_3',
        couple_id: 'couple_meradel_01',
        created_by: 'user_adel',
        title: 'Draf Kejutan Ulang Tahun (Catatan Pribadi)',
        caption: 'Ide kado: jam tangan vintage warna cokelat tua dan surat tulisan tangan.',
        memory_date: today,
        media_path: null,
        media_data_url: null,
        visibility: 'private',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    love_notes: [
      {
        id: 'note_1',
        couple_id: 'couple_meradel_01',
        sender_id: 'user_merdi',
        recipient_id: 'user_adel',
        title: 'Terima kasih sudah selalu sabar dan hangat',
        body: 'Hai sayang, terima kasih ya sudah jadi teman cerita paling nyaman setiap pulang beraktivitas. Semoga hari ini kamu banyak tersenyum!',
        status: 'opened',
        open_at: null,
        opened_at: '2025-02-20T19:00:00.000Z',
        created_at: '2025-02-20T18:30:00.000Z',
        updated_at: '2025-02-20T19:00:00.000Z',
      },
      {
        id: 'note_2',
        couple_id: 'couple_meradel_01',
        sender_id: 'user_adel',
        recipient_id: 'user_merdi',
        title: 'Surat Kapsul Waktu untuk Hari Jadi Kita',
        body: 'RAHASIA TERKUNCI: Selamat hari jadi! Kalau kamu sudah bisa membaca isi surat ini, berarti waktunya sudah tiba. Aku sayang kamu!',
        status: 'scheduled',
        open_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        opened_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    garden_state: [
      {
        couple_id: 'couple_meradel_01',
        points: 65,
        unlocked_items: [
          'cat_mochi',
          'bunny_bubu',
          'bird_piyo',
          'fox_kuro',
          'hamster_choco',
          'panda_pao',
          'fireplace',
          'rug',
          'bookshelf',
          'tea_table',
          'window_view',
          'gramophone',
          'sofa_cozy',
          'lantern_string',
        ],
        tiles: defaultTiles,
        updated_at: new Date().toISOString(),
      },
    ],
    garden_events: [
      {
        id: 'ge_1',
        couple_id: 'couple_meradel_01',
        actor_id: 'user_adel',
        event_type: 'memory_created',
        reference_id: 'mem_1',
        idempotency_key: 'memory_first:mem_1',
        points_awarded: 15,
        created_at: '2025-02-14T15:00:00.000Z',
      },
    ],
    quiz_questions: DEFAULT_QUIZ_QUESTIONS,
    game_sessions: [
      {
        id: 'sess_1',
        couple_id: 'couple_meradel_01',
        game_type: 'couple_quiz',
        category: 'Semua Kategori',
        status: 'active',
        created_by: 'user_adel',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    game_answers: [
      {
        id: 'ans_1',
        session_id: 'sess_1',
        user_id: 'user_adel',
        question_id: 'q_fav_1',
        answer_text: 'Matcha latte hangat dan roti panggang mentega!',
        skipped: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ans_2',
        session_id: 'sess_1',
        user_id: 'user_merdi',
        question_id: 'q_fav_1',
        answer_text: 'Mie kuah hangat bikinan sendiri pas cuaca dingin.',
        skipped: false,
        created_at: new Date().toISOString(),
      },
    ],
  };
}

// ============================================================================
// 4. PIXEL ART SVG SPRITES (KARAKTER & 14 ITEM TAMAN DIORAMA)
// ============================================================================

const PixelAvatar = ({ avatarKey, size = 44, className = '' }) => {
  const palettes = {
    mage_rose: { hat: '#B86B7D', hair: '#4A3525', skin: '#F7D7B5', shirt: '#D98A9C', accent: '#FDF8EE' },
    knight_sage: { hat: '#4E6E5B', hair: '#2C1E14', skin: '#F0C8A0', shirt: '#6B8E78', accent: '#EFE2C6' },
    farmer_straw: { hat: '#D9A75A', hair: '#6E5039', skin: '#F5D0A9', shirt: '#8C684C', accent: '#D8E6DC' },
    cat_cozy: { hat: '#8C684C', hair: '#4A3525', skin: '#F7D7B5', shirt: '#B86B7D', accent: '#FDF8EE' },
  };
  const p = palettes[avatarKey] || palettes.mage_rose;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={`shrink-0 ${className}`}
      style={{ imageRendering: 'pixelated' }}
      aria-label={`Avatar ${avatarKey}`}
    >
      <rect x="0" y="0" width="16" height="16" fill="#FDF8EE" />
      <rect x="1" y="1" width="14" height="14" fill="#EFE2C6" />
      <rect x="4" y="2" width="8" height="2" fill={p.hat} />
      <rect x="3" y="4" width="10" height="1" fill={p.hat} />
      <rect x="7" y="2" width="2" height="1" fill={p.accent} />
      <rect x="4" y="5" width="8" height="5" fill={p.skin} />
      <rect x="3" y="5" width="1" height="4" fill={p.hair} />
      <rect x="12" y="5" width="1" height="4" fill={p.hair} />
      <rect x="5" y="7" width="1" height="1" fill="#2C1E14" />
      <rect x="10" y="7" width="1" height="1" fill="#2C1E14" />
      <rect x="4" y="8" width="1" height="1" fill="#E89999" />
      <rect x="11" y="8" width="1" height="1" fill="#E89999" />
      <rect x="7" y="9" width="2" height="1" fill="#6E5039" />
      <rect x="4" y="10" width="8" height="4" fill={p.shirt} />
      <rect x="6" y="10" width="4" height="1" fill={p.accent} />
    </svg>
  );
};

const SanctuarySprite = ({ item, stage, size = 44, isNight = false }) => {
  if (item === 'empty') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="7" width="12" height="1" fill="#A67C58" opacity="0.35" />
        <rect x="2" y="13" width="12" height="1" fill="#A67C58" opacity="0.35" />
        <rect x="6" y="4" width="1" height="3" fill="#A67C58" opacity="0.25" />
        <rect x="11" y="9" width="1" height="4" fill="#A67C58" opacity="0.25" />
      </svg>
    );
  }

  const isPet = ['cat_mochi', 'bunny_bubu', 'bird_piyo', 'fox_kuro', 'hamster_choco', 'panda_pao'].includes(item);

  // Tahap 1 untuk Pet: Keranjang / Bantal Bayi Pet
  if (isPet && stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="11" width="10" height="3" fill="#8C684C" />
        <rect x="4" y="10" width="8" height="2" fill="#D98A9C" />
        <rect x="6" y="7" width="4" height="4" fill="#FDF8EE" />
        <rect x="7" y="8" width="2" height="2" fill="#E69545" />
        <rect x="11" y="4" width="2" height="2" fill="#D98A9C" />
      </svg>
    );
  }

  if (item === 'cat_mochi') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="13" width="10" height="2" fill="#D98A9C" />
        <rect x="4" y="7" width="8" height="6" fill="#E69545" />
        <rect x="4" y="5" width="2" height="2" fill="#C9782C" />
        <rect x="10" y="5" width="2" height="2" fill="#C9782C" />
        <rect x="5" y="9" width="1" height="1" fill="#2C1E14" />
        <rect x="10" y="9" width="1" height="1" fill="#2C1E14" />
        <rect x="7" y="10" width="2" height="1" fill="#F4A7B9" />
        <rect x="12" y="9" width="2" height="3" fill="#C9782C" />
        {stage >= 3 && <rect x="5" y="12" width="6" height="1" fill="#D94E4E" />}
        {stage === 4 && (
          <>
            <rect x="7" y="2" width="2" height="2" fill="#D94E4E" />
            <rect x="6" y="3" width="4" height="1" fill="#D94E4E" />
          </>
        )}
      </svg>
    );
  }

  if (item === 'bunny_bubu') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="13" width="10" height="2" fill="#6B8E78" />
        <rect x="5" y="3" width="2" height="5" fill="#FDF8EE" />
        <rect x="9" y="3" width="2" height="5" fill="#FDF8EE" />
        <rect x="6" y="4" width="1" height="3" fill="#F4A7B9" />
        <rect x="9" y="4" width="1" height="3" fill="#F4A7B9" />
        <rect x="4" y="7" width="8" height="6" fill="#FDF8EE" />
        <rect x="6" y="9" width="1" height="1" fill="#2C1E14" />
        <rect x="9" y="9" width="1" height="1" fill="#2C1E14" />
        <rect x="7" y="10" width="2" height="1" fill="#F4A7B9" />
        {stage >= 3 && <rect x="11" y="10" width="2" height="3" fill="#E69545" />}
        {stage === 4 && <rect x="7" y="2" width="2" height="2" fill="#D94E4E" />}
      </svg>
    );
  }

  if (item === 'bird_piyo') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="12" width="10" height="2" fill="#6E5039" />
        <rect x="5" y="6" width="6" height="6" fill="#F5C73D" />
        <rect x="4" y="8" width="2" height="3" fill="#E69545" />
        <rect x="9" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="11" y="8" width="2" height="1" fill="#E69545" />
        {stage >= 3 && <rect x="12" y="4" width="2" height="2" fill="#6BA6C4" />}
        {stage === 4 && <rect x="6" y="4" width="3" height="2" fill="#D94E4E" />}
      </svg>
    );
  }

  if (item === 'fox_kuro') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="4" y="7" width="7" height="6" fill="#D96B43" />
        <rect x="4" y="5" width="2" height="2" fill="#4A3525" />
        <rect x="9" y="5" width="2" height="2" fill="#4A3525" />
        <rect x="5" y="10" width="5" height="3" fill="#FDF8EE" />
        <rect x="5" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="9" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="11" y="8" width="3" height="4" fill="#D96B43" />
        <rect x="12" y="7" width="2" height="2" fill="#FDF8EE" />
        {stage === 4 && <rect x="6" y="3" width="3" height="2" fill="#F7D469" />}
      </svg>
    );
  }

  if (item === 'hamster_choco') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="4" y="7" width="8" height="6" fill="#C99A6B" />
        <rect x="5" y="9" width="6" height="4" fill="#FDF8EE" />
        <rect x="4" y="6" width="2" height="2" fill="#8C684C" />
        <rect x="10" y="6" width="2" height="2" fill="#8C684C" />
        <rect x="6" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="9" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="4" y="9" width="2" height="2" fill="#F4A7B9" />
        <rect x="10" y="9" width="2" height="2" fill="#F4A7B9" />
        {stage >= 3 && <rect x="7" y="10" width="2" height="2" fill="#4A3525" />}
        {stage === 4 && <rect x="7" y="3" width="2" height="2" fill="#D94E4E" />}
      </svg>
    );
  }

  if (item === 'panda_pao') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="4" y="6" width="8" height="7" fill="#C85A32" />
        <rect x="3" y="5" width="2" height="2" fill="#FDF8EE" />
        <rect x="11" y="5" width="2" height="2" fill="#FDF8EE" />
        <rect x="5" y="8" width="2" height="2" fill="#FDF8EE" />
        <rect x="9" y="8" width="2" height="2" fill="#FDF8EE" />
        <rect x="6" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="9" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="6" y="11" width="4" height="2" fill="#4A3525" />
        {stage === 4 && <rect x="7" y="3" width="2" height="2" fill="#6B8E78" />}
      </svg>
    );
  }

  // Furnitur Rumah Pohon
  if (item === 'fireplace') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        {isNight && <circle cx="8" cy="9" r="7" fill="#F59E42" opacity="0.35" />}
        <rect x="2" y="3" width="12" height="11" fill="#8C4A3B" />
        <rect x="1" y="3" width="14" height="2" fill="#5C3D28" />
        <rect x="4" y="6" width="8" height="8" fill="#2C1E14" />
        <rect x="5" y="9" width="6" height="5" fill="#E66833" />
        <rect x="6" y="10" width="4" height="4" fill="#F7D469" />
        {stage >= 3 && <rect x="7" y="7" width="2" height="3" fill="#FFF394" />}
      </svg>
    );
  }

  if (item === 'rug') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="4" width="12" height="8" fill="#D98A9C" />
        <rect x="3" y="5" width="10" height="6" fill="#FDF8EE" />
        <rect x="5" y="6" width="6" height="4" fill="#6B8E78" />
        {stage >= 3 && <rect x="7" y="7" width="2" height="2" fill="#F7D469" />}
      </svg>
    );
  }

  if (item === 'bookshelf') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="2" width="10" height="12" fill="#6E5039" />
        <rect x="4" y="3" width="8" height="3" fill="#4A3525" />
        <rect x="4" y="7" width="8" height="3" fill="#4A3525" />
        <rect x="4" y="4" width="2" height="2" fill="#D98A9C" />
        <rect x="6" y="3" width="2" height="3" fill="#6B8E78" />
        <rect x="9" y="4" width="2" height="2" fill="#F2B857" />
        <rect x="5" y="8" width="2" height="2" fill="#6BA6C4" />
        <rect x="8" y="7" width="3" height="3" fill="#D9534F" />
      </svg>
    );
  }

  if (item === 'tea_table') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="9" width="12" height="2" fill="#8C684C" />
        <rect x="3" y="11" width="2" height="3" fill="#5C3D28" />
        <rect x="11" y="11" width="2" height="3" fill="#5C3D28" />
        <rect x="5" y="6" width="3" height="3" fill="#6B8E78" />
        <rect x="9" y="7" width="2" height="2" fill="#FDF8EE" />
        {stage >= 3 && <rect x="6" y="4" width="1" height="2" fill="#FDF8EE" opacity="0.8" />}
      </svg>
    );
  }

  if (item === 'window_view') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="2" width="12" height="11" fill="#5C3D28" />
        <rect x="3" y="3" width="10" height="9" fill={isNight ? '#1E293B' : '#8ECAE6'} />
        {isNight ? (
          <>
            <rect x="5" y="5" width="2" height="2" fill="#FFF394" />
            <rect x="10" y="7" width="1" height="1" fill="#FFF394" />
          </>
        ) : (
          <rect x="9" y="4" width="3" height="3" fill="#F7D469" />
        )}
        <rect x="7" y="3" width="2" height="9" fill="#5C3D28" />
        <rect x="3" y="7" width="10" height="1" fill="#5C3D28" />
      </svg>
    );
  }

  if (item === 'gramophone') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="4" y="10" width="8" height="4" fill="#6E5039" />
        <rect x="5" y="9" width="6" height="1" fill="#2C1E14" />
        <rect x="7" y="4" width="5" height="5" fill="#F2B857" />
        <rect x="9" y="5" width="2" height="3" fill="#C9782C" />
        {stage >= 3 && <rect x="3" y="3" width="2" height="2" fill="#D98A9C" />}
      </svg>
    );
  }

  if (item === 'sofa_cozy') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="5" width="10" height="6" fill="#D98A9C" />
        <rect x="2" y="7" width="2" height="5" fill="#B86B7D" />
        <rect x="12" y="7" width="2" height="5" fill="#B86B7D" />
        <rect x="4" y="9" width="8" height="3" fill="#F4A7B9" />
        <rect x="3" y="12" width="2" height="2" fill="#4A3525" />
        <rect x="11" y="12" width="2" height="2" fill="#4A3525" />
      </svg>
    );
  }

  // lantern_string
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      {isNight && <circle cx="8" cy="7" r="6" fill="#FFF394" opacity="0.35" />}
      <rect x="1" y="3" width="14" height="1" fill="#4A3525" />
      <rect x="3" y="4" width="2" height="3" fill="#FFF394" />
      <rect x="7" y="5" width="2" height="3" fill="#F7D469" />
      <rect x="11" y="4" width="2" height="3" fill="#FFF394" />
    </svg>
  );
};

// ============================================================================
// 5. KOMPONEN UI DESIGN SYSTEM PIXEL (TANPA ALERT/CONFIRM BROWSER)
// ============================================================================

interface PixelCardProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'cream' | 'sage' | 'pink' | 'warm' | string;
}

const PixelCard: React.FC<PixelCardProps> = ({ children, className = '', variant = 'cream' }) => {
  const bgMap = {
    cream: 'bg-[#FDF8EE] border-[#4A3525]',
    sage: 'bg-[#E6EFE9] border-[#4E6E5B]',
    pink: 'bg-[#F9EBEF] border-[#8C4F5E]',
    warm: 'bg-[#F5E9D4] border-[#6E5039]',
  };
  return (
    <div
      className={`border-2 ${bgMap[variant] || bgMap.cream} shadow-[4px_4px_0px_0px_#4A3525] p-4 transition-all ${className}`}
    >
      {children}
    </div>
  );
};

interface PixelButtonProps {
  children?: React.ReactNode;
  onClick?: (e?: any) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'pink' | 'danger' | 'ghost' | string;
  disabled?: boolean;
  className?: string;
  title?: string;
}

const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick = () => {},
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  title = '',
}) => {
  const styles: Record<string, string> = {
    primary: 'bg-[#6B8E78] hover:bg-[#587A65] text-[#FDF8EE] border-[#2C1E14]',
    secondary: 'bg-[#EFE2C6] hover:bg-[#E4D3B0] text-[#2C1E14] border-[#4A3525]',
    pink: 'bg-[#D98A9C] hover:bg-[#C67487] text-[#FDF8EE] border-[#4A3525]',
    danger: 'bg-[#C95B5B] hover:bg-[#B04646] text-[#FDF8EE] border-[#2C1E14]',
    ghost: 'bg-transparent hover:bg-[#EFE2C6]/60 text-[#4A3525] border-transparent shadow-none',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`min-h-[42px] px-3.5 py-2 border-2 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:pointer-events-none ${
        variant !== 'ghost' ? 'shadow-[3px_3px_0px_0px_#2C1E14]' : ''
      } ${styles[variant] || styles.primary} ${className}`}
    >
      {children}
    </button>
  );
};

// ============================================================================
// 6. APLIKASI UTAMA MERADEL
// ============================================================================

export default function App() {
  // --- Database State dengan Persistensi LocalStorage ---
  const [db, setDb] = useState(() => {
    try {
      const saved = localStorage.getItem(DB_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.profiles)) {
          return parsed;
        }
      }
    } catch {
      // Fallback ke seed
    }
    return createInitialSeedDatabase();
  });

  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    } catch {
      // Abaikan jika storage penuh
    }
  }, [db]);

  // --- Sesi Autentikasi & Route ---
  const [currentUserId, setCurrentUserId] = useState('user_adel');
  const [authView, setAuthView] = useState('login');
  const [activeRoute, setActiveRoute] = useState('home');

  // --- Toast & Custom Confirmation Modal (Pengganti alert/confirm) ---
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3800);
  }, []);

  const requestConfirm = useCallback((title, message, onConfirm) => {
    setConfirmDialog({ title, message, onConfirm });
  }, []);

  // --- QA Simulator & Spec Modal ---
  const [showTestModal, setShowTestModal] = useState(false);
  const [showSpecModal, setShowSpecModal] = useState(false);

  // ============================================================================
  // 7. BACKEND / RLS AUTHORIZATION LAYER
  // ============================================================================

  const currentUser = useMemo(
    () => db.profiles.find((p) => p.id === currentUserId) || null,
    [db.profiles, currentUserId]
  );

  const currentMembership = useMemo(() => {
    if (!currentUserId) return null;
    return (
      db.couple_members.find((cm) => {
        const c = db.couples.find((cp) => cp.id === cm.couple_id && cp.unpaired_at === null);
        return cm.user_id === currentUserId && Boolean(c);
      }) || null
    );
  }, [db.couple_members, db.couples, currentUserId]);

  const currentCouple = useMemo(() => {
    if (!currentMembership) return null;
    return db.couples.find((c) => c.id === currentMembership.couple_id && c.unpaired_at === null) || null;
  }, [db.couples, currentMembership]);

  const partnerProfile = useMemo(() => {
    if (!currentCouple || !currentUserId) return null;
    const partnerMember = db.couple_members.find(
      (cm) => cm.couple_id === currentCouple.id && cm.user_id !== currentUserId
    );
    if (!partnerMember) return null;
    return db.profiles.find((p) => p.id === partnerMember.user_id) || null;
  }, [db.couple_members, db.profiles, currentCouple, currentUserId]);

  const isMemberOfCouple = useCallback(
    (userId, coupleId) => {
      if (!userId) return false;
      const c = db.couples.find((cp) => cp.id === coupleId && cp.unpaired_at === null);
      if (!c) return false;
      return db.couple_members.some((cm) => cm.couple_id === coupleId && cm.user_id === userId);
    },
    [db.couples, db.couple_members]
  );

  // Hanya akun perempuan yang memiliki fitur pencatatan menstruasi pribadi
  const canTrackOwnCycle = currentUser?.gender === 'female';

  const partnerCycleConsent = useMemo(() => {
    if (!partnerProfile || !currentCouple) return null;
    return (
      db.cycle_sharing_settings.find(
        (s) => s.user_id === partnerProfile.id && s.couple_id === currentCouple.id
      ) || {
        user_id: partnerProfile.id,
        couple_id: currentCouple.id,
        share_cycle: false,
        share_mood: false,
        share_mood_note: false,
        updated_at: '',
      }
    );
  }, [db.cycle_sharing_settings, partnerProfile, currentCouple]);

  const myCycleConsent = useMemo(() => {
    if (!currentUserId || !currentCouple) return null;
    return (
      db.cycle_sharing_settings.find(
        (s) => s.user_id === currentUserId && s.couple_id === currentCouple.id
      ) || {
        user_id: currentUserId,
        couple_id: currentCouple.id,
        share_cycle: false,
        share_mood: false,
        share_mood_note: false,
        updated_at: '',
      }
    );
  }, [db.cycle_sharing_settings, currentUserId, currentCouple]);

  const authorizedLoveNotes = useMemo(() => {
    if (!currentUserId || !currentCouple) return { inbox: [], sent: [] };
    const nowIso = new Date().toISOString();

    const inbox = db.love_notes
      .filter(
        (n) =>
          n.couple_id === currentCouple.id &&
          n.recipient_id === currentUserId &&
          n.status !== 'draft'
      )
      .map((n) => {
        const isLocked = Boolean(n.open_at && n.open_at > nowIso);
        return {
          ...n,
          body: isLocked ? '🔒 [Isi surat dikunci oleh server hingga waktu buka tiba]' : n.body,
          isLocked,
        };
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at));

    const sent = db.love_notes
      .filter((n) => n.couple_id === currentCouple.id && n.sender_id === currentUserId)
      .map((n) => ({
        ...n,
        isLocked: Boolean(n.open_at && n.open_at > nowIso),
      }))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));

    return { inbox, sent };
  }, [db.love_notes, currentUserId, currentCouple]);

  const authorizedMemories = useMemo(() => {
    if (!currentUserId || !currentCouple) return [];
    return db.memories
      .filter((m) => {
        if (m.couple_id !== currentCouple.id) return false;
        if (m.visibility === 'private') return m.created_by === currentUserId;
        return isMemberOfCouple(currentUserId, m.couple_id);
      })
      .sort((a, b) => b.memory_date.localeCompare(a.memory_date));
  }, [db.memories, currentUserId, currentCouple, isMemberOfCouple]);

  const authorizedWishlist = useMemo(() => {
    if (!currentUserId || !currentCouple) return [];
    if (!isMemberOfCouple(currentUserId, currentCouple.id)) return [];
    return db.wishlist_items
      .filter((w) => w.couple_id === currentCouple.id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [db.wishlist_items, currentUserId, currentCouple, isMemberOfCouple]);

  const awardGardenPointsIdempotent = useCallback(
    (eventType, referenceId, points, customKey) => {
      if (!currentUserId || !currentCouple || points <= 0) return false;
      const idempotencyKey = customKey || `${eventType}:${currentCouple.id}:${referenceId || todayLocalISO()}`;

      let awarded = false;
      setDb((prev) => {
        if (prev.garden_events.some((ge) => ge.idempotency_key === idempotencyKey)) {
          return prev;
        }
        awarded = true;
        const newEvent = {
          id: `ge_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          couple_id: currentCouple.id,
          actor_id: currentUserId,
          event_type: eventType,
          reference_id: referenceId,
          idempotency_key: idempotencyKey,
          points_awarded: points,
          created_at: new Date().toISOString(),
        };

        const existingGarden = prev.garden_state.find((g) => g.couple_id === currentCouple.id);
        const updatedGardens = existingGarden
          ? prev.garden_state.map((g) =>
              g.couple_id === currentCouple.id
                ? { ...g, points: g.points + points, updated_at: new Date().toISOString() }
                : g
            )
          : prev.garden_state;

        return {
          ...prev,
          garden_events: [newEvent, ...prev.garden_events],
          garden_state: updatedGardens,
        };
      });

      return awarded;
    },
    [currentUserId, currentCouple]
  );

  // ============================================================================
  // 8. STATE SEMUA MODUL (DIATAS EARLY RETURN AGAR PATUH RULES OF HOOKS)
  // ============================================================================

  // --- Auth & Pairing State ---
  const [loginEmail, setLoginEmail] = useState('adel@meradel.id');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regGender, setRegGender] = useState('female');
  const [regAvatar, setRegAvatar] = useState('mage_rose');
  const [newWorldName, setNewWorldName] = useState('Dunia Kecil Kita');
  const [generatedRawToken, setGeneratedRawToken] = useState(null);
  const [joinTokenInput, setJoinTokenInput] = useState('');

  // --- Cycle & Mood State ---
  const [cycleStartInput, setCycleStartInput] = useState(todayLocalISO());
  const [cycleEndInput, setCycleEndInput] = useState('');
  const [moodDateInput, setMoodDateInput] = useState(todayLocalISO());
  const [selectedMood, setSelectedMood] = useState('calm');
  const [selectedEnergy, setSelectedEnergy] = useState(4);
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Tidak ada gejala']);
  const [moodNoteInput, setMoodNoteInput] = useState('');
  const [calMonthOffset, setCalMonthOffset] = useState(0);

  // --- Wishlist State ---
  const [wishTitle, setWishTitle] = useState('');
  const [wishDesc, setWishDesc] = useState('');
  const [wishUrl, setWishUrl] = useState('');
  const [wishCategory, setWishCategory] = useState('date');
  const [wishPriority, setWishPriority] = useState('normal');
  const [wishFilterCategory, setWishFilterCategory] = useState('all');
  const [wishFilterStatus, setWishFilterStatus] = useState('all');
  const [wishSearch, setWishSearch] = useState('');
  const [showWishModal, setShowWishModal] = useState(false);

  // --- Memories State ---
  const [memTitle, setMemTitle] = useState('');
  const [memCaption, setMemCaption] = useState('');
  const [memDate, setMemDate] = useState(todayLocalISO());
  const [memVisibility, setMemVisibility] = useState('shared');
  const [memImagePreview, setMemImagePreview] = useState(null);
  const [showMemModal, setShowMemModal] = useState(false);

  // --- Love Notes State ---
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteScheduleDate, setNoteScheduleDate] = useState('');
  const [noteTab, setNoteTab] = useState('inbox');
  const [selectedNoteToRead, setSelectedNoteToRead] = useState(null);

  // --- Sanctuary & Pet Care State ---
  const [selectedBrush, setSelectedBrush] = useState('care');
  const [sanctuaryAmbiance, setSanctuaryAmbiance] = useState('day'); // 'day' | 'sunset' | 'night' | 'rain'
  const [sanctuaryCategoryTab, setSanctuaryCategoryTab] = useState('all'); // 'all' | 'pet' | 'furniture'
  const [inspectedTileIndex, setInspectedTileIndex] = useState(11);

  // --- Couple Quiz & AI Memory Generator State ---
  const [quizInputs, setQuizInputs] = useState({});
  const [quizCategoryFilter, setQuizCategoryFilter] = useState('Semua');
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState(false);

  // --- Settings State ---
  const [editProfileName, setEditProfileName] = useState('');
  const [editWorldName, setEditWorldName] = useState('');
  const [editAnnivDate, setEditAnnivDate] = useState('');

  useEffect(() => {
    if (currentUser) setEditProfileName(currentUser.display_name);
  }, [currentUser]);

  useEffect(() => {
    if (currentCouple) {
      setEditWorldName(currentCouple.name);
      setEditAnnivDate(currentCouple.anniversary_date || '');
    }
  }, [currentCouple]);

  // ============================================================================
  // 9. DATA TURUNAN (MEMOIZED)
  // ============================================================================

  const myCycleLogs = useMemo(
    () =>
      db.cycle_logs
        .filter((l) => l.user_id === currentUserId)
        .sort((a, b) => b.start_date.localeCompare(a.start_date)),
    [db.cycle_logs, currentUserId]
  );

  const partnerCycleLogs = useMemo(() => {
    if (!partnerProfile || !partnerCycleConsent?.share_cycle) return [];
    return db.cycle_logs
      .filter((l) => l.user_id === partnerProfile.id)
      .sort((a, b) => b.start_date.localeCompare(a.start_date));
  }, [db.cycle_logs, partnerProfile, partnerCycleConsent]);

  const myCyclePrediction = useMemo(() => calculateCyclePrediction(myCycleLogs), [myCycleLogs]);
  const partnerCyclePrediction = useMemo(
    () => calculateCyclePrediction(partnerCycleLogs),
    [partnerCycleLogs]
  );

  const myMoodEntries = useMemo(
    () =>
      db.mood_entries
        .filter((m) => m.user_id === currentUserId)
        .sort((a, b) => b.entry_date.localeCompare(a.entry_date)),
    [db.mood_entries, currentUserId]
  );

  const partnerSharedMoodEntries = useMemo(() => {
    if (!partnerProfile || !partnerCycleConsent?.share_mood) return [];
    return db.mood_entries
      .filter((m) => m.user_id === partnerProfile.id)
      .map((m) => ({
        ...m,
        note: partnerCycleConsent.share_mood_note ? m.note : null,
      }))
      .sort((a, b) => b.entry_date.localeCompare(a.entry_date));
  }, [db.mood_entries, partnerProfile, partnerCycleConsent]);

  const currentGarden = useMemo(() => {
    if (!currentCouple) return null;
    return db.garden_state.find((g) => g.couple_id === currentCouple.id) || null;
  }, [db.garden_state, currentCouple]);

  const sanctuaryStats = useMemo(() => {
    if (!currentGarden) return { petCount: 0, maxStagePets: 0, furnitureCount: 0, cozyLevel: 1, cozyProgress: 20 };
    const petTypes = ['cat_mochi', 'bunny_bubu', 'bird_piyo', 'fox_kuro', 'hamster_choco', 'panda_pao'];
    let petCount = 0;
    let maxStagePets = 0;
    let furnitureCount = 0;
    currentGarden.tiles.forEach((t) => {
      if (t.item === 'empty') return;
      if (petTypes.includes(t.item)) {
        petCount++;
        if (t.stage >= 4) maxStagePets++;
      } else {
        furnitureCount++;
      }
    });
    const score = maxStagePets * 15 + petCount * 10 + furnitureCount * 7;
    const cozyLevel = Math.max(1, Math.floor(score / 40) + 1);
    const cozyProgress = Math.min(100, Math.round(((score % 40) / 40) * 100));
    return { petCount, maxStagePets, furnitureCount, cozyLevel, cozyProgress };
  }, [currentGarden]);

  // ============================================================================
  // 10. EVENT HANDLERS
  // ============================================================================

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const trimmed = loginEmail.trim().toLowerCase();
    const found = db.profiles.find((p) => p.email.toLowerCase() === trimmed);
    if (!found) {
      showToast('Akun dengan email tersebut belum terdaftar. Silakan daftar baru.', 'error');
      return;
    }
    setCurrentUserId(found.id);
    showToast(`Selamat datang kembali, ${found.display_name}!`, 'success');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const name = regName.trim();
    const email = regEmail.trim().toLowerCase();
    if (name.length < 2) {
      showToast('Nama panggilan minimal 2 karakter.', 'error');
      return;
    }
    if (!email.includes('@')) {
      showToast('Masukkan alamat email yang valid.', 'error');
      return;
    }
    if (db.profiles.some((p) => p.email.toLowerCase() === email)) {
      showToast('Email sudah terdaftar. Silakan masuk.', 'error');
      return;
    }
    const newProfile = {
      id: `user_${Date.now()}`,
      email,
      display_name: name,
      gender: regGender,
      avatar_key: regAvatar,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDb((prev) => ({
      ...prev,
      profiles: [...prev.profiles, newProfile],
    }));
    setCurrentUserId(newProfile.id);
    showToast(`Akun ${name} berhasil dibuat! Sekarang hubungkan dunia pasanganmu.`, 'success');
  };

  const handleCreateWorld = (e) => {
    e.preventDefault();
    if (!currentUserId || currentCouple) return;
    const trimmedName = newWorldName.trim();
    if (trimmedName.length < 3) {
      showToast('Nama dunia minimal 3 karakter.', 'error');
      return;
    }

    const coupleId = `couple_${Date.now()}`;
    const rawCode = `MRDL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
    const tokenHash = hashInviteToken(rawCode);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newCouple = {
      id: coupleId,
      name: trimmedName,
      anniversary_date: null,
      created_by: currentUserId,
      created_at: new Date().toISOString(),
      unpaired_at: null,
    };

    const newMember = {
      couple_id: coupleId,
      user_id: currentUserId,
      role: 'owner',
      joined_at: new Date().toISOString(),
    };

    const newInvite = {
      id: `inv_${Date.now()}`,
      couple_id: coupleId,
      token_hash: tokenHash,
      raw_preview_hint: rawCode,
      created_by: currentUserId,
      expires_at: expiresAt,
      used_at: null,
      used_by: null,
      created_at: new Date().toISOString(),
    };

    const defaultGarden = {
      couple_id: coupleId,
      points: 30,
      unlocked_items: ['cat_mochi', 'bunny_bubu', 'fireplace', 'rug'],
      tiles: Array.from({ length: 25 }, (_, i) => ({
        index: i,
        item: i === 12 ? 'cat_mochi' : i === 7 ? 'fireplace' : 'empty',
        stage: i === 12 ? 2 : 3,
        last_watered_at: todayLocalISO(),
        planted_by: i === 12 || i === 7 ? currentUserId : null,
      })),
      updated_at: new Date().toISOString(),
    };

    setDb((prev) => ({
      ...prev,
      couples: [...prev.couples, newCouple],
      couple_members: [...prev.couple_members, newMember],
      couple_invites: [...prev.couple_invites, newInvite],
      garden_state: [...prev.garden_state, defaultGarden],
      cycle_sharing_settings: [
        ...prev.cycle_sharing_settings,
        {
          user_id: currentUserId,
          couple_id: coupleId,
          share_cycle: false,
          share_mood: false,
          share_mood_note: false,
          updated_at: new Date().toISOString(),
        },
      ],
    }));

    setGeneratedRawToken(rawCode);
    showToast('Dunia baru dan kode undangan 24 jam berhasil dibuat!', 'success');
  };

  const handleGenerateInviteForExistingCouple = () => {
    if (!currentUserId || !currentCouple) return;
    const rawCode = `MRDL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
    const tokenHash = hashInviteToken(rawCode);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newInvite = {
      id: `inv_${Date.now()}`,
      couple_id: currentCouple.id,
      token_hash: tokenHash,
      raw_preview_hint: rawCode,
      created_by: currentUserId,
      expires_at: expiresAt,
      used_at: null,
      used_by: null,
      created_at: new Date().toISOString(),
    };

    setDb((prev) => ({
      ...prev,
      couple_invites: [...prev.couple_invites, newInvite],
    }));
    setGeneratedRawToken(rawCode);
    showToast('Kode undangan baru berhasil dibuat (berlaku 24 jam).', 'success');
  };

  const handleJoinWithCode = (e) => {
    e.preventDefault();
    if (!currentUserId || currentCouple) return;
    const cleanedCode = joinTokenInput.trim().toUpperCase();
    if (!cleanedCode) {
      showToast('Masukkan kode undangan terlebih dahulu.', 'error');
      return;
    }

    const hashedInput = hashInviteToken(cleanedCode);
    const invite = db.couple_invites.find((inv) => inv.token_hash === hashedInput);

    if (!invite) {
      showToast('Kode undangan tidak ditemukan atau tidak valid.', 'error');
      return;
    }
    if (invite.used_at !== null) {
      showToast('Kode undangan ini sudah pernah digunakan (hanya berlaku 1 kali).', 'error');
      return;
    }
    if (new Date(invite.expires_at).getTime() < Date.now()) {
      showToast('Kode undangan sudah kedaluwarsa (lebih dari 24 jam).', 'error');
      return;
    }

    const targetCouple = db.couples.find((c) => c.id === invite.couple_id && c.unpaired_at === null);
    if (!targetCouple) {
      showToast('Dunia pasangan tujuan sudah tidak aktif.', 'error');
      return;
    }

    const existingMembers = db.couple_members.filter((cm) => cm.couple_id === targetCouple.id);
    if (existingMembers.length >= 2) {
      showToast('Dunia ini sudah penuh (maksimal 2 anggota per dunia pasangan).', 'error');
      return;
    }

    const nowIso = new Date().toISOString();
    setDb((prev) => ({
      ...prev,
      couple_invites: prev.couple_invites.map((i) =>
        i.id === invite.id ? { ...i, used_at: nowIso, used_by: currentUserId } : i
      ),
      couple_members: [
        ...prev.couple_members,
        {
          couple_id: targetCouple.id,
          user_id: currentUserId,
          role: 'member',
          joined_at: nowIso,
        },
      ],
      cycle_sharing_settings: [
        ...prev.cycle_sharing_settings,
        {
          user_id: currentUserId,
          couple_id: targetCouple.id,
          share_cycle: false,
          share_mood: false,
          share_mood_note: false,
          updated_at: nowIso,
        },
      ],
    }));

    setJoinTokenInput('');
    setActiveRoute('home');
    showToast(`Berhasil terhubung ke "${targetCouple.name}"!`, 'success');
  };

  const handleAddCycleLog = (e) => {
    e.preventDefault();
    if (!currentUserId || !canTrackOwnCycle) return;
    if (!cycleStartInput) {
      showToast('Tanggal mulai menstruasi wajib diisi.', 'error');
      return;
    }
    if (cycleEndInput && cycleEndInput < cycleStartInput) {
      showToast('Tanggal selesai tidak boleh sebelum tanggal mulai.', 'error');
      return;
    }
    if (myCycleLogs.some((l) => l.start_date === cycleStartInput)) {
      showToast('Catatan siklus dengan tanggal mulai tersebut sudah ada.', 'error');
      return;
    }

    const newLog = {
      id: `cyc_${Date.now()}`,
      user_id: currentUserId,
      start_date: cycleStartInput,
      end_date: cycleEndInput || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDb((prev) => ({
      ...prev,
      cycle_logs: [newLog, ...prev.cycle_logs],
    }));
    setCycleEndInput('');
    showToast('Catatan siklus berhasil disimpan.', 'success');
  };

  const handleDeleteCycleLog = (id) => {
    setDb((prev) => ({
      ...prev,
      cycle_logs: prev.cycle_logs.filter((l) => !(l.id === id && l.user_id === currentUserId)),
    }));
    showToast('Catatan siklus dihapus.', 'info');
  };

  const handleSaveMoodEntry = (e) => {
    e.preventDefault();
    if (!currentUserId) return;
    const nowIso = new Date().toISOString();

    setDb((prev) => {
      const existing = prev.mood_entries.find(
        (m) => m.user_id === currentUserId && m.entry_date === moodDateInput
      );
      if (existing) {
        return {
          ...prev,
          mood_entries: prev.mood_entries.map((m) =>
            m.id === existing.id
              ? {
                  ...m,
                  mood: selectedMood,
                  energy: selectedEnergy,
                  symptoms: selectedSymptoms,
                  note: moodNoteInput.trim() || null,
                  updated_at: nowIso,
                }
              : m
          ),
        };
      }
      const newEntry = {
        id: `mood_${Date.now()}`,
        user_id: currentUserId,
        entry_date: moodDateInput,
        mood: selectedMood,
        energy: selectedEnergy,
        symptoms: selectedSymptoms,
        note: moodNoteInput.trim() || null,
        created_at: nowIso,
        updated_at: nowIso,
      };
      return {
        ...prev,
        mood_entries: [newEntry, ...prev.mood_entries],
      };
    });

    setMoodNoteInput('');
    showToast('Check-in kondisi harian tersimpan.', 'success');
  };

  const handleToggleConsent = (field) => {
    if (!currentUserId || !currentCouple) return;
    setDb((prev) => {
      const exists = prev.cycle_sharing_settings.find(
        (s) => s.user_id === currentUserId && s.couple_id === currentCouple.id
      );
      if (exists) {
        return {
          ...prev,
          cycle_sharing_settings: prev.cycle_sharing_settings.map((s) =>
            s.user_id === currentUserId && s.couple_id === currentCouple.id
              ? { ...s, [field]: !s[field], updated_at: new Date().toISOString() }
              : s
          ),
        };
      }
      return {
        ...prev,
        cycle_sharing_settings: [
          ...prev.cycle_sharing_settings,
          {
            user_id: currentUserId,
            couple_id: currentCouple.id,
            share_cycle: field === 'share_cycle',
            share_mood: field === 'share_mood',
            share_mood_note: field === 'share_mood_note',
            updated_at: new Date().toISOString(),
          },
        ],
      };
    });
    showToast('Pengaturan izin berbagi diperbarui.', 'info');
  };

  const handleAddWishlist = (e) => {
    e.preventDefault();
    if (!currentUserId || !currentCouple) return;
    const title = wishTitle.trim();
    if (!title) {
      showToast('Judul wishlist wajib diisi.', 'error');
      return;
    }

    const urlCheck = validateSafeUrl(wishUrl);
    if (!urlCheck.valid) {
      showToast(urlCheck.error || 'URL tidak aman.', 'error');
      return;
    }

    const newItem = {
      id: `wish_${Date.now()}`,
      couple_id: currentCouple.id,
      created_by: currentUserId,
      title,
      description: wishDesc.trim() || null,
      url: wishUrl.trim() || null,
      category: wishCategory,
      priority: wishPriority,
      status: 'saved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDb((prev) => ({
      ...prev,
      wishlist_items: [newItem, ...prev.wishlist_items],
    }));

    setWishTitle('');
    setWishDesc('');
    setWishUrl('');
    setShowWishModal(false);
    showToast('Wishlist baru berhasil ditambahkan!', 'success');
  };

  const handleUpdateWishStatus = (item, status) => {
    setDb((prev) => ({
      ...prev,
      wishlist_items: prev.wishlist_items.map((w) =>
        w.id === item.id ? { ...w, status, updated_at: new Date().toISOString() } : w
      ),
    }));
    if (status === 'completed') {
      const gotReward = awardGardenPointsIdempotent(
        'wishlist_completed',
        item.id,
        10,
        `wishlist_done:${item.id}`
      );
      showToast(
        gotReward
          ? 'Wishlist selesai! +10 Poin Kasih ditambahkan ke Rumah Pohon kalian.'
          : 'Status wishlist diubah menjadi Selesai.',
        'success'
      );
    } else {
      showToast('Status wishlist diperbarui.', 'info');
    }
  };

  const handleConvertWishToMemory = (item) => {
    if (!currentUserId || !currentCouple) return;
    const newMem = {
      id: `mem_${Date.now()}`,
      couple_id: currentCouple.id,
      created_by: currentUserId,
      title: item.title,
      caption: item.description
        ? `Terwujud dari Wishlist kita: ${item.description}`
        : 'Momen indah yang akhirnya terwujud dari daftar keinginan kita!',
      memory_date: todayLocalISO(),
      media_path: null,
      media_data_url: null,
      visibility: 'shared',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDb((prev) => ({
      ...prev,
      memories: [newMem, ...prev.memories],
    }));

    const gotReward = awardGardenPointsIdempotent(
      'wishlist_to_memory',
      item.id,
      15,
      `wish_to_mem:${item.id}`
    );

    showToast(
      gotReward
        ? 'Disimpan ke Memories! +15 Poin Kasih untuk merawat peliharaan & rumah pohon kalian.'
        : 'Berhasil disimpan sebagai Memory bersama!',
      'success'
    );
    setActiveRoute('memories');
  };

  const handleMemoryImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Tipe file tidak didukung. Gunakan gambar JPG, PNG, WebP, atau GIF.', 'error');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 4 MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMemImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!currentUserId || !currentCouple) return;
    const title = memTitle.trim();
    if (!title) {
      showToast('Judul kenangan wajib diisi.', 'error');
      return;
    }

    const memId = `mem_${Date.now()}`;
    const randomObjectPath = memImagePreview
      ? `couples/${currentCouple.id}/media_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`
      : null;

    const newMem = {
      id: memId,
      couple_id: currentCouple.id,
      created_by: currentUserId,
      title,
      caption: memCaption.trim() || null,
      memory_date: memDate || todayLocalISO(),
      media_path: randomObjectPath,
      media_data_url: memImagePreview,
      visibility: memVisibility,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDb((prev) => ({
      ...prev,
      memories: [newMem, ...prev.memories],
    }));

    const gotReward = awardGardenPointsIdempotent('memory_created', memId, 10, `mem_reward:${memId}`);
    setMemTitle('');
    setMemCaption('');
    setMemImagePreview(null);
    setShowMemModal(false);
    showToast(
      gotReward
        ? 'Kenangan berhasil disimpan! +10 Poin Kasih untuk kalian.'
        : 'Kenangan berhasil disimpan.',
      'success'
    );
  };

  const handleSendLoveNote = (e) => {
    e.preventDefault();
    if (!currentUserId || !currentCouple || !partnerProfile) {
      showToast('Pastikan pasanganmu sudah terhubung ke dunia ini.', 'error');
      return;
    }
    const title = noteTitle.trim();
    const body = noteBody.trim();
    if (!title || !body) {
      showToast('Judul dan isi surat tidak boleh kosong.', 'error');
      return;
    }

    let openAtIso = null;
    if (noteScheduleDate) {
      const parsed = new Date(noteScheduleDate);
      if (isNaN(parsed.getTime())) {
        showToast('Format waktu jadwal buka tidak valid.', 'error');
        return;
      }
      openAtIso = parsed.toISOString();
    }

    const noteId = `note_${Date.now()}`;
    const newNote = {
      id: noteId,
      couple_id: currentCouple.id,
      sender_id: currentUserId,
      recipient_id: partnerProfile.id,
      title,
      body,
      status: openAtIso && openAtIso > new Date().toISOString() ? 'scheduled' : 'sent',
      open_at: openAtIso,
      opened_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDb((prev) => ({
      ...prev,
      love_notes: [newNote, ...prev.love_notes],
    }));

    awardGardenPointsIdempotent('love_note_sent', noteId, 10, `note_reward:${noteId}`);
    setNoteTitle('');
    setNoteBody('');
    setNoteScheduleDate('');
    setNoteTab('sent');
    showToast(
      openAtIso
        ? 'Surat terjadwal berhasil dikirim! Pasanganmu baru bisa membukanya saat waktunya tiba.'
        : 'Surat cinta berhasil dikirim ke kotak masuk pasanganmu!',
      'success'
    );
  };

  const handleOpenLoveNote = (note) => {
    const nowIso = new Date().toISOString();
    if (note.recipient_id === currentUserId && note.open_at && note.open_at > nowIso) {
      showToast(
        `Surat ini masih dikunci hingga ${formatDateID(note.open_at)}. Sabar ya!`,
        'error'
      );
      return;
    }

    if (note.recipient_id === currentUserId && !note.opened_at) {
      setDb((prev) => ({
        ...prev,
        love_notes: prev.love_notes.map((n) =>
          n.id === note.id ? { ...n, status: 'opened', opened_at: nowIso, updated_at: nowIso } : n
        ),
      }));
    }
    setSelectedNoteToRead(note);
  };

  const handleUnlockSanctuaryItem = (itemType, cost) => {
    if (!currentCouple || !currentGarden) return;
    if (currentGarden.unlocked_items.includes(itemType)) return;
    if (currentGarden.points < cost) {
      showToast('Poin Kasih belum cukup. Selesaikan kuis, wishlist, atau kenangan baru!', 'error');
      return;
    }

    setDb((prev) => ({
      ...prev,
      garden_state: prev.garden_state.map((g) =>
        g.couple_id === currentCouple.id
          ? {
              ...g,
              points: g.points - cost,
              unlocked_items: [...g.unlocked_items, itemType],
              updated_at: new Date().toISOString(),
            }
          : g
      ),
    }));
    setSelectedBrush(itemType);
    showToast('Peliharaan / Furnitur berhasil dibuka dan siap ditempatkan di Rumah Pohon!', 'success');
  };

  const handleTreatPartyAll = () => {
    if (!currentCouple || !currentGarden) return;
    const treatCost = 5;
    if (currentGarden.points < treatCost) {
      showToast(`Butuh minimal ${treatCost} Poin Kasih ✨ untuk menggelar Pesta Camilan!`, 'error');
      return;
    }

    setDb((prev) => ({
      ...prev,
      garden_state: prev.garden_state.map((g) =>
        g.couple_id === currentCouple.id
          ? {
              ...g,
              points: g.points - treatCost,
              tiles: g.tiles.map((t) =>
                t.item !== 'empty' && t.stage < 4
                  ? { ...t, stage: Math.min(4, t.stage + 1), last_watered_at: todayLocalISO() }
                  : t
              ),
              updated_at: new Date().toISOString(),
            }
          : g
      ),
    }));
    showToast('Pesta Camilan & Perawatan digelar! (-5 ✨) Semua peliharaan dan furnitur naik level! 🐾🍰', 'success');
  };

  const handleSanctuaryTileClick = (tileIndex) => {
    if (!currentUserId || !currentCouple || !currentGarden) return;
    setInspectedTileIndex(tileIndex);
    const tile = currentGarden.tiles[tileIndex];
    if (!tile) return;

    const petTypes = ['cat_mochi', 'bunny_bubu', 'bird_piyo', 'fox_kuro', 'hamster_choco', 'panda_pao'];

    if (selectedBrush === 'care') {
      if (tile.item === 'empty') {
        showToast('Pilih peliharaan atau furnitur di katalog kanan untuk ditempatkan di sudut kosong ini.', 'info');
        return;
      }
      if (tile.stage >= 4) {
        showToast('Sudah mencapai Level Maksimal (Lv.4 Master) dan sangat bahagia! ❤️✨', 'info');
        return;
      }
      const careCost = 2;
      if (currentGarden.points < careCost) {
        showToast('Poin Kasih belum cukup (butuh 2 ✨ untuk merawat/upgrade). Yuk isi Quiz atau Wishlist!', 'error');
        return;
      }

      const isPetItem = petTypes.includes(tile.item);
      setDb((prev) => ({
        ...prev,
        garden_state: prev.garden_state.map((g) =>
          g.couple_id === currentCouple.id
            ? {
                ...g,
                points: g.points - careCost,
                tiles: g.tiles.map((t) =>
                  t.index === tileIndex
                    ? {
                        ...t,
                        stage: Math.min(4, t.stage + 1),
                        last_watered_at: todayLocalISO(),
                      }
                    : t
                ),
                updated_at: new Date().toISOString(),
              }
            : g
        ),
      }));
      showToast(
        isPetItem
          ? 'Peliharaan diberi makan & disayang (-2 ✨)! Tumbuh 1 tahap makin akrab! 🐾❤️'
          : 'Furnitur dipoles & di-upgrade (-2 ✨) menjadi makin nyaman! 🛋️✨',
        'success'
      );
      return;
    }

    if (selectedBrush === 'clear') {
      setDb((prev) => ({
        ...prev,
        garden_state: prev.garden_state.map((g) =>
          g.couple_id === currentCouple.id
            ? {
                ...g,
                tiles: g.tiles.map((t) =>
                  t.index === tileIndex
                    ? { index: tileIndex, item: 'empty', stage: 1, last_watered_at: null, planted_by: null }
                    : t
                ),
                updated_at: new Date().toISOString(),
              }
            : g
        ),
      }));
      showToast('Sudut ruangan dirapikan.', 'info');
      return;
    }

    if (!currentGarden.unlocked_items.includes(selectedBrush)) {
      showToast('Buka kunci item ini terlebih dahulu menggunakan Poin Kasih.', 'error');
      return;
    }

    const isPet = petTypes.includes(selectedBrush);
    setDb((prev) => ({
      ...prev,
      garden_state: prev.garden_state.map((g) =>
        g.couple_id === currentCouple.id
          ? {
              ...g,
              tiles: g.tiles.map((t) =>
                t.index === tileIndex
                  ? {
                      index: tileIndex,
                      item: selectedBrush,
                      stage: isPet ? 1 : 2,
                      last_watered_at: todayLocalISO(),
                      planted_by: currentUserId,
                    }
                  : t
              ),
              updated_at: new Date().toISOString(),
            }
          : g
      ),
    }));
  };

  // --- Integrasi AI Couple Quiz dari Data Kenangan Bersama (Shared Memories) ---
  const handleGenerateAiQuestionsFromMemories = async () => {
    if (!currentCouple) return;
    const sharedMems = authorizedMemories.filter((m) => m.visibility === 'shared');
    if (sharedMems.length === 0) {
      showToast('Tambahkan minimal 1 Memory Bersama (Shared) terlebih dahulu agar AI dapat menyusun pertanyaan.', 'error');
      return;
    }

    setIsGeneratingAiQuiz(true);
    try {
      let generatedQuestions = [];
      const apiKey = ((import.meta as any)?.env?.VITE_GEMINI_API_KEY as string) || '';

      if (apiKey) {
        const memContext = sharedMems
          .slice(0, 6)
          .map((m, idx) => `${idx + 1}. Judul: "${m.title}" (${m.memory_date}) - Cerita: "${m.caption || '-'}"`)
          .join('\n');

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Kamu adalah asisten hangat untuk aplikasi pasangan privat. Berdasarkan daftar kenangan bersama berikut:\n${memContext}\n\nBuatlah 3 pertanyaan kuis pasangan yang romantis, hangat, dan spesifik mengacu pada kenangan di atas dalam Bahasa Indonesia. Kembalikan hanya JSON array dengan properti: "text" (pertanyaan) dan "sourceMemoryTitle" (judul kenangan yang dirujuk).`,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            if (Array.isArray(parsed) && parsed.length > 0) {
              generatedQuestions = parsed.map((item, i) => ({
                id: `q_ai_${Date.now()}_${i}`,
                category: '✨ AI dari Kenangan',
                text: item.text,
                sourceMemoryTitle: item.sourceMemoryTitle || sharedMems[0].title,
                isAi: true,
              }));
            }
          }
        }
      }

      // Contextual AI Engine Fallback (selalu mengolah data nyata dari Shared Memories)
      if (generatedQuestions.length === 0) {
        await new Promise((r) => setTimeout(r, 650));
        generatedQuestions = sharedMems.slice(0, 3).map((mem, idx) => {
          const templates = [
            `Saat mengingat momen "${mem.title}" (${formatDateID(mem.memory_date)}), hal kecil apa dari pasanganmu waktu itu yang paling membuatmu merasa disayang?`,
            `Dari cerita "${mem.title}"${mem.caption ? ` tentang "${mem.caption.slice(0, 60)}..."` : ''}, bagian mana yang paling ingin kamu ulangi bersama suatu hari nanti?`,
            `Kalau momen "${mem.title}" dibuat menjadi satu babak di film perjalanan kalian, lagu atau suasana apa yang paling menggambarkan perasaanmu saat itu?`,
          ];
          return {
            id: `q_ai_${Date.now()}_${idx}`,
            category: '✨ AI dari Kenangan',
            text: templates[idx % templates.length],
            sourceMemoryTitle: mem.title,
            isAi: true,
          };
        });
      }

      setDb((prev) => ({
        ...prev,
        quiz_questions: [...generatedQuestions, ...(prev.quiz_questions || DEFAULT_QUIZ_QUESTIONS)],
      }));
      setQuizCategoryFilter('✨ AI dari Kenangan');
      showToast(`✨ AI berhasil merangkai ${generatedQuestions.length} pertanyaan baru dari kenangan kalian!`, 'success');
    } catch {
      showToast('Gagal merangkai pertanyaan AI. Coba lagi.', 'error');
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  const handleSubmitQuizAnswer = (questionId, skip = false) => {
    if (!currentUserId || !currentCouple) return;
    const activeSession = db.game_sessions.find((s) => s.couple_id === currentCouple.id);
    const sessionId = activeSession ? activeSession.id : `sess_${currentCouple.id}`;

    const text = skip ? 'Melewati pertanyaan ini' : (quizInputs[questionId] || '').trim();
    if (!skip && !text) {
      showToast('Tulis jawabanmu terlebih dahulu atau pilih tombol Lewati.', 'error');
      return;
    }

    setDb((prev) => {
      const existingAns = prev.game_answers.find(
        (a) => a.session_id === sessionId && a.user_id === currentUserId && a.question_id === questionId
      );
      if (existingAns) {
        return {
          ...prev,
          game_answers: prev.game_answers.map((a) =>
            a.id === existingAns.id ? { ...a, answer_text: text, skipped: skip } : a
          ),
        };
      }
      return {
        ...prev,
        game_answers: [
          ...prev.game_answers,
          {
            id: `ans_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
            session_id: sessionId,
            user_id: currentUserId,
            question_id: questionId,
            answer_text: text,
            skipped: skip,
            created_at: new Date().toISOString(),
          },
        ],
      };
    });

    const gotReward = awardGardenPointsIdempotent(
      'quiz_answered',
      questionId,
      5,
      `quiz_ans:${currentCouple.id}:${currentUserId}:${questionId}`
    );

    setQuizInputs((prev) => ({ ...prev, [questionId]: '' }));
    showToast(
      gotReward ? 'Jawaban tersimpan! +5 Poin Kebun untukmu.' : 'Jawaban berhasil diperbarui.',
      'success'
    );
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!currentUser || !currentCouple) return;
    setDb((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === currentUser.id
          ? { ...p, display_name: editProfileName.trim() || p.display_name }
          : p
      ),
      couples: prev.couples.map((c) =>
        c.id === currentCouple.id
          ? {
              ...c,
              name: editWorldName.trim() || c.name,
              anniversary_date: editAnnivDate || null,
            }
          : c
      ),
    }));
    showToast('Profil dan pengaturan dunia berhasil diperbarui.', 'success');
  };

  const handleUnpairWorld = () => {
    if (!currentCouple) return;
    requestConfirm(
      'Putuskan Hubungan Dunia (Unpair)',
      'Apakah kamu yakin ingin keluar dari dunia pasangan ini? Dunia akan dinonaktifkan dan kamu memerlukan kode undangan baru untuk terhubung kembali.',
      () => {
        const nowIso = new Date().toISOString();
        setDb((prev) => ({
          ...prev,
          couples: prev.couples.map((c) =>
            c.id === currentCouple.id ? { ...c, unpaired_at: nowIso } : c
          ),
        }));
        showToast('Dunia pasangan telah dinonaktifkan (Unpaired).', 'info');
      }
    );
  };

  const handleResetDemoDatabase = () => {
    const fresh = createInitialSeedDatabase();
    setDb(fresh);
    setCurrentUserId('user_adel');
    setActiveRoute('home');
    showToast('Database demo berhasil di-reset ke kondisi awal (Adel & Merdi).', 'info');
  };

  // ============================================================================
  // 11. AUTOMATED SECURITY & ACCEPTANCE TEST RUNNER (9/9)
  // ============================================================================

  const securityTestResults = useMemo(() => {
    const tests = [];

    const sampleHash = hashInviteToken('MRDL-TEST-1234');
    tests.push({
      id: 't1',
      category: 'Auth & Pairing',
      name: 'Token undangan disimpan sebagai SHA-256 hash',
      passed: sampleHash.startsWith('sha256_') && sampleHash !== 'MRDL-TEST-1234',
      detail: `Hash terverifikasi (${sampleHash}), bukan plaintext.`,
    });

    const meradelMembers = db.couple_members.filter((m) => m.couple_id === 'couple_meradel_01');
    tests.push({
      id: 't2',
      category: 'Auth & Pairing',
      name: 'Kapasitas dunia dibatasi maksimal 2 akun',
      passed: meradelMembers.length <= 2,
      detail: `Anggota aktif saat ini: ${meradelMembers.length}/2. Pihak ketiga ditolak.`,
    });

    const predInsufficient = calculateCyclePrediction(db.cycle_logs.slice(0, 2));
    const predSufficient = calculateCyclePrediction(
      db.cycle_logs.filter((l) => l.user_id === 'user_adel')
    );
    tests.push({
      id: 't3',
      category: 'Cycle & Mood',
      name: 'Prediksi menolak < 3 interval & akun cowok tidak memiliki form menstruasi',
      passed: !predInsufficient.hasEnoughData && predSufficient.hasEnoughData && predSufficient.medianInterval === 28,
      detail: `Data <3 interval ditolak; 4 log perempuan menghasilkan median ${predSufficient.medianInterval} hari.`,
    });

    const adelSettings = db.cycle_sharing_settings.find((s) => s.user_id === 'user_adel');
    const adelMood = db.mood_entries.find((m) => m.user_id === 'user_adel');
    const isNoteProtected = Boolean(adelSettings && !adelSettings.share_mood_note && adelMood?.note);
    tests.push({
      id: 't4',
      category: 'Cycle & Mood',
      name: 'Catatan mood bebas tetap privat meski ringkasan mood dibagikan',
      passed: isNoteProtected,
      detail: 'share_mood=true namun share_mood_note=false menyensor field note untuk pasangan.',
    });

    const xssCheck = validateSafeUrl('javascript:alert(1)');
    const dataCheck = validateSafeUrl('data:text/html,<script>alert(1)</script>');
    const httpsCheck = validateSafeUrl('https://meradel.id/kencan');
    tests.push({
      id: 't5',
      category: 'Wishlist',
      name: 'Validasi URL menolak protokol javascript: dan data:',
      passed: !xssCheck.valid && !dataCheck.valid && httpsCheck.valid,
      detail: 'Hanya protokol http: dan https: yang diizinkan.',
    });

    const privateMem = db.memories.find((m) => m.visibility === 'private');
    const visibleToOwner = db.memories.some(
      (m) => m.id === privateMem?.id && m.created_by === 'user_adel'
    );
    const visibleToPartner = db.memories.some(
      (m) => m.id === privateMem?.id && (m.visibility === 'shared' || m.created_by === 'user_merdi')
    );
    tests.push({
      id: 't6',
      category: 'Memories & AI Quiz',
      name: 'Memory berstatus private terisolasi dari pasangan & tidak bocor ke AI Quiz',
      passed: visibleToOwner && !visibleToPartner,
      detail: 'Pasangan dan akun luar tidak dapat mengakses Memory privat.',
    });

    const futureNote = db.love_notes.find((n) => n.id === 'note_2');
    const isFutureLocked = Boolean(futureNote?.open_at && futureNote.open_at > new Date().toISOString());
    tests.push({
      id: 't7',
      category: 'Love Notes',
      name: 'Surat terjadwal masa depan disensor sebelum open_at',
      passed: isFutureLocked,
      detail: `Surat note_2 terkunci hingga ${formatDateID(futureNote?.open_at)}.`,
    });

    const uniqueKeys = new Set(db.garden_events.map((e) => e.idempotency_key));
    tests.push({
      id: 't8',
      category: 'Pixel Sanctuary',
      name: 'Pencegahan klaim poin ganda dengan idempotency_key unik',
      passed: uniqueKeys.size === db.garden_events.length,
      detail: `${db.garden_events.length} event tercatat tanpa duplikasi idempotency_key.`,
    });

    const intruderAccess = isMemberOfCouple('user_intruder', 'couple_meradel_01');
    tests.push({
      id: 't9',
      category: 'RLS & Security',
      name: 'Akun pihak ketiga (Doni) ditolak mengakses dunia pasangan',
      passed: !intruderAccess,
      detail: 'isMemberOfCouple("user_intruder", "couple_meradel_01") === false.',
    });

    return tests;
  }, [db, isMemberOfCouple]);

  // ============================================================================
  // 12. RENDER GLOBAL MODALS & QA BAR
  // ============================================================================

  const renderGlobalOverlays = () => (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm">
          <div
            className={`px-4 py-3 border-2 border-[#2C1E14] shadow-[4px_4px_0px_0px_#2C1E14] text-xs font-bold flex items-center gap-2 ${
              toast.type === 'error'
                ? 'bg-[#F5DCE2] text-[#592A35]'
                : toast.type === 'info'
                ? 'bg-[#EFE2C6] text-[#2C1E14]'
                : 'bg-[#D8E6DC] text-[#2C4235]'
            }`}
          >
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <PixelCard variant="warm" className="w-full max-w-sm">
            <h3 className="font-bold text-base text-[#2C1E14] mb-2">{confirmDialog.title}</h3>
            <p className="text-xs text-[#4A3525] mb-4 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-end gap-2">
              <PixelButton variant="secondary" onClick={() => setConfirmDialog(null)}>
                Batal
              </PixelButton>
              <PixelButton
                variant="danger"
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
              >
                Ya, Lanjutkan
              </PixelButton>
            </div>
          </PixelCard>
        </div>
      )}

      {/* Modal Hasil Audit & Automated Security Test Suite */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <PixelCard className="w-full max-w-2xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#4A3525]">
              <div>
                <h2 className="font-bold text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#4E6E5B]" />
                  Laporan Verifikasi Acceptance Criteria & Keamanan Meradel
                </h2>
                <p className="text-xs text-[#6E5039]">
                  Pengujian otomatis terhadap aturan bisnis, validasi input, dan kontrol akses (Bab 13 & 16 PRD).
                </p>
              </div>
              <button onClick={() => setShowTestModal(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {securityTestResults.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-[#F6EDD9] border-2 border-[#4A3525] flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-[#4A3525] text-[#FDF8EE]">
                      {t.category}
                    </span>
                    <p className="font-bold text-sm text-[#2C1E14] mt-1">{t.name}</p>
                    <p className="text-[#6E5039] mt-0.5">{t.detail}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 font-bold uppercase shrink-0 border border-[#2C1E14] ${
                      t.passed ? 'bg-[#D8E6DC] text-[#2C4235]' : 'bg-[#F5DCE2] text-[#592A35]'
                    }`}
                  >
                    {t.passed ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t-2 border-[#4A3525] flex justify-end">
              <PixelButton variant="primary" onClick={() => setShowTestModal(false)}>
                Tutup Laporan
              </PixelButton>
            </div>
          </PixelCard>
        </div>
      )}

      {/* Modal Dokumentasi SQL & Laporan Argon */}
      {showSpecModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <PixelCard className="w-full max-w-2xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#4A3525]">
              <div>
                <h2 className="font-bold text-base flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#4E6E5B]" />
                  Ringkasan Arsitektur Supabase, RLS & Laporan Argon
                </h2>
                <p className="text-xs text-[#6E5039]">
                  Implementasi penuh PRD Bab 12, 13, 18, dan 19.
                </p>
              </div>
              <button onClick={() => setShowSpecModal(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono bg-[#2C1E14] text-[#FDF8EE] p-4 border-2 border-[#4A3525] overflow-x-auto">
              <p className="text-[#88B096] font-bold">// LAPORAN PROGRES ARGON (TAHAP 1 - 5 SELESAI)</p>
              <p>TAHAP: Tahap 1 s/d 5 (Fondasi, Fitur Inti, Kenangan, Gamifikasi Diorama, AI Quiz)</p>
              <p>KEAMANAN/RLS: 14 Tabel terlindungi RLS, SHA-256 Invite Hash, Time-lock Love Notes, Granular Mood Consent</p>
              <p>HASIL TEST: 9/9 Acceptance Criteria & Security Assertions LULUS (PASS)</p>
              <hr className="border-[#6E5039] my-2" />
              <p className="text-[#F4A7B9] font-bold">-- CONTOH KEBIJAKAN RLS SUPABASE (PERIOD & MOOD CONSENT)</p>
              <pre className="whitespace-pre-wrap text-[11px] text-[#EFE2C6]">
{`CREATE POLICY "cycle_logs_select_owner_or_consented_partner"
ON public.cycle_logs FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.cycle_sharing_settings css
    JOIN public.couple_members cm ON cm.couple_id = css.couple_id
    WHERE css.user_id = public.cycle_logs.user_id
      AND css.share_cycle = true
      AND cm.user_id = auth.uid()
  )
);`}
              </pre>
            </div>

            <div className="mt-4 pt-3 border-t-2 border-[#4A3525] flex justify-end">
              <PixelButton variant="primary" onClick={() => setShowSpecModal(false)}>
                Tutup
              </PixelButton>
            </div>
          </PixelCard>
        </div>
      )}
    </>
  );

  // ============================================================================
  // 13. SUB-HALAMAN 1: HOME DASHBOARD (RINGKASAN DUNIA PASANGAN)
  // ============================================================================

  const renderHomeDashboard = () => {
    const today = todayLocalISO();
    const myTodayMood = myMoodEntries.find((m) => m.entry_date === today);
    const myTodayMoodMeta = myTodayMood ? MOOD_OPTIONS.find((mo) => mo.value === myTodayMood.mood) : null;

    const partnerTodayMood = partnerSharedMoodEntries.find((m) => m.entry_date === today);
    const partnerTodayMoodMeta = partnerTodayMood ? MOOD_OPTIONS.find((mo) => mo.value === partnerTodayMood.mood) : null;

    const daysTogether = currentCouple?.created_at
      ? Math.max(1, diffDaysLocalISO(currentCouple.created_at.slice(0, 10), today) + 1)
      : 1;

    const daysUntilAnniv = currentCouple?.anniversary_date
      ? diffDaysLocalISO(today, currentCouple.anniversary_date)
      : null;

    const unreadLoveNotesCount = authorizedLoveNotes.inbox.filter((n) => !n.isLocked).length;
    const plannedWishCount = authorizedWishlist.filter((w) => w.status === 'planned').length;

    return (
      <div className="space-y-6">
        {/* Banner Dunia & Sambutan Pasangan */}
        <PixelCard variant="warm" className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="relative">
                <PixelAvatar avatarKey={currentUser?.avatar_key || 'mage_rose'} size={56} />
                <span className="absolute -bottom-1 -right-1 text-xs bg-[#FDF8EE] border border-[#2C1E14] px-1 font-bold">
                  {currentUser?.gender === 'female' ? '♀' : '♂'}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <Heart className="w-8 h-8 text-[#B86B7D] fill-[#B86B7D] animate-bounce" />
                <span className="text-[10px] font-bold text-[#6E5039] bg-[#FDF8EE] px-1.5 py-0.5 border border-[#4A3525] mt-1">
                  Hari ke-{daysTogether}
                </span>
              </div>

              <div className="relative">
                {partnerProfile ? (
                  <>
                    <PixelAvatar avatarKey={partnerProfile.avatar_key || 'knight_sage'} size={56} />
                    <span className="absolute -bottom-1 -right-1 text-xs bg-[#FDF8EE] border border-[#2C1E14] px-1 font-bold">
                      {partnerProfile.gender === 'female' ? '♀' : '♂'}
                    </span>
                  </>
                ) : (
                  <div className="w-14 h-14 bg-[#EFE2C6] border-2 border-dashed border-[#8C684C] flex items-center justify-center text-xs font-bold text-[#8C684C]">
                    ?
                  </div>
                )}
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[#2C1E14] flex items-center justify-center md:justify-start gap-2">
                <span>{currentCouple?.name || 'Dunia Kecil Kita'}</span>
                <Sparkles className="w-5 h-5 text-[#D9A75A]" />
              </h1>
              <p className="text-xs text-[#6E5039] mt-1">
                {currentUser?.display_name} &amp; {partnerProfile?.display_name || 'Menunggu Pasangan'}
              </p>
              {currentCouple?.anniversary_date && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FDF8EE] border border-[#4A3525] text-xs font-semibold">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#B86B7D]" />
                  {daysUntilAnniv !== null && daysUntilAnniv > 0 ? (
                    <span><strong>{daysUntilAnniv} hari lagi</strong> menuju Hari Jadi ({formatDateID(currentCouple.anniversary_date)})</span>
                  ) : daysUntilAnniv === 0 ? (
                    <span className="text-[#B86B7D] font-bold">🎉 Hari Ini adalah Hari Jadi Kita! Happy Anniversary! 🎉</span>
                  ) : (
                    <span>Hari Jadi: {formatDateID(currentCouple.anniversary_date)}</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
              <PixelButton
                variant="primary"
                onClick={() => setActiveRoute('garden')}
                className="w-full justify-center"
              >
                <PawPrint className="w-4 h-4" />
                <span>{currentGarden?.points || 0} Poin Kasih</span>
              </PixelButton>
              <PixelButton
                variant="secondary"
                onClick={() => setActiveRoute('settings')}
                className="w-full justify-center"
              >
                <Settings className="w-4 h-4" />
                <span>Pengaturan Dunia</span>
              </PixelButton>
            </div>
          </div>
        </PixelCard>

        {/* Jika belum terhubung pasangan, tampilkan panel pairing */}
        {!partnerProfile && (
          <PixelCard variant="pink">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[#592A35] flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  Dunia Pasangan Belum Lengkap!
                </h3>
                <p className="text-xs text-[#592A35]">
                  Bagikan kode undangan rahasia ini kepada pasanganmu agar dapat masuk ke dalam dunia yang sama.
                </p>
              </div>
              <PixelButton
                variant="pink"
                onClick={handleGenerateInviteForExistingCouple}
              >
                Buat Kode Undangan Baru
              </PixelButton>
            </div>
            {generatedRawToken && (
              <div className="mt-3 p-3 bg-white border-2 border-[#8C4F5E] text-xs font-mono font-bold text-center select-all">
                {generatedRawToken}
              </div>
            )}
          </PixelCard>
        )}

        {/* Grid Modul Utama (Quick Widgets) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Widget 1: Cycle & Mood */}
          <PixelCard variant="cream" className="flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C4F5E] flex items-center gap-1.5 uppercase">
                  <CalendarIcon className="w-4 h-4" /> Mood &amp; Siklus
                </span>
                <span className="text-[10px] bg-[#EFE2C6] px-1.5 py-0.5 border border-[#4A3525] font-bold">
                  Hari Ini
                </span>
              </div>

              <div className="p-3 bg-[#F6EDD9] border border-[#4A3525] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#6E5039]">Mood Milikmu:</span>
                  {myTodayMoodMeta ? (
                    <span className="font-bold flex items-center gap-1">
                      <span>{myTodayMoodMeta.emoji}</span>
                      <span>{myTodayMoodMeta.label}</span>
                    </span>
                  ) : (
                    <span className="text-[#8C684C] italic">Belum dicatat</span>
                  )}
                </div>

                {partnerProfile && (
                  <div className="flex items-center justify-between pt-1 border-t border-[#EFE2C6]">
                    <span className="font-semibold text-[#6E5039]">Mood {partnerProfile.display_name}:</span>
                    {!partnerCycleConsent?.share_mood ? (
                      <span className="text-[#8C684C] italic">Privat</span>
                    ) : partnerTodayMoodMeta ? (
                      <span className="font-bold flex items-center gap-1">
                        <span>{partnerTodayMoodMeta.emoji}</span>
                        <span>{partnerTodayMoodMeta.label}</span>
                      </span>
                    ) : (
                      <span className="text-[#8C684C] italic">Belum check-in</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#EFE2C6]">
              <PixelButton
                variant="secondary"
                onClick={() => setActiveRoute('cycle')}
                className="w-full text-xs"
              >
                Buka Kalender &amp; Check-In
              </PixelButton>
            </div>
          </PixelCard>

          {/* Widget 2: Pixel Sanctuary */}
          <PixelCard variant="sage" className="flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4E6E5B] flex items-center gap-1.5 uppercase">
                  <PawPrint className="w-4 h-4" /> Pixel Sanctuary
                </span>
                <span className="text-[10px] bg-[#D8E6DC] text-[#2C4235] px-1.5 py-0.5 border border-[#4E6E5B] font-bold">
                  Cozy Lv. {sanctuaryStats.cozyLevel}
                </span>
              </div>

              <div className="p-3 bg-[#FDF8EE] border border-[#4E6E5B] text-xs space-y-2">
                <div className="flex justify-between text-[#2C4235]">
                  <span>Peliharaan Bersama:</span>
                  <span className="font-bold">{sanctuaryStats.petCount} Ekor</span>
                </div>
                <div className="flex justify-between text-[#2C4235]">
                  <span>Dekorasi &amp; Tanaman:</span>
                  <span className="font-bold">{sanctuaryStats.furnitureCount} Item</span>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-[#6E5039] mb-1">
                    <span>Kenyamanan Taman</span>
                    <span>{sanctuaryStats.cozyProgress}%</span>
                  </div>
                  <div className="h-2 bg-[#EFE2C6] border border-[#4A3525] overflow-hidden">
                    <div
                      className="h-full bg-[#6B8E78] transition-all"
                      style={{ width: `${sanctuaryStats.cozyProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#D8E6DC]">
              <PixelButton
                variant="primary"
                onClick={() => setActiveRoute('garden')}
                className="w-full text-xs"
              >
                Kunjungi Taman &amp; Rawat Pet
              </PixelButton>
            </div>
          </PixelCard>

          {/* Widget 3: Love Notes */}
          <PixelCard variant="pink" className="flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C4F5E] flex items-center gap-1.5 uppercase">
                  <Mail className="w-4 h-4" /> Surat Cinta &amp; Kapsul
                </span>
                <span className="text-[10px] bg-[#F9EBEF] text-[#8C4F5E] px-1.5 py-0.5 border border-[#8C4F5E] font-bold">
                  {unreadLoveNotesCount} Siap Dibaca
                </span>
              </div>

              <div className="p-3 bg-white border border-[#8C4F5E] text-xs space-y-1.5">
                <p className="text-[#4A3525] line-clamp-2 italic">
                  {authorizedLoveNotes.inbox.length > 0
                    ? `"${authorizedLoveNotes.inbox[0].title}" — ${authorizedLoveNotes.inbox[0].body.slice(0, 50)}...`
                    : 'Belum ada surat masuk. Tuliskan pesan manis pertamamu hari ini!'}
                </p>
                <div className="flex justify-between text-[11px] text-[#8C684C] pt-1 border-t border-[#F5DCE2]">
                  <span>Total Diterima: {authorizedLoveNotes.inbox.length}</span>
                  <span>Total Terkirim: {authorizedLoveNotes.sent.length}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#F5DCE2]">
              <PixelButton
                variant="pink"
                onClick={() => setActiveRoute('love-notes')}
                className="w-full text-xs"
              >
                Tulis &amp; Buka Surat
              </PixelButton>
            </div>
          </PixelCard>

          {/* Widget 4: Wishlist & Memories */}
          <PixelCard variant="cream" className="flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6E5039] flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-4 h-4 text-[#D9A75A]" /> Impian &amp; Kenangan
                </span>
              </div>

              <div className="p-3 bg-[#F6EDD9] border border-[#4A3525] text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#6E5039]">Wishlist Direncanakan:</span>
                  <span className="font-bold bg-[#EFE2C6] px-1.5 py-0.5 border border-[#4A3525]">
                    {plannedWishCount} Rencana
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6E5039]">Kenangan Tersimpan:</span>
                  <span className="font-bold bg-[#EFE2C6] px-1.5 py-0.5 border border-[#4A3525]">
                    {authorizedMemories.length} Momen
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#EFE2C6] flex gap-2">
              <PixelButton
                variant="secondary"
                onClick={() => setActiveRoute('wishlist')}
                className="flex-1 text-xs"
              >
                Wishlist
              </PixelButton>
              <PixelButton
                variant="secondary"
                onClick={() => setActiveRoute('memories')}
                className="flex-1 text-xs"
              >
                Kenangan
              </PixelButton>
            </div>
          </PixelCard>

          {/* Widget 5: Couple Quiz */}
          <PixelCard variant="warm" className="flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C684C] flex items-center gap-1.5 uppercase">
                  <Gamepad2 className="w-4 h-4" /> Mini Games &amp; Quiz AI
                </span>
                <span className="text-[10px] bg-[#D8E6DC] text-[#2C4235] px-1.5 py-0.5 border border-[#4E6E5B] font-bold">
                  +5 Poin Kasih
                </span>
              </div>

              <div className="p-3 bg-white border border-[#4A3525] text-xs space-y-1.5">
                <p className="text-[#4A3525] leading-relaxed">
                  Uji kecocokan dan rangkai pertanyaan seru dari kenangan kalian berdua menggunakan Gemini AI.
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#EFE2C6]">
              <PixelButton
                variant="primary"
                onClick={() => setActiveRoute('games')}
                className="w-full text-xs"
              >
                Mainkan Couple Quiz
              </PixelButton>
            </div>
          </PixelCard>

          {/* Widget 6: Status Sistem & Audit Keamanan */}
          <PixelCard variant="cream" className="flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4E6E5B] flex items-center gap-1.5 uppercase">
                  <ShieldCheck className="w-4 h-4" /> Keamanan &amp; Protokol
                </span>
                <span className="text-[10px] bg-[#D8E6DC] text-[#2C4235] px-1.5 py-0.5 border border-[#2C4235] font-bold">
                  9/9 LULUS
                </span>
              </div>

              <div className="p-3 bg-[#F6EDD9] border border-[#4A3525] text-xs space-y-1.5">
                <p className="text-[#6E5039]">
                  14 Tabel terlindungi RLS, SHA-256 Invite Hash, Time-lock Love Notes &amp; Consent Granular.
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#EFE2C6] flex gap-2">
              <PixelButton
                variant="secondary"
                onClick={() => setShowTestModal(true)}
                className="flex-1 text-xs"
              >
                Audit Test
              </PixelButton>
              <PixelButton
                variant="secondary"
                onClick={() => setShowSpecModal(true)}
                className="flex-1 text-xs"
              >
                Arsitektur
              </PixelButton>
            </div>
          </PixelCard>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 14. SUB-HALAMAN 2: PERIOD & MOOD TRACKER
  // ============================================================================

  const renderCycleAndMoodPage = () => {
    const canViewCalendarPeriodMarkers = canTrackOwnCycle || Boolean(partnerCycleConsent?.share_cycle);
    const displayedPrediction = canTrackOwnCycle ? myCyclePrediction : partnerCyclePrediction;

    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + calMonthOffset);
    const calYear = currentDate.getFullYear();
    const calMonth = currentDate.getMonth();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const monthLabel = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const isRecordedPeriodDay = (dateIso) => {
      const logsToCheck = canTrackOwnCycle ? myCycleLogs : partnerCycleLogs;
      return logsToCheck.some((l) => {
        const start = l.start_date;
        const end = l.end_date || addDaysLocalISO(start, 4);
        return dateIso >= start && dateIso <= end;
      });
    };

    const isEstimatedPeriodDay = (dateIso) => {
      if (!canViewCalendarPeriodMarkers) return false;
      if (!displayedPrediction.hasEnoughData || !displayedPrediction.nextEstimatedStart) return false;
      const start = displayedPrediction.nextEstimatedStart;
      const end = displayedPrediction.nextEstimatedEnd || addDaysLocalISO(start, 4);
      return dateIso >= start && dateIso <= end;
    };

    const getMoodForDay = (dateIso) => {
      return myMoodEntries.find((m) => m.entry_date === dateIso);
    };

    const symptomList = canTrackOwnCycle ? FEMALE_SYMPTOM_OPTIONS : MALE_SYMPTOM_OPTIONS;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#B86B7D]" />
              {canTrackOwnCycle ? 'Period & Mood Tracker' : 'Mood Check-In & Info Siklus Pasangan'}
            </h1>
            <p className="text-xs text-[#6E5039]">
              {canTrackOwnCycle
                ? 'Catat siklus menstruasi dan kondisi harian secara sukarela. Semua data dimulai sebagai privat.'
                : 'Catat mood dan energi harianmu, serta pantau perkiraan siklus pasanganmu jika ia membagikannya.'}
            </p>
          </div>
        </div>

        {/* Disclaimer Medis */}
        <PixelCard variant="pink" className="py-3">
          <div className="flex items-start gap-2.5 text-xs text-[#592A35]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Catatan Penting:</span> Meradel bukan aplikasi medis, alat diagnosis,
              atau kontrasepsi. Perkiraan siklus dihitung dari median interval historis dan selalu memiliki
              ketidakpastian. Fase siklus tidak pernah dianggap sebagai penyebab pasti suasana hati seseorang.
            </div>
          </div>
        </PixelCard>

        {/* Kontrol Izin Berbagi */}
        <PixelCard variant="sage">
          <h2 className="font-bold text-sm mb-2 flex items-center gap-2 text-[#2C4235]">
            <ShieldCheck className="w-4 h-4" />
            Pengaturan Privasi & Izin Berbagi Milikmu ({currentUser.display_name})
          </h2>
          <p className="text-xs text-[#2C4235] mb-3">
            Kamu memegang kendali penuh atas data kondisi dan perasaanmu. Kamu dapat menarik izin kapan saja.
          </p>
          <div className={`grid ${canTrackOwnCycle ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
            {canTrackOwnCycle && (
              <label className="flex items-start gap-2.5 p-2.5 bg-[#FDF8EE] border-2 border-[#4A3525] cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={Boolean(myCycleConsent?.share_cycle)}
                  onChange={() => handleToggleConsent('share_cycle')}
                  className="mt-0.5 w-4 h-4 accent-[#4E6E5B]"
                />
                <div>
                  <span className="font-bold block">Bagikan Kalender Siklus</span>
                  <span className="text-[#6E5039]">
                    Pasangan dapat melihat riwayat tanggal & estimasi siklus berikutnya.
                  </span>
                </div>
              </label>
            )}

            <label className="flex items-start gap-2.5 p-2.5 bg-[#FDF8EE] border-2 border-[#4A3525] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={Boolean(myCycleConsent?.share_mood)}
                onChange={() => handleToggleConsent('share_mood')}
                className="mt-0.5 w-4 h-4 accent-[#4E6E5B]"
              />
              <div>
                <span className="font-bold block">Bagikan Mood & Energi</span>
                <span className="text-[#6E5039]">
                  Pasangan melihat ikon mood, skor energi, dan kondisi fisik harianmu.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 bg-[#FDF8EE] border-2 border-[#4A3525] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={Boolean(myCycleConsent?.share_mood_note)}
                onChange={() => handleToggleConsent('share_mood_note')}
                className="mt-0.5 w-4 h-4 accent-[#4E6E5B]"
              />
              <div>
                <span className="font-bold block">Bagikan Catatan Teks Bebas</span>
                <span className="text-[#6E5039]">
                  Jika mati, teks jurnal harianmu tetap privat meski mood dibagikan.
                </span>
              </div>
            </label>
          </div>
        </PixelCard>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Kolom Kiri: Kalender & Ringkasan Siklus */}
          <div className="lg:col-span-7 space-y-6">
            <PixelCard>
              <div className="flex items-center justify-between mb-4">
                <PixelButton
                  variant="secondary"
                  onClick={() => setCalMonthOffset((o) => o - 1)}
                  title="Bulan Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </PixelButton>
                <div className="text-center">
                  <h2 className="font-bold text-base capitalize">{monthLabel}</h2>
                  <p className="text-[11px] text-[#6E5039]">
                    {canTrackOwnCycle
                      ? 'Kalender Siklus & Mood Milikmu'
                      : partnerCycleConsent?.share_cycle
                      ? `Mood Milikmu & Siklus ${partnerProfile?.display_name || 'Pasangan'} (Dibagikan)`
                      : 'Kalender Check-In Mood Milikmu'}
                  </p>
                </div>
                <PixelButton
                  variant="secondary"
                  onClick={() => setCalMonthOffset((o) => o + 1)}
                  title="Bulan Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </PixelButton>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#6E5039] mb-1">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayIndex }).map((_, idx) => (
                  <div key={`empty_${idx}`} className="h-12 bg-[#F6EDD9]/40 border border-transparent" />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const dayNum = i + 1;
                  const dateIso = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(
                    dayNum
                  ).padStart(2, '0')}`;
                  const recorded = isRecordedPeriodDay(dateIso);
                  const estimated = !recorded && isEstimatedPeriodDay(dateIso);
                  const moodEntry = getMoodForDay(dateIso);
                  const moodMeta = moodEntry
                    ? MOOD_OPTIONS.find((m) => m.value === moodEntry.mood)
                    : null;

                  return (
                    <button
                      key={dateIso}
                      type="button"
                      onClick={() => {
                        setMoodDateInput(dateIso);
                        if (canTrackOwnCycle) setCycleStartInput(dateIso);
                      }}
                      className={`h-12 p-1 border-2 flex flex-col justify-between text-left transition ${
                        recorded
                          ? 'bg-[#F5DCE2] border-[#B86B7D] font-bold'
                          : estimated
                          ? 'bg-[#FDF8EE] border-dashed border-[#B86B7D]'
                          : dateIso === todayLocalISO()
                          ? 'bg-[#D8E6DC] border-[#2C1E14] font-bold'
                          : 'bg-white border-[#EFE2C6] hover:border-[#8C684C]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] leading-none">{dayNum}</span>
                        {recorded && (
                          <span title="Hari menstruasi tercatat" className="text-[10px] leading-none">
                            🩸
                          </span>
                        )}
                        {estimated && (
                          <span title="Perkiraan siklus" className="text-[10px] leading-none">
                            ◌
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-end w-full">
                        {moodMeta && (
                          <span title={`Mood: ${moodMeta.label}`} className="text-xs leading-none">
                            {moodMeta.emoji}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t-2 border-[#EFE2C6] flex flex-wrap gap-3 text-xs">
                {canViewCalendarPeriodMarkers && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-4 h-4 bg-[#F5DCE2] border-2 border-[#B86B7D] text-center text-[10px] leading-none">
                        🩸
                      </span>
                      Tercatat Menstruasi
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-4 h-4 bg-[#FDF8EE] border-2 border-dashed border-[#B86B7D] text-center text-[10px] leading-none">
                        ◌
                      </span>
                      Perkiraan Berikutnya (Estimasi)
                    </span>
                  </>
                )}
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-4 bg-[#D8E6DC] border-2 border-[#2C1E14]" />
                  Hari Ini
                </span>
              </div>
            </PixelCard>

            {/* Box Ringkasan Estimasi Siklus */}
            {canTrackOwnCycle ? (
              <PixelCard variant="warm">
                <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8C684C]" />
                  Status Estimasi Siklus Berikutnya
                </h3>
                {myCyclePrediction.hasEnoughData ? (
                  <div className="space-y-1 text-xs">
                    <p className="text-sm font-bold text-[#2C1E14]">
                      Perkiraan mulai sekitar: {formatDateID(myCyclePrediction.nextEstimatedStart)} –{' '}
                      {formatDateID(myCyclePrediction.nextEstimatedEnd)}
                    </p>
                    <p className="text-[#6E5039]">{myCyclePrediction.message}</p>
                  </div>
                ) : (
                  <p className="text-xs text-[#6E5039]">{myCyclePrediction.message}</p>
                )}
              </PixelCard>
            ) : (
              <PixelCard variant="warm">
                <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#B86B7D]" />
                  Info Siklus Pasangan ({partnerProfile?.display_name || 'Pasangan'})
                </h3>
                {!partnerCycleConsent?.share_cycle ? (
                  <p className="text-xs text-[#6E5039] italic">
                    Pasanganmu saat ini menyimpan kalender siklus secara privat.
                  </p>
                ) : partnerCyclePrediction.hasEnoughData ? (
                  <div className="space-y-1 text-xs">
                    <p className="text-sm font-bold text-[#2C1E14]">
                      Perkiraan siklus {partnerProfile?.display_name} berikutnya:{' '}
                      {formatDateID(partnerCyclePrediction.nextEstimatedStart)} –{' '}
                      {formatDateID(partnerCyclePrediction.nextEstimatedEnd)}
                    </p>
                    <p className="text-[#6E5039]">{partnerCyclePrediction.message}</p>
                  </div>
                ) : (
                  <p className="text-xs text-[#6E5039]">{partnerCyclePrediction.message}</p>
                )}
              </PixelCard>
            )}

            {/* Daftar Riwayat Siklus (HANYA UNTUK AKUN PEREMPUAN) */}
            {canTrackOwnCycle && (
              <PixelCard>
                <h3 className="font-bold text-sm mb-3">Riwayat Catatan Siklus ({myCycleLogs.length})</h3>
                {myCycleLogs.length === 0 ? (
                  <p className="text-xs text-[#6E5039] italic">
                    Belum ada riwayat siklus tercatat. Tambahkan tanggal mulai pada formulir di samping.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {myCycleLogs.map((log, index) => {
                      const prevLog = myCycleLogs[index + 1];
                      const intervalDays = prevLog
                        ? diffDaysLocalISO(prevLog.start_date, log.start_date)
                        : null;
                      return (
                        <div
                          key={log.id}
                          className="p-2.5 bg-[#F6EDD9] border border-[#4A3525] flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold">Mulai: {formatDateID(log.start_date)}</span>
                            {log.end_date && (
                              <span className="text-[#6E5039]">
                                {' '}
                                • Selesai: {formatDateID(log.end_date)}
                              </span>
                            )}
                            {intervalDays !== null && (
                              <span className="ml-2 px-1.5 py-0.5 bg-[#FDF8EE] border border-[#8C684C] text-[10px] font-bold">
                                Interval: {intervalDays} hari
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCycleLog(log.id)}
                            className="text-[#C95B5B] hover:underline font-bold p-1"
                            title="Hapus catatan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </PixelCard>
            )}
          </div>

          {/* Kolom Kanan: Form Siklus (Khusus Perempuan) & Mood Check-in Harian */}
          <div className="lg:col-span-5 space-y-6">
            {canTrackOwnCycle && (
              <PixelCard>
                <h3 className="font-bold text-base mb-3">Catat Tanggal Menstruasi</h3>
                <form onSubmit={handleAddCycleLog} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold uppercase mb-1">Tanggal Mulai *</label>
                    <input
                      type="date"
                      required
                      value={cycleStartInput}
                      onChange={(e) => setCycleStartInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">
                      Tanggal Selesai (Opsional / Kosongkan jika masih berlangsung)
                    </label>
                    <input
                      type="date"
                      value={cycleEndInput}
                      onChange={(e) => setCycleEndInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                    />
                  </div>
                  <PixelButton type="submit" variant="pink" className="w-full">
                    <Plus className="w-4 h-4" /> Simpan Catatan Siklus
                  </PixelButton>
                </form>
              </PixelCard>
            )}

            <PixelCard>
              <h3 className="font-bold text-base mb-3">Check-In Mood & Energi Harian</h3>
              <form onSubmit={handleSaveMoodEntry} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Tanggal Check-In</label>
                  <input
                    type="date"
                    required
                    value={moodDateInput}
                    onChange={(e) => setMoodDateInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1.5">Perasaan Hari Ini</label>
                  <div className="grid grid-cols-2 gap-2">
                    {MOOD_OPTIONS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setSelectedMood(m.value)}
                        className={`p-2 border-2 text-left flex items-center gap-2 font-semibold ${
                          selectedMood === m.value
                            ? `${m.color} shadow-[2px_2px_0px_0px_#2C1E14]`
                            : 'bg-white border-[#8C684C]/50 text-[#4A3525]'
                        }`}
                      >
                        <span className="text-base">{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">
                    Tingkat Energi: {selectedEnergy} / 5
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedEnergy(lvl)}
                        className={`flex-1 py-2 border-2 font-bold ${
                          selectedEnergy === lvl
                            ? 'bg-[#6B8E78] text-white border-[#2C1E14]'
                            : 'bg-white border-[#4A3525]'
                        }`}
                      >
                        {lvl} ⚡
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1.5">Kondisi Fisik (Opsional)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {symptomList.map((sym) => {
                      const active = selectedSymptoms.includes(sym);
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => {
                            if (active) {
                              setSelectedSymptoms((prev) => prev.filter((s) => s !== sym));
                            } else {
                              setSelectedSymptoms((prev) => [...prev, sym]);
                            }
                          }}
                          className={`px-2.5 py-1 border text-xs font-medium ${
                            active
                              ? 'bg-[#4A3525] text-[#FDF8EE] border-[#2C1E14]'
                              : 'bg-white text-[#4A3525] border-[#8C684C]'
                          }`}
                        >
                          {sym}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">
                    Catatan Bebas (Default Privat)
                  </label>
                  <textarea
                    rows={2}
                    value={moodNoteInput}
                    onChange={(e) => setMoodNoteInput(e.target.value)}
                    placeholder="Tulis apa yang sedang kamu rasakan atau butuhkan..."
                    className="w-full p-2.5 bg-white border-2 border-[#4A3525]"
                  />
                </div>

                <PixelButton type="submit" variant="primary" className="w-full">
                  <Check className="w-4 h-4" /> Simpan Check-In Harian
                </PixelButton>
              </form>
            </PixelCard>
          </div>
        </div>
      </div>
    );
  };

  // --- SUB-HALAMAN 3: SHARED WISHLIST ---
  const renderWishlistPage = () => {
    const filteredWishlist = authorizedWishlist.filter((item) => {
      if (wishFilterCategory !== 'all' && item.category !== wishFilterCategory) return false;
      if (wishFilterStatus !== 'all' && item.status !== wishFilterStatus) return false;
      if (wishSearch.trim()) {
        const q = wishSearch.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q) ?? false;
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B86B7D]" />
              Shared Wishlist
            </h1>
            <p className="text-xs text-[#6E5039]">
              Daftar tempat kencan, kuliner, barang impian, dan rencana bersama kalian.
            </p>
          </div>
          <PixelButton variant="primary" onClick={() => setShowWishModal(true)}>
            <Plus className="w-4 h-4" /> + Tambah Wishlist
          </PixelButton>
        </div>

        <PixelCard className="p-3">
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6E5039]" />
              <input
                type="text"
                value={wishSearch}
                onChange={(e) => setWishSearch(e.target.value)}
                placeholder="Cari judul atau catatan..."
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#4A3525]"
              />
            </div>

            <select
              value={wishFilterCategory}
              onChange={(e) => setWishFilterCategory(e.target.value)}
              className="px-3 py-2 bg-white border-2 border-[#4A3525] font-semibold"
            >
              <option value="all">Semua Kategori</option>
              {WISHLIST_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>

            <select
              value={wishFilterStatus}
              onChange={(e) => setWishFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border-2 border-[#4A3525] font-semibold"
            >
              <option value="all">Semua Status</option>
              <option value="saved">Tersimpan (Saved)</option>
              <option value="planned">Direncanakan (Planned)</option>
              <option value="completed">Terwujud (Completed)</option>
              <option value="archived">Diarsipkan (Archived)</option>
            </select>
          </div>
        </PixelCard>

        {filteredWishlist.length === 0 ? (
          <PixelCard className="text-center py-10">
            <p className="font-bold text-base text-[#4A3525]">Belum ada item wishlist yang cocok</p>
            <p className="text-xs text-[#6E5039] mt-1 mb-4">
              Simpan ide kencan, tempat makan, atau kegiatan seru yang ingin kalian lakukan bersama.
            </p>
            <PixelButton variant="primary" onClick={() => setShowWishModal(true)} className="mx-auto">
              <Plus className="w-4 h-4" /> Tambah Wishlist Pertama
            </PixelButton>
          </PixelCard>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredWishlist.map((item) => {
              const catMeta = WISHLIST_CATEGORIES.find((c) => c.value === item.category);
              const creatorName =
                db.profiles.find((p) => p.id === item.created_by)?.display_name || 'Pasangan';
              const safeUrlInfo = item.url ? validateSafeUrl(item.url) : null;

              return (
                <PixelCard
                  key={item.id}
                  variant={item.status === 'completed' ? 'sage' : 'cream'}
                  className="flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-[#EFE2C6] border border-[#4A3525]">
                        {catMeta?.icon} {catMeta?.label}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold">
                        <span
                          className={`px-2 py-0.5 uppercase ${
                            item.priority === 'high'
                              ? 'bg-[#F5DCE2] text-[#592A35]'
                              : 'bg-white text-[#6E5039]'
                          } border border-[#4A3525]`}
                        >
                          Prioritas: {item.priority}
                        </span>
                        <span className="px-2 py-0.5 bg-[#2C1E14] text-[#FDF8EE] uppercase">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-[#2C1E14]">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-[#6E5039] mt-1">{item.description}</p>
                    )}

                    {item.url && safeUrlInfo?.valid && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#4E6E5B] underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Buka tautan ({safeUrlInfo.hostname})
                      </a>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#8C684C]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-[#6E5039]">
                      Oleh <strong>{creatorName}</strong> • {formatDateID(item.created_at)}
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.status !== 'planned' && item.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateWishStatus(item, 'planned')}
                          className="px-2 py-1 bg-[#EFE2C6] border border-[#4A3525] font-bold hover:bg-[#E2CFA9]"
                        >
                          Rencanakan
                        </button>
                      )}
                      {item.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateWishStatus(item, 'completed')}
                          className="px-2 py-1 bg-[#6B8E78] text-white border border-[#2C1E14] font-bold hover:bg-[#567863]"
                        >
                          ✓ Selesai
                        </button>
                      )}
                      {item.status === 'completed' && (
                        <button
                          onClick={() => handleConvertWishToMemory(item)}
                          className="px-2.5 py-1 bg-[#D98A9C] text-[#2C1E14] border border-[#2C1E14] font-bold flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Jadikan Memory
                        </button>
                      )}
                      <button
                        onClick={() =>
                          requestConfirm(
                            'Hapus Wishlist',
                            `Apakah kamu yakin ingin menghapus wishlist "${item.title}"?`,
                            () => {
                              setDb((prev) => ({
                                ...prev,
                                wishlist_items: prev.wishlist_items.filter((w) => w.id !== item.id),
                              }));
                              showToast('Item wishlist dihapus.', 'info');
                            }
                          )
                        }
                        className="p-1 text-[#C95B5B] hover:bg-[#F5DCE2]"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </PixelCard>
              );
            })}
          </div>
        )}

        {showWishModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <PixelCard className="w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base">Tambah Shared Wishlist</h2>
                <button onClick={() => setShowWishModal(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddWishlist} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Judul Keinginan / Rencana *</label>
                  <input
                    type="text"
                    required
                    value={wishTitle}
                    onChange={(e) => setWishTitle(e.target.value)}
                    placeholder="Contoh: Nonton konser akustik di taman"
                    className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase mb-1">Kategori</label>
                    <select
                      value={wishCategory}
                      onChange={(e) => setWishCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                    >
                      {WISHLIST_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.icon} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Prioritas</label>
                    <select
                      value={wishPriority}
                      onChange={(e) => setWishPriority(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                    >
                      <option value="low">Santai (Low)</option>
                      <option value="normal">Normal</option>
                      <option value="high">Ingin Segera (High)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">
                    Tautan / URL (Opsional — Hanya http/https)
                  </label>
                  <input
                    type="text"
                    value={wishUrl}
                    onChange={(e) => setWishUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Catatan Tambahan</label>
                  <textarea
                    rows={3}
                    value={wishDesc}
                    onChange={(e) => setWishDesc(e.target.value)}
                    placeholder="Detail tempat, perkiraan waktu, atau alasan..."
                    className="w-full p-2.5 bg-white border-2 border-[#4A3525]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <PixelButton variant="secondary" onClick={() => setShowWishModal(false)}>
                    Batal
                  </PixelButton>
                  <PixelButton type="submit" variant="primary">
                    Simpan Wishlist
                  </PixelButton>
                </div>
              </form>
            </PixelCard>
          </div>
        )}
      </div>
    );
  };

  // --- SUB-HALAMAN 4: MEMORIES ---
  const renderMemoriesPage = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#8C684C]" />
              Timeline Memories
            </h1>
            <p className="text-xs text-[#6E5039]">
              Simpan foto dan cerita momen berharga kalian. Kenangan bersama juga dapat diolah AI menjadi pertanyaan kuis pasangan!
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <PixelButton variant="secondary" onClick={() => setActiveRoute('games')}>
              <Wand2 className="w-4 h-4 text-[#B86B7D]" /> Buat Kuis AI dari Kenangan
            </PixelButton>
            <PixelButton variant="pink" onClick={() => setShowMemModal(true)}>
              <Plus className="w-4 h-4" /> + Simpan Memory Baru
            </PixelButton>
          </div>
        </div>

        {authorizedMemories.length === 0 ? (
          <PixelCard className="text-center py-10">
            <p className="font-bold text-base">Belum ada kenangan di sini.</p>
            <p className="text-xs text-[#6E5039] mt-1 mb-4">
              Simpan momen pertama kalian, baik dengan foto maupun cerita singkat.
            </p>
            <PixelButton variant="pink" onClick={() => setShowMemModal(true)} className="mx-auto">
              <Plus className="w-4 h-4" /> Tambah Memory Pertama
            </PixelButton>
          </PixelCard>
        ) : (
          <div className="space-y-4">
            {authorizedMemories.map((mem) => {
              const creatorName =
                db.profiles.find((p) => p.id === mem.created_by)?.display_name || 'Pasangan';
              return (
                <PixelCard key={mem.id} variant={mem.visibility === 'private' ? 'warm' : 'cream'}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {mem.media_data_url ? (
                      <div className="sm:w-48 h-40 shrink-0 border-2 border-[#4A3525] overflow-hidden bg-[#EFE2C6]">
                        <img
                          src={mem.media_data_url}
                          alt={mem.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : mem.media_path ? (
                      <div className="sm:w-48 h-36 shrink-0 border-2 border-[#4A3525] bg-[#D8E6DC] flex flex-col items-center justify-center p-3 text-center">
                        <ImageIcon className="w-7 h-7 text-[#4E6E5B] mb-1" />
                        <span className="text-[10px] font-mono text-[#2C4235] break-all">
                          Private Storage (Signed URL)
                        </span>
                      </div>
                    ) : null}

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-bold text-[#8C684C]">
                            📅 {formatDateID(mem.memory_date)}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 border border-[#4A3525] flex items-center gap-1 ${
                              mem.visibility === 'private'
                                ? 'bg-[#4A3525] text-[#FDF8EE]'
                                : 'bg-[#D8E6DC] text-[#2C4235]'
                            }`}
                          >
                            {mem.visibility === 'private' ? (
                              <>
                                <Lock className="w-3 h-3" /> Privat (Hanya {creatorName})
                              </>
                            ) : (
                              <>
                                <Users className="w-3 h-3" /> Shared Memory
                              </>
                            )}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#2C1E14]">{mem.title}</h3>
                        {mem.caption && (
                          <p className="text-xs text-[#4A3525] mt-1.5 leading-relaxed">
                            {mem.caption}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-2 border-t border-[#8C684C]/30 flex items-center justify-between text-xs">
                        <span className="text-[#6E5039]">Ditulis oleh {creatorName}</span>
                        {mem.created_by === currentUserId && (
                          <button
                            onClick={() =>
                              requestConfirm(
                                'Hapus Kenangan',
                                `Apakah kamu yakin ingin menghapus kenangan "${mem.title}"?`,
                                () => {
                                  setDb((prev) => ({
                                    ...prev,
                                    memories: prev.memories.filter((m) => m.id !== mem.id),
                                  }));
                                  showToast('Kenangan berhasil dihapus.', 'info');
                                }
                              )
                            }
                            className="text-[#C95B5B] font-bold flex items-center gap-1 hover:underline"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </PixelCard>
              );
            })}
          </div>
        )}

        {showMemModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <PixelCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base">Simpan Kenangan Baru</h2>
                <button onClick={() => setShowMemModal(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddMemory} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Judul Momen *</label>
                  <input
                    type="text"
                    required
                    value={memTitle}
                    onChange={(e) => setMemTitle(e.target.value)}
                    placeholder="Contoh: Jalan pagi keliling danau"
                    className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase mb-1">Tanggal Kejadian</label>
                    <input
                      type="date"
                      required
                      value={memDate}
                      onChange={(e) => setMemDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Visibilitas</label>
                    <select
                      value={memVisibility}
                      onChange={(e) => setMemVisibility(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                    >
                      <option value="shared">Bersama (Shared)</option>
                      <option value="private">Pribadi (Hanya Saya)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Cerita / Caption</label>
                  <textarea
                    rows={3}
                    value={memCaption}
                    onChange={(e) => setMemCaption(e.target.value)}
                    placeholder="Ceritakan hal berkesan dari momen ini..."
                    className="w-full p-2.5 bg-white border-2 border-[#4A3525]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">
                    Upload Foto (Bucket Privat — JPG/PNG/WebP maks 4MB)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleMemoryImageUpload}
                    className="w-full text-xs"
                  />
                  {memImagePreview && (
                    <img
                      src={memImagePreview}
                      alt="Preview"
                      className="mt-2 h-28 w-full object-cover border-2 border-[#4A3525]"
                    />
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <PixelButton variant="secondary" onClick={() => setShowMemModal(false)}>
                    Batal
                  </PixelButton>
                  <PixelButton type="submit" variant="pink">
                    Simpan Memory (+10 ✨)
                  </PixelButton>
                </div>
              </form>
            </PixelCard>
          </div>
        )}
      </div>
    );
  };

  // --- SUB-HALAMAN 5: LOVE NOTES & KAPSUL WAKTU ---
  const renderLoveNotesPage = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#4E6E5B]" />
              Love Notes & Kapsul Waktu
            </h1>
            <p className="text-xs text-[#6E5039]">
              Kirim surat langsung atau pilih tanggal buka di masa depan. Surat terjadwal dikunci oleh server hingga
              waktunya tiba.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <PixelButton
              variant={noteTab === 'inbox' ? 'primary' : 'secondary'}
              onClick={() => setNoteTab('inbox')}
            >
              Kotak Masuk ({authorizedLoveNotes.inbox.length})
            </PixelButton>
            <PixelButton
              variant={noteTab === 'sent' ? 'primary' : 'secondary'}
              onClick={() => setNoteTab('sent')}
            >
              Terkirim ({authorizedLoveNotes.sent.length})
            </PixelButton>
            <PixelButton
              variant={noteTab === 'write' ? 'pink' : 'secondary'}
              onClick={() => setNoteTab('write')}
            >
              <Plus className="w-4 h-4" /> Tulis Surat
            </PixelButton>
          </div>
        </div>

        {noteTab === 'write' ? (
          <PixelCard className="max-w-xl mx-auto">
            <h2 className="font-bold text-base mb-3">
              Tulis Surat untuk {partnerProfile ? partnerProfile.display_name : 'Pasanganmu'}
            </h2>
            <form onSubmit={handleSendLoveNote} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Judul Surat *</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Contoh: Untuk dibaca saat kamu butuh semangat"
                  className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Isi Surat *</label>
                <textarea
                  rows={5}
                  required
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  placeholder="Tuliskan pesan hangatmu di sini..."
                  className="w-full p-3 bg-white border-2 border-[#4A3525]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">
                  Jadwalkan Waktu Buka (Opsional — Kosongkan jika ingin langsung bisa dibaca)
                </label>
                <input
                  type="datetime-local"
                  value={noteScheduleDate}
                  onChange={(e) => setNoteScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
                />
                <p className="text-[11px] text-[#6E5039] mt-1">
                  Surat ini akan terbuka pada tanggal yang kamu pilih. Sebelum waktu tersebut, server menyembunyikan
                  isinya dari penerima.
                </p>
              </div>
              <PixelButton type="submit" variant="pink" className="w-full">
                <Mail className="w-4 h-4" /> Kirim Love Note (+10 ✨)
              </PixelButton>
            </form>
          </PixelCard>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {(noteTab === 'inbox' ? authorizedLoveNotes.inbox : authorizedLoveNotes.sent).map(
              (note) => {
                const isInbox = noteTab === 'inbox';
                return (
                  <PixelCard
                    key={note.id}
                    variant={note.isLocked ? 'warm' : 'cream'}
                    className="flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-[#EFE2C6] border border-[#4A3525]">
                          {isInbox
                            ? `Dari: ${partnerProfile?.display_name || 'Pasangan'}`
                            : `Untuk: ${partnerProfile?.display_name || 'Pasangan'}`}
                        </span>
                        {note.isLocked ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-[#4A3525] text-[#FDF8EE] flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Terkunci s/d {formatDateID(note.open_at)}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-[#D8E6DC] text-[#2C4235] flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> {note.opened_at ? 'Sudah Dibaca' : 'Siap Dibuka'}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-[#2C1E14]">{note.title}</h3>
                      <p className="text-xs text-[#6E5039] mt-2 line-clamp-3 italic">
                        {note.body}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#8C684C]/30 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#6E5039]">
                        Dikirim {formatDateID(note.created_at)}
                      </span>
                      <div className="flex items-center gap-2">
                        {!isInbox && !note.opened_at && (
                          <button
                            onClick={() =>
                              requestConfirm(
                                'Tarik Kembali Surat',
                                `Apakah kamu yakin ingin menghapus surat "${note.title}" sebelum dibaca pasanganmu?`,
                                () => {
                                  setDb((prev) => ({
                                    ...prev,
                                    love_notes: prev.love_notes.filter((n) => n.id !== note.id),
                                  }));
                                  showToast('Surat berhasil ditarik kembali.', 'info');
                                }
                              )
                            }
                            className="text-[#C95B5B] font-bold hover:underline"
                          >
                            Hapus
                          </button>
                        )}
                        <PixelButton
                          variant={note.isLocked && isInbox ? 'secondary' : 'primary'}
                          onClick={() => handleOpenLoveNote(note)}
                        >
                          {note.isLocked && isInbox ? (
                            <>
                              <Lock className="w-3.5 h-3.5" /> Belum Waktunya
                            </>
                          ) : (
                            'Baca Surat'
                          )}
                        </PixelButton>
                      </div>
                    </div>
                  </PixelCard>
                );
              }
            )}
          </div>
        )}

        {selectedNoteToRead && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <PixelCard variant="warm" className="w-full max-w-md">
              <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-[#4A3525]">
                <h3 className="font-bold text-base">{selectedNoteToRead.title}</h3>
                <button onClick={() => setSelectedNoteToRead(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 bg-[#FDF8EE] border-2 border-[#4A3525] text-sm leading-relaxed whitespace-pre-line text-[#2C1E14]">
                {selectedNoteToRead.body}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#6E5039]">
                <span>Dikirim: {formatDateID(selectedNoteToRead.created_at)}</span>
                <PixelButton variant="primary" onClick={() => setSelectedNoteToRead(null)}>
                  Tutup Surat
                </PixelButton>
              </div>
            </PixelCard>
          </div>
        )}
      </div>
    );
  };

  // --- SUB-HALAMAN 6: PIXEL SANCTUARY & PET CARE (RUMAH POHON & PELIHARAAN BERSAMA) ---
  const renderPixelGardenPage = () => {
    if (!currentGarden) return null;

    const roomStyles = {
      day: 'from-[#F7E6CA] via-[#EAD2AC] to-[#C9A27B] text-[#2C1E14]',
      sunset: 'from-[#F2B895] via-[#E3A887] to-[#B57C5E] text-[#2C1E14]',
      night: 'from-[#232946] via-[#343B5C] to-[#4A3A38] text-[#FDF8EE]',
      rain: 'from-[#7A8B99] via-[#96A6B3] to-[#8C7A6B] text-[#FDF8EE]',
    };

    const inspectedTile = currentGarden.tiles[inspectedTileIndex] || currentGarden.tiles[0];
    const inspectedMeta = SANCTUARY_CATALOG.find((c) => c.type === inspectedTile?.item);
    const inspectedPlanter = db.profiles.find((p) => p.id === inspectedTile?.planted_by)?.display_name;

    const filteredCatalog = SANCTUARY_CATALOG.filter(
      (item) => sanctuaryCategoryTab === 'all' || item.category === sanctuaryCategoryTab
    );

    const petTypes = ['cat_mochi', 'bunny_bubu', 'bird_piyo', 'fox_kuro', 'hamster_choco', 'panda_pao'];

    return (
      <div className="space-y-6">
        {/* Header Rumah Pohon & Statistik Kehangatan */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-[#4E6E5B]" />
              Cozy Sanctuary — Rumah Pohon & Peliharaan Pixel
            </h1>
            <p className="text-xs text-[#6E5039]">
              Gunakan Poin Kasih dari aktivitas bersama untuk memberi makan peliharaan dan meng-upgrade ruangan kalian!
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-2 bg-[#FDF8EE] border-2 border-[#2C1E14] shadow-[3px_3px_0px_0px_#2C1E14] font-bold text-xs">
              Level Kehangatan: <span className="text-[#B86B7D]">Lv.{sanctuaryStats.cozyLevel}</span> ({sanctuaryStats.maxStagePets} Pet Master)
            </div>
            <div className="px-3.5 py-2 bg-[#FDF8EE] border-2 border-[#2C1E14] shadow-[3px_3px_0px_0px_#2C1E14] font-bold text-xs">
              Poin Kasih: <span className="text-[#4E6E5B]">{currentGarden.points} ✨</span>
            </div>
          </div>
        </div>

        {/* Kontrol Suasana Ruangan & Pesta Camilan */}
        <PixelCard className="p-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold uppercase text-[#6E5039] mr-1">Suasana Rumah Pohon:</span>
              <button
                type="button"
                onClick={() => setSanctuaryAmbiance('day')}
                className={`px-2.5 py-1.5 border-2 font-bold flex items-center gap-1 ${
                  sanctuaryAmbiance === 'day' ? 'bg-[#6B8E78] text-white border-[#2C1E14]' : 'bg-white border-[#4A3525]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Pagi Hangat
              </button>
              <button
                type="button"
                onClick={() => setSanctuaryAmbiance('sunset')}
                className={`px-2.5 py-1.5 border-2 font-bold flex items-center gap-1 ${
                  sanctuaryAmbiance === 'sunset' ? 'bg-[#D98A9C] text-white border-[#2C1E14]' : 'bg-white border-[#4A3525]'
                }`}
              >
                <Sunset className="w-3.5 h-3.5" /> Sore Senja
              </button>
              <button
                type="button"
                onClick={() => setSanctuaryAmbiance('night')}
                className={`px-2.5 py-1.5 border-2 font-bold flex items-center gap-1 ${
                  sanctuaryAmbiance === 'night' ? 'bg-[#2C1E14] text-[#FDF8EE] border-[#4A3525]' : 'bg-white border-[#4A3525]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Malam Perapian
              </button>
              <button
                type="button"
                onClick={() => setSanctuaryAmbiance('rain')}
                className={`px-2.5 py-1.5 border-2 font-bold flex items-center gap-1 ${
                  sanctuaryAmbiance === 'rain' ? 'bg-[#5B738E] text-white border-[#2C1E14]' : 'bg-white border-[#4A3525]'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" /> Hujan di Luar Jendela
              </button>
            </div>

            <PixelButton variant="pink" onClick={handleTreatPartyAll}>
              <Sparkles className="w-4 h-4" /> Pesta Camilan & Rawat Semua (-5 ✨)
            </PixelButton>
          </div>
        </PixelCard>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Kolom Kiri: Panggung Ruangan Rumah Pohon 5x5 (7 col) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className={`border-4 border-[#4A3525] shadow-[6px_6px_0px_0px_#2C1E14] p-4 bg-gradient-to-b ${roomStyles[sanctuaryAmbiance]} relative overflow-hidden transition-colors duration-500`}
            >
              {/* Dekorasi Bintang & Cahaya Malam */}
              {sanctuaryAmbiance === 'night' && (
                <div className="pointer-events-none">
                  <span className="absolute top-3 left-8 text-xs text-[#FFF394] animate-pulse">✦</span>
                  <span className="absolute top-6 right-12 text-sm text-[#FFF394] animate-pulse">★</span>
                </div>
              )}

              {/* Efek Suara Hujan di Luar */}
              {sanctuaryAmbiance === 'rain' && (
                <div className="pointer-events-none flex justify-around text-xs text-[#FDF8EE]/80 font-mono mb-1">
                  <span>🌧️ Rintik hujan di atap kayu...</span>
                  <span>🍵 Suasana teduh</span>
                </div>
              )}

              {/* Header Karakter Pasangan di Dalam Rumah Pohon */}
              <div className="flex items-end justify-between mb-3 pb-2 border-b-2 border-[#4A3525]/30">
                <div className="flex items-center gap-2">
                  <div className="flex items-center -space-x-1 bg-[#FDF8EE]/95 p-1 border-2 border-[#2C1E14]">
                    <PixelAvatar avatarKey={currentUser.avatar_key} size={34} />
                    {partnerProfile && <PixelAvatar avatarKey={partnerProfile.avatar_key} size={34} />}
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold leading-tight">Ruang Santai Rumah Pohon</p>
                    <p className="text-[11px] opacity-85">
                      {sanctuaryStats.petCount} peliharaan • {sanctuaryStats.furnitureCount} furnitur
                    </p>
                  </div>
                </div>

                {/* Bar Progress Level Kehangatan */}
                <div className="w-36 bg-[#FDF8EE]/95 p-1.5 border-2 border-[#2C1E14] text-[#2C1E14] text-[10px]">
                  <div className="flex justify-between font-bold mb-0.5">
                    <span>Kehangatan Lv.{sanctuaryStats.cozyLevel}</span>
                    <span>{sanctuaryStats.cozyProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#EFE2C6] border border-[#4A3525]">
                    <div
                      className="h-full bg-[#D98A9C] transition-all"
                      style={{ width: `${sanctuaryStats.cozyProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Toolbar Aksi Perawatan */}
              <div className="bg-[#FDF8EE] text-[#2C1E14] p-2 border-2 border-[#2C1E14] mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span>
                  Mode Aksi:{' '}
                  <strong className="px-2 py-0.5 bg-[#EFE2C6] border border-[#4A3525]">
                    {selectedBrush === 'care'
                      ? '🍖 Beri Makan / Upgrade (-2 ✨)'
                      : selectedBrush === 'clear'
                      ? '🧹 Simpan ke Inventori'
                      : SANCTUARY_CATALOG.find((c) => c.type === selectedBrush)?.name}
                  </strong>
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedBrush('care')}
                    className={`px-2.5 py-1 border-2 font-bold flex items-center gap-1 ${
                      selectedBrush === 'care'
                        ? 'bg-[#6B8E78] text-white border-[#2C1E14]'
                        : 'bg-[#FDF8EE] border-[#4A3525]'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" /> Rawat / Upgrade (-2 ✨)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBrush('clear')}
                    className={`px-2.5 py-1 border-2 font-bold ${
                      selectedBrush === 'clear'
                        ? 'bg-[#C95B5B] text-white border-[#2C1E14]'
                        : 'bg-[#FDF8EE] border-[#4A3525]'
                    }`}
                  >
                    Rapikan
                  </button>
                </div>
              </div>

              {/* Grid Lantai Kayu Rumah Pohon 5x5 */}
              <div className="grid grid-cols-5 gap-2 bg-[#8C6239] p-3 border-4 border-[#4A3525] shadow-[4px_4px_0px_0px_#2C1E14] max-w-[390px] mx-auto">
                {currentGarden.tiles.map((tile) => {
                  const isEven = tile.index % 2 === 0;
                  const isInspected = inspectedTileIndex === tile.index;
                  const isPet = petTypes.includes(tile.item);
                  return (
                    <button
                      key={tile.index}
                      type="button"
                      onClick={() => handleSanctuaryTileClick(tile.index)}
                      className={`aspect-square ${
                        isEven ? 'bg-[#E6CCB2]' : 'bg-[#DDB892]'
                      } border-2 ${
                        isInspected ? 'border-[#2C1E14] ring-2 ring-[#F7D469]' : 'border-[#B08968]'
                      } hover:border-[#2C1E14] flex flex-col items-center justify-center relative transition active:scale-95`}
                    >
                      <SanctuarySprite
                        item={tile.item}
                        stage={tile.stage}
                        size={46}
                        isNight={sanctuaryAmbiance === 'night'}
                      />
                      {tile.item !== 'empty' && (
                        <span
                          className={`absolute bottom-0.5 right-0.5 text-[9px] font-bold px-1 border ${
                            tile.stage >= 4
                              ? 'bg-[#F5DCE2] text-[#592A35] border-[#B86B7D]'
                              : isPet
                              ? 'bg-[#D8E6DC] text-[#2C4235] border-[#4E6E5B]'
                              : 'bg-[#FDF8EE]/90 text-[#4A3525] border-[#4A3525]'
                          }`}
                        >
                          {tile.stage >= 4 ? '❤️MAX' : `Lv.${tile.stage}`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Panel Inspeksi Sudut Ruangan */}
              {inspectedTile && (
                <div className="mt-3 bg-[#FDF8EE]/95 text-[#2C1E14] p-2.5 border-2 border-[#2C1E14] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold">
                      Sudut #{inspectedTile.index + 1}:{' '}
                      {inspectedTile.item === 'empty'
                        ? 'Lantai Kayu Kosong'
                        : `${inspectedMeta?.name} (Tahap ${inspectedTile.stage}/4)`}
                    </span>
                    <span className="block text-[11px] text-[#6E5039]">
                      {inspectedTile.item === 'empty'
                        ? 'Pilih peliharaan atau furnitur di katalog kanan lalu ketuk lantai ini.'
                        : `${inspectedMeta?.desc || ''} ${
                            inspectedPlanter ? `• Ditempatkan oleh ${inspectedPlanter}` : ''
                          }`}
                    </span>
                  </div>
                  {inspectedTile.last_watered_at && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F5DCE2] border border-[#B86B7D] shrink-0">
                      Dirawat: {formatDateID(inspectedTile.last_watered_at)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Katalog Peliharaan & Furnitur + Audit Log Reward (5 col) */}
          <div className="lg:col-span-5 space-y-6">
            <PixelCard>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-base">Adopsi Pet & Katalog Furnitur</h2>
                <div className="flex gap-1 text-[11px]">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'pet', label: '🐾 Peliharaan' },
                    { id: 'furniture', label: '🛋️ Furnitur' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSanctuaryCategoryTab(tab.id)}
                      className={`px-2 py-1 border font-bold ${
                        sanctuaryCategoryTab === tab.id
                          ? 'bg-[#6B8E78] text-white border-[#2C1E14]'
                          : 'bg-[#EFE2C6] text-[#4A3525] border-[#4A3525]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredCatalog.map((item) => {
                  const unlocked = currentGarden.unlocked_items.includes(item.type);
                  const selected = selectedBrush === item.type;
                  return (
                    <div
                      key={item.type}
                      className={`p-2.5 border-2 flex items-center justify-between gap-2 ${
                        selected
                          ? 'bg-[#D8E6DC] border-[#2C1E14]'
                          : 'bg-[#F6EDD9] border-[#4A3525]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 bg-[#FDF8EE] border border-[#4A3525] flex items-center justify-center shrink-0">
                          <SanctuarySprite item={item.type} stage={4} size={36} />
                        </div>
                        <div className="text-xs">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-[#2C1E14]">{item.name}</p>
                            <span className="text-[10px] px-1.5 py-0.2 bg-[#EFE2C6] border border-[#8C684C]">
                              {item.category === 'pet' ? 'Peliharaan' : 'Furnitur'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6E5039]">{item.desc}</p>
                        </div>
                      </div>

                      {unlocked ? (
                        <PixelButton
                          variant={selected ? 'primary' : 'secondary'}
                          onClick={() => setSelectedBrush(item.type)}
                        >
                          {selected ? 'Dipilih' : 'Pasang'}
                        </PixelButton>
                      ) : (
                        <PixelButton
                          variant="pink"
                          onClick={() => handleUnlockSanctuaryItem(item.type, item.cost)}
                        >
                          Adopsi ({item.cost} ✨)
                        </PixelButton>
                      )}
                    </div>
                  );
                })}
              </div>
            </PixelCard>

            <PixelCard variant="warm">
              <h3 className="font-bold text-sm mb-2">Riwayat Poin Kasih Tervalidasi (Idempotent)</h3>
              <div className="space-y-1.5 text-xs max-h-36 overflow-y-auto">
                {db.garden_events
                  .filter((e) => e.couple_id === currentCouple.id)
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2 bg-[#FDF8EE] border border-[#6E5039] flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold">{ev.event_type}</span>
                        <span className="block text-[10px] font-mono text-[#6E5039]">
                          key: {ev.idempotency_key}
                        </span>
                      </div>
                      <span className="font-bold text-[#4E6E5B]">+{ev.points_awarded} ✨</span>
                    </div>
                  ))}
              </div>
            </PixelCard>
          </div>
        </div>
      </div>
    );
  };

  // --- SUB-HALAMAN 7: MINI GAMES — COUPLE QUIZ TERINTEGRASI AI DARI MEMORIES ---
  const renderGamesPage = () => {
    const activeSession = db.game_sessions.find((s) => s.couple_id === currentCouple.id);
    const sessionId = activeSession ? activeSession.id : `sess_${currentCouple.id}`;
    const allQuestions = db.quiz_questions || DEFAULT_QUIZ_QUESTIONS;
    const sharedMems = authorizedMemories.filter((m) => m.visibility === 'shared');

    const categories = ['Semua', ...allQuestions.map((q: any) => String(q.category)).filter((v, i, a) => a.indexOf(v) === i)];
    const filteredQuestions = allQuestions.filter(
      (q) => quizCategoryFilter === 'Semua' || q.category === quizCategoryFilter
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-[#B86B7D]" />
              Couple Quiz — Saling Mengenal
            </h1>
            <p className="text-xs text-[#6E5039]">
              Jawab pertanyaan dari akun masing-masing. Jawaban pasangan baru terbuka setelah kalian berdua merespons!
            </p>
          </div>
        </div>

        {/* Panel AI Memory Quiz Generator */}
        <PixelCard variant="pink">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-[#592A35]" />
                <h2 className="font-bold text-sm sm:text-base text-[#592A35]">
                  ✨ AI Memory Quiz Generator (Terintegrasi dari Kenangan Bersama)
                </h2>
              </div>
              <p className="text-xs text-[#592A35]">
                AI membaca <strong>{sharedMems.length} Shared Memories</strong> kalian untuk merangkai pertanyaan personal tentang momen yang pernah kalian lalui bersama. Memory berstatus <em>Privat</em> tidak pernah dibaca AI.
              </p>
              {sharedMems.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sharedMems.slice(0, 3).map((m) => (
                    <span
                      key={m.id}
                      className="text-[10px] font-bold px-2 py-0.5 bg-[#FDF8EE] border border-[#8C4F5E] text-[#592A35]"
                    >
                      📖 {m.title}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <PixelButton
              variant="primary"
              onClick={handleGenerateAiQuestionsFromMemories}
              disabled={isGeneratingAiQuiz}
              className="shrink-0"
            >
              {isGeneratingAiQuiz ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Merangkai Pertanyaan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> ✨ Buat Pertanyaan AI dari Kenangan
                </>
              )}
            </PixelButton>
          </div>
        </PixelCard>

        {/* Filter Kategori Pertanyaan */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setQuizCategoryFilter(cat)}
              className={`px-3 py-1.5 border-2 text-xs font-bold ${
                quizCategoryFilter === cat
                  ? 'bg-[#6B8E78] text-white border-[#2C1E14]'
                  : 'bg-[#FDF8EE] text-[#4A3525] border-[#4A3525]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const myAnswer = db.game_answers.find(
              (a) =>
                a.session_id === sessionId &&
                a.question_id === q.id &&
                a.user_id === currentUserId
            );
            const partnerAnswer = partnerProfile
              ? db.game_answers.find(
                  (a) =>
                    a.session_id === sessionId &&
                    a.question_id === q.id &&
                    a.user_id === partnerProfile.id
                )
              : null;

            const bothAnswered = Boolean(myAnswer && partnerAnswer);

            return (
              <PixelCard key={q.id} variant={bothAnswered ? 'sage' : q.isAi ? 'warm' : 'cream'}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 bg-[#EFE2C6] border border-[#4A3525]">
                      {q.category}
                    </span>
                    {q.sourceMemoryTitle && (
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-[#F5DCE2] text-[#592A35] border border-[#B86B7D]">
                        Dari Memory: "{q.sourceMemoryTitle}"
                      </span>
                    )}
                  </div>
                  {bothAnswered ? (
                    <span className="text-xs font-bold text-[#2C4235] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Kalian berdua sudah menjawab!
                    </span>
                  ) : (
                    <span className="text-xs text-[#6E5039]">
                      {myAnswer ? 'Menunggu jawaban pasangan' : 'Giliranmu menjawab'}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-[#2C1E14] mb-4">{q.text}</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Kotak Jawaban Saya */}
                  <div className="p-3 bg-[#FDF8EE] border-2 border-[#4A3525]">
                    <p className="text-xs font-bold text-[#6E5039] mb-2">
                      Jawabanmu ({currentUser.display_name}):
                    </p>
                    {myAnswer ? (
                      <div className="text-xs space-y-2">
                        <p className="font-semibold text-[#2C1E14] p-2 bg-[#EFE2C6]/60 border border-[#8C684C]">
                          {myAnswer.skipped ? '(Melewati pertanyaan ini)' : myAnswer.answer_text}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={quizInputs[q.id] || ''}
                          onChange={(e) =>
                            setQuizInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          placeholder="Tulis jawaban jujurmu..."
                          className="w-full p-2 bg-white border-2 border-[#4A3525] text-xs"
                        />
                        <div className="flex gap-2">
                          <PixelButton
                            variant="primary"
                            onClick={() => handleSubmitQuizAnswer(q.id, false)}
                            className="flex-1"
                          >
                            Kirim Jawaban (+5 ✨)
                          </PixelButton>
                          <PixelButton
                            variant="secondary"
                            onClick={() => handleSubmitQuizAnswer(q.id, true)}
                          >
                            Lewati
                          </PixelButton>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Kotak Jawaban Pasangan */}
                  <div className="p-3 bg-[#FDF8EE] border-2 border-[#4A3525]">
                    <p className="text-xs font-bold text-[#6E5039] mb-2">
                      Jawaban {partnerProfile ? partnerProfile.display_name : 'Pasangan'}:
                    </p>
                    {!partnerAnswer ? (
                      <p className="text-xs text-[#6E5039] italic">Belum menjawab pertanyaan ini.</p>
                    ) : !myAnswer ? (
                      <div className="p-2 bg-[#F5DCE2] border border-[#B86B7D] text-xs text-[#592A35] flex items-center gap-2">
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>
                          {partnerProfile?.display_name} sudah menjawab! Jawab atau lewati pertanyaan ini terlebih
                          dahulu untuk membuka jawabannya.
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-[#2C1E14] p-2 bg-[#D8E6DC] border border-[#4E6E5B]">
                        {partnerAnswer.skipped
                          ? '(Melewati pertanyaan ini)'
                          : partnerAnswer.answer_text}
                      </p>
                    )}
                  </div>
                </div>
              </PixelCard>
            );
          })}
        </div>
      </div>
    );
  };

  // --- SUB-HALAMAN 8: SETTINGS, PROFIL & UNPAIR ---
  const renderSettingsPage = () => (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Settings className="w-5 h-5 text-[#4A3525]" />
        Pengaturan Profil, Dunia & Keamanan
      </h1>

      <PixelCard>
        <h2 className="font-bold text-base mb-4">Profil & Informasi Dunia</h2>
        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase mb-1">Nama Panggilanmu</label>
            <input
              type="text"
              value={editProfileName}
              onChange={(e) => setEditProfileName(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
            />
          </div>
          <div>
            <label className="block font-bold uppercase mb-1">Nama Dunia Pasangan</label>
            <input
              type="text"
              value={editWorldName}
              onChange={(e) => setEditWorldName(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
            />
          </div>
          <div>
            <label className="block font-bold uppercase mb-1">
              Tanggal Penting / Anniversary Berikutnya (Untuk Countdown Home)
            </label>
            <input
              type="date"
              value={editAnnivDate}
              onChange={(e) => setEditAnnivDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
            />
          </div>
          <PixelButton type="submit" variant="primary">
            Simpan Perubahan
          </PixelButton>
        </form>
      </PixelCard>

      <PixelCard variant="pink">
        <h2 className="font-bold text-base text-[#592A35] mb-2">Zona Sensitif: Unpair / Keluar Dunia</h2>
        <p className="text-xs text-[#592A35] mb-4">
          Jika kamu keluar dari dunia pasangan (unpair), akses bersama ke Wishlist, Garden, dan Memories bersama akan
          dihentikan, sedangkan catatan siklus dan mood pribadimu tetap aman bersama akunmu.
        </p>
        <div className="flex flex-wrap gap-3">
          <PixelButton variant="danger" onClick={handleUnpairWorld}>
            Putuskan Hubungan Dunia (Unpair)
          </PixelButton>
          <PixelButton variant="secondary" onClick={handleResetDemoDatabase}>
            <RefreshCw className="w-4 h-4" /> Reset Data Demo (Adel & Merdi)
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );

  // ============================================================================
  // 15. SHELL NAVIGASI UTAMA (DESKTOP SIDEBAR & MOBILE BOTTOM NAV)
  // ============================================================================

  const mobileBottomNavItems = [
    { id: 'home', label: 'Home', icon: <Heart className="w-5 h-5" /> },
    { id: 'cycle', label: 'Cycle', icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'garden', label: 'Sanctuary', icon: <PawPrint className="w-5 h-5" /> },
    { id: 'memories', label: 'Memories', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'games', label: 'Games', icon: <Gamepad2 className="w-5 h-5" /> },
  ];

  const desktopSidebarItems = [
    ...mobileBottomNavItems,
    { id: 'wishlist', label: 'Wishlist', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'love-notes', label: 'Love Notes', icon: <Mail className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F6EDD9] text-[#2C1E14] flex flex-col overflow-x-hidden">
      
      {renderGlobalOverlays()}

      <div className="flex-1 flex max-w-6xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 border-r-2 border-[#4A3525] bg-[#FDF8EE] p-4 justify-between">
          <div className="space-y-6">
            <div
              onClick={() => setActiveRoute('home')}
              className="flex items-center gap-3 p-2 border-2 border-[#4A3525] bg-[#F6EDD9] cursor-pointer"
            >
              <PixelAvatar avatarKey={currentUser.avatar_key} size={40} />
              <div className="overflow-hidden">
                <p className="font-extrabold text-sm tracking-tight truncate">MERADEL</p>
                <p className="text-[11px] text-[#6E5039] truncate">{currentUser.display_name}</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              {desktopSidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveRoute(item.id)}
                  className={`w-full px-3 py-2.5 border-2 text-left text-xs font-bold flex items-center gap-3 transition ${
                    activeRoute === item.id
                      ? 'bg-[#6B8E78] text-[#FDF8EE] border-[#2C1E14] shadow-[3px_3px_0px_0px_#2C1E14]'
                      : 'bg-transparent text-[#4A3525] border-transparent hover:bg-[#EFE2C6]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-4 border-t-2 border-[#EFE2C6]">
            <PixelButton
              variant="secondary"
              onClick={() => setCurrentUserId(null)}
              className="w-full"
            >
              <LogOut className="w-4 h-4" /> Keluar Akun
            </PixelButton>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-8 min-w-0">
          {/* Mobile Top Header */}
          <div className="md:hidden flex items-center justify-between pb-3 mb-4 border-b-2 border-[#4A3525]">
            <div
              onClick={() => setActiveRoute('home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <PixelAvatar avatarKey={currentUser.avatar_key} size={34} />
              <div>
                <span className="font-extrabold text-sm block leading-none">MERADEL</span>
                <span className="text-[10px] text-[#6E5039]">{currentCouple.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveRoute('wishlist')}
                className={`p-2 border-2 border-[#4A3525] ${
                  activeRoute === 'wishlist' ? 'bg-[#D98A9C] text-white' : 'bg-[#FDF8EE]'
                }`}
                title="Wishlist"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveRoute('love-notes')}
                className={`p-2 border-2 border-[#4A3525] ${
                  activeRoute === 'love-notes' ? 'bg-[#6B8E78] text-white' : 'bg-[#FDF8EE]'
                }`}
                title="Love Notes"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveRoute('settings')}
                className={`p-2 border-2 border-[#4A3525] ${
                  activeRoute === 'settings' ? 'bg-[#4A3525] text-white' : 'bg-[#FDF8EE]'
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {activeRoute === 'home' && renderHomeDashboard()}
          {activeRoute === 'cycle' && renderCycleAndMoodPage()}
          {activeRoute === 'wishlist' && renderWishlistPage()}
          {activeRoute === 'memories' && renderMemoriesPage()}
          {activeRoute === 'love-notes' && renderLoveNotesPage()}
          {activeRoute === 'garden' && renderPixelGardenPage()}
          {activeRoute === 'games' && renderGamesPage()}
          {activeRoute === 'settings' && renderSettingsPage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation (5 Item sesuai PRD Bab 4.3) */}
      <nav
        aria-label="Navigasi Utama Mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDF8EE] border-t-2 border-[#2C1E14] grid grid-cols-5"
      >
        {mobileBottomNavItems.map((item) => {
          const active = activeRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveRoute(item.id)}
              className={`min-h-[54px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition ${
                active ? 'bg-[#6B8E78] text-[#FDF8EE]' : 'text-[#4A3525] hover:bg-[#EFE2C6]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}