/**
 * Soul Signature System — Data & Catalog
 * Authentic multi-language song database & initial friend soul signatures
 */

export const INITIAL_SOUL_SIGNATURES = [
  {
    id: 'user-self',
    userId: 1,
    name: 'Your Soul',
    username: 'christon',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    isSelf: true,
    shapeIndex: 0,
    note: 'Vibrating at 528Hz ✨',
    noteTimestamp: 'Just now',
    frequency: '99%',
    vibeTag: 'Deep Focus',
    reactionsCount: 14,
    music: {
      id: 'eng-1',
      title: 'Golden Hour',
      artist: 'JVKE',
      lang: 'English',
      category: 'Trending',
      artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
      duration: '3:29',
      bpm: 94,
      scale: 'major'
    }
  },
  {
    id: 'user-megha',
    userId: 2,
    name: 'Megha',
    username: 'megha_official',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
    isSelf: false,
    shapeIndex: 1,
    note: 'Varkala cliff sunset 🌅',
    noteTimestamp: '18m ago',
    frequency: '98%',
    vibeTag: 'Coastal Peace',
    reactionsCount: 42,
    music: {
      id: 'mal-1',
      title: 'Aaradhike',
      artist: 'Sushin Shyam, Sooraj',
      lang: 'Malayalam',
      category: 'Soulful',
      artwork: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=80',
      duration: '4:12',
      bpm: 82,
      scale: 'pentatonic'
    }
  },
  {
    id: 'user-arjun',
    userId: 3,
    name: 'Arjun',
    username: 'arjun_v',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    isSelf: false,
    shapeIndex: 2,
    note: 'Pine mist & silence 🌲',
    noteTimestamp: '45m ago',
    frequency: '94%',
    vibeTag: 'Mountain Trek',
    reactionsCount: 28,
    music: {
      id: 'hin-1',
      title: 'Tum Se Hi',
      artist: 'Mohit Chauhan, Pritam',
      lang: 'Hindi',
      category: 'Romantic',
      artwork: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=150&auto=format&fit=crop&q=80',
      duration: '5:23',
      bpm: 78,
      scale: 'acoustic'
    }
  },
  {
    id: 'user-sahana',
    userId: 4,
    name: 'Sahana',
    username: 'sahana_m',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    isSelf: false,
    shapeIndex: 0,
    note: 'Ocean breeze in Goa 🌊',
    noteTimestamp: '1h ago',
    frequency: '91%',
    vibeTag: 'Ocean Calm',
    reactionsCount: 35,
    music: {
      id: 'tam-1',
      title: 'Naan Pizhai',
      artist: 'Anirudh Ravichander',
      lang: 'Tamil',
      category: 'Melodic',
      artwork: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=150&auto=format&fit=crop&q=80',
      duration: '4:02',
      bpm: 88,
      scale: 'melodic'
    }
  },
  {
    id: 'user-vikram',
    userId: 5,
    name: 'Vikram',
    username: 'vikram_r',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    isSelf: false,
    shapeIndex: 1,
    note: 'Acoustic jam till 3am 🎸',
    noteTimestamp: '2h ago',
    frequency: '89%',
    vibeTag: 'Midnight Jam',
    reactionsCount: 19,
    music: {
      id: 'mal-2',
      title: 'Katha Parayave',
      artist: 'Job Kurian',
      lang: 'Malayalam',
      category: 'Acoustic',
      artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
      duration: '3:45',
      bpm: 74,
      scale: 'folk'
    }
  },
  {
    id: 'user-priya',
    userId: 6,
    name: 'Priya',
    username: 'priya_arts',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    isSelf: false,
    shapeIndex: 2,
    note: 'Neon palette dreams 🎨',
    noteTimestamp: '3h ago',
    frequency: '93%',
    vibeTag: 'Creative Flow',
    reactionsCount: 51,
    music: {
      id: 'eng-2',
      title: 'Midnight City',
      artist: 'M83',
      lang: 'English',
      category: 'Synthwave',
      artwork: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150&auto=format&fit=crop&q=80',
      duration: '4:04',
      bpm: 105,
      scale: 'synth'
    }
  },
  {
    id: 'user-karthik',
    userId: 7,
    name: 'Karthik',
    username: 'karthik_lens',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    isSelf: false,
    shapeIndex: 0,
    note: 'Into wild Wayanad 🍃',
    noteTimestamp: '4h ago',
    frequency: '87%',
    vibeTag: 'Wilderness',
    reactionsCount: 22,
    music: null
  }
];

