# Adding another character archive

Keep each archive isolated so artwork, copy, and interactions never become tangled with another character.

## 1. Create the public route

For a future `/leon-kennedy/` page, add:

```text
app/leon-kennedy/page.tsx
app/leon-kennedy/layout.tsx
```

The page file should only load the feature:

```tsx
export { default } from "@/features/leon-kennedy/LeonKennedyArchive";
```

Use the layout file for that character's title, description, canonical URL, and social preview.

## 2. Create the character feature

Add character-specific React code and content under:

```text
features/leon-kennedy/
```

Large pages may be split into `content.ts`, `components/`, and the main archive component.

## 3. Add the artwork

Store only that character's artwork under:

```text
public/assets/characters/leon-kennedy/
```

Keep site-wide branding under `public/assets/brand/` and social cards under `public/assets/social/`.

## 4. Build before uploading

```bash
pnpm run build
```

The build must list the new route as static. GitHub Actions will repeat this check whenever `main` is updated.
