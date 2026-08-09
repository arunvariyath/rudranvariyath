# Rudran Variyath — Official Website

A modern, bilingual (English / മലയാളം), fully responsive website for **Rudran Variyath**, a Malayalam poet and writer from Veliyancode, Malappuram, Kerala.

Built with **React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion**, deployed automatically to **GitHub Pages** via **GitHub Actions**.

🔗 **Live site:** https://arvapps-com.github.io/rudranvariyath/

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Editing Content](#editing-content)
  - [Changing text (English / Malayalam)](#changing-text-english--malayalam)
  - [Updating book images](#updating-book-images)
  - [Updating award images](#updating-award-images)
  - [Updating gallery photos](#updating-gallery-photos)
  - [Updating family names](#updating-family-names)
  - [Adding a third language](#adding-a-third-language)
- [Poems / YouTube Sync](#poems--youtube-sync)
- [Deployment](#deployment)
- [GitHub Actions Workflows](#github-actions-workflows)
- [What is and isn't committed](#what-is-and-isnt-committed)
- [Performance Notes](#performance-notes)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)

---

## Features

| | |
|---|---|
| 🌐 **Bilingual** | Full English ⇄ Malayalam toggle. Choice saved in `localStorage`, Malayalam browsers auto-detected |
| 🎬 **Poems** | YouTube video grid with in-page modal player, auto-synced daily |
| 📚 **Books** | 5 published works with lightbox |
| 🏆 **Awards** | 12 awards with descriptions |
| 🖼️ **Gallery** | 33 photos in a masonry layout, progressive "load more" |
| 🌳 **Family tree** | Interactive, generation-grouped, click for details |
| 🌙 **Dark mode** | Follows system preference |
| ⚡ **Lazy loading** | Every image uses `loading="lazy"` + IntersectionObserver reveal |
| ♿ **Accessible** | Keyboard nav, focus rings, ARIA labels, `prefers-reduced-motion` |
| 🔍 **SEO** | Meta tags, Open Graph, Twitter Cards, dynamic `<html lang>` |

---

## Tech Stack

| Purpose | Library |
|---|---|
| UI | React 19 |
| Language | TypeScript (strict) |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | lucide-react |
| Fonts | Inter (Latin) + Noto Sans Malayalam |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Project Structure

```
rudranvariyath/
├── .github/
│   └── workflows/
│       ├── deploy.yml           # Build + deploy to GitHub Pages
│       └── update-poems.yml     # Daily YouTube → poems.json sync
├── public/
│   ├── .nojekyll                # Stops GitHub Pages running Jekyll
│   ├── 404.html                 # SPA fallback for deep links
│   └── data/
│       └── poems.json           # ← auto-updated daily by Actions
├── scripts/
│   └── update_poems.py          # yt-dlp script used by the workflow
├── src/
│   ├── components/              # One file per section
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Poems.tsx
│   │   ├── Books.tsx
│   │   ├── Awards.tsx
│   │   ├── Gallery.tsx
│   │   ├── Family.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Lightbox.tsx         # Shared image viewer
│   │   ├── LanguageToggle.tsx   # EN / മലയാളം switch
│   │   └── icons/
│   ├── locales/
│   │   ├── en.ts                # ★ ALL ENGLISH TEXT
│   │   ├── ml.ts                # ★ ALL MALAYALAM TEXT
│   │   └── index.ts             # Language registry
│   ├── i18n/
│   │   └── LanguageProvider.tsx # Context + persistence
│   ├── data/
│   │   └── content.ts           # ★ IMAGES & LINKS ONLY (no text)
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

> **Key idea:** text lives in `src/locales/`, images/links live in `src/data/content.ts`. They're linked by a `key` (books/awards) or an `id` (family members).

---

## Feature Flags

Sections can be shown or hidden from one file — `src/config/features.ts`:

```ts
export const features = {
  familyTree: false,   // ← set to true to show the Family section
} as const;
```

Flipping a flag removes the section from the page **and** from the navbar,
mobile menu and footer links automatically. Nothing else needs editing.

| Flag | Default | Section |
|---|---|---|
| `familyTree` | `true` | Family — Tree / Cards views |

---

## Getting Started

### Prerequisites
- **Node.js 20+**
- npm

### Run locally

```bash
git clone https://github.com/arvapps-com/rudranvariyath.git
cd rudranvariyath

npm install
npm run dev          # http://localhost:5173
```

### Other commands

```bash
npm run build        # Production build → dist/
npm run preview      # Preview the production build locally
npx tsc --noEmit     # Type-check without building
```

---

## Editing Content

### Changing text (English / Malayalam)

All visible text is in **two files**:

| Language | File |
|---|---|
| English | `src/locales/en.ts` |
| Malayalam | `src/locales/ml.ts` |

Open the file, find the key, and change **only the value on the right**:

```ts
// src/locales/en.ts
hero: {
  badge: 'Malayalam Poet & Writer',    // ← edit this
  watchPoems: 'Watch Poems',           // ← and this
}
```

```ts
// src/locales/ml.ts
hero: {
  badge: 'മലയാള കവിയും എഴുത്തുകാരനും',
  watchPoems: 'കവിതകൾ കാണുക',
}
```

> ⚠️ **Both files must have exactly the same keys.** `ml.ts` is typed against `en.ts`, so if you delete or misspell a key, the build fails immediately with a clear error instead of silently showing a blank space.

---

### Updating book images

**1.** Put the new image in the repo (or point at any URL) and edit `src/data/content.ts`:

```ts
export const books = [
  { key: 'kavithakal',         imageSrc: `${ASSETS}/books/Rudran_variyathinte_kavithakal.webp` },
  { key: 'ormacheppu',         imageSrc: `${ASSETS}/books/Ormacheppu.webp` },
  { key: 'nilav',              imageSrc: `${ASSETS}/books/Nilav.webp` },
  { key: 'naalamyamam',        imageSrc: `${ASSETS}/books/naalam_yamam.webp` },
  { key: 'kaliyugakazhchakal', imageSrc: `${ASSETS}/books/kaliyugakazhchakal.webp` },
  { key: 'newbook',            imageSrc: `${ASSETS}/books/new_book.webp` },   // ← added
];
```

**2.** Add the matching text to **both** locale files using the same `key`:

```ts
// src/locales/en.ts → books.items
newbook: { title: 'New Book', description: 'A short description.' },
```
```ts
// src/locales/ml.ts → books.items
newbook: { title: 'പുതിയ പുസ്തകം', description: 'ഒരു ചെറിയ വിവരണം.' },
```

To **replace** a cover without changing anything else, just swap the image file — keep the same filename and nothing else needs editing.

---

### Updating award images

Identical pattern — `src/data/content.ts`:

```ts
export const awards = [
  { key: 'bhashamalayalam', imageSrc: `${ASSETS}/awards/awards_1.webp` },
  // ...
  { key: 'newaward',        imageSrc: `${ASSETS}/awards/awards_13.webp` },  // ← added
];
```

Then add `newaward: { title: …, description: … }` under `awards.items` in **both** `en.ts` and `ml.ts`.

---

### Updating gallery photos

The gallery is generated from a count, so adding photos is a one-number change.

```ts
// src/data/content.ts
export const galleryImages = Array.from({ length: 33 }, (_, i) => ({
  imageSrc: `${ASSETS}/gallery/gallery_${String(i + 1).padStart(2, '0')}.webp`,
}));
```

Add `gallery_34.webp` to the folder → change `33` to `34`. Done.

Files must be named `gallery_01.webp`, `gallery_02.webp`, … (zero-padded to two digits).

---

### The family section

Two views, switchable with a toggle:

| View | What it shows |
|---|---|
| **Tree** (default) | A proper genealogical tree with CSS connector lines |
| **Cards** | Generation bands — easier to scan on a phone |

Every card carries four pieces of information:

```
        [ photo or initials ]
          Jayarani                ← name
          Mother                  ← relation within her own family
          Arun's mother-in-law    ← how she connects to the poet's family
          🏢 Homemaker             ← occupation (hidden when blank)
```

The third line is the key one — it answers "whose mother-in-law is this?"
without having to trace the tree by eye.

Each in-law panel also shows **who it connects through** in its header, plus a
`View in family tree` link that scrolls to that person and pulses their card.

The section is scoped to the poet's family, going **one level into each marriage**.

**Core line** — shown as a vertical tree:

```
Parents          Aachattil Narayanan Nair ♥ Variyath Seemanthini Nangyar
   │
The Poet         Rudran Variyath ♥ Shylaja M N
   │
Children         Arun ♥ Aparna  ·  Anjitha ♥ Vijil  ·  Anoop
   │
Grandchildren    Adhisree · Rishikesh
```

**Relatives by marriage** — one collapsible panel per person who married in,
each showing their parents, siblings (with spouses) and their siblings' children:

| Branch | Contains |
|---|---|
| Shylaja's Family | Venugopala Menon · Nandini · Baburaj ♥ Anu K → Anjana, Adhidev, Archana · Biju M · Anilkumar M ♥ Keerthy V → Anandhakrishnan, Aryanandha |
| Aparna's Family | Mohandas · Jayarani |
| Vijil's Family | Das · Vijaya · Vipin |

Anything past that level — in-laws' grandparents, aunts, uncles, cousins — is
deliberately excluded. That trimmed the tree from ~70 people down to 28.

**Structure** → `src/data/family.ts`
**Names / relations / occupations** → `family.members` in both locale files
**Photos** → `public/images/family/`

#### Adding a photo

1. Drop the image into `public/images/family/` (square, ~400×400, WebP preferred)
2. Set the filename in `src/data/family.ts`:

```ts
{ id: 'arun', generation: 'children', gender: 'male', photo: 'arun.webp' },
```

Leave `photo: null` to show a gradient initials placeholder. Missing or broken
images fall back to initials automatically — no broken image icons, ever.

#### The four fields on each card

```ts
// src/locales/en.ts → family.members
jayarani: {
  name:       'Jayarani',              // displayed name
  relation:   'Mother',                // role inside her own family
  context:    "Arun's mother-in-law",  // link back to the poet's family
  occupation: 'Homemaker',             // optional — blank hides the line
},
```
```ts
// src/locales/ml.ts → family.members
jayarani: {
  name:       'ജയറാണി',
  relation:   'അമ്മ',
  context:    'അരുണിന്റെ ഭാര്യാമാതാവ്',
  occupation: 'വീട്ടമ്മ',
},
```

`context` and `occupation` both hide their line when set to an empty string.

> ℹ️ All `occupation` fields ship **blank** — real occupations were not known at
> build time and were deliberately not invented. Fill them in when you have them.

#### Adding a family member

**1.** Register the person in `src/data/family.ts`:

```ts
export const people = {
  // …
  newchild: { gender: 'female', photo: null },
};
```

**2.** Place them in the tree — either in the core line:

```ts
{
  key: 'grandchildren',
  units: [
    // …
    { primary: 'newchild', parentId: 'anoop' },
  ],
}
```

…or inside an in-law branch:

```ts
{
  key: 'vijilFamily',
  connectedTo: 'vijil',
  parents: ['das', 'vijaya'],
  siblings: [
    { primary: 'vipin', spouse: 'vipinwife', children: ['newchild'] },
  ],
}
```

**3.** Add `newchild: { name, relation, occupation }` to `family.members` in
**both** locale files. TypeScript will error if you forget one.

> In the in-law branches, write `relation` from the point of view of the person
> that branch belongs to — so in Shylaja's branch, her brother's daughter is
> `'Niece'`, not `'Wife's brother's daughter'`.

---

### Adding a third language

1. Copy `src/locales/en.ts` → `src/locales/hi.ts` and translate the values.
2. Register it in `src/locales/index.ts`:

```ts
import { hi } from './hi';

export type LanguageCode = 'en' | 'ml' | 'hi';
export const translations = { en, ml, hi };
export const languageOrder: LanguageCode[] = ['en', 'ml', 'hi'];
```

The toggle picks it up automatically — no component changes needed.

---

## Poems / YouTube Sync

The Poems section reads from **`public/data/poems.json`**, which is refreshed automatically.

**How it resolves, in order:**
1. `public/data/poems.json` — updated daily by GitHub Actions
2. The original repo's `poem-ids.json` on `feature_1` — remote fallback
3. A small hardcoded list baked into the bundle — last-resort fallback

So the section never renders empty, even offline or if a fetch fails.

**Run the sync manually:**
```bash
pip install yt-dlp
python scripts/update_poems.py
```

**Change the channel:** edit `CHANNEL_URL` at the top of `scripts/update_poems.py`.

### Upload dates

Each entry may carry an optional `publishedAt` field:

```json
{
  "poemSrc": "W_8etpfnaUk",
  "poemTitle": "മൃത്യഞ്ജയ ഹോമം (രുദ്ര രാമായണം ഭാഗം 24)",
  "publishedAt": "20240314"
}
```

- Format is `YYYYMMDD` (what yt-dlp returns) — ISO strings like `2024-03-14` also work.
- The sync script passes `--extractor-args youtubetab:approximate_date` to make YouTube
  return dates in flat-playlist mode. Note that these dates are **approximate** — that's a
  YouTube limitation, not a bug in the script.
- **The field is optional.** Entries without it simply render with no date badge, and are
  sorted to the end of the list. Nothing breaks.
- When dates are present, poems are automatically ordered **newest first**.

You can also add or correct a date by hand — just edit `public/data/poems.json`. Be aware
the daily workflow will overwrite manual edits on its next run.

---

## Deployment

### First-time setup — required, one time

> ⚠️ **The deploy workflow cannot do this for you.** `GITHUB_TOKEN` is not
> allowed to create a Pages site, so the first run will fail until you do this
> by hand. It only needs doing once.

**1. Enable Pages**

&nbsp;&nbsp;&nbsp;&nbsp;**Settings → Pages → Build and deployment → Source = `GitHub Actions`**

&nbsp;&nbsp;&nbsp;&nbsp;Not "Deploy from a branch". Save.

**2. Allow workflows to write**

&nbsp;&nbsp;&nbsp;&nbsp;**Settings → Actions → General → Workflow permissions → Read and write permissions**

&nbsp;&nbsp;&nbsp;&nbsp;Needed to publish Pages and to let the poem sync commit `poems.json`.

**3. Re-run the workflow** — Actions tab → the failed run → **Re-run all jobs**.

After this, every push to `main` rebuilds and redeploys automatically.

### If you can't change those settings

On org-owned repos those settings may be locked by an administrator. In that
case, deploy to a `gh-pages` branch instead — it needs only `contents: write`
and no Pages-via-Actions configuration:

```yaml
# Replace the "Setup Pages" / "Upload artifact" / deploy job with:
- name: Deploy to gh-pages branch
  uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

Then set **Settings → Pages → Source = Deploy from a branch → `gh-pages` / root**.

### Repo name / URL

`vite.config.ts` sets `base: '/rudranvariyath/'` to match the repo name.

- **Renaming the repo?** Update `base` to `'/<new-repo-name>/'`.
- **Using a custom domain or a `username.github.io` repo?** Set `base: '/'`.
- **Custom domain:** add it under **Settings → Pages → Custom domain**. GitHub creates the `CNAME` file for you — don't create one manually.

---

## GitHub Actions Workflows

Both live in `.github/workflows/`.

### `deploy.yml` — Build & Deploy

| | |
|---|---|
| **Triggers** | Push to `main`/`master`, PRs (build only), manual dispatch |
| **Steps** | Checkout → Node 24 → install → `tsc --noEmit` → `vite build` → add `.nojekyll` → upload → deploy |
| **Notes** | PRs are build-checked but never deployed. Falls back to `npm install` if there's no lockfile. Concurrency-guarded so deploys never overlap. Self-enables Pages via `enablement: true`. |

### `update-poems.yml` — Daily YouTube Sync

| | |
|---|---|
| **Triggers** | Daily at 00:30 UTC (06:00 IST), manual dispatch |
| **Steps** | Checkout → Python 3.12 → install `yt-dlp` → run `scripts/update_poems.py` → commit if changed |
| **Notes** | Commits only when the list actually changed. Refuses to overwrite with an empty list if YouTube errors. The commit triggers `deploy.yml`, so new poems go live automatically. |

Run either one manually from the **Actions** tab → select the workflow → **Run workflow**.

---

## What is and isn't committed

`.gitignore` keeps the repo clean. Highlights:

**Ignored (never pushed):**
```
node_modules/        Dependencies — reinstalled by CI
dist/                Build output — rebuilt by CI on every push
.env, *.pem, *.key   Secrets
*.log                Logs
.vite/, *.tsbuildinfo  Build caches
.DS_Store, Thumbs.db   OS junk
__pycache__/, .venv/   Python artifacts
.idea/, .vscode/*      Editor settings (except shared config)
coverage/, test-results/  Test output
```

**Committed (required):**
```
src/                 Source code
public/              Static assets + poems.json + .nojekyll + 404.html
scripts/             Python sync script
.github/workflows/   CI/CD definitions
package.json
package-lock.json    ← important, lets CI use `npm ci` for reproducible builds
tsconfig.json
vite.config.ts
index.html
```

> ⚠️ **Do not** add `package-lock.json` to `.gitignore`. The deploy workflow uses it for fast, reproducible installs.
>
> ⚠️ `dist/` is intentionally ignored — GitHub Actions builds it fresh. Committing it causes merge conflicts and stale deploys.

---

## Performance Notes

- **Single-file build** — JS + CSS inlined into one `index.html` (~140 KB gzipped), so there's one round trip.
- **Lazy images** — every `<img>` has `loading="lazy"` and `decoding="async"`.
- **Deferred sections** — content animates in via `IntersectionObserver` only when scrolled near.
- **Progressive lists** — Poems load 8 at a time, Gallery 12 at a time.
- **YouTube thumbnails** — lightweight `mqdefault.jpg` previews; the heavy iframe only mounts when a video is clicked.
- **Preconnect hints** — DNS/TLS warmed up for `raw.githubusercontent.com`, `img.youtube.com`, and Google Fonts.
- **Reduced motion** — animations disabled for users who request it.

---

## Troubleshooting

**Blank page after deploy**
`base` in `vite.config.ts` doesn't match the repo name. It must be `'/<repo-name>/'`.

**Images not loading**
They're pulled from the `feature_1` branch via `raw.githubusercontent.com`. Confirm that branch and the file paths still exist, or update `ASSETS` at the top of `src/data/content.ts`.

**Build fails: "Property 'xyz' is missing"**
A key exists in `en.ts` but not `ml.ts` (or vice versa). Add it to both — the error message names the exact key.

**Malayalam text shows boxes (▯▯▯)**
The Noto Sans Malayalam webfont didn't load. Check the Google Fonts `<link>` in `index.html` and your network connection.

**Poems section is empty**
Check `public/data/poems.json` exists and is valid JSON. Run the sync manually, or check the **Actions** tab for a failed `update-poems` run.

**`Get Pages site failed … Not Found`**
Pages has never been enabled on the repo. See
[First-time setup](#first-time-setup--required-one-time) — step 1.

**`Create Pages site failed … Resource not accessible by integration`**
The workflow tried to enable Pages itself and was refused — `GITHUB_TOKEN` cannot
create a Pages site. This is not fixable in YAML. Enable Pages manually
(step 1) and make sure workflow permissions are **Read and write** (step 2).

**`Node 20 is being deprecated. This workflow is running with Node 24 by default.`**
Informational, not an error — it is confirming you are *already* on Node 24.
Nothing to do. Do **not** set `ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true`;
that pins you *back* to the deprecated runtime.

---

## Credits

- **Poetry & content** — Rudran Variyath
- **Development** — Arun R Variyath
- **YouTube** — [@rudranvariyath7049](https://www.youtube.com/@rudranvariyath7049)
- **Email** — rudranvariyath.creative@gmail.com

© Rudran Variyath. All rights reserved.
