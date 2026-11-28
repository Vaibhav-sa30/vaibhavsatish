# Artifact email updates setup

The static portfolio contains the Artifacts page and signup form. Email collection and delivery run through Supabase Edge Functions and Resend; those services must be configured before the form can accept subscriptions or send mail.

## One-time setup

1. In the Supabase SQL Editor for the project already used by the portfolio, run `supabase/artifact-subscribers.sql`.
2. Create a Resend account, verify a sending domain, and create an API key.
3. Install and authenticate the Supabase CLI, then link this repository to the existing Supabase project.
4. Set Edge Function secrets (use your deployed portfolio URL for `SITE_URL`):

   ```sh
   supabase secrets set RESEND_API_KEY=... FROM_EMAIL="Vaibhav Satish <research@your-verified-domain>" SITE_URL="https://your-portfolio.example"
   supabase secrets set ARTIFACT_NOTIFY_SECRET=...
   ```

   Supabase provides the service role key to Edge Functions automatically. Keep the Resend key and notification secret private; never put them in the browser.
5. The function settings in `supabase/config.toml` disable JWT verification for these routes. Subscribe, confirmation, and unsubscribe are public; the notification route checks its own secret.

   ```sh
   supabase functions deploy subscribe-artifacts
   supabase functions deploy notify-artifact
   supabase functions deploy confirm-artifact-subscription
   supabase functions deploy unsubscribe-artifacts
   ```

After setup, the signup form stores addresses and emails a confirmation link. Only confirmed addresses receive updates. When publishing an artifact, call the notification function with the title, public HTTPS URL, and summary; it emails all current subscribers and includes an unsubscribe link.

```sh
curl -X POST "https://frgzcwsqbakawyrqegxj.supabase.co/functions/v1/notify-artifact" \
  -H "Authorization: Bearer $ARTIFACT_NOTIFY_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"title":"New interpretability note","url":"https://your-portfolio.example/artifacts.html","summary":"A short description of the new work."}'
```
