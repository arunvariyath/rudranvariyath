# Family Photos

Drop family portrait images into this folder, then reference the filename in
`src/data/family.ts`.

## How to add a photo

1. Save the image here, e.g. `arun.webp`
2. Open `src/data/family.ts` and set the `photo` field:

```ts
{ id: 'arun', generation: 'children', gender: 'male', photo: 'arun.webp' },
```

That's it. If `photo` is `null`, an elegant initials placeholder is shown instead,
so the page always looks intentional even before photos are added.

## Recommended format

| | |
|---|---|
| **Format** | `.webp` (best compression) — `.jpg` / `.png` also work |
| **Dimensions** | Square, 400×400 px is plenty |
| **Crop** | Head and shoulders, centred — images render inside a circle |
| **File size** | Under 100 KB each |

## Converting to WebP

```bash
# Single file
cwebp -q 82 -resize 400 400 photo.jpg -o arun.webp

# Or with ImageMagick
magick photo.jpg -resize 400x400^ -gravity center -extent 400x400 -quality 82 arun.webp
```

If a referenced file is missing or fails to load, the component automatically
falls back to initials — a broken image will never appear on the site.
