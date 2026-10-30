-- ============================================================================
-- SUPABASE POSTGRES BEST PRACTICES & OPTIMASI LENGKAP (MERADEL)
-- Mengacu pada: Supabase Postgres Best Practices (Security, Performance & Schema)
-- Salin dan jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> Run
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. OPTIMASI INDEX FOREIGN KEY & LOOKUP RLS (schema-foreign-key-indexes)
-- Mencegah Full Table Seq Scan saat join, filter couple, dan cascade delete
-- ----------------------------------------------------------------------------

-- Indexes untuk Keanggotaan & Pasangan
create index if not exists idx_couples_created_by on public.couples (created_by);
create index if not exists idx_couple_members_couple_id on public.couple_members (couple_id);
create index if not exists idx_couple_members_user_id on public.couple_members (user_id);
create index if not exists idx_couple_members_lookup on public.couple_members (couple_id, user_id);
create index if not exists idx_couple_invites_couple_id on public.couple_invites (couple_id);
create index if not exists idx_couple_invites_token_hash on public.couple_invites (token_hash);

-- Indexes untuk Pesan / Love Notes (Penting agar surat terkunci & riwayat cepat dibuka)
create index if not exists idx_love_notes_couple_id on public.love_notes (couple_id);
create index if not exists idx_love_notes_recipient_id on public.love_notes (recipient_id);
create index if not exists idx_love_notes_sender_id on public.love_notes (sender_id);
create index if not exists idx_love_notes_scheduled_for on public.love_notes (scheduled_for);

-- Indexes untuk Game Kuis Pasangan
create index if not exists idx_game_sessions_couple_id on public.game_sessions (couple_id);
create index if not exists idx_game_answers_session_id on public.game_answers (session_id);
create index if not exists idx_game_answers_user_id on public.game_answers (user_id);

-- Indexes untuk Kebun & Fitur Pasangan Lainnya
create index if not exists idx_garden_state_couple_id on public.garden_state (couple_id);
create index if not exists idx_memories_couple_id on public.memories (couple_id);
create index if not exists idx_wishlist_items_couple_id on public.wishlist_items (couple_id);
create index if not exists idx_cycle_logs_user_id on public.cycle_logs (user_id);
create index if not exists idx_mood_entries_user_id on public.mood_entries (user_id);
create index if not exists idx_cycle_sharing_couple_id on public.cycle_sharing_settings (couple_id);

-- ----------------------------------------------------------------------------
-- 2. FUNGSI CEK KEANGGOTAAN DUNIA (ANTI-HIJACKING & SUBQUERY OPTIMIZED)
-- ----------------------------------------------------------------------------
create or replace function public.is_active_couple_member(target_couple_id uuid)
returns boolean
language sql
security definer
set search_path = public, extensions
stable
as $$
  select exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = target_couple_id
      and cm.user_id = (select auth.uid())
  );
$$;

-- ----------------------------------------------------------------------------
-- 3. RLS TABEL PROFILES
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
drop policy if exists "profiles_select_all" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;

create policy "profiles_select_all" on public.profiles
for select to authenticated
using (true);

create policy "profiles_insert_own" on public.profiles
for insert to authenticated
with check (id = (select auth.uid()));

create policy "profiles_update_own" on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- ----------------------------------------------------------------------------
-- 4. RLS TABEL COUPLES (DUNIA PASANGAN)
-- Menggunakan (select auth.uid()) agar query plan di-cache dan efisien
-- ----------------------------------------------------------------------------
alter table public.couples enable row level security;
drop policy if exists "couples_select" on public.couples;
drop policy if exists "couples_insert" on public.couples;
drop policy if exists "couples_update" on public.couples;

create policy "couples_select" on public.couples
for select to authenticated
using (
  created_by = (select auth.uid()) or public.is_active_couple_member(id)
);

create policy "couples_insert" on public.couples
for insert to authenticated
with check (
  created_by = (select auth.uid())
);

create policy "couples_update" on public.couples
for update to authenticated
using (
  public.is_active_couple_member(id)
) with check (
  public.is_active_couple_member(id)
);

