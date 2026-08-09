/**
 * LANGUAGE-INDEPENDENT DATA
 * ---------------------------------------------------------------
 * Only images / links / structure live here.
 * All *text* lives in `src/locales/en.ts` and `src/locales/ml.ts`
 * and is matched to these entries using the `key` / `id` field.
 * ---------------------------------------------------------------
 */
import { features } from '../config/features';

const ASSETS =
  'https://raw.githubusercontent.com/arvapps-com/rudranvariyath/feature_1/assets/images';

/** Links & values that are identical in every language. */
export const poetLinks = {
  youtubeUrl: 'https://www.youtube.com/@rudranvariyath7049',
  email: 'rudranvariyath.creative@gmail.com',
  birthDate: '1959-06-01',
  profileImage: `${ASSETS}/profile-img.webp`,
  heroImage: `${ASSETS}/hero-bg.webp`,

  /**
   * Poem sources, tried in order.
   * 1. Local file — refreshed daily by .github/workflows/update-poems.yml
   * 2. Remote fallback — the original repo's list, in case the local one is missing
   */
  poemSources: [
    `${import.meta.env.BASE_URL}data/poems.json`,
    'https://raw.githubusercontent.com/arvapps-com/rudranvariyath/feature_1/assets/javascripts/poem-ids.json',
  ],
};

/** Books — `key` maps to `locales/*.ts -> books.items[key]` */
export const books = [
  { key: 'kavithakal', imageSrc: `${ASSETS}/books/Rudran_variyathinte_kavithakal.webp` },
  { key: 'ormacheppu', imageSrc: `${ASSETS}/books/Ormacheppu.webp` },
  { key: 'nilav', imageSrc: `${ASSETS}/books/Nilav.webp` },
  { key: 'naalamyamam', imageSrc: `${ASSETS}/books/naalam_yamam.webp` },
  { key: 'kaliyugakazhchakal', imageSrc: `${ASSETS}/books/kaliyugakazhchakal.webp` },
];

/** Awards — `key` maps to `locales/*.ts -> awards.items[key]` */
export const awards = [
  { key: 'bhashamalayalam', imageSrc: `${ASSETS}/awards/awards_1.webp` },
  { key: 'nirmalyam', imageSrc: `${ASSETS}/awards/awards_2.webp` },
  { key: 'kppc', imageSrc: `${ASSETS}/awards/awards_3.webp` },
  { key: 'kavyatheeram', imageSrc: `${ASSETS}/awards/awards_4.webp` },
  { key: 'panchayath', imageSrc: `${ASSETS}/awards/awards_5.webp` },
  { key: 'nalanda', imageSrc: `${ASSETS}/awards/awards_6.webp` },
  { key: 'redpower', imageSrc: `${ASSETS}/awards/awards_7.webp` },
  { key: 'qatarvelicham', imageSrc: `${ASSETS}/awards/awards_8.webp` },
  { key: 'districtpanchayath', imageSrc: `${ASSETS}/awards/awards_9.webp` },
  { key: 'redrose', imageSrc: `${ASSETS}/awards/awards_10.webp` },
  { key: 'bharatsevaksamaj', imageSrc: `${ASSETS}/awards/awards_11.webp` },
  { key: 'vayalar', imageSrc: `${ASSETS}/awards/awards_12.webp` },
];

/** Gallery — add/remove numbers here when photos change. */
export const galleryImages = Array.from({ length: 33 }, (_, i) => ({
  imageSrc: `${ASSETS}/gallery/gallery_${String(i + 1).padStart(2, '0')}.webp`,
}));

/**
 * Family lineage now lives in `src/data/family.ts` — it is scoped to the
 * poet's direct line (parents → poet & wife → children → grandchildren).
 */

/** Section ids used by the navigation — labels come from locales. */
const allSections = [
  { id: 'home', key: 'home' },
  { id: 'about', key: 'about' },
  { id: 'poems', key: 'poems' },
  { id: 'books', key: 'books' },
  { id: 'awards', key: 'awards' },
  { id: 'gallery', key: 'gallery' },
  { id: 'family', key: 'family' },
  { id: 'contact', key: 'contact' },
] as const;

/**
 * Sections actually rendered, after applying feature flags.
 * Toggle a section in `src/config/features.ts` and it disappears from
 * the navbar, the mobile menu and the footer links automatically.
 */
export const navSections = allSections.filter(
  (section) => section.id !== 'family' || features.familyTree
);