export const SOUL_MUSIC_CATALOG = [
  // Tamil
  {
    id: 'tam-1',
    title: 'Naan Pizhai',
    artist: 'Anirudh Ravichander, Ravi G',
    lang: 'Tamil',
    category: 'Melodic',
    artwork: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=150&auto=format&fit=crop&q=80',
    duration: '4:02',
    isTrending: true,
    scale: 'melodic'
  },
  {
    id: 'tam-2',
    title: 'Kanave Kanave',
    artist: 'Anirudh Ravichander',
    lang: 'Tamil',
    category: 'Soulful',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
    duration: '4:45',
    isTrending: false,
    scale: 'acoustic'
  },
  {
    id: 'tam-3',
    title: 'Hukum (Thalaivar Alappara)',
    artist: 'Anirudh Ravichander',
    lang: 'Tamil',
    category: 'Energy',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80',
    duration: '3:28',
    isTrending: true,
    scale: 'synth'
  },
  {
    id: 'tam-4',
    title: 'Marakkuma Nenjam',
    artist: 'A.R. Rahman',
    lang: 'Tamil',
    category: 'Soulful',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    duration: '4:16',
    isTrending: true,
    scale: 'pentatonic'
  },

  // English
  {
    id: 'eng-1',
    title: 'Golden Hour',
    artist: 'JVKE',
    lang: 'English',
    category: 'Trending',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
    duration: '3:29',
    isTrending: true,
    scale: 'major'
  },
  {
    id: 'eng-2',
    title: 'Midnight City',
    artist: 'M83',
    lang: 'English',
    category: 'Synthwave',
    artwork: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150&auto=format&fit=crop&q=80',
    duration: '4:04',
    isTrending: true,
    scale: 'synth'
  },
  {
    id: 'eng-3',
    title: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    lang: 'English',
    category: 'R&B / Synth',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80',
    duration: '3:50',
    isTrending: false,
    scale: 'pulse'
  },
  {
    id: 'eng-4',
    title: 'As It Was',
    artist: 'Harry Styles',
    lang: 'English',
    category: 'Indie Pop',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&auto=format&fit=crop&q=80',
    duration: '2:47',
    isTrending: false,
    scale: 'major'
  },

  // Hindi
  {
    id: 'hin-1',
    title: 'Tum Se Hi',
    artist: 'Mohit Chauhan, Pritam',
    lang: 'Hindi',
    category: 'Romantic',
    artwork: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=150&auto=format&fit=crop&q=80',
    duration: '5:23',
    isTrending: true,
    scale: 'acoustic'
  },
  {
    id: 'hin-2',
    title: 'Apna Bana Le',
    artist: 'Arijit Singh, Sachin-Jigar',
    lang: 'Hindi',
    category: 'Soulful',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
    duration: '4:21',
    isTrending: true,
    scale: 'melodic'
  },
  {
    id: 'hin-3',
    title: 'Kesariya',
    artist: 'Arijit Singh, Pritam',
    lang: 'Hindi',
    category: 'Romantic',
    artwork: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=80',
    duration: '4:28',
    isTrending: false,
    scale: 'major'
  },
  {
    id: 'hin-4',
    title: 'Kun Faya Kun',
    artist: 'A.R. Rahman, Mohit Chauhan',
    lang: 'Hindi',
    category: 'Sufi Resonance',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    duration: '7:52',
    isTrending: true,
    scale: 'pentatonic'
  },

  // Malayalam
  {
    id: 'mal-1',
    title: 'Aaradhike',
    artist: 'Sushin Shyam, Sooraj Santhosh',
    lang: 'Malayalam',
    category: 'Soulful',
    artwork: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=80',
    duration: '4:12',
    isTrending: true,
    scale: 'pentatonic'
  },
  {
    id: 'mal-2',
    title: 'Katha Parayave',
    artist: 'Job Kurian',
    lang: 'Malayalam',
    category: 'Acoustic',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    duration: '3:45',
    isTrending: false,
    scale: 'folk'
  },
  {
    id: 'mal-3',
    title: 'Cherathukal',
    artist: 'Sushin Shyam, Sithara',
    lang: 'Malayalam',
    category: 'Ethereal',
    artwork: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=150&auto=format&fit=crop&q=80',
    duration: '3:38',
    isTrending: true,
    scale: 'acoustic'
  },
  {
    id: 'mal-4',
    title: 'Neela Nilave',
    artist: 'Kapil Kapilan, Jakes Bejoy',
    lang: 'Malayalam',
    category: 'Euphoric',
    artwork: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=150&auto=format&fit=crop&q=80',
    duration: '4:19',
    isTrending: true,
    scale: 'pulse'
  },

  // Telugu
  {
    id: 'tel-1',
    title: 'Samayama',
    artist: 'Hesham Abdul Wahab, Anurag',
    lang: 'Telugu',
    category: 'Romantic',
    artwork: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=80',
    duration: '3:50',
    isTrending: true,
    scale: 'pulse'
  },
  {
    id: 'tel-2',
    title: 'Butta Bomma',
    artist: 'Armaan Malik, Thaman S',
    lang: 'Telugu',
    category: 'Groove',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80',
    duration: '3:18',
    isTrending: false,
    scale: 'major'
  },
  {
    id: 'tel-3',
    title: 'Inkem Inkem Inkem Kaavaale',
    artist: 'Sid Sriram, Gopi Sundar',
    lang: 'Telugu',
    category: 'Melodic',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
    duration: '4:27',
    isTrending: true,
    scale: 'melodic'
  },

  // Kannada
  {
    id: 'kan-1',
    title: 'Belakina Kavithe',
    artist: 'Sanjith Hegde, Charan Raj',
    lang: 'Kannada',
    category: 'Soulful',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    duration: '4:15',
    isTrending: true,
    scale: 'acoustic'
  },
  {
    id: 'kan-2',
    title: 'Singara Siriye',
    artist: 'Vijay Prakash, Ajaneesh Loknath',
    lang: 'Kannada',
    category: 'Folk Resonance',
    artwork: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=150&auto=format&fit=crop&q=80',
    duration: '4:42',
    isTrending: true,
    scale: 'folk'
  },
  {
    id: 'kan-3',
    title: 'Neene Modalu',
    artist: 'Armaan Malik, Arjun Janya',
    lang: 'Kannada',
    category: 'Romantic',
    artwork: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=150&auto=format&fit=crop&q=80',
    duration: '3:34',
    isTrending: false,
    scale: 'melodic'
  }
];

