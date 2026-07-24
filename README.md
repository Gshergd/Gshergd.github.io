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
- `https://YOUR-USERNAME.github.io/ada-wong/`
- `https://YOUR-USERNAME.github.io/gallery/`
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
   unchanged. The default mailer can send only to members of the Supabase project team, so make
   sure `dikshitaggarwal007@gmail.com` is listed in the organization's team settings. It is also
   rate-limited, which is fine for this private owner dashboard; custom SMTP can be added later if
   the login is opened to other people.
4. In the GitHub repository, add the Actions variable `NEXT_PUBLIC_SUPABASE_URL` containing
   the project URL.
5. Add the Actions secret `NEXT_PUBLIC_SUPABASE_ANON_KEY` containing the project's publishable
   (or legacy anon) key. Never use the service-role key in this site.
6. Push to `main`. The Pages workflow injects both values during the static build.

For local testing, copy `.env.example` to `.env.local`, replace the two Supabase placeholders,
add `http://localhost:3000/developer/` to Supabase's redirect allowlist, then run `pnpm dev`.
`.env.local` is ignored by Git.

Without these values the original gallery is still visible, while `/developer/` shows setup
instructions instead of pretending that browser-only edits are persistent.

## Add future character archives

Use one folder per public route and one feature folder per character:

```text
app/
  ada-wong/page.tsx
  leon-kennedy/page.tsx
  james-bond/page.tsx
features/
  ada-wong/
  leon-kennedy/
  james-bond/
public/assets/characters/
  ada-wong/
  leon-kennedy/
  james-bond/
```

Each `app/<route>/page.tsx` should export its character feature. Keep reusable navigation,
buttons, modal components, and legal text in `components/site/` as those shared pieces grow.
