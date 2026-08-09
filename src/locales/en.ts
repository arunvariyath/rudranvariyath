/**
 * ENGLISH CONTENT FILE
 * ---------------------------------------------------------------
 * Edit any text below to change what appears on the English site.
 * Keep the keys (left side) untouched — only change the values.
 * ---------------------------------------------------------------
 */

export const en = {
  meta: {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    short: 'EN',
    htmlLang: 'en',
    documentTitle: 'Rudran Variyath - Malayalam Poet & Writer',
  },

  nav: {
    brand: 'Rudran Variyath',
    home: 'Home',
    about: 'About',
    poems: 'Poems',
    books: 'Books',
    awards: 'Awards',
    gallery: 'Gallery',
    family: 'Family',
    contact: 'Contact',
    switchLanguage: 'Switch language',
  },

  hero: {
    badge: 'Malayalam Poet & Writer',
    firstName: 'Rudran',
    lastName: 'Variyath',
    tagline:
      'Exploring the depths of human emotions through the beauty of Malayalam poetry. A journey through words, culture, and timeless expressions.',
    watchPoems: 'Watch Poems',
    learnMore: 'Learn More',
    scrollDown: 'Scroll down',
  },

  about: {
    badge: 'About the Poet',
    titlePrefix: 'Meet',
    titleHighlight: 'Rudran Variyath',
    role: 'Poet & Writer',
    name: 'Rudran Variyath',
    bio: 'Rudran Variyath was born to Aachattil Narayanan Nair and Variyath Seemanthini Nangyar in Veliyankode, Malappuram district. He went to Veliyancode Govt. School and then earned a degree in Economics from MES College Ponnani. He writes poetry for magazines and online publications. He is one of the caretakers of Maitri library which is located in Maranchery.',
    labels: {
      birthday: 'Birthday',
      location: 'Location',
      education: 'Education',
      age: 'Age',
    },
    values: {
      birthday: '1 Jun 1959',
      location: 'Malappuram, Kerala',
      education: 'B.A Economics',
      ageSuffix: 'years',
    },
    emailButton: 'Email',
    youtubeButton: 'YouTube',
  },

  poems: {
    badge: 'YouTube Channel',
    titlePrefix: 'Poetic',
    titleHighlight: 'Journey',
    description:
      'Experience the soulful recitation of poems on the official YouTube channel. Each video is a journey into the world of Malayalam poetry.',
    loading: 'Loading poems...',
    watchLabel: 'Watch',
    watchOnYoutube: 'Watch on YouTube',
    loadMore: 'Load More',
    remaining: 'remaining',
    publishedOn: 'Published on',
    totalCount: 'poems',
  },

  books: {
    badge: 'Published Works',
    titlePrefix: 'Books &',
    titleHighlight: 'Publications',
    description:
      'A collection of literary works that capture the essence of life, nature, and human emotions through Malayalam poetry.',
    items: {
      kavithakal: {
        title: 'Rudran Variyathinte Kavithakal',
        description:
          'A collection of poems by Rudran Variyath showcasing his poetic journey and literary excellence.',
      },
      ormacheppu: {
        title: 'Ormacheppu',
        description:
          'A beautiful collection of nostalgic poems that touch the heart and soul.',
      },
      nilav: {
        title: 'Nilav',
        description:
          'Poems inspired by the moonlight and the serene beauty of nature.',
      },
      naalamyamam: {
        title: 'Naalamyamam',
        description: 'A poetic exploration of time, life, and human emotions.',
      },
      kaliyugakazhchakal: {
        title: 'Kaliyugakazhchakal',
        description: 'Observations and reflections on modern life and times.',
      },
    } as Record<string, { title: string; description: string }>,
  },

  awards: {
    badge: 'Recognition',
    titlePrefix: 'Awards &',
    titleHighlight: 'Honors',
    description:
      'Celebrating the recognition and accolades received for contributions to Malayalam literature and poetry.',
    items: {
      bhashamalayalam: {
        title: 'Bhashamalayalam',
        description: 'Recognition from Bhashamalayalam for contributions to Malayalam literature.',
      },
      nirmalyam: {
        title: 'Nirmalyam',
        description: 'Award from Nirmalyam for poetic excellence.',
      },
      kppc: {
        title: 'KPPC',
        description: 'Kerala Pradesh Poetry Council recognition.',
      },
      kavyatheeram: {
        title: 'Kavyatheeram',
        description: 'Kavyatheeram poetry award for outstanding contribution.',
      },
      panchayath: {
        title: 'Panchayath',
        description: 'Recognition from local Panchayath for literary contributions.',
      },
      nalanda: {
        title: 'Nalanda',
        description: 'Nalanda literary award for poetry.',
      },
      redpower: {
        title: 'Red Power',
        description: 'Red Power magazine recognition.',
      },
      qatarvelicham: {
        title: 'Qatar Velicham',
        description: 'Recognition from Qatar Velicham publication.',
      },
      districtpanchayath: {
        title: 'District Panchayath',
        description: 'Award from District Panchayath Malappuram.',
      },
      redrose: {
        title: 'Red Rose',
        description: 'Red Rose literary award.',
      },
      bharatsevaksamaj: {
        title: 'Bharat Sevak Samaj',
        description: 'Recognition from Bharat Sevak Samaj.',
      },
      vayalar: {
        title: 'Vayalar Kala Samskarika Vedi',
        description: 'Award from Vayalar Kala Samskarika Vedi.',
      },
    } as Record<string, { title: string; description: string }>,
  },

  gallery: {
    badge: 'Memories',
    titlePrefix: 'Photo',
    titleHighlight: 'Gallery',
    description:
      'A visual journey through moments, events, and cherished memories captured in time.',
    imageAlt: 'Gallery image',
    loadMore: 'Load More',
    remaining: 'remaining',
  },

  family: {
    badge: 'Family',
    titlePrefix: 'The',
    titleHighlight: 'Variyath',
    titleSuffix: 'Family',
    description:
      'Four generations of a family rooted in Veliyancode — the people closest to the poet.',
    generations: {
      elders: 'Parents',
      poet: 'The Poet',
      children: 'Children',
      grandchildren: 'Grandchildren',
    },
    childOf: 'Child of',
    extendedTitle: 'Relatives by Marriage',
    extendedSubtitle: 'Parents and siblings of those who married into the family',
    parentsLabel: 'Parents',
    siblingsLabel: 'Siblings',
    show: 'Show',
    hide: 'Hide',
    viewTree: 'Tree',
    viewCards: 'Cards',
    connectedVia: 'Connected through',
    viewInTree: 'View in family tree',
    /** Branch headings — one per person who married into the family. */
    branches: {
      wifeFamily: "Shylaja's Family",
      aparnaFamily: "Aparna's Family",
      vijilFamily: "Vijil's Family",
    } as Record<string, string>,
    /**
     * `occupation` is optional — leave it as an empty string to hide the line.
     * Examples: 'Software Engineer', 'Homemaker', 'Student', 'Teacher'
     *
     * In the "Relatives by Marriage" branches, `relation` is written from the
     * point of view of the person that branch belongs to.
     */
    members: {
      // ── Core line ──────────────────────────────────────────
      father: { name: 'Aachattil Narayanan Nair', relation: 'Father', context: "Rudran's father", occupation: '' },
      mother: { name: 'Variyath Seemanthini Nangyar', relation: 'Mother', context: "Rudran's mother", occupation: '' },
      poet: { name: 'Rudran Variyath', relation: 'Poet & Writer', context: '', occupation: '' },
      wife: { name: 'Shylaja M N', relation: 'Wife', context: "Rudran's wife", occupation: '' },
      arun: { name: 'Arun R Variyath', relation: 'Son', context: "Rudran's eldest son", occupation: '' },
      aparna: { name: 'Aparna', relation: 'Daughter-in-law', context: "Arun's wife", occupation: '' },
      anjitha: { name: 'Anjitha R Variyath', relation: 'Daughter', context: "Rudran's daughter", occupation: '' },
      vijil: { name: 'Vijil', relation: 'Son-in-law', context: "Anjitha's husband", occupation: '' },
      anoop: { name: 'Anoop R Variyath', relation: 'Son', context: "Rudran's son", occupation: '' },
      adhisree: { name: 'Adhisree A V', relation: 'Granddaughter', context: "Arun & Aparna's daughter", occupation: '' },
      rishikesh: { name: 'Rishikesh', relation: 'Grandson', context: "Anjitha & Vijil's son", occupation: '' },

      // ── Shylaja's family (the poet's wife) ─────────────────
      venugopalamenon: { name: 'Venugopala Menon', relation: 'Father', context: "Rudran's father-in-law", occupation: '' },
      nandini: { name: 'Nandini', relation: 'Mother', context: "Rudran's mother-in-law", occupation: '' },
      baburaj: { name: 'Baburaj', relation: 'Brother', context: "Shylaja's brother", occupation: '' },
      anuk: { name: 'Anu K', relation: "Brother's wife", context: "Baburaj's wife", occupation: '' },
      anjana: { name: 'Anjana', relation: 'Niece', context: "Baburaj & Anu's daughter", occupation: '' },
      adhidev: { name: 'Adhidev', relation: 'Nephew', context: "Baburaj & Anu's son", occupation: '' },
      archana: { name: 'Archana', relation: 'Niece', context: "Baburaj & Anu's daughter", occupation: '' },
      biju: { name: 'Biju M', relation: 'Brother', context: "Shylaja's brother", occupation: '' },
      anilkumar: { name: 'Anilkumar M', relation: 'Brother', context: "Shylaja's brother", occupation: '' },
      keerthy: { name: 'Keerthy V', relation: "Brother's wife", context: "Anilkumar's wife", occupation: '' },
      anandhakrishnan: { name: 'Anandhakrishnan', relation: 'Nephew', context: "Anilkumar & Keerthy's son", occupation: '' },
      aryanandha: { name: 'Aryanandha', relation: 'Niece', context: "Anilkumar & Keerthy's daughter", occupation: '' },

      // ── Aparna's family (Arun's wife) ──────────────────────
      mohandas: { name: 'Mohandas', relation: 'Father', context: "Arun's father-in-law", occupation: '' },
      jayarani: { name: 'Jayarani', relation: 'Mother', context: "Arun's mother-in-law", occupation: '' },

      // ── Vijil's family (Anjitha's husband) ─────────────────
      das: { name: 'Das', relation: 'Father', context: "Anjitha's father-in-law", occupation: '' },
      vijaya: { name: 'Vijaya', relation: 'Mother', context: "Anjitha's mother-in-law", occupation: '' },
      vipin: { name: 'Vipin', relation: 'Brother', context: "Vijil's brother", occupation: '' },
    } as Record<
      string,
      { name: string; relation: string; context: string; occupation: string }
    >,
  },

  contact: {
    badge: 'Get in Touch',
    titlePrefix: 'Contact',
    titleHighlight: 'Us',
    description:
      'Have a question or want to collaborate? Feel free to reach out through any of the channels below.',
    addressLabel: 'Address',
    addressValue:
      'Variyath House, Post Pazhanji, Veliyancode, Malappuram(DT), Kerala',
    emailLabel: 'Email',
    youtubeLabel: 'YouTube',
    youtubeValue: 'Rudran Variyath',
    ctaTitle: 'Prefer to send an email?',
    ctaText: 'Reach out directly at',
  },

  footer: {
    tagline:
      'Malayalam poet and writer sharing the beauty of language through poetry and literature.',
    quickLinks: 'Quick Links',
    navigation: 'Navigation',
    backToTop: 'Back to Top',
    rights: 'All rights reserved.',
    madeWith: 'Made with',
    by: 'by',
    developer: 'Arun R Variyath',
  },

  common: {
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
    loading: 'Loading...',
  },
};

export type Translation = typeof en;
