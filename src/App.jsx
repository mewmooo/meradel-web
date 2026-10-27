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
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Image as ImageIcon,
  Info,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Wand2,
  Loader2,
  Sun,
  Sunset,
  Moon,
  CloudRain,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';
import { supabase } from './lib/supabaseClient';

// ============================================================================
// 1. KONSTANTA & DATA REFERENSI (DESAIN PIXEL ART 16-BIT COZY)
// ============================================================================

const DB_STORAGE_KEY = 'meradel_prod_db_v1';
const SESSION_STORAGE_KEY = 'meradel_prod_active_session_v1';

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

function hashText(rawText) {
  const normalized = (rawText || '').trim();
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

function hashInviteToken(rawToken) {
  return hashText((rawToken || '').trim().toUpperCase());
}

function validateSafeUrl(inputUrl) {
  const trimmed = (inputUrl || '').trim();
  if (!trimmed) return { valid: true };
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        valid: false,
        error: `Protokol "${parsed.protocol}" tidak diizinkan demi keamanan. Gunakan https:// atau http://.`,
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
      intervalsCount: Math.max(0, (logs?.length || 0) - 1),
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
// 3. DATABASE KOSONG BERSIH UNTUK PUBLIK (TANPA AUTO-LOGIN KE DATA DUMMY)
// ============================================================================

function createEmptyPublicDatabase() {
  return {
    profiles: [],
    couples: [],
    couple_members: [],
    couple_invites: [],
    cycle_logs: [],
    cycle_sharing_settings: [],
    mood_entries: [],
    wishlist_items: [],
    memories: [],
    love_notes: [],
    garden_state: [],
    garden_events: [],
    game_sessions: [],
    game_answers: [],
    custom_quiz_questions: [],
  };
}

// ============================================================================
// 4. KOMPONEN PIXEL ART SVG SPRITES (16-BIT COZY)
// ============================================================================

function PixelAvatar({ avatarKey = 'mage_rose', size = 44, className = '' }) {
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
}

function SanctuarySprite({ item, stage = 4, size = 44, isNight = false }) {
  if (!item || item === 'empty') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="12" width="12" height="1" fill="#8C684C" opacity="0.3" />
        <rect x="5" y="6" width="6" height="1" fill="#8C684C" opacity="0.25" />
      </svg>
    );
  }

  const isPet = ['cat_mochi', 'bunny_bubu', 'bird_piyo', 'fox_kuro', 'hamster_choco', 'panda_pao'].includes(item);

  if (isPet && stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="10" width="10" height="4" fill="#8C684C" />
        <rect x="4" y="9" width="8" height="2" fill="#D98A9C" />
        <rect x="6" y="7" width="4" height="3" fill="#FDF8EE" />
        <rect x="7" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="9" y="8" width="1" height="1" fill="#2C1E14" />
      </svg>
    );
  }

  const HeartBadge = stage >= 4 ? (
    <>
      <rect x="6" y="1" width="1" height="1" fill="#E05A6D" />
      <rect x="9" y="1" width="1" height="1" fill="#E05A6D" />
      <rect x="5" y="2" width="6" height="1" fill="#E05A6D" />
      <rect x="6" y="3" width="4" height="1" fill="#E05A6D" />
      <rect x="7" y="4" width="2" height="1" fill="#E05A6D" />
    </>
  ) : null;

  if (item === 'cat_mochi') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        {HeartBadge}
        <rect x="4" y="5" width="2" height="2" fill="#E69A4C" />
        <rect x="10" y="5" width="2" height="2" fill="#E69A4C" />
        <rect x="4" y="7" width="8" height="6" fill="#F2B16B" />
        <rect x="5" y="10" width="6" height="3" fill="#FDF8EE" />
        <rect x="5" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="10" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="7" y="9" width="2" height="1" fill="#D98A9C" />
        {stage >= 3 && <rect x="5" y="11" width="6" height="1" fill="#D95B5B" />}
        <rect x="12" y="9" width="2" height="3" fill="#E69A4C" />
      </svg>
    );
  }

  if (item === 'bunny_bubu') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        {HeartBadge}
        <rect x="5" y="3" width="2" height="4" fill="#FDF8EE" />
        <rect x="9" y="3" width="2" height="4" fill="#FDF8EE" />
        <rect x="6" y="4" width="1" height="2" fill="#F2BAC9" />
        <rect x="9" y="4" width="1" height="2" fill="#F2BAC9" />
        <rect x="4" y="7" width="8" height="6" fill="#FDF8EE" />
        <rect x="5" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="10" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="7" y="9" width="2" height="1" fill="#E89999" />
        {stage >= 3 && <rect x="10" y="10" width="3" height="2" fill="#E8853A" />}
      </svg>
    );
  }

  if (item === 'bird_piyo') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        {HeartBadge}
        <rect x="3" y="13" width="10" height="1" fill="#8C684C" />
        <rect x="5" y="6" width="6" height="6" fill="#F7D469" />
        <rect x="4" y="8" width="2" height="3" fill="#E8B84B" />
        <rect x="10" y="8" width="2" height="3" fill="#E8B84B" />
        <rect x="6" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="9" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="7" y="9" width="2" height="1" fill="#E87A3E" />
        <rect x="6" y="12" width="1" height="1" fill="#8C684C" />
        <rect x="9" y="12" width="1" height="1" fill="#8C684C" />
      </svg>
    );
  }

  if (item === 'fox_kuro') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        {HeartBadge}
        <rect x="4" y="5" width="2" height="2" fill="#4A3525" />
        <rect x="10" y="5" width="2" height="2" fill="#4A3525" />
        <rect x="4" y="7" width="8" height="6" fill="#D96B38" />
        <rect x="6" y="10" width="4" height="3" fill="#FDF8EE" />
        <rect x="5" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="10" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="12" y="8" width="3" height="4" fill="#D96B38" />
        <rect x="13" y="7" width="2" height="2" fill="#FDF8EE" />
      </svg>
    );
  }

  if (item === 'hamster_choco') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        {HeartBadge}
        <rect x="4" y="6" width="2" height="2" fill="#A67856" />
        <rect x="10" y="6" width="2" height="2" fill="#A67856" />
        <rect x="4" y="7" width="8" height="6" fill="#D9A773" />
        <rect x="3" y="9" width="2" height="3" fill="#F7D7B5" />
        <rect x="11" y="9" width="2" height="3" fill="#F7D7B5" />
        <rect x="6" y="10" width="4" height="3" fill="#FDF8EE" />
        <rect x="5" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="10" y="8" width="1" height="1" fill="#2C1E14" />
      </svg>
    );
  }

  if (item === 'panda_pao') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        {HeartBadge}
        <rect x="4" y="5" width="2" height="2" fill="#FDF8EE" />
        <rect x="10" y="5" width="2" height="2" fill="#FDF8EE" />
        <rect x="4" y="7" width="8" height="6" fill="#C95238" />
        <rect x="5" y="8" width="2" height="2" fill="#FDF8EE" />
        <rect x="9" y="8" width="2" height="2" fill="#FDF8EE" />
        <rect x="5" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="10" y="8" width="1" height="1" fill="#2C1E14" />
        <rect x="6" y="11" width="4" height="2" fill="#4A3525" />
      </svg>
    );
  }

  if (item === 'fireplace') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="3" width="12" height="11" fill="#9E4F42" />
        <rect x="1" y="2" width="14" height="2" fill="#6E5039" />
        <rect x="4" y="6" width="8" height="8" fill="#2C1E14" />
        <rect x="5" y="9" width="6" height="5" fill="#E87A3E" />
        <rect x="6" y="10" width="4" height="4" fill="#F7D469" />
        {(stage >= 3 || isNight) && <rect x="7" y="7" width="2" height="3" fill="#FFF3B0" />}
      </svg>
    );
  }

  if (item === 'rug') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="1" y="4" width="14" height="8" fill="#D98A9C" />
        <rect x="2" y="5" width="12" height="6" fill="#FDF8EE" />
        <rect x="4" y="6" width="8" height="4" fill="#6B8E78" />
        {stage >= 3 && <rect x="6" y="7" width="4" height="2" fill="#F7D469" />}
      </svg>
    );
  }

  if (item === 'bookshelf') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="2" width="12" height="12" fill="#6E5039" />
        <rect x="3" y="3" width="10" height="4" fill="#4A3525" />
        <rect x="3" y="8" width="10" height="5" fill="#4A3525" />
        <rect x="4" y="4" width="2" height="3" fill="#D98A9C" />
        <rect x="6" y="4" width="2" height="3" fill="#6B8E78" />
        <rect x="8" y="4" width="3" height="3" fill="#E8B84B" />
        <rect x="4" y="9" width="3" height="4" fill="#78A8C4" />
        <rect x="8" y="9" width="2" height="4" fill="#D96B38" />
      </svg>
    );
  }

  if (item === 'tea_table') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="8" width="12" height="3" fill="#8C684C" />
        <rect x="3" y="11" width="2" height="3" fill="#6E5039" />
        <rect x="11" y="11" width="2" height="3" fill="#6E5039" />
        <rect x="5" y="5" width="3" height="3" fill="#D8E6DC" />
        <rect x="9" y="6" width="3" height="2" fill="#D98A9C" />
      </svg>
    );
  }

  if (item === 'window_view') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="2" width="12" height="11" fill="#6E5039" />
        <rect x="3" y="3" width="10" height="9" fill={isNight ? '#1E293B' : '#94C9E8'} />
        {isNight ? (
          <rect x="9" y="4" width="2" height="2" fill="#FFF3B0" />
        ) : (
          <rect x="4" y="4" width="3" height="3" fill="#F7D469" />
        )}
        <rect x="7" y="3" width="2" height="9" fill="#6E5039" />
        <rect x="3" y="7" width="10" height="1" fill="#6E5039" />
      </svg>
    );
  }

  if (item === 'gramophone') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="4" y="10" width="8" height="4" fill="#6E5039" />
        <rect x="5" y="9" width="6" height="1" fill="#2C1E14" />
        <rect x="7" y="4" width="4" height="4" fill="#E8B84B" />
        <rect x="9" y="3" width="3" height="3" fill="#F7D469" />
        {stage >= 2 && <rect x="3" y="4" width="2" height="2" fill="#D98A9C" />}
      </svg>
    );
  }

  if (item === 'lantern_string') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="1" y="3" width="14" height="1" fill="#4A3525" />
        <rect x="3" y="4" width="2" height="3" fill="#FFF3B0" />
        <rect x="7" y="5" width="2" height="3" fill="#F7D469" />
        <rect x="11" y="4" width="2" height="3" fill="#FFF3B0" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="6" width="12" height="6" fill="#D98A9C" />
      <rect x="3" y="8" width="10" height="4" fill="#B86B7D" />
      <rect x="4" y="7" width="3" height="2" fill="#FDF8EE" />
      <rect x="9" y="7" width="3" height="2" fill="#FDF8EE" />
    </svg>
  );
}

// ============================================================================
// 5. KOMPONEN UI DESIGN SYSTEM PIXEL
// ============================================================================

function PixelCard({ children, className = '', variant = 'cream' }) {
  const bgMap = {
    cream: 'bg-[#FDF8EE] border-[#4A3525]',
    sage: 'bg-[#E6EFE9] border-[#4E6E5B]',
    pink: 'bg-[#F9EBEF] border-[#8C4F5E]',
    warm: 'bg-[#F5E9D4] border-[#6E5039]',
  };
  return (
    <div className={`border-2 ${bgMap[variant] || bgMap.cream} shadow-[4px_4px_0px_0px_#4A3525] p-4 transition-all ${className}`}>
      {children}
    </div>
  );
}

function PixelButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  title,
}) {
  const styles = {
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
      className={`min-h-[42px] px-3.5 py-2 border-2 font-semibold text-sm flex items-center justify-center gap-2 transition-transform active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:pointer-events-none ${
        variant !== 'ghost' ? 'shadow-[3px_3px_0px_0px_#2C1E14]' : ''
      } ${styles[variant] || styles.primary} ${className}`}
    >
      {children}
    </button>
  );
}

// ============================================================================
// 6. APLIKASI UTAMA MERADEL (PRODUCTION PUBLIC RELEASE)
// ============================================================================

export default function App() {
  // --- Database State dengan Persistensi LocalStorage ---
  const [db, setDb] = useState(() => {
    try {
      const saved = localStorage.getItem(DB_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.profiles)) {
          return {
            ...createEmptyPublicDatabase(),
            ...parsed,
          };
        }
      }
    } catch {
      // Fallback ke database kosong publik
    }
    return createEmptyPublicDatabase();
  });

  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    } catch {
      // Abaikan jika penyimpanan penuh
    }
  }, [db]);

  // --- Sesi Autentikasi Publik (Dimulai dari null / Belum Login kecuali sudah ada sesi aktif) ---
  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      return localStorage.getItem(SESSION_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUserId) {
        localStorage.setItem(SESSION_STORAGE_KEY, currentUserId);
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Abaikan error storage
    }
  }, [currentUserId]);

  const [authView, setAuthView] = useState('login'); // 'login' | 'register' | 'forgot'
  const [activeRoute, setActiveRoute] = useState('home');

  // --- Toast Notification ---
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // --- Custom Confirmation Modal State (Tanpa window.confirm) ---
  const [confirmDialog, setConfirmDialog] = useState(null);

  // --- Fungsi Sinkronisasi Data Cloud Supabase ke State Lokal ---
  const loadSupabaseData = useCallback(async (userId) => {
    if (!supabase || !userId) return;
    try {
      // 1. Ambil profil user saat ini
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // 2. Ambil keanggotaan couple user
      const { data: memberships } = await supabase
        .from('couple_members')
        .select('*')
        .eq('user_id', userId);

      let couplesData = [];
      let allMembers = memberships || [];
      let partnerProfiles = [];

      if (memberships && memberships.length > 0) {
        const coupleIds = memberships.map((m) => m.couple_id);
        const { data: couples } = await supabase
          .from('couples')
          .select('*')
          .in('id', coupleIds);
        couplesData = couples || [];

        const { data: members } = await supabase
          .from('couple_members')
          .select('*')
          .in('couple_id', coupleIds);
        if (members) allMembers = members;

        const partnerIds = allMembers.map((m) => m.user_id).filter((id) => id !== userId);
        if (partnerIds.length > 0) {
          const { data: partners } = await supabase
            .from('profiles')
            .select('*')
            .in('id', partnerIds);
          if (partners) partnerProfiles = partners;
        }
      }

      // 3. Ambil modul data lainnya dari Supabase
      const [
        { data: cycles },
        { data: cycleSettings },
        { data: moods },
        { data: wishes },
        { data: memories },
        { data: notes },
        { data: gardens },
      ] = await Promise.all([
        supabase.from('cycle_logs').select('*'),
        supabase.from('cycle_sharing_settings').select('*'),
        supabase.from('mood_entries').select('*'),
        supabase.from('wishlist_items').select('*'),
        supabase.from('memories').select('*'),
        supabase.from('love_notes').select('*'),
        supabase.from('garden_state').select('*'),
      ]);

      const allFetchedProfiles = [
        ...(myProfile ? [myProfile] : []),
        ...partnerProfiles,
      ];

      setDb((prev) => ({
        ...prev,
        profiles: allFetchedProfiles.length > 0
          ? [
              ...prev.profiles.filter(
                (p) => !allFetchedProfiles.some((fp) => fp.id === p.id)
              ),
              ...allFetchedProfiles,
            ]
          : prev.profiles,
        couples: couplesData,
        couple_members: allMembers,
        cycle_logs: cycles || [],
        cycle_sharing_settings: cycleSettings || [],
        mood_entries: moods || [],
        wishlist_items: wishes || [],
        memories: memories || [],
        love_notes: notes || [],
        garden_state: gardens && gardens.length > 0 ? gardens : prev.garden_state,
      }));
    } catch (err) {
      console.warn('Sinkronisasi Supabase:', err);
    }
  }, []);

  // --- Inisialisasi Sesi Supabase Cloud & Recovery Listener ---
  useEffect(() => {
    const checkRecoveryUrl = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      if (
        hash.includes('type=recovery') ||
        search.includes('type=recovery') ||
        hash.includes('access_token=')
      ) {
        setAuthView('reset_password');
        showToast('Sesi pemulihan akun terverifikasi. Silakan masukkan kata sandi barumu.', 'info');
      }
    };

    checkRecoveryUrl();
    window.addEventListener('hashchange', checkRecoveryUrl);

    if (supabase) {
      // 1. Pulihkan sesi login aktif saat pertama kali dibuka
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setCurrentUserId(session.user.id);
          loadSupabaseData(session.user.id);
        }
      });

      // 2. Listener event perubahan auth
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setCurrentUserId(session.user.id);
          loadSupabaseData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUserId(null);
        } else if (event === 'PASSWORD_RECOVERY') {
          setAuthView('reset_password');
          showToast('Sesi pemulihan akun aktif dari email. Silakan atur kata sandi baru kamu.', 'info');
        }
      });

      return () => {
        window.removeEventListener('hashchange', checkRecoveryUrl);
        subscription?.unsubscribe();
      };
    }

    return () => {
      window.removeEventListener('hashchange', checkRecoveryUrl);
    };
  }, [loadSupabaseData, showToast]);

  // ============================================================================
  // 7. BACKEND / RLS AUTHORIZATION LAYER
  // ============================================================================

  const currentUser = useMemo(
    () => db.profiles.find((p) => p.id === currentUserId) || null,
    [db.profiles, currentUserId]
  );

  useEffect(() => {
    if (currentUserId && !currentUser) {
      setCurrentUserId(null);
    }
  }, [currentUserId, currentUser]);

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
          : [
              ...prev.garden_state,
              {
                couple_id: currentCouple.id,
                points,
                unlocked_items: ['cat_mochi', 'bunny_bubu', 'fireplace', 'rug'],
                tiles: Array.from({ length: 25 }, (_, i) => ({
                  index: i,
                  item: 'empty',
                  stage: 1,
                  last_watered_at: null,
                  planted_by: null,
                })),
                updated_at: new Date().toISOString(),
              },
            ];

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
  // 8. STATE SEMUA FORMULIR & FITUR
  // ============================================================================

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGender, setRegGender] = useState('female');
  const [regAvatar, setRegAvatar] = useState('mage_rose');

  const [forgotEmail, setForgotEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const [newWorldName, setNewWorldName] = useState('');
  const [generatedRawToken, setGeneratedRawToken] = useState(null);
  const [joinTokenInput, setJoinTokenInput] = useState('');

  const [cycleStartInput, setCycleStartInput] = useState(todayLocalISO());
  const [cycleEndInput, setCycleEndInput] = useState('');
  const [moodDateInput, setMoodDateInput] = useState(todayLocalISO());
  const [selectedMood, setSelectedMood] = useState('calm');
  const [selectedEnergy, setSelectedEnergy] = useState(4);
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Tidak ada gejala']);
  const [moodNoteInput, setMoodNoteInput] = useState('');
  const [calMonthOffset, setCalMonthOffset] = useState(0);

  const [wishTitle, setWishTitle] = useState('');
  const [wishDesc, setWishDesc] = useState('');
  const [wishUrl, setWishUrl] = useState('');
  const [wishCategory, setWishCategory] = useState('date');
  const [wishPriority, setWishPriority] = useState('normal');
  const [wishFilterCategory, setWishFilterCategory] = useState('all');
  const [wishFilterStatus, setWishFilterStatus] = useState('all');
  const [wishSearch, setWishSearch] = useState('');
  const [showWishModal, setShowWishModal] = useState(false);

  const [memTitle, setMemTitle] = useState('');
  const [memCaption, setMemCaption] = useState('');
  const [memDate, setMemDate] = useState(todayLocalISO());
  const [memVisibility, setMemVisibility] = useState('shared');
  const [memImagePreview, setMemImagePreview] = useState(null);
  const [showMemModal, setShowMemModal] = useState(false);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteScheduleDate, setNoteScheduleDate] = useState('');
  const [noteTab, setNoteTab] = useState('inbox');
  const [selectedNoteToRead, setSelectedNoteToRead] = useState(null);

  const [selectedBrush, setSelectedBrush] = useState('care');
  const [gardenAmbiance, setGardenAmbiance] = useState('day');
  const [gardenCatalogTab, setGardenCatalogTab] = useState('all');
  const [inspectedTileIndex, setInspectedTileIndex] = useState(null);

  const [quizInputs, setQuizInputs] = useState({});
  const [quizCategoryFilter, setQuizCategoryFilter] = useState('Semua');
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState(false);

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
  // 9. HANDLER AUTENTIKASI PUBLIK & PAIRING
  // ============================================================================

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = loginEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      showToast('Masukkan alamat email yang valid.', 'error');
      return;
    }
    if (!loginPassword) {
      showToast('Masukkan kata sandi akunmu.', 'error');
      return;
    }

    setIsSubmittingAuth(true);
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: loginPassword,
        });

        if (error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('invalid login credentials')) {
            showToast('Email belum terdaftar atau kata sandi salah. Silakan periksa kembali atau buat akun baru.', 'error');
          } else if (msg.includes('email not confirmed')) {
            showToast('Email belum dikonfirmasi. Buka emailmu untuk verifikasi atau matikan "Confirm email" di Supabase.', 'error');
          } else {
            showToast(error.message, 'error');
          }
          return;
        }

        const user = data.user;
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          const activeProfile = profile || {
            id: user.id,
            email: user.email || trimmedEmail,
            display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
            gender: user.user_metadata?.gender || 'female',
            avatar_key: user.user_metadata?.avatar_key || 'mage_rose',
            created_at: user.created_at,
            updated_at: user.updated_at || new Date().toISOString(),
          };

          setDb((prev) => ({
            ...prev,
            profiles: [...prev.profiles.filter((p) => p.id !== user.id), activeProfile],
          }));

          setCurrentUserId(user.id);
          setLoginPassword('');
          showToast(`Selamat datang kembali di Meradel, ${activeProfile.display_name}!`, 'success');
          await loadSupabaseData(user.id);
          return;
        }
      }

      // Fallback Mode Offline / Demo
      const found = db.profiles.find((p) => p.email.toLowerCase() === trimmedEmail);
      if (!found) {
        showToast('Akun dengan email tersebut belum terdaftar. Silakan klik tab Daftar Baru.', 'error');
        return;
      }
      if (found.password_hash && found.password_hash !== hashText(loginPassword)) {
        showToast('Kata sandi yang kamu masukkan salah.', 'error');
        return;
      }
      setCurrentUserId(found.id);
      setLoginPassword('');
      showToast(`Selamat datang kembali di Meradel, ${found.display_name}!`, 'success');
    } catch {
      showToast('Gagal menghubungi server autentikasi. Periksa koneksi internetmu.', 'error');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
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
    if (regPassword.length < 6) {
      showToast('Kata sandi minimal 6 karakter.', 'error');
      return;
    }

    setIsSubmittingAuth(true);
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: regPassword,
          options: {
            data: {
              display_name: name,
              gender: regGender,
              avatar_key: regAvatar,
            },
          },
        });

        if (error) {
          if (error.message.toLowerCase().includes('already registered')) {
            showToast('Email ini sudah terdaftar di Supabase Cloud. Silakan langsung masuk.', 'error');
          } else {
            showToast(error.message, 'error');
          }
          return;
        }

        const user = data.user;
        if (user) {
          const profileData = {
            id: user.id,
            email,
            display_name: name,
            gender: regGender,
            avatar_key: regAvatar,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          try {
            await supabase.from('profiles').upsert(profileData);
          } catch {
            // Abaikan jika trigger sudah membuat profile
          }

          setDb((prev) => ({
            ...prev,
            profiles: [...prev.profiles.filter((p) => p.id !== user.id), profileData],
          }));

          setCurrentUserId(user.id);
          setRegName('');
          setRegEmail('');
          setRegPassword('');

          if (!data.session) {
            showToast(`Akun ${name} terdaftar! Jika tombol Masuk belum bisa, buka emailmu untuk verifikasi (atau matikan Confirm Email di Supabase Dashboard).`, 'info');
          } else {
            showToast(`Akun ${name} berhasil dibuat di Supabase Cloud! Sekarang buat atau gabung dunia pasanganmu.`, 'success');
          }
          await loadSupabaseData(user.id);
          return;
        }
      }

      // Fallback Mode Offline / Demo
      if (db.profiles.some((p) => p.email.toLowerCase() === email)) {
        showToast('Email sudah terdaftar. Silakan masuk menggunakan akunmu.', 'error');
        return;
      }
      const newProfile = {
        id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        email,
        password_hash: hashText(regPassword),
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
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      showToast(`Akun ${name} berhasil dibuat! Sekarang buat atau gabung dunia pasanganmu.`, 'success');
    } catch {
      showToast('Gagal mendaftarkan akun. Periksa koneksi internetmu.', 'error');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // 1. Minta pengiriman tautan reset ke email (Aman - tidak mengubah sandi langsung)
  const handleRequestPasswordReset = async (e) => {
    e.preventDefault();
    const email = forgotEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      showToast('Masukkan alamat email yang valid.', 'error');
      return;
    }

    setIsSendingResetEmail(true);
    try {
      if (supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#type=recovery`,
        });
        if (error) {
          showToast(error.message || 'Gagal mengirim email pemulihan.', 'error');
          return;
        }
        setForgotSent(true);
        showToast(`Tautan reset kata sandi telah dikirim ke ${email}. Silakan cek kotak masuk/spam emailmu!`, 'success');
      } else {
        // Fallback untuk database demo / offline
        const found = db.profiles.find((p) => p.email.toLowerCase() === email);
        if (!found) {
          showToast('Akun dengan email tersebut belum terdaftar.', 'error');
          return;
        }
        setForgotSent(true);
        showToast(`Tautan pemulihan kata sandi telah disiapkan untuk ${email}.`, 'success');
      }
    } catch {
      showToast('Terjadi kesalahan saat memproses permintaan reset kata sandi.', 'error');
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  // 2. Simpan kata sandi baru (Hanya dapat diakses setelah membuka tautan recovery)
  const handleConfirmNewPassword = async (e) => {
    e.preventDefault();
    if (resetNewPassword.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter.', 'error');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          password: resetNewPassword,
        });
        if (error) {
          showToast(error.message || 'Gagal memperbarui kata sandi di Supabase.', 'error');
          return;
        }
      }

      // Sinkronkan ke database lokal
      const targetEmail = forgotEmail.trim().toLowerCase();
      if (targetEmail) {
        setDb((prev) => ({
          ...prev,
          profiles: prev.profiles.map((p) =>
            p.email.toLowerCase() === targetEmail
              ? { ...p, password_hash: hashText(resetNewPassword), updated_at: new Date().toISOString() }
              : p
          ),
        }));
        setLoginEmail(targetEmail);
      }

      showToast('Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi barumu.', 'success');
      setResetNewPassword('');
      setResetConfirmPassword('');
      setForgotSent(false);
      setAuthView('login');
      if (window.location.hash.includes('recovery')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch {
      showToast('Gagal menyimpan kata sandi baru.', 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Abaikan jika offline
      }
    }
    setCurrentUserId(null);
    setActiveRoute('home');
    setAuthView('login');
    showToast('Kamu telah keluar dari sesi akun.', 'info');
  };

  const handleCreateWorld = async (e) => {
    e.preventDefault();
    if (!currentUserId) return;
    if (currentCouple) {
      showToast('Kamu sudah terhubung ke sebuah dunia aktif.', 'error');
      return;
    }
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

    if (supabase) {
      try {
        const { data: couple, error: coupleErr } = await supabase
          .from('couples')
          .insert({
            name: trimmedName,
            created_by: currentUserId,
          })
          .select()
          .single();

        if (coupleErr) throw coupleErr;

        await supabase.from('couple_members').insert({
          couple_id: couple.id,
          user_id: currentUserId,
          role: 'owner',
        });

        await supabase.from('couple_invites').insert({
          couple_id: couple.id,
          token_hash: rawCode.trim().toUpperCase(),
          created_by: currentUserId,
          expires_at: expiresAt,
        });

        await supabase.from('garden_state').insert({
          couple_id: couple.id,
          points: 30,
        });

        await supabase.from('cycle_sharing_settings').upsert({
          user_id: currentUserId,
          couple_id: couple.id,
          share_cycle: false,
          share_mood: false,
          share_mood_note: false,
        });

        setGeneratedRawToken(rawCode);
        setNewWorldName('');
        showToast('Dunia baru dan kode undangan 24 jam berhasil dibuat di Supabase Cloud!', 'success');
        await loadSupabaseData(currentUserId);
        return;
      } catch (err) {
        console.error('Gagal buat dunia di Supabase:', err);
        showToast(err.message || 'Gagal membuat dunia di Supabase. Periksa izin/RLS.', 'error');
        return;
      }
    }

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
      tiles: Array.from({ length: 25 }, (_, i) => {
        if (i === 2) return { index: i, item: 'fireplace', stage: 2, last_watered_at: todayLocalISO(), planted_by: currentUserId };
        if (i === 12) return { index: i, item: 'rug', stage: 2, last_watered_at: todayLocalISO(), planted_by: currentUserId };
        if (i === 11) return { index: i, item: 'cat_mochi', stage: 2, last_watered_at: todayLocalISO(), planted_by: currentUserId };
        return { index: i, item: 'empty', stage: 1, last_watered_at: null, planted_by: null };
      }),
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
    setNewWorldName('');
    showToast('Dunia baru dan kode undangan 24 jam berhasil dibuat!', 'success');
  };

  const handleGenerateInviteForExistingCouple = async () => {
    if (!currentUserId || !currentCouple) return;

    // Jika ID couple bukan UUID (sisa offline dummy), bersihkan dan minta buat di Cloud
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentCouple.id);
    if (!isUuid && supabase) {
      setDb((prev) => ({
        ...prev,
        couples: prev.couples.filter((c) => c.id !== currentCouple.id),
        couple_members: prev.couple_members.filter((cm) => cm.couple_id !== currentCouple.id),
      }));
      showToast('Sesi dunia lokal lama dibersihkan. Silakan klik "Buat Dunia Baru" untuk membuat dunia di Cloud Supabase.', 'info');
      return;
    }

    const rawCode = `MRDL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
    const tokenHash = hashInviteToken(rawCode);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    if (supabase) {
      try {
        const { error } = await supabase.from('couple_invites').insert({
          couple_id: currentCouple.id,
          token_hash: rawCode.trim().toUpperCase(),
          created_by: currentUserId,
          expires_at: expiresAt,
        });
        if (error) throw error;
        setGeneratedRawToken(rawCode);
        showToast('Kode undangan baru berhasil dibuat (berlaku 24 jam).', 'success');
        await loadSupabaseData(currentUserId);
        return;
      } catch (err) {
        console.error('Gagal buat invite di Supabase:', err);
        showToast(err.message || 'Gagal membuat kode undangan di Supabase.', 'error');
        return;
      }
    }

    const newInvite = {
      id: `inv_${Date.now()}`,
      couple_id: currentCouple.id,
      token_hash: tokenHash,
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

  const handleJoinWithCode = async (e) => {
    e.preventDefault();
    if (!currentUserId) return;
    if (currentCouple) {
      showToast('Akunmu sudah berada di dalam dunia aktif.', 'error');
      return;
    }

    const cleanedCode = joinTokenInput.trim().toUpperCase();
    if (!cleanedCode) {
      showToast('Masukkan kode undangan terlebih dahulu.', 'error');
      return;
    }

    if (supabase) {
      try {
        const { data: coupleId, error } = await supabase.rpc('redeem_couple_invite', {
          raw_token: cleanedCode,
        });

        if (error) {
          showToast(error.message || 'Kode undangan tidak valid atau sudah kedaluwarsa.', 'error');
          return;
        }

        showToast('Selamat! Kamu berhasil terhubung ke dunia pasangan!', 'success');
        setJoinTokenInput('');
        await loadSupabaseData(currentUserId);
        return;
      } catch (err) {
        showToast('Gagal memproses kode undangan di Supabase.', 'error');
        return;
      }
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
    if (existingMembers.some((cm) => cm.user_id === currentUserId)) {
      showToast('Kamu sudah menjadi anggota dunia ini.', 'error');
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
    showToast(`Berhasil terhubung ke "${targetCouple.name}"! Selamat datang di dunia kecil kalian.`, 'success');
  };

  // ============================================================================
  // 10. HANDLER FITUR INTI (CYCLE, WISHLIST, MEMORIES, NOTES, SANCTUARY, AI QUIZ)
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

  const handleAddCycleLog = (e) => {
    e.preventDefault();
    if (!currentUserId || currentUser?.gender !== 'female') return;
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
          ? 'Wishlist selesai! +10 Poin Kasih ditambahkan ke dunia kalian.'
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
        ? 'Disimpan ke Memories! +15 Poin Kasih untuk momen bermakna kalian.'
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

  // --- Sanctuary & Pet Care Handlers ---
  const currentGarden = useMemo(() => {
    if (!currentCouple) return null;
    return db.garden_state.find((g) => g.couple_id === currentCouple.id) || null;
  }, [db.garden_state, currentCouple]);

  const handleUnlockGardenItem = (itemType, cost) => {
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
    showToast('Item Sanctuary berhasil diadopsi/dibuka dan siap ditempatkan!', 'success');
  };

  const handleGardenTileClick = (tileIndex) => {
    if (!currentUserId || !currentCouple || !currentGarden) return;
    const tile = currentGarden.tiles[tileIndex];
    if (!tile) return;

    setInspectedTileIndex(tileIndex);

    if (selectedBrush === 'care') {
      if (tile.item === 'empty') {
        showToast('Pilih Peliharaan atau Furnitur di katalog untuk ditempatkan di petak ini.', 'info');
        return;
      }
      if (tile.stage >= 4) {
        showToast('Peliharaan/furnitur ini sudah mencapai Level Maksimal (Lv.4 ❤️)!', 'info');
        return;
      }
      const careCost = 2;
      if (currentGarden.points < careCost) {
        showToast(`Butuh ${careCost} Poin Kasih (✨) untuk merawat/meng-upgrade ke level berikutnya.`, 'error');
        return;
      }

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
      showToast('Dirawat dengan penuh kasih! Naik 1 Level (-2 ✨) ❤️', 'success');
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
      return;
    }

    if (!currentGarden.unlocked_items.includes(selectedBrush)) {
      showToast('Adopsi atau buka item ini terlebih dahulu menggunakan Poin Kasih.', 'error');
      return;
    }

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
                      stage: 1,
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

  const handleTreatAllPets = () => {
    if (!currentCouple || !currentGarden) return;
    const cost = 5;
    if (currentGarden.points < cost) {
      showToast(`Butuh ${cost} Poin Kasih (✨) untuk mengadakan Pesta Camilan bagi seluruh peliharaan!`, 'error');
      return;
    }
    let upgradedCount = 0;
    setDb((prev) => ({
      ...prev,
      garden_state: prev.garden_state.map((g) => {
        if (g.couple_id !== currentCouple.id) return g;
        return {
          ...g,
          points: g.points - cost,
          tiles: g.tiles.map((t) => {
            if (t.item !== 'empty' && t.stage < 4) {
              upgradedCount++;
              return { ...t, stage: Math.min(4, t.stage + 1), last_watered_at: todayLocalISO() };
            }
            return t;
          }),
          updated_at: new Date().toISOString(),
        };
      }),
    }));
    setGardenAmbiance('sunset');
    showToast(
      upgradedCount > 0
        ? `Pesta Camilan dimulai! ${upgradedCount} peliharaan & sudut ruangan naik level (-5 ✨) 🍖`
        : 'Semua peliharaan dan furnitur sudah mencapai level maksimal!',
      'success'
    );
  };

  // --- AI Quiz Generator ---
  const allQuizQuestions = useMemo(() => {
    const customForCouple = (db.custom_quiz_questions || []).filter(
      (q) => !q.couple_id || q.couple_id === currentCouple?.id
    );
    return [...customForCouple, ...DEFAULT_QUIZ_QUESTIONS];
  }, [db.custom_quiz_questions, currentCouple]);

  const handleGenerateAiQuestionsFromMemories = async () => {
    if (!currentCouple || !currentUser) return;
    const sharedMems = authorizedMemories.filter((m) => m.visibility === 'shared');
    if (sharedMems.length === 0) {
      showToast('Tambahkan minimal 1 Memory bersama (Shared) terlebih dahulu agar AI punya bahan cerita.', 'error');
      return;
    }

    setIsGeneratingAiQuiz(true);
    const memoriesContext = sharedMems
      .map((m, idx) => `${idx + 1}. Judul: "${m.title}" (${m.memory_date}) - Cerita: "${m.caption || '-'}"`)
      .join('\n');

    const partnerName = partnerProfile ? partnerProfile.display_name : 'pasanganmu';
    const systemPrompt =
      'Kamu adalah asisten pembuat kuis pasangan romantis untuk aplikasi Meradel. Buat 3 pertanyaan refleksi/kuis pasangan yang hangat, santai, dan personal dalam Bahasa Indonesia berdasarkan daftar kenangan (Memories) pasangan yang diberikan.';
    const userQuery = `Pasangan ini adalah ${currentUser.display_name} dan ${partnerName}. Berikut daftar kenangan bersama mereka:\n${memoriesContext}\n\nBuatlah 3 pertanyaan Couple Quiz yang secara spesifik menyebut atau menggali perasaan dari momen-momen di atas.`;

    const apiKey =
      (typeof window !== 'undefined' && window.VITE_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY) ||
      '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              category: { type: 'STRING' },
              text: { type: 'STRING' },
              memoryReference: { type: 'STRING' },
            },
            propertyOrdering: ['category', 'text', 'memoryReference'],
          },
        },
      },
    };

    const fetchWithRetry = async (retries = 2, delay = 1000) => {
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('API request failed');
        return await res.json();
      } catch (err) {
        if (retries <= 0) throw err;
        await new Promise((r) => setTimeout(r, delay));
        return fetchWithRetry(retries - 1, delay * 2);
      }
    };

    try {
      const result = await fetchWithRetry();
      const rawJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const generatedItems = parsed.map((item, idx) => ({
            id: `q_ai_${Date.now()}_${idx}`,
            couple_id: currentCouple.id,
            category: '✨ AI dari Kenangan',
            text: item.text,
            memoryReference: item.memoryReference || sharedMems[0].title,
            isAi: true,
          }));

          setDb((prev) => ({
            ...prev,
            custom_quiz_questions: [...generatedItems, ...(prev.custom_quiz_questions || [])],
          }));
          setQuizCategoryFilter('✨ AI dari Kenangan');
          showToast('3 Pertanyaan AI berhasil dirangkai dari kenangan kalian!', 'success');
          setIsGeneratingAiQuiz(false);
          return;
        }
      }
      throw new Error('Fallback ke sintesis lokal');
    } catch {
      const fallbackQuestions = sharedMems.slice(0, 3).map((mem, idx) => ({
        id: `q_ai_local_${Date.now()}_${idx}`,
        couple_id: currentCouple.id,
        category: '✨ AI dari Kenangan',
        text: `Saat mengingat kembali momen "${mem.title}" (${formatDateID(mem.memory_date)}), hal kecil apa dari pasanganmu waktu itu yang paling membuatmu tersenyum?`,
        memoryReference: mem.title,
        isAi: true,
      }));

      setDb((prev) => ({
        ...prev,
        custom_quiz_questions: [...fallbackQuestions, ...(prev.custom_quiz_questions || [])],
      }));
      setQuizCategoryFilter('✨ AI dari Kenangan');
      showToast('Pertanyaan personal berhasil dibuat dari daftar kenangan kalian!', 'success');
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
      gotReward ? 'Jawaban tersimpan! +5 Poin Kasih untukmu.' : 'Jawaban berhasil diperbarui.',
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
          ? { ...p, display_name: editProfileName.trim() || p.display_name, updated_at: new Date().toISOString() }
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
    setConfirmDialog({
      title: 'Putuskan Hubungan Dunia (Unpair)?',
      message:
        'Dunia pasangan ini akan dinonaktifkan. Catatan siklus dan mood pribadimu tetap aman di akunmu, namun kamu memerlukan kode undangan baru untuk terhubung kembali.',
      onConfirm: () => {
        const nowIso = new Date().toISOString();
        setDb((prev) => ({
          ...prev,
          couples: prev.couples.map((c) =>
            c.id === currentCouple.id ? { ...c, unpaired_at: nowIso } : c
          ),
        }));
        setConfirmDialog(null);
        showToast('Dunia pasangan telah dinonaktifkan (Unpaired).', 'info');
      },
    });
  };

  // ============================================================================
  // 11. RENDER TOAST & CONFIRM DIALOG
  // ============================================================================

  const renderToast = () =>
    toast ? (
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
    ) : null;

  const renderConfirmDialog = () =>
    confirmDialog ? (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <PixelCard className="w-full max-w-sm">
          <h3 className="font-bold text-base text-[#2C1E14] mb-2">{confirmDialog.title}</h3>
          <p className="text-xs text-[#6E5039] mb-4 leading-relaxed">{confirmDialog.message}</p>
          <div className="flex justify-end gap-2">
            <PixelButton variant="secondary" onClick={() => setConfirmDialog(null)}>
              Batal
            </PixelButton>
            <PixelButton variant="danger" onClick={confirmDialog.onConfirm}>
              Ya, Lanjutkan
            </PixelButton>
          </div>
        </PixelCard>
      </div>
    ) : null;

  // ============================================================================
  // 12. HALAMAN PUBLIK: LOGIN, DAFTAR AKUN & RESET PASSWORD (TANPA SIMULATOR)
  // ============================================================================

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F6EDD9] text-[#2C1E14] flex flex-col justify-between p-4">
        {renderToast()}
        <div className="flex-1 flex items-center justify-center py-8">
          <PixelCard className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center gap-2 mb-2">
                <PixelAvatar avatarKey="mage_rose" size={48} />
                <Heart className="w-6 h-6 text-[#D98A9C] fill-[#D98A9C]" />
                <PixelAvatar avatarKey="knight_sage" size={48} />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#2C1E14]">MERADEL</h1>
              <p className="text-xs text-[#6E5039] mt-1">
                Our Little Pixel World — Ruang digital privat bergaya pixel art 16-bit untuk dua hati.
              </p>
            </div>

            {/* Header Tab Navigasi Autentikasi */}
            {authView === 'login' || authView === 'register' ? (
              <div className="flex border-b-2 border-[#4A3525] mb-5">
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    authView === 'login' ? 'bg-[#6B8E78] text-[#FDF8EE]' : 'bg-[#EFE2C6] text-[#4A3525]'
                  }`}
                >
                  Masuk Akun
                </button>
                <button
                  type="button"
                  onClick={() => setAuthView('register')}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    authView === 'register' ? 'bg-[#6B8E78] text-[#FDF8EE]' : 'bg-[#EFE2C6] text-[#4A3525]'
                  }`}
                >
                  Daftar Baru
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between border-b-2 border-[#4A3525] pb-3 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthView('login');
                    setForgotSent(false);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-[#4A3525] hover:text-[#6B8E78] transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Kembali ke Masuk
                </button>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C4F5E] flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  {authView === 'reset_password' ? 'Sandi Baru' : 'Pemulihan Akun'}
                </span>
              </div>
            )}

            {authView === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3525] mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3 py-2.5 bg-white border-2 border-[#4A3525] text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3525]">
                      Kata Sandi
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthView('forgot')}
                      className="text-[11px] font-bold text-[#6E5039] underline"
                    >
                      Lupa kata sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full px-3 py-2.5 pr-10 bg-white border-2 border-[#4A3525] text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2.5 top-2.5 text-[#6E5039]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <PixelButton type="submit" variant="primary" disabled={isSubmittingAuth} className="w-full">
                  {isSubmittingAuth ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Masuk ke Cloud...</span>
                    </>
                  ) : (
                    'Masuk ke Meradel'
                  )}
                </PixelButton>

                <p className="text-center text-xs text-[#6E5039] pt-1">
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('register')}
                    className="font-bold text-[#2C1E14] underline"
                  >
                    Daftar akun baru di sini
                  </button>
                </p>
              </form>
            )}

            {authView === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3525] mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Adel / Merdi"
                    className="w-full px-3 py-2 bg-white border-2 border-[#4A3525] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3525] mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3 py-2 bg-white border-2 border-[#4A3525] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3525] mb-1">
                    Kata Sandi (Min. 6 Karakter)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3 py-2 bg-white border-2 border-[#4A3525] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3525] mb-1">
                    Peran / Gender (Menyesuaikan Fitur Tracker Siklus)
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setRegGender('female')}
                      className={`py-2 px-3 border-2 font-bold ${
                        regGender === 'female'
                          ? 'bg-[#F5DCE2] border-[#2C1E14] text-[#592A35]'
                          : 'bg-white border-[#8C684C]/50'
                      }`}
                    >
                      👩 Perempuan
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegGender('male')}
                      className={`py-2 px-3 border-2 font-bold ${
                        regGender === 'male'
                          ? 'bg-[#D8E6DC] border-[#2C1E14] text-[#2C4235]'
                          : 'bg-white border-[#8C684C]/50'
                      }`}
                    >
                      🧑 Laki-laki
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3525] mb-1.5">
                    Pilih Karakter Pixel
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['mage_rose', 'knight_sage', 'farmer_straw', 'cat_cozy'].map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setRegAvatar(av)}
                        className={`p-2 border-2 flex flex-col items-center ${
                          regAvatar === av
                            ? 'border-[#2C1E14] bg-[#D8E6DC] shadow-[2px_2px_0px_0px_#2C1E14]'
                            : 'border-[#8C684C]/40 bg-white'
                        }`}
                      >
                        <PixelAvatar avatarKey={av} size={36} />
                      </button>
                    ))}
                  </div>
                </div>
                <PixelButton type="submit" variant="pink" disabled={isSubmittingAuth} className="w-full">
                  {isSubmittingAuth ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mendaftarkan Akun ke Cloud...</span>
                    </>
                  ) : (
                    'Buat Akun Meradel Sekarang'
                  )}
                </PixelButton>
              </form>
            )}

            {/* Form Permintaan Reset Kata Sandi (Kirim Tautan ke Email) */}
            {authView === 'forgot' && (
              !forgotSent ? (
                <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                  <div className="p-3 bg-[#FDF8EE] border-2 border-[#4A3525] text-xs text-[#4A3525] space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-[#8C4F5E]">
                      <Mail className="w-4 h-4" />
                      Lupa Kata Sandi Akunmu?
                    </p>
                    <p className="text-[#6E5039] leading-relaxed">
                      Masukkan alamat email terdaftarmu. Kami akan mengirimkan <strong>tautan pemulihan aman</strong> ke email kamu untuk memverifikasi kepemilikan akun sebelum kata sandi dapat diubah.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3525] mb-1">
                      Email Terdaftar
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-3 py-2.5 bg-white border-2 border-[#4A3525] text-sm focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <PixelButton
                      type="button"
                      variant="secondary"
                      onClick={() => setAuthView('login')}
                      className="flex-1"
                    >
                      Batal
                    </PixelButton>
                    <PixelButton
                      type="submit"
                      variant="primary"
                      disabled={isSendingResetEmail}
                      className="flex-1"
                    >
                      {isSendingResetEmail ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Kirim Tautan Reset</span>
                        </>
                      )}
                    </PixelButton>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-[#D8E6DC] border-2 border-[#4E6E5B] text-xs text-[#2C4235] space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#2C4235]">
                      <CheckCircle2 className="w-5 h-5 text-[#4E6E5B] shrink-0" />
                      <span>Email Pemulihan Terkirim! 💌</span>
                    </div>
                    <p className="leading-relaxed">
                      Tautan untuk mereset kata sandi telah dikirimkan ke alamat email:
                    </p>
                    <p className="font-mono font-bold bg-[#FDF8EE] p-2 border border-[#4E6E5B] text-center select-all break-all">
                      {forgotEmail}
                    </p>
                    <p className="text-[11px] text-[#2C4235]/80 leading-relaxed">
                      Silakan periksa kotak masuk (Inbox) atau folder <strong>Spam/Promotions</strong> pada emailmu, lalu klik tautan tersebut untuk membuat kata sandi baru.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <PixelButton
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setAuthView('login');
                        setForgotSent(false);
                      }}
                      className="w-full"
                    >
                      Kembali ke Halaman Masuk
                    </PixelButton>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleRequestPasswordReset}
                        disabled={isSendingResetEmail}
                        className="text-xs text-[#6E5039] underline font-semibold hover:text-[#2C1E14]"
                      >
                        {isSendingResetEmail ? 'Sedang mengirim ulang...' : 'Belum menerima email? Kirim ulang'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Form Pembuatan Kata Sandi Baru (Hanya Muncul dari Tautan Email yang Sah) */}
            {authView === 'reset_password' && (
              <form onSubmit={handleConfirmNewPassword} className="space-y-4">
                <div className="p-3 bg-[#E6EFE9] border-2 border-[#4E6E5B] text-xs text-[#2C4235] space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-[#2C4235]">
                    <ShieldCheck className="w-4 h-4 text-[#4E6E5B]" />
                    Verifikasi Berhasil! Buat Kata Sandi Baru
                  </p>
                  <p className="text-[11px] text-[#2C4235]/90 leading-relaxed">
                    Tautan pemulihan akun berhasil diverifikasi. Silakan masukkan kata sandi baru yang ingin kamu gunakan.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3525] mb-1">
                    Kata Sandi Baru (Min. 6 Karakter)
                  </label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter..."
                      className="w-full px-3 py-2.5 pr-10 bg-white border-2 border-[#4A3525] text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword((s) => !s)}
                      className="absolute right-2.5 top-2.5 text-[#6E5039]"
                    >
                      {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3525] mb-1">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi baru..."
                      className="w-full px-3 py-2.5 pr-10 bg-white border-2 border-[#4A3525] text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-2.5 top-2.5 text-[#6E5039]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <PixelButton
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setAuthView('login');
                      setForgotSent(false);
                    }}
                    className="flex-1"
                  >
                    Batal
                  </PixelButton>
                  <PixelButton
                    type="submit"
                    variant="primary"
                    disabled={isUpdatingPassword}
                    className="flex-1"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Simpan Sandi Baru</span>
                      </>
                    )}
                  </PixelButton>
                </div>
              </form>
            )}
          </PixelCard>
        </div>

        <footer className="text-center text-[11px] text-[#6E5039] py-2">
          Meradel — Ruang Privat Dua Akun • Privasi & Keamanan Terlindungi
        </footer>
      </div>
    );
  }

  // ============================================================================
  // 13. HALAMAN PAIRING DUNIA PASANGAN (/pairing)
  // ============================================================================

  if (!currentCouple) {
    return (
      <div className="min-h-screen bg-[#F6EDD9] text-[#2C1E14] flex flex-col">
        {renderToast()}
        <div className="flex-1 max-w-2xl w-full mx-auto p-4 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PixelAvatar avatarKey={currentUser.avatar_key} size={48} />
              <div>
                <h1 className="text-xl font-bold">Halo, {currentUser.display_name}!</h1>
                <p className="text-xs text-[#6E5039]">
                  Akunmu belum terhubung ke dunia pasangan mana pun.
                </p>
              </div>
            </div>
            <PixelButton variant="secondary" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Keluar Akun
            </PixelButton>
          </div>

          <PixelCard variant="warm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#4E6E5B] shrink-0 mt-0.5" />
              <div className="text-xs text-[#4A3525] space-y-1">
                <p className="font-bold text-sm">Ruang Privat Dua Akun</p>
                <p>
                  Di Meradel, setiap dunia pasangan hanya dapat dihuni oleh tepat 2 akun. Buat dunia baru lalu bagikan
                  kode undangan 24 jam kepada pasanganmu, atau masukkan kode yang sudah dikirim pasanganmu.
                </p>
              </div>
            </div>
          </PixelCard>

          <div className="grid md:grid-cols-2 gap-6">
            <PixelCard>
              <h2 className="text-base font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B86B7D]" />
                Opsi 1: Buat Dunia Baru
              </h2>
              <p className="text-xs text-[#6E5039] mb-4">
                Buat ruang baru untuk kalian berdua, lalu bagikan kode undangan acak 24 jam kepada pasanganmu.
              </p>
              <form onSubmit={handleCreateWorld} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Nama Dunia Kalian</label>
                  <input
                    type="text"
                    required
                    value={newWorldName}
                    onChange={(e) => setNewWorldName(e.target.value)}
                    placeholder="Contoh: Rumah Pohon Kita"
                    className="w-full px-3 py-2 bg-white border-2 border-[#4A3525] text-sm"
                  />
                </div>
                <PixelButton type="submit" variant="primary" className="w-full">
                  <Plus className="w-4 h-4" /> Buat Dunia & Kode Undangan
                </PixelButton>
              </form>
            </PixelCard>

            <PixelCard>
              <h2 className="text-base font-bold mb-2 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#4E6E5B]" />
                Opsi 2: Masukkan Kode Pasangan
              </h2>
              <p className="text-xs text-[#6E5039] mb-4">
                Sudah menerima kode undangan dari pasanganmu? Masukkan kodenya di bawah ini.
              </p>
              <form onSubmit={handleJoinWithCode} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Kode Undangan</label>
                  <input
                    type="text"
                    required
                    value={joinTokenInput}
                    onChange={(e) => setJoinTokenInput(e.target.value.toUpperCase())}
                    placeholder="MRDL-XXXX-XXXX"
                    className="w-full px-3 py-2 bg-white border-2 border-[#4A3525] text-sm font-mono uppercase"
                  />
                </div>
                <PixelButton type="submit" variant="pink" className="w-full">
                  <ArrowRight className="w-4 h-4" /> Validasi & Gabung Dunia
                </PixelButton>
              </form>
            </PixelCard>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 14. RENDER MODUL-MODUL UTAMA DALAM APLIKASI
  // ============================================================================

  const renderHomeDashboard = () => {
    const unreadOrReadyNotes = authorizedLoveNotes.inbox.filter(
      (n) => !n.isLocked && !n.opened_at
    ).length;
    const latestPartnerMood = partnerSharedMoodEntries[0] || null;
    const daysToAnniversary = currentCouple.anniversary_date
      ? diffDaysLocalISO(todayLocalISO(), currentCouple.anniversary_date)
      : null;

    return (
      <div className="space-y-6">
        <PixelCard variant="warm" className="relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                <PixelAvatar
                  avatarKey={currentUser.avatar_key}
                  size={52}
                  className="border-2 border-[#2C1E14]"
                />
                {partnerProfile ? (
                  <PixelAvatar
                    avatarKey={partnerProfile.avatar_key}
                    size={52}
                    className="border-2 border-[#2C1E14]"
                  />
                ) : (
                  <div className="w-[52px] h-[52px] bg-[#EFE2C6] border-2 border-dashed border-[#4A3525] flex items-center justify-center text-xs font-bold">
                    ?
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#6B8E78] text-[#FDF8EE]">
                    MERADEL WORLD
                  </span>
                  <span className="text-xs text-[#6E5039] font-medium">
                    • Poin Kasih: <strong>{currentGarden?.points ?? 0} ✨</strong>
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#2C1E14] mt-0.5">
                  {currentCouple.name}
                </h1>
                <p className="text-xs text-[#6E5039]">
                  {partnerProfile
                    ? `${currentUser.display_name} & ${partnerProfile.display_name} — Selamat datang di dunia kecil kalian.`
                    : 'Menunggu pasangan bergabung ke dunia ini.'}
                </p>
              </div>
            </div>

            {daysToAnniversary !== null && (
              <div className="bg-[#FDF8EE] border-2 border-[#4A3525] px-3.5 py-2 text-center shrink-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8C684C]">
                  Hari Spesial Berikutnya
                </span>
                <span className="text-lg font-extrabold text-[#B86B7D]">
                  {daysToAnniversary === 0
                    ? 'Hari Ini! 🎉'
                    : daysToAnniversary > 0
                    ? `${daysToAnniversary} Hari Lagi`
                    : `${Math.abs(daysToAnniversary)} Hari Lalu`}
                </span>
                <span className="block text-[11px] text-[#6E5039]">
                  {formatDateID(currentCouple.anniversary_date)}
                </span>
              </div>
            )}
          </div>

          {!partnerProfile && (
            <div className="mt-4 pt-4 border-t-2 border-dashed border-[#8C684C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs">
                <p className="font-bold text-[#2C1E14]">Pasanganmu belum terhubung ke dunia ini</p>
                <p className="text-[#6E5039]">
                  Buat kode undangan sekali pakai (berlaku 24 jam) dan kirimkan ke pasanganmu agar ia bisa bergabung.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {generatedRawToken ? (
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-white border-2 border-[#2C1E14] font-mono font-bold text-sm">
                      {generatedRawToken}
                    </div>
                    <PixelButton
                      variant="secondary"
                      onClick={() => {
                        navigator.clipboard?.writeText(generatedRawToken);
                        showToast('Kode undangan disalin ke clipboard!', 'info');
                      }}
                    >
                      <Copy className="w-4 h-4" /> Salin
                    </PixelButton>
                  </div>
                ) : (
                  <PixelButton variant="primary" onClick={handleGenerateInviteForExistingCouple}>
                    Buat Kode Undangan
                  </PixelButton>
                )}
              </div>
            </div>
          )}
        </PixelCard>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveRoute('wishlist')}
            className="p-3.5 bg-[#FDF8EE] border-2 border-[#4A3525] shadow-[3px_3px_0px_0px_#4A3525] text-left hover:bg-[#EFE2C6]/60 transition"
          >
            <div className="flex items-center justify-between mb-1">
              <Sparkles className="w-5 h-5 text-[#B86B7D]" />
              <span className="text-xs font-bold px-1.5 py-0.5 bg-[#F5DCE2] text-[#592A35]">
                {authorizedWishlist.filter((w) => w.status !== 'archived').length} item
              </span>
            </div>
            <p className="font-bold text-sm text-[#2C1E14]">Shared Wishlist</p>
            <p className="text-[11px] text-[#6E5039]">Rencana & impian berdua</p>
          </button>

          <button
            onClick={() => setActiveRoute('love-notes')}
            className="p-3.5 bg-[#FDF8EE] border-2 border-[#4A3525] shadow-[3px_3px_0px_0px_#4A3525] text-left hover:bg-[#EFE2C6]/60 transition"
          >
            <div className="flex items-center justify-between mb-1">
              <Mail className="w-5 h-5 text-[#4E6E5B]" />
              {unreadOrReadyNotes > 0 ? (
                <span className="text-xs font-bold px-1.5 py-0.5 bg-[#D98A9C] text-white">
                  {unreadOrReadyNotes} surat baru
                </span>
              ) : (
                <span className="text-xs font-bold px-1.5 py-0.5 bg-[#D8E6DC] text-[#2C4235]">
                  {authorizedLoveNotes.inbox.length} kotak masuk
                </span>
              )}
            </div>
            <p className="font-bold text-sm text-[#2C1E14]">Love Notes</p>
            <p className="text-[11px] text-[#6E5039]">Surat & kapsul waktu</p>
          </button>

          <button
            onClick={() => setActiveRoute('garden')}
            className="p-3.5 bg-[#FDF8EE] border-2 border-[#4A3525] shadow-[3px_3px_0px_0px_#4A3525] text-left hover:bg-[#EFE2C6]/60 transition"
          >
            <div className="flex items-center justify-between mb-1">
              <PawPrint className="w-5 h-5 text-[#4E6E5B]" />
              <span className="text-xs font-bold px-1.5 py-0.5 bg-[#D8E6DC] text-[#2C4235]">
                {currentGarden?.points ?? 0} Poin
              </span>
            </div>
            <p className="font-bold text-sm text-[#2C1E14]">Cozy Sanctuary</p>
            <p className="text-[11px] text-[#6E5039]">Rumah Pohon & Anabul</p>
          </button>

          <button
            onClick={() => setActiveRoute('games')}
            className="p-3.5 bg-[#FDF8EE] border-2 border-[#4A3525] shadow-[3px_3px_0px_0px_#4A3525] text-left hover:bg-[#EFE2C6]/60 transition"
          >
            <div className="flex items-center justify-between mb-1">
              <Gamepad2 className="w-5 h-5 text-[#6E5039]" />
              <span className="text-xs font-bold px-1.5 py-0.5 bg-[#EFE2C6] text-[#4A3525]">
                AI Quiz
              </span>
            </div>
            <p className="font-bold text-sm text-[#2C1E14]">Couple Quiz</p>
            <p className="text-[11px] text-[#6E5039]">Kuis dari kenangan kalian</p>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <PixelCard variant="sage">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-base flex items-center gap-2 text-[#2C4235]">
                <Heart className="w-4 h-4 text-[#B86B7D] fill-[#B86B7D]" />
                Check-In Kondisi Hari Ini
              </h2>
              <button
                onClick={() => setActiveRoute('cycle')}
                className="text-xs font-bold underline text-[#2C4235]"
              >
                Buka Tracker →
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#FDF8EE] border-2 border-[#4A3525]">
                <p className="text-xs font-bold uppercase text-[#6E5039] mb-1">
                  Kondisi {partnerProfile ? partnerProfile.display_name : 'Pasangan'}
                </p>
                {!partnerProfile ? (
                  <p className="text-xs text-[#6E5039]">Belum ada pasangan terhubung.</p>
                ) : !partnerCycleConsent?.share_mood && !partnerCycleConsent?.share_cycle ? (
                  <p className="text-xs text-[#6E5039] italic flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    {partnerProfile.display_name} memilih menyimpan catatan kondisi secara pribadi saat ini.
                  </p>
                ) : (
                  <div className="space-y-2 text-xs">
                    {partnerCycleConsent.share_mood && latestPartnerMood ? (
                      <div>
                        <p className="font-semibold text-[#2C1E14]">
                          Hari ini ({formatDateID(latestPartnerMood.entry_date)}) merasa:{' '}
                          <span className="px-2 py-0.5 bg-[#D8E6DC] border border-[#4E6E5B]">
                            {MOOD_OPTIONS.find((m) => m.value === latestPartnerMood.mood)?.emoji}{' '}
                            {MOOD_OPTIONS.find((m) => m.value === latestPartnerMood.mood)?.label}
                          </span>{' '}
                          • Energi {latestPartnerMood.energy ?? '-'}/5
                        </p>
                        {latestPartnerMood.symptoms.length > 0 && (
                          <p className="text-[#6E5039] mt-1">
                            Kondisi fisik: {latestPartnerMood.symptoms.join(', ')}
                          </p>
                        )}
                        {latestPartnerMood.note ? (
                          <p className="mt-1 p-2 bg-[#EFE2C6]/60 border-l-2 border-[#6E5039] italic">
                            "{latestPartnerMood.note}"
                          </p>
                        ) : (
                          <p className="text-[11px] text-[#8C684C] mt-1">
                            (Catatan jurnal bebas disimpan pribadi oleh pemilik)
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[#6E5039]">Belum ada check-in mood yang dibagikan.</p>
                    )}

                    {partnerProfile.gender === 'female' && partnerCycleConsent.share_cycle && (
                      <div className="pt-2 border-t border-[#EFE2C6]">
                        <p className="font-bold text-[#4A3525]">Ringkasan Siklus {partnerProfile.display_name}:</p>
                        {partnerCyclePrediction.hasEnoughData ? (
                          <p className="text-[#6E5039]">
                            Perkiraan siklus berikutnya sekitar{' '}
                            <strong>{formatDateID(partnerCyclePrediction.nextEstimatedStart)}</strong>{' '}
                            (estimasi median {partnerCyclePrediction.medianInterval} hari).
                          </p>
                        ) : (
                          <p className="text-[#6E5039]">{partnerCyclePrediction.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-[#FDF8EE]/80 border border-[#4E6E5B] flex items-center justify-between text-xs">
                <span>
                  Izin berbagimu:{' '}
                  {currentUser.gender === 'female' && (
                    <>
                      Siklus <strong>{myCycleConsent?.share_cycle ? 'Dibagikan' : 'Privat'}</strong> •{' '}
                    </>
                  )}
                  Mood <strong>{myCycleConsent?.share_mood ? 'Dibagikan' : 'Privat'}</strong>
                </span>
                <button
                  onClick={() => setActiveRoute('cycle')}
                  className="font-bold text-[#4E6E5B] underline"
                >
                  Ubah Izin
                </button>
              </div>
            </div>
          </PixelCard>

          <PixelCard>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-bold text-base flex items-center gap-2">
                  <PawPrint className="w-4 h-4 text-[#8C684C]" />
                  Rumah Pohon & Anabul Pixel
                </h2>
                <p className="text-xs text-[#6E5039]">Rawat peliharaan & dekorasi ruangan dengan Poin Kasih.</p>
              </div>
              <PixelButton variant="secondary" onClick={() => setActiveRoute('garden')}>
                Masuk Ruangan
              </PixelButton>
            </div>

            {currentGarden && (
              <div
                onClick={() => setActiveRoute('garden')}
                className="cursor-pointer border-2 border-[#4A3525] bg-[#E8D3B9] p-3 shadow-[2px_2px_0px_0px_#2C1E14]"
              >
                <div className="grid grid-cols-5 gap-1.5 max-w-[260px] mx-auto">
                  {currentGarden.tiles.map((tile) => (
                    <div
                      key={tile.index}
                      className="aspect-square bg-[#F5E6D3] border border-[#C2A382] flex items-center justify-center hover:bg-[#FDF8EE]"
                    >
                      <SanctuarySprite item={tile.item} stage={tile.stage} size={32} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </PixelCard>
        </div>

        <PixelCard>
          <h2 className="font-bold text-base mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8C684C]" />
            Jejak Dunia Bersama Terbaru
          </h2>
          {authorizedMemories.filter((m) => m.visibility === 'shared').length === 0 &&
          authorizedWishlist.length === 0 ? (
            <p className="text-xs text-[#6E5039] italic">
              Belum ada aktivitas bersama. Yuk mulai tambahkan Wishlist atau simpan Memory pertama kalian!
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {authorizedMemories
                .filter((m) => m.visibility === 'shared')
                .slice(0, 2)
                .map((mem) => (
                  <div
                    key={mem.id}
                    onClick={() => setActiveRoute('memories')}
                    className="p-3 bg-[#F6EDD9] border-2 border-[#4A3525] cursor-pointer hover:bg-[#EFE2C6]"
                  >
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-[#6B8E78] text-white">
                      Memory • {formatDateID(mem.memory_date)}
                    </span>
                    <p className="font-bold text-sm mt-1.5">{mem.title}</p>
                    {mem.caption && (
                      <p className="text-xs text-[#6E5039] line-clamp-2 mt-0.5">{mem.caption}</p>
                    )}
                  </div>
                ))}
              {authorizedWishlist.slice(0, 2).map((wish) => (
                <div
                  key={wish.id}
                  onClick={() => setActiveRoute('wishlist')}
                  className="p-3 bg-[#F6EDD9] border-2 border-[#4A3525] cursor-pointer hover:bg-[#EFE2C6]"
                >
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-[#D98A9C] text-[#2C1E14]">
                    Wishlist • {wish.status.toUpperCase()}
                  </span>
                  <p className="font-bold text-sm mt-1.5">{wish.title}</p>
                  {wish.description && (
                    <p className="text-xs text-[#6E5039] line-clamp-2 mt-0.5">{wish.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </PixelCard>
      </div>
    );
  };

  const renderCycleAndMoodPage = () => {
    const isFemaleUser = currentUser.gender === 'female';
    const symptomList = isFemaleUser ? FEMALE_SYMPTOM_OPTIONS : MALE_SYMPTOM_OPTIONS;

    const baseDate = new Date();
    baseDate.setDate(1);
    baseDate.setMonth(baseDate.getMonth() + calMonthOffset);
    const calYear = baseDate.getFullYear();
    const calMonth = baseDate.getMonth();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const monthLabel = baseDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const activeCycleLogs = isFemaleUser ? myCycleLogs : partnerCycleLogs;
    const activeCyclePrediction = isFemaleUser ? myCyclePrediction : partnerCyclePrediction;

    const isRecordedPeriodDay = (dateIso) => {
      return activeCycleLogs.some((log) => {
        const end = log.end_date || addDaysLocalISO(log.start_date, 4);
        return dateIso >= log.start_date && dateIso <= end;
      });
    };

    const isEstimatedPeriodDay = (dateIso) => {
      if (!activeCyclePrediction.hasEnoughData || !activeCyclePrediction.nextEstimatedStart) return false;
      const start = activeCyclePrediction.nextEstimatedStart;
      const end = activeCyclePrediction.nextEstimatedEnd || addDaysLocalISO(start, 4);
      return dateIso >= start && dateIso <= end;
    };

    const getMoodForDay = (dateIso) => {
      return myMoodEntries.find((m) => m.entry_date === dateIso);
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#B86B7D]" />
            {isFemaleUser ? 'Period & Mood Tracker' : 'Mood Check-In & Pendamping Siklus Pasangan'}
          </h1>
          <p className="text-xs text-[#6E5039]">
            {isFemaleUser
              ? 'Catat siklus menstruasi dan kondisi harian secara sukarela. Semua data dimulai sebagai privat.'
              : `Catat mood harianmu dan lihat informasi siklus yang dibagikan oleh ${partnerProfile?.display_name || 'pasanganmu'}.`}
          </p>
        </div>

        <PixelCard variant="pink" className="py-3">
          <div className="flex items-start gap-2.5 text-xs text-[#592A35]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Catatan Penting:</span> Meradel bukan aplikasi medis, alat diagnosis,
              atau kontrasepsi. Perkiraan siklus dihitung dari median interval historis dan selalu memiliki
              ketidakpastian.
            </div>
          </div>
        </PixelCard>

        <PixelCard variant="sage">
          <h2 className="font-bold text-sm mb-2 flex items-center gap-2 text-[#2C4235]">
            <ShieldCheck className="w-4 h-4" />
            Pengaturan Privasi & Izin Berbagi Milikmu ({currentUser.display_name})
          </h2>
          <div className={`grid ${isFemaleUser ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
            {isFemaleUser && (
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
                <span className="font-bold block">Bagikan Mood & Kondisi Fisik</span>
                <span className="text-[#6E5039]">
                  Pasangan melihat ikon mood, skor energi, dan gejala terstruktur.
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
          <div className="lg:col-span-7 space-y-6">
            <PixelCard>
              <div className="flex items-center justify-between mb-4">
                <PixelButton variant="secondary" onClick={() => setCalMonthOffset((o) => o - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </PixelButton>
                <div className="text-center">
                  <h2 className="font-bold text-base capitalize">{monthLabel}</h2>
                  <p className="text-[11px] text-[#6E5039]">
                    {isFemaleUser
                      ? 'Kalender Siklus & Mood Milikmu'
                      : partnerCycleConsent?.share_cycle
                      ? `Kalender Siklus ${partnerProfile?.display_name || 'Pasangan'} & Mood Milikmu`
                      : 'Kalender Mood Harian Milikmu'}
                  </p>
                </div>
                <PixelButton variant="secondary" onClick={() => setCalMonthOffset((o) => o + 1)}>
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
                        if (isFemaleUser) setCycleStartInput(dateIso);
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
                        {recorded && <span className="text-[10px] leading-none">🩸</span>}
                        {estimated && <span className="text-[10px] leading-none">◌</span>}
                      </div>
                      <div className="flex items-center justify-end w-full">
                        {moodMeta && <span className="text-xs leading-none">{moodMeta.emoji}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </PixelCard>

            {isFemaleUser ? (
              <>
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

                <PixelCard>
                  <h3 className="font-bold text-sm mb-3">Riwayat Catatan Siklus ({myCycleLogs.length})</h3>
                  {myCycleLogs.length === 0 ? (
                    <p className="text-xs text-[#6E5039] italic">Belum ada riwayat siklus tercatat.</p>
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
                                <span className="text-[#6E5039]"> • Selesai: {formatDateID(log.end_date)}</span>
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
                              className="text-[#C95B5B] p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </PixelCard>
              </>
            ) : (
              <PixelCard variant="warm">
                <h3 className="font-bold text-sm mb-1.5 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#B86B7D]" />
                  Ringkasan Siklus {partnerProfile ? partnerProfile.display_name : 'Pasangan'}
                </h3>
                {!partnerProfile ? (
                  <p className="text-xs text-[#6E5039]">Pasangan belum terhubung ke dunia ini.</p>
                ) : !partnerCycleConsent?.share_cycle ? (
                  <p className="text-xs text-[#6E5039] italic">
                    Saat ini {partnerProfile.display_name} belum mengaktifkan izin berbagi kalender siklus.
                  </p>
                ) : partnerCyclePrediction.hasEnoughData ? (
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-sm text-[#2C1E14]">
                      Perkiraan siklus {partnerProfile.display_name} berikutnya:{' '}
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
          </div>

          <div className="lg:col-span-5 space-y-6">
            {isFemaleUser && (
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
                      Tanggal Selesai (Opsional)
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
              <h3 className="font-bold text-base mb-3">
                Check-In Mood & Energi Harian ({currentUser.display_name})
              </h3>
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
            <p className="font-bold text-base text-[#4A3525]">Belum ada item wishlist</p>
            <p className="text-xs text-[#6E5039] mt-1 mb-4">
              Simpan ide kencan, tempat makan, atau kegiatan seru yang ingin kalian wujudkan bersama.
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
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-[#2C1E14] text-[#FDF8EE] uppercase">
                        {item.status}
                      </span>
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
                          className="px-2 py-1 bg-[#EFE2C6] border border-[#4A3525] font-bold"
                        >
                          Rencanakan
                        </button>
                      )}
                      {item.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateWishStatus(item, 'completed')}
                          className="px-2 py-1 bg-[#6B8E78] text-white border border-[#2C1E14] font-bold"
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
                          setConfirmDialog({
                            title: 'Hapus Wishlist?',
                            message: `Apakah kamu yakin ingin menghapus "${item.title}" dari daftar keinginan?`,
                            onConfirm: () => {
                              setDb((prev) => ({
                                ...prev,
                                wishlist_items: prev.wishlist_items.filter((w) => w.id !== item.id),
                              }));
                              setConfirmDialog(null);
                              showToast('Item wishlist dihapus.', 'info');
                            },
                          })
                        }
                        className="p-1 text-[#C95B5B]"
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

  const renderMemoriesPage = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#8C684C]" />
            Timeline Memories
          </h1>
          <p className="text-xs text-[#6E5039]">
            Simpan foto dan cerita momen berharga kalian. Kenangan berstatus Shared juga dapat menjadi bahan kuis AI!
          </p>
        </div>
        <PixelButton variant="pink" onClick={() => setShowMemModal(true)}>
          <Plus className="w-4 h-4" /> + Simpan Memory Baru
        </PixelButton>
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
              <PixelCard
                key={mem.id}
                variant={mem.visibility === 'private' ? 'warm' : 'cream'}
              >
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
                      <span className="text-[10px] font-mono text-[#2C4235]">Media Tersimpan</span>
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
                            setConfirmDialog({
                              title: 'Hapus Kenangan?',
                              message: `Hapus kenangan "${mem.title}"?`,
                              onConfirm: () => {
                                setDb((prev) => ({
                                  ...prev,
                                  memories: prev.memories.filter((m) => m.id !== mem.id),
                                }));
                                setConfirmDialog(null);
                                showToast('Kenangan dihapus.', 'info');
                              },
                            })
                          }
                          className="text-[#C95B5B] font-bold flex items-center gap-1"
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
                  Upload Foto (JPG/PNG/WebP maks 4MB)
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
                  Simpan Memory
                </PixelButton>
              </div>
            </form>
          </PixelCard>
        </div>
      )}
    </div>
  );

  const renderLoveNotesPage = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#4E6E5B]" />
            Love Notes & Kapsul Waktu
          </h1>
          <p className="text-xs text-[#6E5039]">
            Kirim surat langsung atau pilih tanggal buka di masa depan. Surat terjadwal dikunci hingga waktunya tiba.
          </p>
        </div>
        <div className="flex gap-2">
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
                Jadwalkan Waktu Buka (Opsional)
              </label>
              <input
                type="datetime-local"
                value={noteScheduleDate}
                onChange={(e) => setNoteScheduleDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-[#4A3525]"
              />
            </div>
            <PixelButton type="submit" variant="pink" className="w-full">
              <Mail className="w-4 h-4" /> Kirim Love Note
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
                    <p className="text-xs text-[#6E5039] mt-2 line-clamp-3 italic">{note.body}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#8C684C]/30 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#6E5039]">
                      Dikirim {formatDateID(note.created_at)}
                    </span>
                    <PixelButton
                      variant={note.isLocked && isInbox ? 'secondary' : 'primary'}
                      onClick={() => handleOpenLoveNote(note)}
                    >
                      {note.isLocked && isInbox ? 'Belum Waktunya' : 'Baca Surat'}
                    </PixelButton>
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

  const renderSanctuaryPage = () => {
    if (!currentGarden) return null;

    const isNight = gardenAmbiance === 'night';
    const isSunset = gardenAmbiance === 'sunset';
    const isRain = gardenAmbiance === 'rain';

    const petCategories = ['cat_mochi', 'bunny_bubu', 'bird_piyo', 'fox_kuro', 'hamster_choco', 'panda_pao'];
    const totalPets = currentGarden.tiles.filter((t) => petCategories.includes(t.item)).length;
    const maxLevelItems = currentGarden.tiles.filter((t) => t.item !== 'empty' && t.stage === 4).length;
    const filledTiles = currentGarden.tiles.filter((t) => t.item !== 'empty').length;
    const cozyScore = Math.min(100, filledTiles * 4 + maxLevelItems * 8);
    const sanctuaryLevel = Math.max(1, Math.floor(cozyScore / 20) + 1);

    const inspectedTile =
      inspectedTileIndex !== null ? currentGarden.tiles[inspectedTileIndex] : null;
    const inspectedMeta = inspectedTile
      ? SANCTUARY_CATALOG.find((c) => c.type === inspectedTile.item)
      : null;

    const filteredCatalog = SANCTUARY_CATALOG.filter((c) =>
      gardenCatalogTab === 'all' ? true : c.category === gardenCatalogTab
    );

    const skyGradient = isNight
      ? 'from-[#1B2234] via-[#28324B] to-[#3B4254] text-[#FDF8EE]'
      : isSunset
      ? 'from-[#D97F6C] via-[#E8A57B] to-[#F5D3A6] text-[#2C1E14]'
      : isRain
      ? 'from-[#6C8094] via-[#8CA0B3] to-[#B8C7D4] text-[#2C1E14]'
      : 'from-[#88C9E8] via-[#B4E0F5] to-[#E2F3FA] text-[#2C1E14]';

    const roomBg = isNight ? 'bg-[#3A281D]' : isSunset ? 'bg-[#7A5238]' : 'bg-[#8C6245]';

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-[#8C684C]" />
              Cozy Sanctuary — Rumah Pohon & Peliharaan Pixel
            </h1>
            <p className="text-xs text-[#6E5039]">
              Adopsi anabul pixel, tata furnitur hangat, dan gunakan Poin Kasih untuk merawat mereka hingga Level Maksimal!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 bg-[#FDF8EE] border-2 border-[#2C1E14] shadow-[3px_3px_0px_0px_#2C1E14] font-bold text-xs">
              Cozy Lv.{sanctuaryLevel} ({cozyScore}%)
            </div>
            <div className="px-3.5 py-2 bg-[#D8E6DC] border-2 border-[#2C1E14] shadow-[3px_3px_0px_0px_#2C1E14] font-bold text-xs text-[#2C4235]">
              Poin Kasih: {currentGarden.points} ✨
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FDF8EE] p-3 border-2 border-[#4A3525] shadow-[3px_3px_0px_0px_#4A3525]">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold mr-1">Suasana Jendela:</span>
            <button
              type="button"
              onClick={() => setGardenAmbiance('day')}
              className={`px-2.5 py-1 border-2 font-bold flex items-center gap-1 ${
                gardenAmbiance === 'day' ? 'bg-[#6B8E78] text-white border-[#2C1E14]' : 'bg-white border-[#4A3525]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Pagi Cerah
            </button>
            <button
              type="button"
              onClick={() => setGardenAmbiance('sunset')}
              className={`px-2.5 py-1 border-2 font-bold flex items-center gap-1 ${
                gardenAmbiance === 'sunset' ? 'bg-[#D98A9C] text-white border-[#2C1E14]' : 'bg-white border-[#4A3525]'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" /> Senja Hangat
            </button>
            <button
              type="button"
              onClick={() => setGardenAmbiance('night')}
              className={`px-2.5 py-1 border-2 font-bold flex items-center gap-1 ${
                gardenAmbiance === 'night' ? 'bg-[#2C1E14] text-[#FDF8EE] border-[#2C1E14]' : 'bg-white border-[#4A3525]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Malam Perapian
            </button>
            <button
              type="button"
              onClick={() => setGardenAmbiance('rain')}
              className={`px-2.5 py-1 border-2 font-bold flex items-center gap-1 ${
                gardenAmbiance === 'rain' ? 'bg-[#5B738E] text-white border-[#2C1E14]' : 'bg-white border-[#4A3525]'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" /> Hujan Syahdu
            </button>
          </div>

          <PixelButton
            variant="pink"
            onClick={handleTreatAllPets}
            className="text-xs py-1.5"
          >
            ✨ Pesta Camilan & Rawat Semua (-5 ✨)
          </PixelButton>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="border-4 border-[#2C1E14] shadow-[5px_5px_0px_0px_#2C1E14] overflow-hidden">
              <div className={`bg-gradient-to-b ${skyGradient} p-4 relative border-b-4 border-[#2C1E14]`}>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <PixelAvatar avatarKey={currentUser.avatar_key} size={40} className="border-2 border-[#2C1E14]" />
                    {partnerProfile && (
                      <PixelAvatar avatarKey={partnerProfile.avatar_key} size={40} className="border-2 border-[#2C1E14]" />
                    )}
                    <div className="text-xs">
                      <p className="font-extrabold tracking-tight">{currentCouple.name}</p>
                      <p className="opacity-85 text-[11px]">
                        🐾 {totalPets} Peliharaan • ⭐ {maxLevelItems} Item Level Maks
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${roomBg} p-4 transition-colors`}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 bg-[#FDF8EE] px-3 py-2 border-2 border-[#2C1E14] text-xs">
                  <span>
                    Alat Aktif:{' '}
                    <strong className="uppercase text-[#4E6E5B]">
                      {selectedBrush === 'care'
                        ? '🍖 Rawat / Upgrade Level (-2 ✨)'
                        : selectedBrush === 'clear'
                        ? '🧹 Rapikan Petak'
                        : `📦 Pasang: ${SANCTUARY_CATALOG.find((c) => c.type === selectedBrush)?.name}`}
                    </strong>
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedBrush('care')}
                      className={`px-2 py-1 border font-bold flex items-center gap-1 ${
                        selectedBrush === 'care'
                          ? 'bg-[#D98A9C] text-[#2C1E14] border-[#2C1E14]'
                          : 'bg-white text-[#2C1E14] border-[#4A3525]'
                      }`}
                    >
                      🍖 Rawat (-2 ✨)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedBrush('clear')}
                      className={`px-2 py-1 border font-bold ${
                        selectedBrush === 'clear'
                          ? 'bg-[#C95B5B] text-white border-[#2C1E14]'
                          : 'bg-white text-[#2C1E14] border-[#4A3525]'
                      }`}
                    >
                      Rapikan
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 max-w-[390px] mx-auto">
                  {currentGarden.tiles.map((tile) => {
                    const isSelected = inspectedTileIndex === tile.index;
                    return (
                      <button
                        key={tile.index}
                        type="button"
                        onClick={() => handleGardenTileClick(tile.index)}
                        className={`aspect-square relative flex flex-col items-center justify-center border-2 transition transform active:scale-95 ${
                          isNight
                            ? 'bg-[#593E2E] border-[#362318] hover:border-[#FFF3B0]'
                            : 'bg-[#E5C9A8] border-[#B5926B] hover:border-[#2C1E14]'
                        } ${isSelected ? 'ring-2 ring-[#D98A9C]' : ''}`}
                      >
                        <SanctuarySprite item={tile.item} stage={tile.stage} size={46} isNight={isNight} />
                        {tile.item !== 'empty' && (
                          <span
                            className={`absolute bottom-0.5 right-0.5 text-[9px] font-extrabold px-1 border ${
                              tile.stage === 4
                                ? 'bg-[#F5DCE2] text-[#592A35] border-[#B86B7D]'
                                : 'bg-[#FDF8EE]/90 text-[#2C1E14] border-[#4A3525]'
                            }`}
                          >
                            {tile.stage === 4 ? '❤️MAX' : `Lv.${tile.stage}`}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {inspectedTile && inspectedTile.item !== 'empty' && inspectedMeta && (
              <PixelCard variant="cream" className="p-3">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#EFE2C6] border-2 border-[#4A3525] flex items-center justify-center">
                      <SanctuarySprite item={inspectedTile.item} stage={inspectedTile.stage} size={40} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#2C1E14]">
                        {inspectedMeta.name} (Petak #{inspectedTile.index + 1})
                      </p>
                      <p className="text-[#6E5039]">
                        Status Kasih Sayang: <strong>Level {inspectedTile.stage} dari 4</strong> • Dirawat terakhir:{' '}
                        {formatDateID(inspectedTile.last_watered_at)}
                      </p>
                    </div>
                  </div>
                  {inspectedTile.stage < 4 && (
                    <PixelButton
                      variant="pink"
                      onClick={() => {
                        setSelectedBrush('care');
                        handleGardenTileClick(inspectedTile.index);
                      }}
                    >
                      🍖 Beri Makan / Upgrade (-2 ✨)
                    </PixelButton>
                  )}
                </div>
              </PixelCard>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <PixelCard>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-base">Katalog Peliharaan & Furnitur</h2>
                <div className="flex gap-1 text-xs">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'pet', label: '🐾 Anabul' },
                    { id: 'furniture', label: '🛋️ Furnitur' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setGardenCatalogTab(tab.id)}
                      className={`px-2 py-1 border font-bold ${
                        gardenCatalogTab === tab.id
                          ? 'bg-[#4A3525] text-white border-[#2C1E14]'
                          : 'bg-[#F6EDD9] text-[#4A3525] border-[#8C684C]'
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
                          <p className="font-bold text-[#2C1E14]">{item.name}</p>
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
                          onClick={() => handleUnlockGardenItem(item.type, item.cost)}
                        >
                          Adopsi ({item.cost} ✨)
                        </PixelButton>
                      )}
                    </div>
                  );
                })}
              </div>
            </PixelCard>
          </div>
        </div>
      </div>
    );
  };

  const renderGamesPage = () => {
    const activeSession = db.game_sessions.find((s) => s.couple_id === currentCouple.id);
    const sessionId = activeSession ? activeSession.id : `sess_${currentCouple.id}`;
    const sharedMems = authorizedMemories.filter((m) => m.visibility === 'shared');

    const categories = ['Semua', ...Array.from(new Set(allQuizQuestions.map((q) => q.category)))];
    const filteredQuestions = allQuizQuestions.filter(
      (q) => quizCategoryFilter === 'Semua' || q.category === quizCategoryFilter
    );

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#B86B7D]" />
            Couple Quiz — Pertanyaan Kenangan & Hati
          </h1>
          <p className="text-xs text-[#6E5039]">
            Jawab pertanyaan dari akun masing-masing. Jawaban pasangan baru terbuka setelah kalian berdua merespons!
          </p>
        </div>

        <PixelCard variant="pink">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#592A35] text-[#FDF8EE] text-[10px] font-bold uppercase">
                <Wand2 className="w-3 h-3" /> Gemini AI Memory Quiz Generator
              </div>
              <h2 className="font-bold text-base text-[#2C1E14]">
                Buat Pertanyaan Otomatis dari Kenangan Bersama Kalian
              </h2>
              <p className="text-xs text-[#592A35]">
                AI membaca daftar <strong>Shared Memories ({sharedMems.length} kenangan)</strong> milik kalian dan
                merangkai pertanyaan refleksi personal.
              </p>
            </div>

            <PixelButton
              variant="primary"
              disabled={isGeneratingAiQuiz}
              onClick={handleGenerateAiQuestionsFromMemories}
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
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 bg-[#EFE2C6] border border-[#4A3525]">
                      {q.category}
                    </span>
                    {q.memoryReference && (
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-[#F5DCE2] text-[#592A35] border border-[#B86B7D]">
                        📖 Dari Memory: "{q.memoryReference}"
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
                  <div className="p-3 bg-[#FDF8EE] border-2 border-[#4A3525]">
                    <p className="text-xs font-bold text-[#6E5039] mb-2">
                      Jawabanmu ({currentUser.display_name}):
                    </p>
                    {myAnswer ? (
                      <p className="text-xs font-semibold text-[#2C1E14] p-2 bg-[#EFE2C6]/60 border border-[#8C684C]">
                        {myAnswer.skipped ? '(Melewati pertanyaan ini)' : myAnswer.answer_text}
                      </p>
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
              Tanggal Penting / Anniversary Berikutnya
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
        <h2 className="font-bold text-base text-[#592A35] mb-2">Keluar Sesi atau Putuskan Dunia (Unpair)</h2>
        <p className="text-xs text-[#592A35] mb-4">
          Kamu dapat keluar dari sesi akunmu di perangkat ini, atau memutuskan hubungan dunia pasangan (Unpair) jika
          ingin membuat ulang dunia baru.
        </p>
        <div className="flex flex-wrap gap-3">
          <PixelButton variant="secondary" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Keluar Akun (Logout)
          </PixelButton>
          <PixelButton variant="danger" onClick={handleUnpairWorld}>
            Putuskan Hubungan Dunia (Unpair)
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
      {renderToast()}
      {renderConfirmDialog()}

      <div className="flex-1 flex max-w-6xl w-full mx-auto">
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
            <PixelButton variant="secondary" onClick={handleLogout} className="w-full">
              <LogOut className="w-4 h-4" /> Keluar Akun
            </PixelButton>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-8 min-w-0">
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
          {activeRoute === 'garden' && renderSanctuaryPage()}
          {activeRoute === 'games' && renderGamesPage()}
          {activeRoute === 'settings' && renderSettingsPage()}
        </main>
      </div>

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