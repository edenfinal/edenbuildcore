# Supabase Migration Cleanup Guide

This project already has migration files that may have been applied to a live Supabase project. Do not rename or delete old migration files after they may have reached a remote database. Supabase tracks migration filenames and changing historical files can cause deployment drift.

## Current Safe Rule

- Keep historical migrations in place, including older `.sql.sql` files.
- Add new fixes as forward-only migrations with a newer timestamp.
- Use `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, `DROP POLICY IF EXISTS`, and guarded `INSERT ... WHERE NOT EXISTS` patterns.
- Do not move public admin writes fully behind RLS until the matching Edge Functions are deployed and the frontend has stopped writing directly to those tables.

## Hero Tables

- `page_heroes` is the source of truth for page hero configuration and home carousel settings.
- `hero_slides` currently remains as the slide list used by carousel pages and is scoped by `page_id`.
- Removing `hero_slides` is a breaking database change unless the schema is redesigned to allow multiple hero rows per page or a dedicated `page_hero_slides` table is introduced with a data migration.

## Deployment Order For Hardening

1. Deploy new Edge Functions.
2. Apply new forward-only migrations.
3. Verify admin login, hero editing, image upload, and contact form on staging.
4. Only then replace broad admin write policies with service-role-only Edge Function writes.
