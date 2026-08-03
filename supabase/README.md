# Database schema

**`schema.sql`** is the single source of truth. It reflects the actual live
schema (verified against the running Supabase project) and is safe to re-run
— every statement is idempotent.

To set up a fresh Supabase project: run `schema.sql` top to bottom in the SQL
editor. To sync an existing project after a schema change: update
`schema.sql` in place and re-run only the changed section (or the whole file
— it won't break anything already applied).

## archive/

Old one-off migration files from earlier in the project, kept for history.
They're already folded into `schema.sql` — don't run them again.

## migrations/

Pre-existing Drizzle-generated migrations from an earlier iteration of this
project (before it moved to the current Supabase project). Not part of the
current schema — left untouched, not connected to `schema.sql`.
