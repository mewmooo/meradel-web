-- ============================================================================
-- SKRIP PERBAIKAN LENGKAP KEAMANAN OWASP, RLS, & INTEGRASI DATABASE (MERADEL)
-- Salin dan jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> Run
-- ============================================================================

-- 1. FUNGSI CEK KEANGGOTAAN DUNIA (ANTI SEARCH PATH HIJACKING & ANTI REKURSI)
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
      and cm.user_id = auth.uid()
  );
$$;

-- 2. PERBAIKAN RLS TABEL COUPLES (DUNIA PASANGAN)
alter table public.couples enable row level security;
drop policy if exists "couples_select" on public.couples;
drop policy if exists "couples_insert" on public.couples;
drop policy if exists "couples_update" on public.couples;

create policy "couples_select" on public.couples
for select using (
  created_by = auth.uid() or public.is_active_couple_member(id)
);

create policy "couples_insert" on public.couples
for insert with check (
  created_by = auth.uid()
);

create policy "couples_update" on public.couples
for update using (
  public.is_active_couple_member(id)
) with check (
  public.is_active_couple_member(id)
);

-- 3. PERBAIKAN RLS TABEL COUPLE MEMBERS (MENGHINDARI INFINITE RECURSION)
alter table public.couple_members enable row level security;
drop policy if exists "couple_members_select" on public.couple_members;
drop policy if exists "couple_members_insert" on public.couple_members;

create policy "couple_members_select" on public.couple_members
for select using (
  user_id = auth.uid() or public.is_active_couple_member(couple_id)
);

create policy "couple_members_insert" on public.couple_members
for insert with check (
  user_id = auth.uid()
);

-- 4. PERBAIKAN RLS TABEL COUPLE INVITES (KODE UNDANGAN)
alter table public.couple_invites enable row level security;
drop policy if exists "couple_invites_select" on public.couple_invites;
drop policy if exists "couple_invites_insert" on public.couple_invites;

create policy "couple_invites_select" on public.couple_invites
for select using (
  public.is_active_couple_member(couple_id)
);

create policy "couple_invites_insert" on public.couple_invites
for insert with check (
  public.is_active_couple_member(couple_id) and created_by = auth.uid()
);

-- 5. PERBAIKAN RLS TABEL LOVE NOTES (MEMASTIKAN KARTU SURAT TERKUNCI MUNCUL DI PENERIMA)
alter table public.love_notes enable row level security;
drop policy if exists "love_notes_select_policy" on public.love_notes;
drop policy if exists "love_notes_insert_sender" on public.love_notes;

create policy "love_notes_select_policy" on public.love_notes
for select using (
  public.is_active_couple_member(couple_id)
  and (
    sender_id = auth.uid()
    or recipient_id = auth.uid()
  )
);

create policy "love_notes_insert_sender" on public.love_notes
for insert with check (
  public.is_active_couple_member(couple_id) and sender_id = auth.uid()
);

-- 6. PERBAIKAN RLS TABEL GAME SESSIONS & GAME ANSWERS (KUIS PASANGAN TERINTEGRASI KEDUA AKUN)
alter table public.game_sessions enable row level security;
drop policy if exists "game_sessions_couple_access" on public.game_sessions;

create policy "game_sessions_couple_access" on public.game_sessions
for all using (
  public.is_active_couple_member(couple_id)
) with check (
  public.is_active_couple_member(couple_id)
);

alter table public.game_answers enable row level security;
drop policy if exists "game_answers_select" on public.game_answers;
drop policy if exists "game_answers_all" on public.game_answers;

create policy "game_answers_select" on public.game_answers
for select using (
  exists (
    select 1 from public.game_sessions gs
    where gs.id = session_id and public.is_active_couple_member(gs.couple_id)
  )
);

create policy "game_answers_all" on public.game_answers
for all using (
  user_id = auth.uid()
  and exists (
    select 1 from public.game_sessions gs
    where gs.id = session_id and public.is_active_couple_member(gs.couple_id)
  )
) with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.game_sessions gs
    where gs.id = session_id and public.is_active_couple_member(gs.couple_id)
  )
);

-- 7. PERBAIKAN RLS TABEL SANCTUARY / GARDEN STATE
alter table public.garden_state enable row level security;
drop policy if exists "garden_state_couple_access" on public.garden_state;

create policy "garden_state_couple_access" on public.garden_state
for all using (public.is_active_couple_member(couple_id))
with check (public.is_active_couple_member(couple_id));

-- 8. PENGUNCIAN KEAMANAN FUNGSI REDEEM PAIRING
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
begin
  if auth.uid() is null then
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
  values (v_invite.couple_id, auth.uid(), 'member');

  update public.couple_invites
  set used_at = now(), used_by = auth.uid()
  where id = v_invite.id;

  insert into public.cycle_sharing_settings (user_id, couple_id)
  values (auth.uid(), v_invite.couple_id)
  on conflict (user_id) do nothing;

  return v_invite.couple_id;
end;
$$;
