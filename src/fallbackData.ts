import { Event, MusicTrack, VideoClip, GalleryImage, BandMember, SystemSettings, Coupon } from './types.js';

export const FALLBACK_EVENTS: Event[] = [
  {
    "id": "e-1",
    "title": "Soul Fusion Arena: Pune Live",
    "tagline": "Experience the grand Indian fusion extravaganza",
    "description": "Rangrez is returning to Pune for their biggest live gig ever. Witness high-energy tabla grooves combined with blazing guitar solos and haunting sufi vocals that will reverberate in your heart forever.",
    "date": "2026-06-15",
    "time": "18:30",
    "venue": "Royal Palms Open Air Theatre",
    "city": "Pune",
    "imageUrl": "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
    "status": "upcoming",
    "categories": [
      {
        "class": "vip",
        "name": "₹250 Couple Entry + 25% Food Coupon",
        "price": 250,
        "availableSeats": 30,
        "totalSeats": 30,
        "benefits": [
          "Admittance for 2 (Couple Entry)",
          "Exclusive 25% discount coupon at all food stalls",
          "Priority couple entrance privileges"
        ]
      },
      {
        "class": "fanpit",
        "name": "₹200 Solo Entry + 20% Food Coupon",
        "price": 200,
        "availableSeats": 80,
        "totalSeats": 80,
        "benefits": [
          "Single person admission (Solo Entry)",
          "Exclusive 20% discount coupon valid at all food stalls",
          "Priority fast-track entry lane"
        ]
      },
      {
        "class": "general",
        "name": "₹149 Solo Entry",
        "price": 149,
        "availableSeats": 300,
        "totalSeats": 300,
        "benefits": [
          "Single person admission (Solo Entry)",
          "Access to the main high-energy audience field"
        ]
      }
    ],
    "totalSales": 241900,
    "venueAddress": "Survey No 23, Near Koregaon Park, Mundhwa, Pune, Maharashtra 411036",
    "googleMapUrl": "https://maps.google.com/?q=Royal+Palms+Open+Air+Theatre+Pune"
  },
  {
    "id": "e-2",
    "title": "Rhythm & Echoes Tour: Bangalore",
    "tagline": "A mystical sufi rock performance under the stars",
    "description": "Join Yash the Flutist, V. Anand the Tabla master, and the entire high-octane Rangrez line-up at Bangalore's finest creative container yard for a cinematic audiovisual performance.",
    "date": "2026-06-28",
    "time": "19:00",
    "venue": "The Quad Open Space",
    "city": "Bangalore",
    "imageUrl": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    "status": "upcoming",
    "categories": [
      {
        "class": "vip",
        "name": "₹250 Couple Entry + 25% Food Coupon",
        "price": 250,
        "availableSeats": 20,
        "totalSeats": 20,
        "benefits": [
          "Admittance for 2 (Couple Entry)",
          "Exclusive 25% discount coupon at all food stalls",
          "Priority couple entrance privileges"
        ]
      },
      {
        "class": "fanpit",
        "name": "₹200 Solo Entry + 20% Food Coupon",
        "price": 200,
        "availableSeats": 60,
        "totalSeats": 60,
        "benefits": [
          "Single person admission (Solo Entry)",
          "Exclusive 20% discount coupon valid at all food stalls",
          "Priority fast-track entry lane"
        ]
      },
      {
        "class": "general",
        "name": "₹149 Solo Entry",
        "price": 149,
        "availableSeats": 250,
        "totalSeats": 250,
        "benefits": [
          "Single person admission (Solo Entry)",
          "Access to the main high-energy audience field"
        ]
      }
    ],
    "totalSales": 168000,
    "venueAddress": "Plot No. 44, opposite RMZ Ecospace, Bellandur, Bengaluru, Karnataka 560103",
    "googleMapUrl": "https://maps.google.com/?q=The+Quad+Open+Space+Bangalore"
  },
  {
    "id": "e-3",
    "title": "Cosmic Vibrations: Mumbai Arena",
    "tagline": "Where the pulse of classical meets the weight of heavy metal",
    "description": "Rangrez lands in Mumbai to light up the night with heavy basslines, traditional Indian strings, and spectacular laser visual mappings. Do not miss this legendary concert.",
    "date": "2026-07-12",
    "time": "18:00",
    "venue": "Nesco Exhibition Centre",
    "city": "Mumbai",
    "imageUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    "status": "upcoming",
    "categories": [
      {
        "class": "vip",
        "name": "₹250 Couple Entry + 25% Food Coupon",
        "price": 250,
        "availableSeats": 40,
        "totalSeats": 40,
        "benefits": [
          "Admittance for 2 (Couple Entry)",
          "Exclusive 25% discount coupon at all food stalls",
          "Priority couple entrance privileges"
        ]
      },
      {
        "class": "fanpit",
        "name": "₹200 Solo Entry + 20% Food Coupon",
        "price": 200,
        "availableSeats": 100,
        "totalSeats": 100,
        "benefits": [
          "Single person admission (Solo Entry)",
          "Exclusive 20% discount coupon valid at all food stalls",
          "Priority fast-track entry lane"
        ]
      },
      {
        "class": "general",
        "name": "₹149 Solo Entry",
        "price": 149,
        "availableSeats": 450,
        "totalSeats": 450,
        "benefits": [
          "Single person admission (Solo Entry)",
          "Access to the main high-energy audience field"
        ]
      }
    ],
    "totalSales": 412000,
    "venueAddress": "Western Express Hwy, NSE Exhibition Complex, Goregaon, Mumbai, Maharashtra 400063",
    "googleMapUrl": "https://maps.google.com/?q=Nesco+Exhibition+Centre+Goregaon+Mumbai"
  },
  {
    "id": "e-4",
    "title": "Rangrez Sacred Echoes: Delhi Acoustic",
    "tagline": "An intimate classical and ambient fusion acoustic journey",
    "description": "A specially curated acoustic sunset concert featuring purely flutes, unplugged drums, classical tabla compositions, and exquisite sitar crossovers designed for the soul.",
    "date": "2026-07-25",
    "time": "17:30",
    "venue": "Kamani Auditorium",
    "venueAddress": "1, Copernicus Marg, Mandi House, New Delhi, Delhi 110001",
    "googleMapUrl": "https://maps.google.com/?q=Kamani+Auditorium+New+Delhi",
    "city": "Delhi",
    "imageUrl": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80",
    "status": "upcoming",
    "categories": [
      {
        "class": "vip",
        "name": "₹250 Couple Entry + 25% Food Coupon",
        "price": 250,
        "availableSeats": 15,
        "totalSeats": 15,
        "benefits": [
          "Admittance for 2 (Couple Entry)",
          "Exclusive 25% discount coupon at all food stalls",
          "Priority couple entrance privileges"
        ]
      },
      {
        "class": "fanpit",
        "name": "₹200 Solo Entry + 20% Food Coupon",
        "price": 200,
        "availableSeats": 40,
        "totalSeats": 40,
        "benefits": [
          "Single person admission (Solo Entry)",
          "Exclusive 20% discount coupon valid at all food stalls",
          "Priority fast-track entry lane"
        ]
      },
      {
        "class": "general",
        "name": "₹149 Solo Entry",
        "price": 149,
        "availableSeats": 150,
        "totalSeats": 150,
        "benefits": [
          "Single person admission (Solo Entry)",
          "Access to the main high-energy audience field"
        ]
      }
    ],
    "totalSales": 94000
  }
];

