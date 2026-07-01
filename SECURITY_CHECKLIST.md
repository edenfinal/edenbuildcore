# Production Security Checklist

## Supabase

- RLS must stay enabled on public and admin tables.
- Never put `SUPABASE_SERVICE_ROLE_KEY` in frontend `.env` files. Only Edge Functions may use it.
- Deploy Edge Functions before locking down broad admin write policies:
  - `admin-login`
  - `admin-session`
  - `admin-logout`
  - `upload-image`
  - `send-contact-email`
- Link admins to Supabase Auth using `admin_users.auth_user_id`.
- Replace old direct browser CRUD writes with Edge Function writes before dropping broad historical `admin_all_* USING (true)` policies.
- Enable daily backups from Supabase project settings.
- Review SQL editor migration output after every deploy.

## Environment Variables

Frontend may only expose:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Edge Functions may use:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `TO_EMAIL`

## Hosting

- Use HTTPS/SSL only.
- Redirect HTTP to HTTPS.
- Keep secrets in the hosting provider's encrypted environment variable manager.
- Do not commit `.env` files.

## Forms And Uploads

- Contact and job forms validate required fields and length before insert.
- Contact email function validates data again server-side.
- Image upload requires an admin session token, validates MIME type and file signature, limits file size, and writes through an Edge Function.

## Remaining Hardening Step

The final database hardening step is to move admin CRUD writes behind service-role Edge Functions. After that, broad historical policies such as `admin_all_* USING (true)` can be replaced with service-role-only writes without breaking the admin panel.
