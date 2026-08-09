/**
 * FEATURE FLAGS
 * ---------------------------------------------------------------
 * Flip a flag to `true` to show that section, `false` to hide it.
 * Hidden sections are removed from the navigation and the footer
 * links automatically — no other file needs editing.
 * ---------------------------------------------------------------
 */
export const features = {
  /**
   * Family section (Tree / Cards views).
   *
   * Set to `false` to hide it from the page, the navbar, the mobile
   * menu and the footer links in one go.
   *
   * Photos go in `public/images/family/`; names, relations and
   * occupations live in the `family.members` block of the locale files.
   */
  familyTree: true,
} as const;