export const FALLBACK_COUPONS: Coupon[] = [
  {
    "code": "RANGREZ20",
    "discountPercent": 20,
    "description": "Official 20% discount code for Rangrez followers",
    "isActive": true
  },
  {
    "code": "GOLDVIP",
    "discountPercent": 30,
    "description": "Flat 30% off for high tier experiences",
    "isActive": true,
    "minBookingValue": 4000
  },
  {
    "code": "SOUL10",
    "discountPercent": 10,
    "description": "Welcome coupon for standard general admission tickets",
    "isActive": true
  }
];

export const FALLBACK_MUSIC: MusicTrack[] = [
  {
    "id": "m-1",
    "title": "Soul & Sitar (Rhythm of Rangrez)",
    "album": "Sacred Vibrations",
    "duration": "04:32",
    "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "coverUrl": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80",
    "spotifyUrl": "https://open.spotify.com",
    "youtubeUrl": "https://youtube.com",
    "appleMusicUrl": "https://apple.co",
    "releaseDate": "2026-01-10",
    "isPopular": true
  },
  {
    "id": "m-2",
    "title": "The Golden Tabla (High Energy Crossover)",
    "album": "Sacred Vibrations",
    "duration": "05:14",
    "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "coverUrl": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80",
    "spotifyUrl": "https://open.spotify.com",
    "youtubeUrl": "https://youtube.com",
    "appleMusicUrl": "https://apple.co",
    "releaseDate": "2026-02-15",
    "isPopular": true
  },
  {
    "id": "m-3",
    "title": "Breathe the Vibe (Flute Sunset Mix)",
    "album": "Ethereal Echoes",
    "duration": "03:55",
    "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "coverUrl": "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=500&q=80",
    "spotifyUrl": "https://open.spotify.com",
    "youtubeUrl": "https://youtube.com",
    "releaseDate": "2026-04-01",
    "isPopular": false
  },
  {
    "id": "m-4",
    "title": "Electric Sufi (Heavy Drums Crossover)",
    "album": "Sacred Vibrations",
    "duration": "06:05",
    "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "coverUrl": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=500&q=80",
    "spotifyUrl": "https://open.spotify.com",
    "youtubeUrl": "https://youtube.com",
    "appleMusicUrl": "https://apple.co",
    "releaseDate": "2026-05-18",
    "isPopular": true
  }
];