-- ----------------------------------------------------------------------------
-- 5. RLS TABEL COUPLE MEMBERS
-- ----------------------------------------------------------------------------
alter table public.couple_members enable row level security;
drop policy if exists "couple_members_select" on public.couple_members;
drop policy if exists "couple_members_insert" on public.couple_members;

create policy "couple_members_select" on public.couple_members
for select to authenticated
using (
  user_id = (select auth.uid()) or public.is_active_couple_member(couple_id)
);

create policy "couple_members_insert" on public.couple_members
for insert to authenticated
with check (
  user_id = (select auth.uid())
);

-- ----------------------------------------------------------------------------
-- 6. RLS TABEL COUPLE INVITES
-- ----------------------------------------------------------------------------
alter table public.couple_invites enable row level security;
drop policy if exists "couple_invites_select" on public.couple_invites;
drop policy if exists "couple_invites_insert" on public.couple_invites;

create policy "couple_invites_select" on public.couple_invites
for select to authenticated
using (
  public.is_active_couple_member(couple_id)
);

create policy "couple_invites_insert" on public.couple_invites
for insert to authenticated
with check (
  public.is_active_couple_member(couple_id) and created_by = (select auth.uid())
);

-- ----------------------------------------------------------------------------
-- 7. RLS TABEL LOVE NOTES (MEMASTIKAN SURAT TERKUNCI & TERKIRIM MUNCUL DI PENERIMA)
-- ----------------------------------------------------------------------------
alter table public.love_notes enable row level security;
drop policy if exists "love_notes_select_policy" on public.love_notes;
drop policy if exists "love_notes_insert_sender" on public.love_notes;
drop policy if exists "love_notes_update_recipient" on public.love_notes;
drop policy if exists "love_notes_delete_sender" on public.love_notes;

create policy "love_notes_select_policy" on public.love_notes
for select to authenticated
using (
  public.is_active_couple_member(couple_id)
  and (
    sender_id = (select auth.uid())
    or recipient_id = (select auth.uid())
  )
);

create policy "love_notes_insert_sender" on public.love_notes
for insert to authenticated
with check (
  public.is_active_couple_member(couple_id) and sender_id = (select auth.uid())
);

create policy "love_notes_update_recipient" on public.love_notes
for update to authenticated
using (
  public.is_active_couple_member(couple_id)
  and (sender_id = (select auth.uid()) or recipient_id = (select auth.uid()))
)
with check (
  public.is_active_couple_member(couple_id)
  and (sender_id = (select auth.uid()) or recipient_id = (select auth.uid()))
);

create policy "love_notes_delete_sender" on public.love_notes
for delete to authenticated
using (
  sender_id = (select auth.uid())
);

-- ----------------------------------------------------------------------------
-- 8. RLS TABEL MEMORIES (TIMELINE KENANGAN BERSAMA & FOTO)
-- ----------------------------------------------------------------------------
alter table public.memories enable row level security;
drop policy if exists "memories_select_couple" on public.memories;
drop policy if exists "memories_insert_couple" on public.memories;
drop policy if exists "memories_update_couple" on public.memories;
drop policy if exists "memories_delete_couple" on public.memories;

create policy "memories_select_couple" on public.memories
for select to authenticated
using (
  public.is_active_couple_member(couple_id)
);

create policy "memories_insert_couple" on public.memories
for insert to authenticated
with check (
  public.is_active_couple_member(couple_id) and created_by = (select auth.uid())
);

create policy "memories_update_couple" on public.memories
for update to authenticated
using (
  public.is_active_couple_member(couple_id)
) with check (
  public.is_active_couple_member(couple_id)
);

create policy "memories_delete_couple" on public.memories
for delete to authenticated
using (
  created_by = (select auth.uid())
);

-- ----------------------------------------------------------------------------
-- 9. RLS TABEL WISHLIST ITEMS
-- ----------------------------------------------------------------------------
alter table public.wishlist_items enable row level security;
drop policy if exists "wishlist_items_all_couple" on public.wishlist_items;

