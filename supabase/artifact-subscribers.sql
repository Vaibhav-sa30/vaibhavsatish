-- Email subscribers for research artifact announcements.
-- Run in the Supabase SQL Editor before deploying the Edge Functions.
CREATE TABLE IF NOT EXISTS public.artifact_subscribers (
  email TEXT PRIMARY KEY CHECK (email = lower(email)),
  unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  confirmation_token UUID UNIQUE DEFAULT gen_random_uuid(),
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.artifact_subscribers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.artifact_subscribers FROM anon, authenticated;
-- The Edge Functions use the service role key; never expose that key in the browser.