export const FALLBACK_VIDEOS: VideoClip[] = [
  {
    "id": "v-1",
    "title": "Rangrez Live Pune - Full Performance Film",
    "type": "live",
    "thumbnailUrl": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80",
    "youtubeEmbedId": "dQw4w9WgXcQ",
    "duration": "24:12",
    "releaseDate": "2025-11-20"
  },
  {
    "id": "v-2",
    "title": "Soul & Sitar (Official Cinematic Music Video)",
    "type": "music_video",
    "thumbnailUrl": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    "youtubeEmbedId": "dQw4w9WgXcQ",
    "duration": "04:45",
    "releaseDate": "2026-01-12"
  },
  {
    "id": "v-3",
    "title": "Backstage Secrets: Tuning Yash's Traditional Flute",
    "type": "bts",
    "thumbnailUrl": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    "youtubeEmbedId": "dQw4w9WgXcQ",
    "duration": "08:15",
    "releaseDate": "2026-03-05"
  }
];

export const FALLBACK_GALLERY: GalleryImage[] = [
  {
    "id": "g-1",
    "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=850&q=80",
    "title": "Mumbai Arena Sledge Guitar Solo",
    "category": "performance"
  },
  {
    "id": "g-2",
    "url": "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=850&q=80",
    "title": "Traditional Hand Sculpted Tabla Set",
    "category": "performance"
  },
  {
    "id": "g-3",
    "url": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    "title": "Soundcheck in Pune Amphitheatre",
    "category": "behind_scenes"
  },
  {
    "id": "g-4",
    "url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    "title": "Flutist Yash posing in recording studio",
    "category": "portrait"
  },
  {
    "id": "g-5",
    "url": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80",
    "title": "Crowd Wave Energy at Bangalore Gig",
    "category": "performance"
  },
  {
    "id": "g-6",
    "url": "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=800&q=80",
    "title": "Dhawal setting up custom hybrid drums",
    "category": "behind_scenes"
  }
];

