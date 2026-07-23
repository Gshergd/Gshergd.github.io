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
