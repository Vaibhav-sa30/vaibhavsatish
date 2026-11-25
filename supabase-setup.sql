-- Persistent, privacy-conscious engagement for portfolio writeups.
-- Run this migration in the Supabase SQL Editor before deploying js/engagement.js.
-- Existing aggregate likes are retained as a historical baseline. Existing
-- comments are retained and remain visible; new comments require approval.

begin;

create table if not exists public.article_likes (
  article_id text primary key,
  like_count integer not null default 0,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.article_like_handles (
  id uuid primary key default gen_random_uuid(),
  article_id text not null,
  reader_handle text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_id text not null,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.article_comments
  add column if not exists visitor_id uuid,
  add column if not exists moderation_status text not null default 'approved';

-- Retain the existing annotations feature without changing its policies.
create table if not exists public.article_annotations (
  article_id text primary key,
  strokes_json jsonb not null,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.article_user_likes (
  article_id text not null,
  visitor_id uuid not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  primary key (article_id, visitor_id),
  constraint article_user_likes_article_id_format
    check (article_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create table if not exists public.article_comment_rate_limits (
  visitor_id uuid primary key,
  window_started_at timestamptz not null,
  submission_count integer not null check (submission_count > 0)
);

alter table public.article_likes enable row level security;
alter table public.article_like_handles enable row level security;
alter table public.article_comments enable row level security;
alter table public.article_annotations enable row level security;
alter table public.article_user_likes enable row level security;
alter table public.article_comment_rate_limits enable row level security;

-- Remove old public policies that allowed arbitrary count changes,
-- unmoderated comment inserts, and public deletion of comments.
drop policy if exists "Allow public read on article_likes" on public.article_likes;
drop policy if exists "Allow public insert on article_likes" on public.article_likes;
drop policy if exists "Allow public update on article_likes" on public.article_likes;
drop policy if exists "Allow public read on article_like_handles" on public.article_like_handles;
drop policy if exists "Allow public insert on article_like_handles" on public.article_like_handles;
drop policy if exists "Allow public read on article_comments" on public.article_comments;
drop policy if exists "Allow public insert on article_comments" on public.article_comments;
drop policy if exists "Allow public delete on article_comments" on public.article_comments;

-- Keep the existing annotation persistence behavior unchanged.
drop policy if exists "Allow public read on article_annotations" on public.article_annotations;
drop policy if exists "Allow public insert on article_annotations" on public.article_annotations;
drop policy if exists "Allow public update on article_annotations" on public.article_annotations;
create policy "Allow public read on article_annotations"
  on public.article_annotations for select using (true);
create policy "Allow public insert on article_annotations"
  on public.article_annotations for insert with check (true);
create policy "Allow public update on article_annotations"
  on public.article_annotations for update using (true);
grant select, insert, update on table public.article_annotations to anon, authenticated;

drop policy if exists "Approved comments are publicly readable" on public.article_comments;
create policy "Approved comments are publicly readable"
  on public.article_comments for select to anon, authenticated
  using (moderation_status = 'approved');

revoke all on table public.article_likes from anon, authenticated;
revoke all on table public.article_like_handles from anon, authenticated;
revoke all on table public.article_user_likes from anon, authenticated;
revoke all on table public.article_comment_rate_limits from anon, authenticated;
revoke all on table public.article_comments from anon, authenticated;
grant select on table public.article_comments to anon, authenticated;
grant usage on schema public to anon, authenticated;

-- These constraints apply to new comments but allow older rows to remain
-- untouched if they predate today's length limits.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.article_comments'::regclass
      and conname = 'article_comments_author_name_length'
  ) then
    alter table public.article_comments
      add constraint article_comments_author_name_length
      check (char_length(btrim(author_name)) between 1 and 50) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.article_comments'::regclass
      and conname = 'article_comments_content_length'
  ) then
    alter table public.article_comments
      add constraint article_comments_content_length
      check (char_length(btrim(content)) between 1 and 2000) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.article_comments'::regclass
      and conname = 'article_comments_moderation_status'
  ) then
    alter table public.article_comments
      add constraint article_comments_moderation_status
      check (moderation_status in ('pending', 'approved', 'rejected')) not valid;
  end if;
end;
$$;

-- The previous increment-only endpoint was not idempotent and is no longer used.
drop function if exists public.increment_like(text);

create or replace function public.get_article_engagement(
  target_article_id text,
  target_visitor_id uuid
)
returns table(like_count bigint, visitor_liked boolean, comment_count bigint)
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if target_article_id is null
     or length(target_article_id) > 120
     or target_article_id !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
    raise exception 'INVALID_ARTICLE_ID' using errcode = '22023';
  end if;

  return query
  select
    greatest(coalesce((
      select legacy.like_count from public.article_likes as legacy
      where legacy.article_id = target_article_id
    ), 0), 0)::bigint + (
      select count(*) from public.article_user_likes as user_likes
      where user_likes.article_id = target_article_id
    ),
    target_visitor_id is not null and exists (
      select 1 from public.article_user_likes as user_likes
      where user_likes.article_id = target_article_id
        and user_likes.visitor_id = target_visitor_id
    ),
    (
      select count(*) from public.article_comments as comments
      where comments.article_id = target_article_id
        and comments.moderation_status = 'approved'
    );
end;
$$;

create or replace function public.toggle_article_like(
  target_article_id text,
  target_visitor_id uuid
)
returns table(liked boolean, like_count bigint)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  baseline_count bigint;
  total_like_count bigint;
begin
  if target_article_id is null
     or length(target_article_id) > 120
     or target_article_id !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
     or target_visitor_id is null then
    raise exception 'INVALID_LIKE_REQUEST' using errcode = '22023';
  end if;

  -- Serialize toggles for the same article and visitor. The table's primary
  -- key is the final duplicate-prevention guarantee.
  perform pg_advisory_xact_lock(hashtext(target_article_id), hashtext(target_visitor_id::text));

  if exists (
    select 1 from public.article_user_likes
    where article_id = target_article_id and visitor_id = target_visitor_id
  ) then
    delete from public.article_user_likes
    where article_id = target_article_id and visitor_id = target_visitor_id;
  else
    insert into public.article_user_likes(article_id, visitor_id)
    values (target_article_id, target_visitor_id)
    on conflict (article_id, visitor_id) do nothing;
  end if;

  liked := exists (
    select 1 from public.article_user_likes
    where article_id = target_article_id and visitor_id = target_visitor_id
  );
  select greatest(coalesce(legacy.like_count, 0), 0)::bigint
    into baseline_count
    from public.article_likes as legacy
    where legacy.article_id = target_article_id;
  baseline_count := coalesce(baseline_count, 0);
  select baseline_count + count(*) into total_like_count
    from public.article_user_likes
    where article_id = target_article_id;
  like_count := total_like_count;
  return next;
end;
$$;

create or replace function public.submit_article_comment(
  target_article_id text,
  target_visitor_id uuid,
  target_author_name text,
  target_content text,
  target_honeypot text default ''
)
returns table(
  id uuid,
  article_id text,
  author_name text,
  content text,
  moderation_status text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  visitor_submissions integer;
  new_comment public.article_comments%rowtype;
begin
  if target_honeypot is not null and btrim(target_honeypot) <> '' then
    raise exception 'COMMENT_SPAM_REJECTED' using errcode = 'P0001';
  end if;
  if target_article_id is null
     or length(target_article_id) > 120
     or target_article_id !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
     or target_visitor_id is null then
    raise exception 'INVALID_COMMENT' using errcode = '22023';
  end if;
  if target_author_name is null
     or char_length(btrim(target_author_name)) not between 1 and 50
     or target_content is null
     or char_length(btrim(target_content)) not between 1 and 2000 then
    raise exception 'INVALID_COMMENT' using errcode = '22023';
  end if;

  -- Five comments per anonymous browser ID per rolling hour.
  insert into public.article_comment_rate_limits as rate_limit
    (visitor_id, window_started_at, submission_count)
  values (target_visitor_id, now(), 1)
  on conflict (visitor_id) do update set
    window_started_at = case
      when rate_limit.window_started_at <= now() - interval '1 hour' then now()
      else rate_limit.window_started_at
    end,
    submission_count = case
      when rate_limit.window_started_at <= now() - interval '1 hour' then 1
      else rate_limit.submission_count + 1
    end
  returning submission_count into visitor_submissions;

  if visitor_submissions > 5 then
    raise exception 'COMMENT_RATE_LIMITED' using errcode = 'P0001';
  end if;

  insert into public.article_comments(
    article_id, visitor_id, author_name, content, moderation_status
  ) values (
    target_article_id, target_visitor_id, btrim(target_author_name), btrim(target_content), 'pending'
  ) returning * into new_comment;

  return query select
    new_comment.id,
    new_comment.article_id,
    new_comment.author_name,
    new_comment.content,
    new_comment.moderation_status,
    new_comment.created_at;
end;
$$;

revoke all on function public.get_article_engagement(text, uuid) from public;
revoke all on function public.toggle_article_like(text, uuid) from public;
revoke all on function public.submit_article_comment(text, uuid, text, text, text) from public;
grant execute on function public.get_article_engagement(text, uuid) to anon, authenticated;
grant execute on function public.toggle_article_like(text, uuid) to anon, authenticated;
grant execute on function public.submit_article_comment(text, uuid, text, text, text) to anon, authenticated;

commit;
