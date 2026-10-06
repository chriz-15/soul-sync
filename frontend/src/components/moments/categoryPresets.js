/**
 * Category Presets & Sample Photo Collections
 * Provides authentic, high-resolution photo sets (25–30 photos) and defaults for:
 * 1. Travel Moments
 * 2. Favorite Memories
 * 3. Special Days
 * 4. College Days
 */

export const CATEGORY_CONFIG = {
  travel: {
    key: 'travel',
    collectionId: 1,
    name: 'Travel Moments',
    icon: '🌅',
    badge: '🌅 Travel Moments Collection',
    title: 'Complete Travel Memory Collection',
    subtitle: 'Preserve entire journeys, route memories, multiple photos, and your complete travel experience in one place.',
    sampleTitle: '3 Days in Varkala',
    samplePlace: 'Varkala, Kerala',
    sampleDateRange: 'September 21 – September 23, 2026',
    samplePeople: 'Megha, Arjun, Sahana',
    sampleNotes: `Three unforgettable days by the Arabian Sea. We started our mornings at the North Cliff cafe listening to the waves crash below. The sunsets painted the entire horizon in amber and rose. 

We rented scooters to explore the backwaters and ancient Janardhana Swamy temple cliffs. We spent our afternoons catching waves at Black Sand Beach and our final evening sharing deep conversations around a quiet seaside bonfire. A trip where time completely stood still.`,
    samplePhotos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80'
    ]
  },

  favorite: {
    key: 'favorite',
    collectionId: 2,
    name: 'Favorite Memories',
    icon: '❤️',
    badge: '❤️ Favorite Memories Collection',
    title: 'Complete Favorite Memory Collection',
    subtitle: 'Anchor deeply cherished moments, shared laughter, and the personal stories behind them.',
    sampleTitle: 'Our First Long Drive',
    sampleDate: 'October 14, 2025',
    samplePeople: 'Megha',
    sampleWhySpecial: 'The rain had just stopped and we played our favorite retro playlist on the open highway for hours without any destination in mind.',
    sampleNotes: `The monsoon showers had just cleared, leaving a fresh petrichor scent across the Western Ghats highway. We rolled down the windows, put on our nostalgic playlist, and drove through the misty hills until dusk.

We stopped at an old hilltop tea stall and watched the clouds roll across the tea estates below. It was in those quiet, spontaneous hours that we realized how deeply our souls synchronized. A memory etched permanently in my heart.`,
    samplePhotos: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&auto=format&fit=crop&q=80'
    ]
  },

  special: {
    key: 'special',
    collectionId: 3,
    name: 'Special Days',
    icon: '✨',
    badge: '✨ Special Days Collection',
    title: 'Complete Special Day Memory Collection',
    subtitle: 'Mark life’s golden occasions — birthdays, anniversaries, celebrations, and personal milestones.',
    sampleTitle: "Megha's 24th Birthday Celebration",
    specialTypes: [
      'Birthday',
      'Anniversary',
      'Celebration',
      'Achievement',
      'Festival',
      'Graduation',
      'Important Personal Event',
      'Custom'
    ],
    sampleType: 'Birthday',
    sampleDate: 'August 18, 2026',
    samplePeople: 'Megha, Arjun, Priya, Vikram, Karthik',
    sampleWhatHappened: 'Surprise midnight cake cutting followed by a sunset rooftop dinner overlooking the illuminated city skyline. Everyone brought handwritten letters.',
    sampleNotes: `The look of pure joy on Megha's face when she walked into the room was priceless. The rooftop was decorated with warm fairy lights and polaroid memories of the past three years. 

We surprised her with a customized acoustic session and shared heartfelt speeches that brought tears and laughter in equal measure. A milestone celebration we will talk about for decades.`,
    samplePhotos: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=80'
    ]
  },

  college: {
    key: 'college',
    collectionId: 4,
    name: 'College Days',
    icon: '🎓',
    badge: '🎓 College Days Collection',
    title: 'Complete College Memory Collection',
    subtitle: 'Relive campus hallways, late night canteen talks, fest chaos, and lifelong friendships.',
    sampleTitle: 'Final Year Memories — Batch of 2026',
    sampleCollege: 'Kerala Technical Institute',
    samplePeriod: '2022 – 2026',
    sampleOccasion: 'Final Semester & Cul-Fest',
    sampleFriends: 'Arjun, Vikram, Karthik, Sahana',
    sampleStory: `Four years condensed into a whirlwind of late-night assignment submissions, endless canteen chai debates, project viva panic, and the exhilarating chaos of our annual cultural festival. 

From rehearsing dance routines in the seminar halls till 2 AM to bunking lectures for sea breeze drives, these friends turned an academic degree into an unforgettable adventure. Leaving these corridors is bittersweet, but our bond is forever.`,
    samplePersonalNotes: 'Leaving these campus corridors feels surreal. The friendships forged here are for life, no matter where our individual paths lead.',
    samplePhotos: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80'
    ]
  }
};
