export interface Poem {
  poemSrc: string;
  poemTitle: string;
  /** `YYYYMMDD` (from yt-dlp) or an ISO date string. Optional — UI hides it when absent. */
  publishedAt?: string;
  /**
   * `false` when YouTube refuses embedding (private / disabled by owner).
   * Those videos skip the in-page modal and open on youtube.com instead.
   */
  embeddable?: boolean;
}

/** Language-independent item — text is resolved from locale files via `key`. */
export interface MediaItem {
  key: string;
  imageSrc: string;
}

export interface GalleryImage {
  imageSrc: string;
}

// Family types live in `src/data/family.ts`, colocated with the data.
