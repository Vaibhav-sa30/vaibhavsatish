-- Daymark check-ins and update lifecycle events. These tables intentionally store
-- operational metadata only, never proposal or portfolio content text.
create table if not exists public.portfolio_checkins (
  id uuid primary key,
  response text not null check (response in ('has_update', 'nothing_to_update')),
  source text not null check (char_length(source) <= 40),
  created_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object')
);

create table if not exists public.portfolio_update_events (
  event_id uuid primary key,
  update_id text,
  event_type text not null check (event_type in (
    'checkin_completed', 'update_submitted', 'proposal_generated', 'ai_proposal_failed', 'branch_created',
    'preview_deployment_ready', 'update_refined', 'update_approved',
    'production_deployment_completed', 'update_discarded', 'deployment_failed'
  )),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null
);

create index if not exists portfolio_checkins_created_at_idx
  on public.portfolio_checkins (created_at desc);
create index if not exists portfolio_update_events_created_at_idx
  on public.portfolio_update_events (created_at desc);

alter table public.portfolio_checkins enable row level security;
alter table public.portfolio_update_events enable row level security;
revoke all on public.portfolio_checkins from anon, authenticated;
revoke all on public.portfolio_update_events from anon, authenticated;
-- Writes are performed only by the Edge Function using its server-side service role.



