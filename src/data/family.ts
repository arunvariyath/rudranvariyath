/**
 * FAMILY TREE DATA
 * ---------------------------------------------------------------
 * Scope — the poet's family, one level into each marriage:
 *
 *   CORE LINE
 *     his parents → the poet & his wife → children (with their
 *     spouses) → grandchildren
 *
 *   RELATIVES BY MARRIAGE  (for each person who married in)
 *     their father & mother
 *     their siblings (with spouses)
 *     their siblings' children
 *
 *   NOT INCLUDED — anything past that level: in-laws' grandparents,
 *   aunts, uncles, cousins.
 *
 * TEXT (names, relations, occupations) lives in the locale files:
 *   src/locales/en.ts  →  family.members
 *   src/locales/ml.ts  →  family.members
 * matched to the `id` keys below.
 *
 * PHOTOS: drop an image into `public/images/family/` and set `photo`,
 * e.g.  photo: 'arun.webp'
 * Leave it `null` to show an initials placeholder instead.
 * ---------------------------------------------------------------
 */

export interface Person {
  gender: 'male' | 'female';
  /** Filename inside `public/images/family/`, or null for an initials placeholder. */
  photo: string | null;
  /** Highlights the poet's card. */
  isPoet?: boolean;
}

/** Every person in the tree. Keys match `family.members` in the locale files. */
export const people: Record<string, Person> = {
  // ── Core line ────────────────────────────────────────────────
  father: { gender: 'male', photo: null },
  mother: { gender: 'female', photo: null },
  poet: { gender: 'male', photo: null, isPoet: true },
  wife: { gender: 'female', photo: null },
  arun: { gender: 'male', photo: null },
  aparna: { gender: 'female', photo: null },
  anjitha: { gender: 'female', photo: null },
  vijil: { gender: 'male', photo: null },
  anoop: { gender: 'male', photo: null },
  adhisree: { gender: 'female', photo: null },
  rishikesh: { gender: 'male', photo: null },

  // ── Wife's family ────────────────────────────────────────────
  venugopalamenon: { gender: 'male', photo: null },
  nandini: { gender: 'female', photo: null },
  baburaj: { gender: 'male', photo: null },
  anuk: { gender: 'female', photo: null },
  anjana: { gender: 'female', photo: null },
  adhidev: { gender: 'male', photo: null },
  archana: { gender: 'female', photo: null },
  biju: { gender: 'male', photo: null },
  anilkumar: { gender: 'male', photo: null },
  keerthy: { gender: 'female', photo: null },
  anandhakrishnan: { gender: 'male', photo: null },
  aryanandha: { gender: 'female', photo: null },

  // ── Daughter-in-law's family ─────────────────────────────────
  mohandas: { gender: 'male', photo: null },
  jayarani: { gender: 'female', photo: null },

  // ── Son-in-law's family ──────────────────────────────────────
  das: { gender: 'male', photo: null },
  vijaya: { gender: 'female', photo: null },
  vipin: { gender: 'male', photo: null },
};

/** A person, optionally paired with their spouse. */
export interface Unit {
  primary: string;
  spouse?: string;
  /** Grandchildren only — used for the "Child of …" caption. */
  parentId?: string;
}

export interface CoreGeneration {
  key: 'elders' | 'poet' | 'children' | 'grandchildren';
  units: Unit[];
}

/** The direct line, top to bottom. */
export const coreGenerations: CoreGeneration[] = [
  {
    key: 'elders',
    units: [{ primary: 'father', spouse: 'mother' }],
  },
  {
    key: 'poet',
    units: [{ primary: 'poet', spouse: 'wife' }],
  },
  {
    key: 'children',
    units: [
      { primary: 'arun', spouse: 'aparna' },
      { primary: 'anjitha', spouse: 'vijil' },
      { primary: 'anoop' },
    ],
  },
  {
    key: 'grandchildren',
    units: [
      { primary: 'adhisree', parentId: 'arun' },
      { primary: 'rishikesh', parentId: 'anjitha' },
    ],
  },
];

export interface SiblingUnit extends Unit {
  children?: string[];
}

export interface Branch {
  key: string;
  /** The family member through whom this branch connects. */
  connectedTo: string;
  parents: string[];
  siblings: SiblingUnit[];
}

/**
 * One branch per person who married into the family.
 * Depth is capped at: parents, siblings (+ spouses), siblings' children.
 */
export const branches: Branch[] = [
  {
    key: 'wifeFamily',
    connectedTo: 'wife',
    parents: ['venugopalamenon', 'nandini'],
    siblings: [
      {
        primary: 'baburaj',
        spouse: 'anuk',
        children: ['anjana', 'adhidev', 'archana'],
      },
      { primary: 'biju' },
      {
        primary: 'anilkumar',
        spouse: 'keerthy',
        children: ['anandhakrishnan', 'aryanandha'],
      },
    ],
  },
  {
    key: 'aparnaFamily',
    connectedTo: 'aparna',
    parents: ['mohandas', 'jayarani'],
    siblings: [],
  },
  {
    key: 'vijilFamily',
    connectedTo: 'vijil',
    parents: ['das', 'vijaya'],
    siblings: [{ primary: 'vipin' }],
  },
];

/* ── Tree shapes (used by the "Tree" view) ─────────────────── */

export interface TreeNode {
  unit: Unit;
  children?: TreeNode[];
  /** Marks the person through whom a branch connects to the main family. */
  isConnector?: boolean;
}

/** The core line, as a nested tree. */
export const familyTree: TreeNode = {
  unit: { primary: 'father', spouse: 'mother' },
  children: [
    {
      unit: { primary: 'poet', spouse: 'wife' },
      children: [
        {
          unit: { primary: 'arun', spouse: 'aparna' },
          children: [{ unit: { primary: 'adhisree' } }],
        },
        {
          unit: { primary: 'anjitha', spouse: 'vijil' },
          children: [{ unit: { primary: 'rishikesh' } }],
        },
        { unit: { primary: 'anoop' } },
      ],
    },
  ],
};

/**
 * Turn an in-law branch into a tree. The connecting person is included
 * among their siblings and flagged, so it is obvious how the branch
 * attaches to the poet's family.
 */
export function branchToTree(branch: Branch): TreeNode {
  const siblingNodes: TreeNode[] = branch.siblings.map((sibling) => ({
    unit: { primary: sibling.primary, spouse: sibling.spouse },
    children: sibling.children?.map((child) => ({ unit: { primary: child } })),
  }));

  return {
    unit: { primary: branch.parents[0], spouse: branch.parents[1] },
    children: [
      { unit: { primary: branch.connectedTo }, isConnector: true },
      ...siblingNodes,
    ],
  };
}

/** Full URL for a family photo filename. */
export function familyPhotoUrl(photo: string): string {
  return `${import.meta.env.BASE_URL}images/family/${photo}`;
}

/** The poet's existing portrait, used until a dedicated photo is added. */
export const POET_FALLBACK_PHOTO =
  'https://raw.githubusercontent.com/arvapps-com/rudranvariyath/feature_1/assets/images/profile-img.webp';
