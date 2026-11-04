# Mains-Portfolio

Personal developer and research portfolio for software engineering projects, work experience,
AI/ML and HPC research, conferences, skills, education and hobbies.

All content is managed through an authenticated **Sanity Studio** at `/studio`, so no code
changes are needed to add, edit, publish or delete content.

## Tech stack

| Concern   | Choice                                               |
| --------- | ---------------------------------------------------- |
| Framework | Next.js 16 (App Router, Cache Components) + React 19 |
| Language  | TypeScript (strict)                                  |
| Styling   | Tailwind CSS v4                                      |
| CMS       | Sanity (embedded Studio at `/studio`)                |
| Quality   | ESLint, Prettier, Vitest                             |
| CI        | GitHub Actions (`.github/workflows/ci.yml`)          |
| Hosting   | Vercel                                               |

## Quick start

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` (the minimum supported by jsdom and Vitest;
`.nvmrc` pins 24).

```bash
npm install
cp .env.example .env.local   # optional: the app runs without it
npm run dev                  # http://localhost:3000
```

**Without Sanity credentials** the site still runs and builds. It shows placeholder settings and
empty sections, and `/studio` explains how to configure it.

## Connecting Sanity

1. Create a free project at <https://www.sanity.io/manage> (or run `npx sanity init` and
   choose "create new project". Skip the file generation, because the config already exists).
2. Copy the **Project ID** into `.env.local`:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=yourprojectid
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. Under **API → CORS origins**, add `http://localhost:3000` (and later your production URL)
   **with "Allow credentials" enabled**. Studio login needs this. You can also run
   `npx sanity cors add http://localhost:3000 --credentials`.
4. Restart `npm run dev` and open <http://localhost:3000/studio>. Log in with your Sanity account.
5. Open **Site settings** first, fill in your name, headline and bio, and publish.

### Authentication and security

- `/studio` is protected by Sanity's own authentication. Only users invited as project members
  (sanity.io/manage → Members) can log in or change content. Keep yourself as the only
  Administrator.
- The public site uses the `published` perspective, so drafts are never visible. Content is
  only live after you click **Publish**. **Unpublish** or **Delete** removes it.
- `NEXT_PUBLIC_*` variables (project id, dataset) are not secrets. Tokens
  (`SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`) are server-only and must never be
  prefixed with `NEXT_PUBLIC_`.
- A public dataset is fine for a portfolio, because only published content is readable. If you
  make the dataset private, add a Viewer token as `SANITY_API_READ_TOKEN`.
- `/studio` is served with `X-Frame-Options: DENY` and `noindex`.

### Instant updates (optional webhook)

Content is cached and refreshes on its own within about a minute. A webhook expires the changed
content type's cache as soon as Sanity delivers it. This is not a guaranteed instant update:
requests handled before the webhook arrives (or while it is retried) still receive the cached
content, and a browser that already has the page open may keep showing content from the client
router cache until it reloads. To set up the webhook:

1. Generate a secret: `openssl rand -hex 32`, then set it as `SANITY_REVALIDATE_SECRET`
   (in `.env.local` and in Vercel).
2. In sanity.io/manage → API → Webhooks, create a webhook:
   - URL: `https://<your-domain>/api/revalidate`
   - Trigger on: Create, Update, Delete
   - Projection: `{ _type }`
   - Secret: the same value
   - HTTP method: POST

## Content model

| Type           | Purpose                                       | Media support                                         |
| -------------- | --------------------------------------------- | ----------------------------------------------------- |
| `siteSettings` | Singleton: name, bio, social, SEO, résumé PDF | Avatar                                                |
| `project`      | Software projects                             | Cover, photo gallery, multiple YouTube videos         |
| `research`     | AI/ML and HPC research, publications          | Cover, photo gallery, multiple YouTube videos         |
| `experience`   | Jobs, internships, research positions         | Logo                                                  |
| `conference`   | Conferences attended or presented             | Cover, gallery with captions, multiple YouTube videos |
| `skill`        | Skills grouped by category                    | –                                                     |
| `education`    | Degrees                                       | Logo                                                  |
| `hobby`        | Hobbies                                       | Image, photo gallery                                  |