export const FALLBACK_MEMBERS: BandMember[] = [
  {
    "id": "bm-1",
    "name": "Vocals & Sitar",
    "artist": "Aadarsh",
    "role": "Vocalist & Sitarist",
    "quote": "Sufi rock is not just an aesthetic; it is our breathing frequency, transporting listeners to higher dimensions.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    "skills": ["Spiritual Vocals", "Classical Sitar", "Arranging"]
  },
  {
    "id": "bm-2",
    "name": "Tabla Player",
    "artist": "V. Aanand",
    "role": "Traditional Percussions",
    "quote": "His hands tell stories. His energy moves souls. Breathes soul and lives in every beat.",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    "skills": ["Double-struck Tabla", "Mridangam", "Konnakol Rhythm"]
  },
  {
    "id": "bm-3",
    "name": "Flutist",
    "artist": "Yash",
    "role": "Traditional Woodwinds",
    "quote": "Breathes soul and lives in every vibe. His melodies move souls, from tradition to tomorrow.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    "skills": ["Bansuri Bamboo Flute", "Recorder", "Acoustic Harmonies"]
  },
  {
    "id": "bm-4",
    "name": "Lead Guitarist",
    "artist": "Vishnu",
    "role": "Solos & Soundscapes",
    "quote": "Tells stories without words. His strings carry pure emotion, and his heavy guitar solos ignite the stage.",
    "imageUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80",
    "skills": ["Heavy Distortion", "Ambient Reverbs", "Raga-Scale Soloing"]
  },
  {
    "id": "bm-5",
    "name": "Drummer",
    "artist": "Dhawal",
    "role": "Hybrid Rhythm Station",
    "quote": "Doesn't just play the drums, he builds the moment. Every single beat creates endless feel.",
    "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
    "skills": ["Double Bass Drumming", "Electronic Drum Pad Triggering"]
  },
  {
    "id": "bm-6",
    "name": "Bass Guitarist",
    "artist": "Anubhav",
    "role": "Sub-harmonic Grooves",
    "quote": "Anchor of the Rangrez sound. Fuses low-end power with high speed classical patterns.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
    "skills": ["5-String Bass slap", "Fretless Glide", "Sub-station control"]
  }
];

export const FALLBACK_SETTINGS: SystemSettings = {
  "heroBgUrl": "/uploads/lead_singer_microphone.jpg",
  "posterMainSingerUrl": "https://images.unsplash.com/photo-1541604193435-22419f564789?auto=format&fit=crop&w=500&q=80",
  "posterSilhouetteUrl": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=40",
  "bandName": "RANGREZ",
  "tagline": "★ SANSKRIT ROOTED SUFI FUSION ROCK ★",
  "creedTitle": "Rangrez Creed",
  "creedBody": "We don't just play music, we create feelings. Driven by energy, connected by rhythm, we turn every single performance into a highly memorable shared experience.",
  "storyHeading": "Sanskrit Roots Meets Heavy Electric Amplification",
  "storyParagraph1": "The term Rangrez signifies the dyer of souls. Rooted firmly in traditional Hindustani classical frameworks, we do not merely play musical rhythms; we paint feelings across an infinite cosmic frequency map.",
  "storyParagraph2": "From the deep heart-touching woodwind structures of Yash's Bansuri flutes to the hyperkinetic rhythm sweeps of V. Anand’s classical tablas, complemented by Vishnu's heavy distorted heavy metal guitar solos — Rangrez is a majestic auditory storm of classical soul and modern high-energy rock combined.",
  "posterMainTitle": "RANGREZ",
  "posterSubTitle": "LIVE EXPERIENCE",
  "posterSlogan": "ONE STAGE.\nONE SOUND.\nONE IDENTITY.",
  "posterFooterLeft": "THE CULTURE.",
  "posterFooterMiddle": "SUNDAY 24TH MAY 2026",
  "posterFooterRight": "SHREYORA - Street meets statement",
  "stat1Number": "120+",
  "stat1Label": "Concerts Played",
  "stat2Number": "8M+",
  "stat2Label": "Digital Streams",
  "stat3Number": "100%",
  "stat3Label": "Soul & Energy",
  "contactEmail": "rangrezencore@gmail.com",
  "contactPhone": "+91 98765 43210",
  "contactOffice": "Koregaon Park Road, Pune, Maharashtra",
  "contactInstagram": "https://www.instagram.com/rangrezencore?igsh=MWNpZThta3A3aDc3cQ==",
  "areTicketsReleased": false
};
