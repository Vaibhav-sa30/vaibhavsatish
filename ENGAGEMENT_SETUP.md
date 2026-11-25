# Article likes and comments setup

The portfolio uses its existing Supabase project. The browser only uses the public anon key; no service-role key is used or needed.

## Apply the database migration

Before relying on likes or comments in production, open the Supabase project `frgzcwsqbakawyrqegxj`, open **SQL Editor**, and run the complete [`supabase-setup.sql`](supabase-setup.sql) script. It is safe to rerun. It preserves old aggregate like counts and existing comments, removes the old public increment/delete policies, and adds the per-visitor like table, RPCs, comment validation, moderation status, and rate-limit table.

The migration must be applied to the hosted database. Pushing this repository does not apply SQL to Supabase. Deploying the browser code before the migration has run will show an actionable failure state rather than silently saving data only in the visitor's browser.

## Moderating comments

New comments are stored with `moderation_status = 'pending'` and are not readable by visitors. To publish one, open **Table Editor → article_comments**, review the row, and change its status to `approved`. Set it to `rejected` to keep it hidden. Existing comments are retained and migrated as approved.

Visitors can read approved comments and submit a new comment through the validation RPC. They cannot insert directly, change a moderation status, or delete comments. Names are limited to 50 characters, comment text to 2,000 characters, blank input is rejected server-side, a hidden honeypot is checked, and each anonymous browser ID is limited to five submissions per hour.

## Anonymous likes and rate limits

The browser creates a random UUID with the Web Crypto API and stores it in local storage. Supabase stores one row per `(article_id, visitor_id)` with a database primary key. A transaction-level lock makes like toggles atomic. The identifier contains no personal information; clearing browser storage or using another browser creates a new anonymous visitor.

Comment throttling is enforced in Postgres per anonymous visitor ID, with a honeypot as a second low-friction spam check. As with any account-free browser identifier, someone determined to evade the limit can clear storage or generate another ID. The site does not retain visitor IP addresses.

## Vercel configuration and verification limits

No new Vercel environment variable or secret is required. The existing public Supabase URL and anon key are used by the client. The anon key is designed for browser use and is constrained by the database grants and RLS policies in the migration. Never put a Supabase service-role key in browser code.

The current environment cannot resolve the Supabase or Vercel hosts, so the live database schema and production persistence could not be checked from this checkout. After applying the SQL, verify the migration and test likes/comments on the deployed site from two separate browser profiles. The site should not be described as production-verified until that check succeeds.