create policy "wishlist_items_all_couple" on public.wishlist_items
for all to authenticated
using (public.is_active_couple_member(couple_id))
with check (public.is_active_couple_member(couple_id));

-- ----------------------------------------------------------------------------
-- 10. RLS TABEL GAME SESSIONS & ANSWERS (KUIS PASANGAN)
-- ----------------------------------------------------------------------------
alter table public.game_sessions enable row level security;
drop policy if exists "game_sessions_couple_access" on public.game_sessions;

create policy "game_sessions_couple_access" on public.game_sessions
for all to authenticated
using (public.is_active_couple_member(couple_id))
with check (public.is_active_couple_member(couple_id));

alter table public.game_answers enable row level security;
drop policy if exists "game_answers_select" on public.game_answers;
drop policy if exists "game_answers_all" on public.game_answers;

create policy "game_answers_select" on public.game_answers
for select to authenticated
using (
  exists (
    select 1 from public.game_sessions gs
    where gs.id = session_id and public.is_active_couple_member(gs.couple_id)
  )
);

create policy "game_answers_all" on public.game_answers
for all to authenticated
using (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.game_sessions gs
    where gs.id = session_id and public.is_active_couple_member(gs.couple_id)
  )
) with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.game_sessions gs
    where gs.id = session_id and public.is_active_couple_member(gs.couple_id)
  )
);

-- ----------------------------------------------------------------------------
-- 11. RLS TABEL SANCTUARY (GARDEN STATE)
-- ----------------------------------------------------------------------------
alter table public.garden_state enable row level security;
drop policy if exists "garden_state_couple_access" on public.garden_state;

create policy "garden_state_couple_access" on public.garden_state
for all to authenticated
using (public.is_active_couple_member(couple_id))
with check (public.is_active_couple_member(couple_id));

-- ----------------------------------------------------------------------------
-- 12. RLS TABEL CYCLE LOGS & MOOD ENTRIES
-- ----------------------------------------------------------------------------
alter table public.cycle_logs enable row level security;
drop policy if exists "cycle_logs_own" on public.cycle_logs;
create policy "cycle_logs_own" on public.cycle_logs
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

alter table public.mood_entries enable row level security;
drop policy if exists "mood_entries_own" on public.mood_entries;
create policy "mood_entries_own" on public.mood_entries
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

alter table public.cycle_sharing_settings enable row level security;
drop policy if exists "cycle_sharing_settings_access" on public.cycle_sharing_settings;
create policy "cycle_sharing_settings_access" on public.cycle_sharing_settings
for all to authenticated
using (
  user_id = (select auth.uid()) or public.is_active_couple_member(couple_id)
)
with check (
  user_id = (select auth.uid())
);

-- ----------------------------------------------------------------------------
-- 13. PENGUNCIAN KEAMANAN FUNGSI REDEEM PAIRING (TRANSAKSIONAL & LOCK FOR UPDATE)
-- ----------------------------------------------------------------------------
create or replace function public.redeem_couple_invite(raw_token text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_hash text;
  v_invite record;
  v_member_count int;
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'Harus login terlebih dahulu';
  end if;

  v_hash := encode(digest(upper(trim(raw_token)), 'sha256'), 'hex');

  select * into v_invite
  from public.couple_invites
  where token_hash = v_hash
    and used_at is null
    and expires_at > now()
  for update;

  if not found then
    raise exception 'Kode undangan tidak valid, sudah digunakan, atau kedaluwarsa';
  end if;

  select count(*) into v_member_count
  from public.couple_members
  where couple_id = v_invite.couple_id;

  if v_member_count >= 2 then
    raise exception 'Dunia pasangan ini sudah penuh (maksimal 2 akun)';
  end if;

  insert into public.couple_members (couple_id, user_id, role)
  values (v_invite.couple_id, v_uid, 'member');

  update public.couple_invites
  set used_at = now(), used_by = v_uid
  where id = v_invite.id;

  insert into public.cycle_sharing_settings (user_id, couple_id)
  values (v_uid, v_invite.couple_id)
  on conflict (user_id) do nothing;

  return v_invite.couple_id;
end;
$$;
