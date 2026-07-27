# The Secretary Archives

A static, multi-route Next.js archive designed for GitHub Pages.

## Publish it

1. Create a **public** GitHub repository named exactly `YOUR-USERNAME.github.io`.
2. Upload the **contents** of this folder to the repository root (do not upload the enclosing folder).
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions** as the source.
5. Open the **Actions** tab and wait for `Deploy GitHub Pages` to finish.

The archive will appear at:

- `https://YOUR-USERNAME.github.io/`
- `https://YOUR-USERNAME.github.io/missions/`
- `https://YOUR-USERNAME.github.io/missions/ada-wong/`
- `https://YOUR-USERNAME.github.io/gallery/`
- `https://YOUR-USERNAME.github.io/forum/`
- `https://YOUR-USERNAME.github.io/developer/`

## Local development

```bash
pnpm install
pnpm run dev
```

## Production check

```bash
pnpm install --frozen-lockfile
pnpm run build
```

The static website is generated in `out/`.

## Connect the owner-managed gallery

The public site remains static on GitHub Pages. Supabase supplies the passwordless magic-link sign-in,
gallery records, and uploaded image storage required by `/developer/`.

1. Create a Supabase project and run [`supabase/gallery-setup.sql`](supabase/gallery-setup.sql)
   once in its SQL Editor. The policies permit public reads and restrict every write to
   `dikshitaggarwal007@gmail.com`.
2. Open **Authentication → URL Configuration**. Set **Site URL** to
   `https://gshergd.github.io` and add the exact redirect URL
   `https://gshergd.github.io/developer/`.
3. Keep the Email provider enabled and leave Supabase's default **Magic Link** email template
   unchanged. The private login never displays the owner email; opening the emailed button returns
   to `/developer/` and signs the owner in automatically. The default mailer can send only to members
   of the Supabase project team, so make
   sure `dikshitaggarwal007@gmail.com` is listed in the organization's team settings. It is also
   rate-limited, which is fine for this private owner dashboard; custom SMTP can be added later if
   the login is opened to other people.
4. In the GitHub repository, add the Actions variable `NEXT_PUBLIC_SUPABASE_URL` containing
   the project URL.
5. Add the Actions secret `NEXT_PUBLIC_SUPABASE_ANON_KEY` containing the project's publishable
   (or legacy anon) key. Never expose the service-role key as a public environment variable.
6. Push to `main`. The Pages workflow injects both values during the static build.

For local testing, copy `.env.example` to `.env.local`, replace the two Supabase placeholders,
add `http://localhost:3000/developer/` to Supabase's redirect allowlist, then run `pnpm dev`.
`.env.local` is ignored by Git.

Without these values the original gallery is still visible, while `/developer/` shows setup
instructions instead of pretending that browser-only edits are persistent.

### Permanent GitHub archive for gallery images

Gallery uploads appear immediately through Supabase, then the gallery-only archive workflow copies
them into `public/assets/gallery/`, deploys the new asset, replaces the database URL with the GitHub
Pages URL, and removes the temporary Supabase Storage object. The **Update GitHub** button checks all
existing gallery records and queues only images that have not been archived; when everything is
already hosted by GitHub it performs no deployment.

1. In GitHub, add an Actions secret named `SUPABASE_SERVICE_ROLE_KEY` containing the Supabase
   project's service-role key. Keep it only in GitHub Actions; never prefix it with `NEXT_PUBLIC_`
   or place it in browser code.
2. Deploy the gallery sync Edge Function from the linked project:

   ```bash
   npx supabase@latest functions deploy sync-gallery
   ```

The function reuses the existing `GITHUB_ACTIONS_TOKEN` and `GITHUB_REPOSITORY` Supabase secrets.
This process applies only to gallery images; mission images and mission publishing are unchanged.

## Connect the Mission Builder

`/developer/` also contains an owner-only visual Mission Builder. Pages are assembled from
locked cinematic widgets, so editors can change content and order without changing the site's
theme, header, footer, motion, or responsive behavior.

1. Complete the gallery Supabase setup above.
2. Run [`supabase/mission-builder.sql`](supabase/mission-builder.sql) in the same Supabase SQL
   Editor. This adds draft/published mission records and a dedicated mission image bucket.
3. Redeploy the website. Ada Wong is included as the built-in first mission and can be imported
   into Supabase simply by opening it in the builder and saving or publishing it.

### Automatic deployment after publishing

GitHub Pages is static, so a newly published clean URL such as `/missions/new-file/` must be added
during a fresh Pages build. The builder can request that build securely:

1. Create a fine-grained GitHub token that can run Actions for the `Portfolio` repository.
2. In Supabase CLI, link the project and set the Edge Function secrets:

   ```bash
   supabase secrets set GITHUB_ACTIONS_TOKEN=YOUR_TOKEN
   supabase secrets set GITHUB_REPOSITORY=Gshergd/Portfolio
   ```

3. Deploy the included function:

   ```bash
   supabase functions deploy publish-mission
   ```

The function validates the existing owner session before requesting the already configured Pages
workflow. The GitHub token remains inside Supabase and is never shipped to the browser. If this
optional function is not deployed, mission drafts and records still work; pushing any commit to
`main` performs the required rebuild.

## Mission content model

Mission pages are stored as structured JSON blocks in Supabase. Supported widgets include the
cinematic hero, marquee, dossier cards, statistics, image feature, full-width banner, footage
gallery, capabilities, connections, and FAQ intelligence. Public pages render those records using
the fixed components in `features/missions/`; raw HTML and custom CSS are never accepted.
