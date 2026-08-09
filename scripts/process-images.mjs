#!/usr/bin/env node
/**
 * IMAGE PIPELINE
 * ---------------------------------------------------------------
 * Scans `public/images/<category>/`, produces optimised derivatives,
 * and writes a manifest the website reads at runtime.
 *
 * Drop any image (.jpg .jpeg .png .webp, any size) into a category
 * folder and run this — links, dimensions and thumbnails all update
 * on their own. Nothing in `src/` needs editing.
 *
 *   node scripts/process-images.mjs              # process new/changed files
 *   node scripts/process-images.mjs --force      # re-encode everything
 *   node scripts/process-images.mjs --replace    # also shrink the originals
 *   node scripts/process-images.mjs --dry-run    # report only, write nothing
 *
 * Requires sharp:  npm install --no-save sharp
 * ---------------------------------------------------------------
 */

import { readdir, mkdir, writeFile, readFile, stat, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error(
    '\n  sharp is not installed.\n\n' +
      '    npm install --no-save sharp\n\n' +
      '  then run this script again.\n'
  );
  process.exit(1);
}

/* ── Settings ──────────────────────────────────────────────── */

const ROOT = process.cwd();
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const MANIFEST_PATH = path.join(ROOT, 'public', 'data', 'media.json');
const CACHE_PATH = path.join(IMAGES_DIR, '.cache.json');

/** Folders that are scanned. Add one here and it is picked up. */
const CATEGORIES = ['gallery', 'books', 'awards', 'family'];

/** Sub-folder holding generated files. Never edit these by hand. */
const OUT_DIR = '_opt';

const FULL_MAX_WIDTH = 1600; // lightbox / full view
const FULL_QUALITY = 80;
const THUMB_MAX_WIDTH = 640; // grid view
const THUMB_QUALITY = 72;
const BLUR_WIDTH = 14; // inline base64 placeholder

const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const REPLACE = args.has('--replace');
const DRY_RUN = args.has('--dry-run');

/* ── Helpers ───────────────────────────────────────────────── */