export const MUSIC_CATEGORIES = [
  'All',
  'Trending 🔥',
  'Recent ⏱️',
  'Tamil 🪕',
  'English 🎧',
  'Hindi 🎵',
  'Malayalam 🌴',
  'Telugu 🎶',
  'Kannada 🌿'
];

/**
 * Organic Liquid Soul Signature Templates — Modeled with fidelity to PRIMARY REFERENCE 1:
 * - Soaring asymmetric fluid wave crest
 * - Deep organic valley dip
 * - Expansive outward liquid-glass loop
 * - Layered double-walled translucent glass envelope
 * - Electric soul filaments / tendrils
 * - Brilliant 4-pointed diamond star sparkle jewels
 * Strictly NOT circles, rounded squares, or standard geometric avatars.
 */
export const SIGNATURE_TEMPLATES = [
  {
    // Template 0: Harmonic Wave Crest (Primary Reference Image 1)
    outerRibbon: 'M 78,8 C 96,12 110,28 108,52 C 106,72 98,92 82,102 C 68,112 46,114 32,104 C 14,94 8,76 12,54 C 16,36 28,26 44,24 C 54,24 60,18 68,10 C 72,6 76,6 78,8 Z',
    innerRibbon: 'M 74,16 C 88,20 98,34 96,54 C 94,72 86,88 72,96 C 58,104 42,102 32,94 C 20,84 18,70 20,56 C 24,42 34,32 48,30 C 56,30 62,24 68,18 Z',
    crestPoint: { x: 78, y: 8 },
    dipPoint: { x: 44, y: 24 },
    avatarCenter: { cx: 58, cy: 62, r: 33 },
    sparkles: [
      { x: 36, y: 12, size: 7, color: '#F5F3F7', core: '#B98CFF' }, // Upper-left 4-pointed diamond star
      { x: 14, y: 78, size: 5.5, color: '#F5F3F7', core: '#B83268' } // Lower-left 4-pointed diamond star
    ],
    tendrils: [
      'M 78,8 C 84,2 92,4 98,2',
      'M 44,24 C 38,16 30,18 24,12',
      'M 12,54 C 4,50 2,40 6,32',
      'M 20,102 C 12,106 4,102 1,94'
    ]
  },
  {
    // Template 1: Fluid Nebula Surge
    outerRibbon: 'M 42,8 C 58,6 68,16 76,24 C 92,26 104,38 108,56 C 112,76 104,94 88,104 C 72,114 52,112 36,102 C 20,92 10,72 12,52 C 14,32 26,10 42,8 Z',
    innerRibbon: 'M 46,16 C 58,16 66,24 72,30 C 86,32 96,44 98,60 C 100,76 92,90 80,98 C 66,104 50,102 38,94 C 26,86 20,70 22,54 C 24,40 32,20 46,16 Z',
    crestPoint: { x: 42, y: 8 },
    dipPoint: { x: 76, y: 24 },
    avatarCenter: { cx: 60, cy: 62, r: 33 },
    sparkles: [
      { x: 84, y: 14, size: 6.5, color: '#F5F3F7', core: '#B98CFF' },
      { x: 104, y: 76, size: 5.5, color: '#F5F3F7', core: '#B83268' }
    ],
    tendrils: [
      'M 42,8 C 36,2 28,4 22,2',
      'M 76,24 C 82,16 90,18 96,12',
      'M 108,56 C 116,52 118,42 114,34',
      'M 36,102 C 28,106 20,102 16,94'
    ]
  },
  {
    // Template 2: Cosmic Flame Ascendant
    outerRibbon: 'M 82,10 C 98,16 108,34 106,58 C 104,78 94,96 78,106 C 60,116 38,112 24,98 C 8,84 6,64 12,44 C 18,24 36,12 54,20 C 64,24 72,14 82,10 Z',
    innerRibbon: 'M 76,18 C 90,24 98,38 96,60 C 94,76 86,90 70,98 C 54,106 36,102 26,90 C 16,78 16,60 20,46 C 26,30 40,22 54,28 C 62,32 70,22 76,18 Z',
    crestPoint: { x: 82, y: 10 },
    dipPoint: { x: 54, y: 20 },
    avatarCenter: { cx: 58, cy: 62, r: 33 },
    sparkles: [
      { x: 46, y: 10, size: 7, color: '#F5F3F7', core: '#B98CFF' },
      { x: 14, y: 72, size: 5.5, color: '#F5F3F7', core: '#B83268' }
    ],
    tendrils: [
      'M 82,10 C 88,4 96,6 100,2',
      'M 54,20 C 48,12 40,14 34,8',
      'M 12,44 C 4,40 2,30 6,22',
      'M 24,98 C 16,102 8,98 4,90'
    ]
  }
];

export const ORGANIC_SHAPES = SIGNATURE_TEMPLATES.map((t) => t.outerRibbon);