Reusable objects: `accessibleImage` (alt text), `galleryImage` (alt + caption), `youtubeVideo`
(URL validated as YouTube), `link`, `richText` (Portable Text with inline images and videos).

## Architecture

```
sanity.config.ts            Studio config (structure, singleton rules, plugins)
sanity.cli.ts               Sanity CLI config
src/
├─ app/
│  ├─ layout.tsx            Root HTML shell + metadata
│  ├─ (site)/               Public site (header/footer layout, pages)
│  ├─ studio/[[...tool]]/   Embedded Sanity Studio
│  └─ api/revalidate/       Sanity webhook → cache revalidation
├─ components/              Reusable, content-agnostic UI
│  ├─ layout/               Header, nav, footer
│  ├─ media/                CmsImage, PhotoGallery, YouTubeEmbed
│  └─ ui/                   Container, cards, tags, rich text, ...
├─ features/                Domain-specific UI (projects, research, conferences, ...)
├─ domain/content.ts        CMS-agnostic domain types (the UI depends only on these)
├─ lib/
│  ├─ content/              Typed content-access layer
│  │  ├─ repository.ts      ContentRepository interface
│  │  ├─ sanity-repository.ts   Sanity implementation
│  │  ├─ fallback-repository.ts Placeholder implementation (no CMS configured)
│  │  ├─ source.ts          Picks the active implementation
│  │  ├─ index.ts           Cached public API ("use cache" + tags)
│  │  └─ tags.ts            Cache tags per content type
│  └─ utils/                YouTube parsing, date formatting
└─ sanity/
   ├─ env.ts                Env parsing (never throws)
   ├─ schemas/              Document and object schemas
   ├─ structure.ts          Studio sidebar
   └─ lib/                  Client, GROQ queries, raw → domain mappers
```

**Data flow:** page → `@/lib/content` (cached) → `ContentRepository` → GROQ query → mapper →
domain types → UI.

**Replacing the CMS:** implement `ContentRepository` for the new source (for example Markdown
files or a database), map the data into the types in `src/domain/content.ts`, and select it in
`src/lib/content/source.ts`. No pages or components need to change.

**Caching:** Cache Components is enabled. Content functions use `"use cache"` with a
per-type `cacheTag` and `cacheLife("minutes")`. The webhook calls `revalidateTag` for the
changed type.

**Images:** Sanity images are resized by Sanity's CDN through a custom `next/image` loader.
This avoids using Vercel's image-optimization quota.

**Videos:** editors paste any YouTube URL (watch, youtu.be, shorts, embed, live). It is
validated in Studio, parsed to an id, and embedded through `youtube-nocookie.com` with lazy
loading.

## Commands

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Start the dev server                      |
| `npm run build`     | Production build                          |
| `npm start`         | Serve the production build                |
| `npm run lint`      | ESLint                                    |
| `npm run typecheck` | Generate route types + `tsc --noEmit`     |
| `npm run format`    | Prettier write (`format:check` to verify) |
| `npm test`          | Vitest (`test:watch` for watch mode)      |
| `npm run check`     | lint + typecheck + format check + tests   |

## CI

`.github/workflows/ci.yml` runs on pushes to `main` and `dev` and on pull requests. It runs
lint, typecheck, format check, tests, and a production build. The build runs without secrets
by default. To build against real content, set `NEXT_PUBLIC_SANITY_PROJECT_ID` and
`NEXT_PUBLIC_SANITY_DATASET` as GitHub repository **variables**.

## Deployment (Vercel)

1. Import the GitHub repository in Vercel (Hobby plan is sufficient). The framework preset is
   detected as Next.js.
2. Add environment variables (Project → Settings → Environment Variables):
   `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SITE_URL`, and
   optionally `NEXT_PUBLIC_SANITY_API_VERSION` (defaults to `2025-10-01`, see `src/sanity/env.ts`),
   `SANITY_REVALIDATE_SECRET` and `SANITY_API_READ_TOKEN`.
3. Add the production URL to Sanity CORS origins (with credentials).
4. Optionally configure the revalidation webhook (see above).

Vercel deploys `main` to production and creates preview deployments for other branches and PRs.