const bytes = (n) =>
  n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${Math.round(n / 1024)} KB`;

/**
 * `Rudran_Variyathinte Kavithakal.webp` → `rudran-variyathinte-kavithakal`
 * This is the key used to look up title/description in the locale files.
 */
function toKey(filename) {
  return path
    .basename(filename, path.extname(filename))
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Fallback title when a key has no locale entry yet. */
function humanise(filename) {
  return path
    .basename(filename, path.extname(filename))
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function readCache() {
  if (FORCE || !existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(await readFile(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

/* ── Per-image processing ──────────────────────────────────── */

async function processImage(category, filename, cache) {
  const sourcePath = path.join(IMAGES_DIR, category, filename);
  const outDir = path.join(IMAGES_DIR, category, OUT_DIR);
  const key = toKey(filename);

  const fullName = `${key}.webp`;
  const thumbName = `${key}.thumb.webp`;
  const fullPath = path.join(outDir, fullName);
  const thumbPath = path.join(outDir, thumbName);

  const info = await stat(sourcePath);
  const cacheKey = `${category}/${filename}`;
  const fingerprint = `${info.size}:${Math.floor(info.mtimeMs)}`;

  // Reuse cached output when the source is unchanged and derivatives exist.
  const cached = cache[cacheKey];
  const upToDate =
    cached &&
    cached.fingerprint === fingerprint &&
    existsSync(fullPath) &&
    existsSync(thumbPath);

  if (upToDate) {
    return { entry: cached.entry, cacheEntry: cached, skipped: true };
  }

  const image = sharp(sourcePath, { failOn: 'none' });
  const meta = await image.metadata();
  const srcWidth = meta.width ?? FULL_MAX_WIDTH;
  const srcHeight = meta.height ?? FULL_MAX_WIDTH;

  if (DRY_RUN) {
    console.log(`  would process  ${category}/${filename}  (${bytes(info.size)})`);
    return null;
  }

  await mkdir(outDir, { recursive: true });

  // Full-size derivative — never upscaled.
  const fullBuffer = await sharp(sourcePath, { failOn: 'none' })
    .rotate() // honour EXIF orientation
    .resize({ width: FULL_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: FULL_QUALITY })
    .toBuffer();
  await writeFile(fullPath, fullBuffer);

  const fullMeta = await sharp(fullBuffer).metadata();

  // Grid thumbnail.
  await sharp(sourcePath, { failOn: 'none' })
    .rotate()
    .resize({ width: THUMB_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: THUMB_QUALITY })
    .toFile(thumbPath);

  // Tiny inline placeholder shown while the real image loads.
  const blurBuffer = await sharp(sourcePath, { failOn: 'none' })
    .rotate()
    .resize({ width: BLUR_WIDTH })
    .webp({ quality: 25 })
    .toBuffer();
  const blur = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  // Optionally shrink the original in place to keep the repo small.
  if (REPLACE && fullBuffer.length < info.size) {
    const replacement = path.join(
      IMAGES_DIR,
      category,
      `${path.basename(filename, path.extname(filename))}.webp`
    );
    await writeFile(replacement, fullBuffer);
    if (replacement !== sourcePath) {
      console.log(`    replaced original → ${path.basename(replacement)}`);
    }
  }

  const width = fullMeta.width ?? srcWidth;
  const height = fullMeta.height ?? srcHeight;

  const entry = {
    key,
    title: humanise(filename),
    src: `images/${category}/${OUT_DIR}/${fullName}`,
    thumb: `images/${category}/${OUT_DIR}/${thumbName}`,
    width,
    height,
    aspectRatio: Number((width / height).toFixed(4)),
    blur,
  };

  const saved = info.size - fullBuffer.length;
  console.log(
    `  ${category}/${filename}  ${bytes(info.size)} → ${bytes(fullBuffer.length)}` +
      (saved > 0 ? `  (−${Math.round((saved / info.size) * 100)}%)` : '')
  );

  return { entry, cacheEntry: { fingerprint, entry }, skipped: false };
}

/* ── Category scan ─────────────────────────────────────────── */

async function processCategory(category, cache, nextCache) {
  const dir = path.join(IMAGES_DIR, category);
  if (!existsSync(dir)) return [];

  const files = (await readdir(dir, { withFileTypes: true }))
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => SOURCE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .filter((name) => !name.startsWith('.'))
    // Natural sort so gallery_2 comes before gallery_10.
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  if (files.length === 0) return [];

  console.log(`\n${category}  (${files.length} file${files.length === 1 ? '' : 's'})`);

  const entries = [];
  let reused = 0;

  for (const file of files) {
    try {
      const result = await processImage(category, file, cache);
      if (!result) continue;
      entries.push(result.entry);
      nextCache[`${category}/${file}`] = result.cacheEntry;
      if (result.skipped) reused++;
    } catch (error) {
      console.warn(`  !  skipped ${file} — ${error.message}`);
    }
  }

  if (reused > 0) console.log(`  ${reused} unchanged, reused from cache`);
  return entries;
}

/* ── Entry point ───────────────────────────────────────────── */

async function main() {
  if (!existsSync(IMAGES_DIR)) {
    console.error(`\n  No image folder found at public/images/\n`);
    process.exit(1);
  }

  console.log(
    `Processing images${FORCE ? ' (forced)' : ''}${REPLACE ? ' (replacing originals)' : ''}${
      DRY_RUN ? ' (dry run)' : ''
    }`
  );

  const cache = await readCache();
  const nextCache = {};
  const manifest = {
    generatedAt: new Date().toISOString(),
    categories: {},
  };

  for (const category of CATEGORIES) {
    manifest.categories[category] = await processCategory(category, cache, nextCache);
  }

  if (DRY_RUN) {
    console.log('\nDry run — nothing written.\n');
    return;
  }

  const total = Object.values(manifest.categories).reduce((n, list) => n + list.length, 0);
  if (total === 0) {
    console.log('\nNo images found. Manifest not written.\n');
    return;
  }

  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(CACHE_PATH, `${JSON.stringify(nextCache, null, 2)}\n`);

  console.log(`\nWrote ${total} entries to public/data/media.json\n`);

  // Flag images that have no matching text in the locale files.
  for (const category of ['books', 'awards']) {
    const keys = manifest.categories[category]?.map((e) => e.key) ?? [];
    if (keys.length) {
      console.log(`${category} keys → ${keys.join(', ')}`);
    }
  }
  console.log(
    '\nAdd matching entries under `%s.items` in src/locales/en.ts and ml.ts\n' +
      'for any key above that is new. Unmatched keys fall back to the filename.\n',
    'books/awards'
  );
}

await main();
