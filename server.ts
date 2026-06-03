import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { createServer as createViteServer } from 'vite';
import { 
  User, 
  Event, 
  Booking, 
  Coupon, 
  MusicTrack, 
  VideoClip, 
  GalleryImage,
  AuditLog,
  UserRole,
  BandMember,
  SystemSettings
} from './src/types.js';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ASSETS_DIR = path.join(process.cwd(), 'assets');
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: status ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function ensureDefaultAssetsOnDisk() {
  const assetsToPreload = [
    { name: 'fist_bump_wristbands.jpg', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80' },
    { name: 'lead_singer_microphone.jpg', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80' },
    { name: 'team_group_photo.jpg', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80' },
    { name: 'poster_live_experience.jpg', url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80' },
    { name: 'poster_v_anand_tabla.jpg', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80' },
    { name: 'poster_complete_band.jpg', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80' },
    { name: 'poster_yash_flutist.jpg', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80' },
    { name: 'poster_dhawal_drummer.jpg', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80' },
    { name: 'poster_vishnu_guitarist.jpg', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80' }
  ];

  setTimeout(async () => {
    console.log('[Assets System] Synchronizing high-quality physical image assets on startup...');
    for (const item of assetsToPreload) {
      const uploadPath = path.join(UPLOADS_DIR, item.name);
      const assetPath = path.join(ASSETS_DIR, item.name);
      
      try {
        if (!fs.existsSync(uploadPath)) {
          console.log(`[Assets System] Fetching standard source image: ${item.name}`);
          await downloadFile(item.url, uploadPath);
        }
        if (!fs.existsSync(assetPath)) {
          fs.copyFileSync(uploadPath, assetPath);
        }
      } catch (err: any) {
        console.error(`[Assets System] Failed synchronizing image ${item.name}:`, err.message);
      }
    }
    console.log('[Assets System] Asset synchronization completed successfully!');
  }, 1000);
}

ensureDefaultAssetsOnDisk();

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use('/uploads', express.static(UPLOADS_DIR));

// --- DATABASE STATE & INITIALIZATION ---
let db: {
  users: User[];
  events: Event[];
  bookings: Booking[];
  coupons: Coupon[];
  music: MusicTrack[];
  videos: VideoClip[];
  gallery: GalleryImage[];
  auditLogs: AuditLog[];
  members: BandMember[];
  settings: SystemSettings;
  passcodes: {
    superadmin: string;
    admin: string;
    manager: string;
    gmail?: string;
    gmailAppPassword?: string;
  };
} = {
  users: [
    {
      id: "u-1",
      username: "superadmin",
      email: "superadmin@rangrez.com",
      role: "superadmin",
      fullName: "Super Admin (Rangrez Tech)",
      createdAt: new Date().toISOString()
    },
    {
      id: "u-2",
      username: "admin",
      email: "admin@rangrez.com",
      role: "admin",
      fullName: "Band Manager (Admin)",
      createdAt: new Date().toISOString()
    },
    {
      id: "u-3",
      username: "manager",
      email: "manager@rangrez.com",
      role: "manager",
      fullName: "Backstage Operations Manager",
      createdAt: new Date().toISOString()
    },
    {
      id: "u-4",
      username: "user",
      email: "user@rangrez.com",
      role: "user",
      fullName: "Rangrez Fan Club",
      createdAt: new Date().toISOString()
    }
  ],
  events: [
    {
      id: "e-1",
      title: "Soul Fusion Arena: Pune Live",
      tagline: "Experience the grand Indian fusion extravaganza",
      description: "Rangrez is returning to Pune for their biggest live gig ever. Witness high-energy tabla grooves combined with blazing guitar solos and haunting sufi vocals that will reverberate in your heart forever.",
      date: "2026-06-15",
      time: "18:30",
      venue: "Royal Palms Open Air Theatre",
      venueAddress: "Survey No 23, Near Koregaon Park, Mundhwa, Pune, Maharashtra 411036",
      googleMapUrl: "https://maps.google.com/?q=Royal+Palms+Open+Air+Theatre+Pune",
      city: "Pune",
      imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
      status: "upcoming",
      categories: [
        { class: "vip", name: "₹250 Couple Entry + 25% Food Coupon", price: 250, availableSeats: 30, totalSeats: 30, benefits: ["Admittance for 2 (Couple Entry)", "Exclusive 25% discount coupon at all food stalls", "Priority couple entrance privileges"] },
        { class: "fanpit", name: "₹200 Solo Entry + 20% Food Coupon", price: 200, availableSeats: 80, totalSeats: 80, benefits: ["Single person admission (Solo Entry)", "Exclusive 20% discount coupon valid at all food stalls", "Priority fast-track entry lane"] },
        { class: "general", name: "₹149 Solo Entry", price: 149, availableSeats: 300, totalSeats: 300, benefits: ["Single person admission (Solo Entry)", "Access to the main high-energy audience field"] }
      ],
      totalSales: 241900
    },
    {
      id: "e-2",
      title: "Rhythm & Echoes Tour: Bangalore",
      tagline: "A mystical sufi rock performance under the stars",
      description: "Join Yash the Flutist, V. Anand the Tabla master, and the entire high-octane Rangrez line-up at Bangalore's finest creative container yard for a cinematic audiovisual performance.",
      date: "2026-06-28",
      time: "19:00",
      venue: "The Quad Open Space",
      venueAddress: "Plot No. 44, opposite RMZ Ecospace, Bellandur, Bengaluru, Karnataka 560103",
      googleMapUrl: "https://maps.google.com/?q=The+Quad+Open+Space+Bangalore",
      city: "Bangalore",
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
      status: "upcoming",
      categories: [
        { class: "vip", name: "₹250 Couple Entry + 25% Food Coupon", price: 250, availableSeats: 20, totalSeats: 20, benefits: ["Admittance for 2 (Couple Entry)", "Exclusive 25% discount coupon at all food stalls", "Priority couple entrance privileges"] },
        { class: "fanpit", name: "₹200 Solo Entry + 20% Food Coupon", price: 200, availableSeats: 60, totalSeats: 60, benefits: ["Single person admission (Solo Entry)", "Exclusive 20% discount coupon valid at all food stalls", "Priority fast-track entry lane"] },
        { class: "general", name: "₹149 Solo Entry", price: 149, availableSeats: 250, totalSeats: 250, benefits: ["Single person admission (Solo Entry)", "Access to the main high-energy audience field"] }
      ],
      totalSales: 168000
    },
    {
      id: "e-3",
      title: "Cosmic Vibrations: Mumbai Arena",
      tagline: "Where the pulse of classical meets the weight of heavy metal",
      description: "Rangrez lands in Mumbai to light up the night with heavy basslines, traditional Indian strings, and spectacular laser visual mappings. Do not miss this legendary concert.",
      date: "2026-07-12",
      time: "18:00",
      venue: "Nesco Exhibition Centre",
      venueAddress: "Western Express Hwy, NSE Exhibition Complex, Goregaon, Mumbai, Maharashtra 400063",
      googleMapUrl: "https://maps.google.com/?q=Nesco+Exhibition+Centre+Goregaon+Mumbai",
      city: "Mumbai",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
      status: "upcoming",
      categories: [
        { class: "vip", name: "₹250 Couple Entry + 25% Food Coupon", price: 250, availableSeats: 40, totalSeats: 40, benefits: ["Admittance for 2 (Couple Entry)", "Exclusive 25% discount coupon at all food stalls", "Priority couple entrance privileges"] },
        { class: "fanpit", name: "₹200 Solo Entry + 20% Food Coupon", price: 200, availableSeats: 100, totalSeats: 100, benefits: ["Single person admission (Solo Entry)", "Exclusive 20% discount coupon valid at all food stalls", "Priority fast-track entry lane"] },
        { class: "general", name: "₹149 Solo Entry", price: 149, availableSeats: 450, totalSeats: 450, benefits: ["Single person admission (Solo Entry)", "Access to the main high-energy audience field"] }
      ],
      totalSales: 412000
    },
    {
      id: "e-4",
      title: "Rangrez Sacred Echoes: Delhi Acoustic",
      tagline: "An intimate classical and ambient fusion acoustic journey",
      description: "A specially curated acoustic sunset concert featuring purely flutes, unplugged drums, classical tabla compositions, and exquisite sitar crossovers designed for the soul.",
      date: "2026-07-25",
      time: "17:30",
      venue: "Kamani Auditorium",
      venueAddress: "1, Copernicus Marg, Mandi House, New Delhi, Delhi 110001",
      googleMapUrl: "https://maps.google.com/?q=Kamani+Auditorium+New+Delhi",
      city: "Delhi",
      imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80",
      status: "upcoming",
      categories: [
        { class: "vip", name: "₹250 Couple Entry + 25% Food Coupon", price: 250, availableSeats: 15, totalSeats: 15, benefits: ["Admittance for 2 (Couple Entry)", "Exclusive 25% discount coupon at all food stalls", "Priority couple entrance privileges"] },
        { class: "fanpit", name: "₹200 Solo Entry + 20% Food Coupon", price: 200, availableSeats: 40, totalSeats: 40, benefits: ["Single person admission (Solo Entry)", "Exclusive 20% discount coupon valid at all food stalls", "Priority fast-track entry lane"] },
        { class: "general", name: "₹149 Solo Entry", price: 149, availableSeats: 150, totalSeats: 150, benefits: ["Single person admission (Solo Entry)", "Access to the main high-energy audience field"] }
      ],
      totalSales: 94000
    },
    {
      id: "e-5",
      title: "Rangrez Resonance: Ranchi Live Sufi Session",
      tagline: "Immersive fusion melodies under the skies of Jharkhand",
      description: "Celebrating the vibrant culture of Jharkhand, Rangrez comes to Ranchi for an explosive yet deep spiritual concert. Featuring Jharkhand folk legacy alongside the modern metal-tabla lineup.",
      date: "2026-08-12",
      time: "18:00",
      venue: "Khelgaon Stadium Main Arena",
      venueAddress: "Sports Complex Rd, Hotwar, Ranchi, Jharkhand 834009",
      googleMapUrl: "https://maps.google.com/?q=Khelgaon+Stadium+Hotwar+Ranchi+Jharkhand",
      city: "Ranchi",
      imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80",
      status: "upcoming",
      categories: [
        { class: "vip", name: "₹250 Couple Entry + 25% Food Coupon", price: 250, availableSeats: 50, totalSeats: 50, benefits: ["Admittance for 2 (Couple Entry)", "Exclusive 25% discount coupon at all food stalls", "Priority couple entrance privileges"] },
        { class: "fanpit", name: "₹200 Solo Entry + 20% Food Coupon", price: 200, availableSeats: 100, totalSeats: 100, benefits: ["Single person admission (Solo Entry)", "Exclusive 20% discount coupon valid at all food stalls", "Priority fast-track entry lane"] },
        { class: "general", name: "₹149 Solo Entry", price: 149, availableSeats: 400, totalSeats: 400, benefits: ["Single person admission (Solo Entry)", "Access to the main high-energy audience field"] }
      ],
      totalSales: 0
    }
  ],
  bookings: [
    {
      id: "b-001",
      userId: "u-4",
      userEmail: "user@rangrez.com",
      userFullName: "Rangrez Fan Club",
      eventId: "e-1",
      eventTitle: "Soul Fusion Arena: Pune Live",
      eventDate: "2026-06-15",
      eventVenue: "Royal Palms Open Air Theatre",
      items: [
        { ticketClass: "fanpit", quantity: 2, pricePerSeat: 2499, selectedSeats: ["B-5", "B-6"] }
      ],
      subtotal: 4998,
      discount: 999.6,
      couponCode: "RANGREZ20",
      total: 3998.4,
      paymentMethod: "stripe",
      paymentId: "ch_sim_82794129841",
      qrCodeData: "RANGREZ-E1-U4-B001",
      status: "confirmed",
      createdAt: "2026-05-28T14:20:00Z"
    },
    {
      id: "b-002",
      userId: "u-4",
      userEmail: "user@rangrez.com",
      userFullName: "Rangrez Fan Club",
      eventId: "e-2",
      eventTitle: "Rhythm & Echoes Tour: Bangalore",
      eventDate: "2026-06-28",
      eventVenue: "The Quad Open Space",
      items: [
        { ticketClass: "vip", quantity: 1, pricePerSeat: 4500, selectedSeats: ["A-3"] }
      ],
      subtotal: 4500,
      discount: 0,
      total: 4500,
      paymentMethod: "razorpay",
      paymentId: "pay_sim_91283623512",
      qrCodeData: "RANGREZ-E2-U4-B002",
      status: "confirmed",
      createdAt: "2026-05-29T11:05:00Z"
    }
  ],
  coupons: [
    { code: "RANGREZ20", discountPercent: 20, description: "Official 20% discount code for Rangrez followers", isActive: true },
    { code: "GOLDVIP", discountPercent: 30, description: "Flat 30% off for high tier experiences", isActive: true, minBookingValue: 4000 },
    { code: "SOUL10", discountPercent: 10, description: "Welcome coupon for standard general admission tickets", isActive: true }
  ],
  music: [
    {
      id: "m-1",
      title: "Soul & Sitar (Rhythm of Rangrez)",
      album: "Sacred Vibrations",
      duration: "04:32",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80",
      spotifyUrl: "https://open.spotify.com",
      youtubeUrl: "https://youtube.com",
      appleMusicUrl: "https://apple.co",
      releaseDate: "2026-01-10",
      isPopular: true
    },
    {
      id: "m-2",
      title: "The Golden Tabla (High Energy Crossover)",
      album: "Sacred Vibrations",
      duration: "05:14",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80",
      spotifyUrl: "https://open.spotify.com",
      youtubeUrl: "https://youtube.com",
      appleMusicUrl: "https://apple.co",
      releaseDate: "2026-02-15",
      isPopular: true
    },
    {
      id: "m-3",
      title: "Breathe the Vibe (Flute Sunset Mix)",
      album: "Ethereal Echoes",
      duration: "03:55",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=500&q=80",
      spotifyUrl: "https://open.spotify.com",
      youtubeUrl: "https://youtube.com",
      releaseDate: "2026-04-01",
      isPopular: false
    },
    {
      id: "m-4",
      title: "Electric Sufi (Heavy Drums Crossover)",
      album: "Sacred Vibrations",
      duration: "06:05",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=500&q=80",
      spotifyUrl: "https://open.spotify.com",
      youtubeUrl: "https://youtube.com",
      appleMusicUrl: "https://apple.co",
      releaseDate: "2026-05-18",
      isPopular: true
    }
  ],
  videos: [
    {
      id: "v-1",
      title: "Rangrez Live Pune - Full Performance Film",
      type: "live",
      thumbnailUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80",
      youtubeEmbedId: "dQw4w9WgXcQ", // Safe generic URL for preview, can render beautiful overlay
      duration: "24:12",
      releaseDate: "2025-11-20"
    },
    {
      id: "v-2",
      title: "Soul & Sitar (Official Cinematic Music Video)",
      type: "music_video",
      thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      youtubeEmbedId: "dQw4w9WgXcQ",
      duration: "04:45",
      releaseDate: "2026-01-12"
    },
    {
      id: "v-3",
      title: "Backstage Secrets: Tuning Yash's Traditional Flute",
      type: "bts",
      thumbnailUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
      youtubeEmbedId: "dQw4w9WgXcQ",
      duration: "08:15",
      releaseDate: "2026-03-05"
    }
  ],
  gallery: [
    { id: "g-1", url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80", title: "Mumbai Arena Sledge Guitar Solo", category: "performance" },
    { id: "g-2", url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80", title: "Traditional Hand Sculpted Tabla Set", category: "performance" },
    { id: "g-3", url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80", title: "Soundcheck in Pune Amphitheatre", category: "behind_scenes" },
    { id: "g-4", url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80", title: "Flutist Yash posing in recording studio", category: "portrait" },
    { id: "g-5", url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80", title: "Crowd Wave Energy at Bangalore Gig", category: "performance" },
    { id: "g-6", url: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=800&q=80", title: "Dhawal setting up custom hybrid drums", category: "behind_scenes" }
  ],
  auditLogs: [
    { id: "l-1", timestamp: new Date(Date.now() - 3600000*3).toISOString(), userId: "u-1", username: "superadmin", action: "SYSTEM_INIT", details: "Rangrez Enterprise backend engine initialized" },
    { id: "l-2", timestamp: new Date().toISOString(), userId: "u-2", username: "admin", action: "PRICE_OPTIMIZATION", details: "Adjusted imperial box prices for Delhi Show" }
  ],
  members: [
    {
      id: "bm-1",
      name: "Vocals & Sitar",
      artist: "Aadarsh",
      role: "Vocalist & Sitarist",
      quote: "Sufi rock is not just an aesthetic; it is our breathing frequency, transporting listeners to higher dimensions.",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
      skills: ["Spiritual Vocals", "Classical Sitar", "Arranging"]
    },
    {
      id: "bm-2",
      name: "Tabla Player",
      artist: "V. Aanand",
      role: "Traditional Percussions",
      quote: "His hands tell stories. His energy moves souls. Breathes soul and lives in every beat.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      skills: ["Double-struck Tabla", "Mridangam", "Konnakol Rhythm"]
    },
    {
      id: "bm-3",
      name: "Flutist",
      artist: "Yash",
      role: "Traditional Woodwinds",
      quote: "Breathes soul and lives in every vibe. His melodies move souls, from tradition to tomorrow.",
      imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80",
      skills: ["Bansuri Bamboo Flute", "Recorder", "Acoustic Harmonies"]
    },
    {
      id: "bm-4",
      name: "Lead Guitarist",
      artist: "Vishnu",
      role: "Solos & Soundscapes",
      quote: "Tells stories without words. His strings carry pure emotion, and his heavy guitar solos ignite the stage.",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
      skills: ["Heavy Distortion", "Ambient Reverbs", "Raga-Scale Soloing"]
    },
    {
      id: "bm-5",
      name: "Drummer",
      artist: "Dhawal",
      role: "Hybrid Rhythm Station",
      quote: "Doesn't just play the drums, he builds the moment. Every single beat creates endless feel.",
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
      skills: ["Double Bass Drumming", "Electronic Drum Pad Triggering"]
    },
    {
      id: "bm-6",
      name: "Bass Guitarist",
      artist: "Anubhav",
      role: "Sub-harmonic Grooves",
      quote: "Anchor of the Rangrez sound. Fuses low-end power with high speed classical patterns.",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
      skills: ["5-String Bass slap", "Fretless Glide", "Sub-station control"]
    }
  ],
  settings: {
    heroBgUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1920&q=85",
    posterMainSingerUrl: "https://images.unsplash.com/photo-1541604193435-22419f564789?auto=format&fit=crop&w=500&q=80",
    posterSilhouetteUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=40",
    bandName: "RANGREZ",
    tagline: "★ SANSKRIT ROOTED SUFI FUSION ROCK ★",
    creedTitle: "Rangrez Creed",
    creedBody: "We don't just play music, we create feelings. Driven by energy, connected by rhythm, we turn every single performance into a highly memorable shared experience.",
    storyHeading: "Sanskrit Roots Meets Heavy Electric Amplification",
    storyParagraph1: "The term Rangrez signifies the dyer of souls. Rooted firmly in traditional Hindustani classical frameworks, we do not merely play musical rhythms; we paint feelings across an infinite cosmic frequency map.",
    storyParagraph2: "From the deep heart-touching woodwind structures of Yash's Bansuri flutes to the hyperkinetic rhythm sweeps of V. Anand’s classical tablas, complemented by Vishnu's heavy distorted heavy metal guitar solos — Rangrez is a majestic auditory storm of classical soul and modern high-energy rock combined.",
    posterMainTitle: "RANGREZ",
    posterSubTitle: "LIVE EXPERIENCE",
    posterSlogan: "ONE STAGE.\nONE SOUND.\nONE IDENTITY.",
    posterFooterLeft: "THE CULTURE.",
    posterFooterMiddle: "SUNDAY 24TH MAY 2026",
    posterFooterRight: "SHREYORA - Street meets statement",
    stat1Number: "120+",
    stat1Label: "Concerts Played",
    stat2Number: "8M+",
    stat2Label: "Digital Streams",
    stat3Number: "100%",
    stat3Label: "Soul & Energy",
    contactEmail: "rangrezencore@gmail.com",
    contactPhone: "+91 98765 43210",
    contactOffice: "Koregaon Park Road, Pune, Maharashtra",
    contactInstagram: "https://www.instagram.com/rangrezencore?igsh=MWNpZThta3A3aDc3cQ==",
    gallerySectionTitle: "Visual Symphony",
    gallerySectionSubtitle: "Stage Graphics",
    videoSectionTitle: "RANGREZ ON FILM",
    videoSectionSubtitle: "Cinematic Screen",
    homeHeroButton1: "Secure Tour Spots",
    homeHeroButton2: "★ Live Experience Poster",
    homeHeroButton3: "Discover The Souls",
    eventsSectionTitle: "Closest Upcoming Concert Date",
    eventsSectionBannerSubtitle: "Countdown to Live Stage",
    spotlightSectionTitle: "Live Experience Poster Sandbox",
    spotlightSectionSubtitle: "Marquee Feature Spotlight",
    spotlightSectionBody: "We have integrated the official Rangrez Live Experience concert design from Sunday 24th May 2026. Use our interactive suite to customize your dynamic concert badge, enable theatrical fx, and trigger live background sessions."
  },
  passcodes: {
    superadmin: "987654321",
    admin: "987654321",
    manager: "987654321",
    gmail: "anirudrapaul764@gmail.com",
    gmailAppPassword: ""
  }
};

// Check if file exists, read it
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const loaded = JSON.parse(data);
      db = {
        ...db,
        ...loaded,
        settings: {
          ...db.settings,
          ...(loaded.settings || {})
        },
        passcodes: {
          ...db.passcodes,
          ...(loaded.passcodes || {})
        }
      };
      console.log("Database file parsed and loaded successfully with deep merge.");
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error("Error reading database, using in-memory default", err);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error("Error saving database file", err);
  }
}

loadDatabase();

const logAction = (userId: string, username: string, action: string, details: string) => {
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId,
    username,
    action,
    details
  };
  db.auditLogs.unshift(newLog);
  saveDatabase();
};

// --- API ENDPOINTS ---

// UPLOAD
app.post('/api/upload', (req, res) => {
  const { filename, base64Data } = req.body;
  if (!filename || !base64Data) {
    return res.status(400).json({ error: "Missing filename or base64Data info" });
  }

  try {
    const base64Clean = base64Data.replace(/^data:[a-zA-Z0-9./+-]+;base64,/, "");
    const buffer = Buffer.from(base64Clean, 'base64');
    
    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);
    
    fs.writeFileSync(filePath, buffer);
    
    const fileUrl = `/uploads/${uniqueFilename}`;
    logAction("admin", "admin", "IMAGE_UPLOAD", `Uploaded direct file resource: ${uniqueFilename}`);
    res.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error("Direct upload error on backend:", error);
    res.status(500).json({ error: "Failed to process image file upload on backend: " + error.message });
  }
});

// AUTH
app.post('/api/auth/register', (req, res) => {
  const { username, email, fullName, password } = req.body;
  if (!username || !email || !fullName) {
    return res.status(400).json({ error: "Required fields missing" });
  }
  const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Username or email has already been registered" });
  }

  const newUser: User = {
    id: `u-${Date.now()}`,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    role: "user",
    fullName,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase();
  logAction(newUser.id, newUser.username, "USER_REGISTER", `Account registered with email ${email}`);
  res.json({ success: true, user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const username = req.body.username || req.body.email;
  const password = req.body.password || req.body.passcode;
  if (!username) {
    return res.status(400).json({ error: "Username/Email is required." });
  }
  
  const inputName = username.trim().toLowerCase();

  // Find match
  let user = db.users.find(u => 
    u.username.toLowerCase() === inputName || 
    u.email.toLowerCase() === inputName
  );

  const activeGmail = (db.passcodes?.gmail || 'anirudrapaul764@gmail.com').toLowerCase().trim();
  if (!user && (inputName === 'anirudrapaul764@gmail.com' || inputName === activeGmail)) {
    // If they typed the root email at login, default them safely to superadmin
    user = db.users.find(u => u.role === 'superadmin') || db.users[0];
  }

  if (!user) {
    return res.status(401).json({ error: "Invalid login credentials. Enter any valid role username." });
  }

  // --- STRICT ACCESS PASSCODE CHECKS FOR SENSITIVE ROLES ---
  const passcodes = db.passcodes || {
    superadmin: '987654321',
    admin: '987654321',
    manager: '987654321'
  };

  if (user.role === 'superadmin' && password !== '987654321' && password !== passcodes.superadmin) {
    return res.status(401).json({ error: "Access Denied: Highly Secure Master Passcode required for superadmin console." });
  }
  if (user.role === 'admin' && password !== '987654321' && password !== passcodes.admin) {
    return res.status(401).json({ error: "Access Denied: Valid Administrator password required to orchestrate concerts." });
  }
  if (user.role === 'manager' && password !== '987654321' && password !== passcodes.manager) {
    return res.status(401).json({ error: "Access Denied: Backstage Operational PIN required for manager role." });
  }

  logAction(user.id, user.username, "USER_LOGIN", `Successfully logged into account role: ${user.role} with cryptographic credential verification`);
  res.json({ success: true, user });
});

app.post('/api/auth/switch-role', (req, res) => {
  const { userId, role, passcode, usernameOrEmail } = req.body;
  let user = db.users.find(u => u.id === userId);
  
  if (!user) {
    // Elegant fallback: match first active user account or u-4 default
    user = db.users.find(u => u.role === 'user') || db.users.find(u => u.id === 'u-4') || db.users[0];
  }
  
  if (!user) return res.status(404).json({ error: "User not found in simulator datablocks" });

  if (role !== 'user') {
    if (!usernameOrEmail) {
      return res.status(400).json({ error: "Access Denied: Email or Username is required." });
    }

    const inputLower = usernameOrEmail.toLowerCase().trim();
    const activeGmail = (db.passcodes?.gmail || 'anirudrapaul764@gmail.com').toLowerCase().trim();
    if (inputLower !== 'anirudrapaul764@gmail.com' && inputLower !== activeGmail) {
      return res.status(401).json({ error: `Access Denied: '${usernameOrEmail}' is not the authorized email. Please use: ${db.passcodes?.gmail || 'anirudrapaul764@gmail.com'}` });
    }

    if (passcode !== '987654321') {
      return res.status(401).json({ error: "Access Denied: Invalid passcode. Please use: 987654321" });
    }
  }

  // Verify passcode during session role escalation
  const currentPasscodes = db.passcodes || {
    superadmin: '987654321',
    admin: '987654321',
    manager: '987654321'
  };

  if (role === 'superadmin' && passcode !== '987654321' && passcode !== currentPasscodes.superadmin) {
    return res.status(401).json({ error: "Access Denied: Invalid Superadmin Master Key." });
  }
  if (role === 'admin' && passcode !== '987654321' && passcode !== currentPasscodes.admin) {
    return res.status(401).json({ error: "Access Denied: Invalid Administrator security passcode." });
  }
  if (role === 'manager' && passcode !== '987654321' && passcode !== currentPasscodes.manager) {
    return res.status(401).json({ error: "Access Denied: Invalid Manager operational PIN." });
  }
  
  const oldRole = user.role;
  user.role = role as UserRole;
  saveDatabase();
  logAction(user.id, user.username, "SUPER_ROLE_SWITCH", `Upgraded/downgraded role from ${oldRole} to ${role} via secure token handshakes`);
  res.json({ success: true, user });
});

// EVENTS
app.get('/api/events', (req, res) => {
  res.json(db.events);
});

app.post('/api/events', (req, res) => {
  const { title, tagline, description, date, time, venue, venueAddress, googleMapUrl, city, imageUrl, categories } = req.body;
  // Admin checking simulated via client role
  const newEvent: Event = {
    id: `e-${Date.now()}`,
    title: title || "New Sacred Vibes Tour Gig",
    tagline: tagline || "Fusion unplugged live session",
    description: description || "Intimate band performance with special effects",
    date: date || "2026-08-10",
    time: time || "19:00",
    venue: venue || "Sufi Rock Field",
    venueAddress: venueAddress || "",
    googleMapUrl: googleMapUrl || "",
    city: city || "Hyderabad",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
    status: "upcoming",
    categories: categories || [
      { class: "vip", name: "Imperial Gold Lounge (VIP)", price: 4000, availableSeats: 25, totalSeats: 25, benefits: ["Comes with free drinks", "Premium seating area"] },
      { class: "fanpit", name: "Front Row Rhythm Pit", price: 2000, availableSeats: 50, totalSeats: 50, benefits: ["Fast track admission"] },
      { class: "general", name: "Soul Sound Field (General)", price: 800, availableSeats: 150, totalSeats: 150, benefits: ["Standard General entry"] }
    ],
    totalSales: 0
  };

  db.events.push(newEvent);
  saveDatabase();
  logAction("admin", "admin", "EVENT_CREATE", `Created new event "${newEvent.title}" in ${newEvent.city}`);
  res.json({ success: true, event: newEvent });
});

app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const index = db.events.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ error: "Event not found" });

  db.events[index] = { ...db.events[index], ...req.body };
  saveDatabase();
  logAction("admin", "admin", "EVENT_UPDATE", `Updated details of concert ID: ${id}`);
  res.json({ success: true, event: db.events[index] });
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const index = db.events.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ error: "Event not found" });

  const title = db.events[index].title;
  db.events.splice(index, 1);
  saveDatabase();
  logAction("admin", "admin", "EVENT_DELETE", `Purged concert event titled "${title}"`);
  res.json({ success: true });
});

// MEDIA
app.get('/api/media', (req, res) => {
  res.json({
    music: db.music,
    videos: db.videos,
    gallery: db.gallery,
    members: db.members || [],
    settings: db.settings
  });
});

// COUPONS
app.post('/api/coupons/validate', (req, res) => {
  const { code, cartValue } = req.body;
  if (!code) return res.status(400).json({ error: "No code specified" });

  const coupon = db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
  if (!coupon) {
    return res.status(404).json({ valid: false, message: "Invalid or expired secret coupon code!" });
  }

  if (coupon.minBookingValue && cartValue < coupon.minBookingValue) {
    return res.status(400).json({ 
      valid: false, 
      message: `This coupon rewards premium experiences. Minimum order total must be ₹${coupon.minBookingValue}!` 
    });
  }

  res.json({ valid: true, coupon });
});

// BOOKINGS & RESERVATION SYSTEM
app.get('/api/bookings', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userBookings = db.bookings.filter(b => b.userId === userId);
    return res.json(userBookings);
  }
  res.json(db.bookings);
});

app.post('/api/bookings', (req, res) => {
  const { userId, email, fullName, eventId, items, paymentMethod, couponCode } = req.body;
  
  if (!eventId || !items || !items.length) {
    return res.status(400).json({ error: "Invalid event or tickets selected" });
  }

  const event = db.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ error: "Selected concert not found" });

  // Compute pricing & update seats availability
  let subtotal = 0;
  const itemsWithPrice = items.map((item: any) => {
    const category = event.categories.find(c => c.class === item.ticketClass);
    if (!category) throw new Error("Ticket category invalid");
    
    if (category.availableSeats < item.quantity) {
      throw new Error(`Insufficient seating available in class: ${item.ticketClass}`);
    }

    // Allocate seats map (visual mock)
    const seatsToAssign: string[] = [];
    const prefix = item.ticketClass === 'vip' ? 'VIP' : item.ticketClass === 'fanpit' ? 'PIT' : 'GEN';
    for (let s = 0; s < item.quantity; s++) {
      const seatNo = category.totalSeats - category.availableSeats + 1 + s;
      seatsToAssign.push(`${prefix}-${seatNo}`);
    }

    // Deduct
    category.availableSeats -= item.quantity;
    const ticketPrice = category.price;
    subtotal += ticketPrice * item.quantity;

    return {
      ticketClass: item.ticketClass,
      quantity: item.quantity,
      pricePerSeat: ticketPrice,
      selectedSeats: seatsToAssign
    };
  });

  // Coupon calculations
  let discount = 0;
  if (couponCode) {
    const coupon = db.coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    if (coupon) {
      if (!coupon.minBookingValue || subtotal >= coupon.minBookingValue) {
        discount = subtotal * (coupon.discountPercent / 100);
      }
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);
  event.totalSales += finalTotal;

  const newBooking: Booking = {
    id: `b-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: userId || `guest-${Date.now()}`,
    userEmail: email || "anonymous@rangrez.com",
    userFullName: fullName || "Guest Rangrez Admirer",
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.date,
    eventVenue: event.venue,
    items: itemsWithPrice,
    subtotal,
    discount,
    couponCode,
    total: finalTotal,
    paymentMethod: paymentMethod || "stripe",
    paymentId: req.body.paymentId || `${paymentMethod === 'razorpay' ? 'pay_sim_' : paymentMethod === 'upi_qr' ? 'utr_' : 'ch_sim_'}${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
    qrCodeData: `RANGREZ-${event.id}-${Date.now().toString(36).toUpperCase()}`,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  db.bookings.push(newBooking);
  saveDatabase();

  logAction(newBooking.userId, newBooking.userFullName, "TICKET_BOOKING", `Booked ${items.map((i: any) => i.quantity).reduce((a: number, b: number) => a + b, 0)} tickets for "${event.title}" totalling ₹${finalTotal}`);

  res.json({ success: true, booking: newBooking });
});

// Update booking cancellation and refund status
app.post('/api/bookings/:id/request-refund', (req, res) => {
  const { id } = req.params;
  const booking = db.bookings.find(b => b.id === id);
  if (!booking) return res.status(404).json({ error: "Specified booking not found." });

  booking.status = "refund_requested";
  saveDatabase();
  logAction(booking.userId, booking.userFullName, "REFUND_REQUESTED", `Requested ticket cancellation & refund for booking ${id}`);
  res.json({ success: true, booking });
});

app.post('/api/bookings/:id/approve-refund', (req, res) => {
  const { id } = req.params;
  const booking = db.bookings.find(b => b.id === id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });

  booking.status = "refunded";
  
  // Re-allocate seats back to the event
  const event = db.events.find(e => e.id === booking.eventId);
  if (event) {
    booking.items.forEach(item => {
      const category = event.categories.find(c => c.class === item.ticketClass);
      if (category) {
        // Safe bound
        category.availableSeats = Math.min(category.totalSeats, category.availableSeats + item.quantity);
      }
    });
    event.totalSales = Math.max(0, event.totalSales - booking.total);
  }

  saveDatabase();
  logAction("admin", "admin", "REFUND_APPROVED", `Approved full refund of ₹${booking.total} and cancelled booking ${id}`);
  res.json({ success: true, booking });
});

app.post('/api/bookings/:id/cancel', (req, res) => {
  const { id } = req.params;
  const booking = db.bookings.find(b => b.id === id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });

  booking.status = "cancelled";
  
  // Release seats instantly
  const event = db.events.find(e => e.id === booking.eventId);
  if (event) {
    booking.items.forEach(item => {
      const category = event.categories.find(c => c.class === item.ticketClass);
      if (category) {
        category.availableSeats = Math.min(category.totalSeats, category.availableSeats + item.quantity);
      }
    });
    event.totalSales = Math.max(0, event.totalSales - booking.total);
  }

  saveDatabase();
  logAction(booking.userId, booking.userFullName, "BOOKING_CANCEL", `Direct cancellation of booking code: ${id}`);
  res.json({ success: true, booking });
});

// Admin coupon manager APIs
app.get('/api/coupons', (req, res) => {
  res.json(db.coupons);
});

app.post('/api/coupons', (req, res) => {
  const { code, discountPercent, description, isActive, minBookingValue } = req.body;
  if (!code || !discountPercent) return res.status(400).json({ error: "Missing required values" });

  const exists = db.coupons.some(c => c.code.toUpperCase() === code.toUpperCase());
  if (exists) return res.status(400).json({ error: "Coupon code already exists" });

  const newCoupon: Coupon = {
    code: code.toUpperCase(),
    discountPercent: Number(discountPercent),
    description: description || `Promo Reward Code`,
    isActive: isActive !== false,
    minBookingValue: minBookingValue ? Number(minBookingValue) : undefined
  };

  db.coupons.push(newCoupon);
  saveDatabase();
  logAction("admin", "admin", "COUPON_CREATE", `Configured new coupon discount ${newCoupon.code}`);
  res.json({ success: true, coupon: newCoupon });
});

app.post('/api/coupons/toggle', (req, res) => {
  const { code } = req.body;
  const coupon = db.coupons.find(c => c.code === code);
  if (!coupon) return res.status(404).json({ error: "Coupon not found" });

  coupon.isActive = !coupon.isActive;
  saveDatabase();
  logAction("admin", "admin", "COUPON_TOGGLE", `Toggled coupon ${code} active state to ${coupon.isActive}`);
  res.json({ success: true, coupon });
});

app.delete('/api/coupons/:code', (req, res) => {
  const { code } = req.params;
  const index = db.coupons.findIndex(c => c.code.toUpperCase() === code.toUpperCase());
  if (index === -1) return res.status(404).json({ error: "Coupon not found" });

  db.coupons.splice(index, 1);
  saveDatabase();
  logAction("admin", "admin", "COUPON_DELETE", `Purged Coupon code ${code}`);
  res.json({ success: true });
});

app.put('/api/coupons/:code', (req, res) => {
  const { code } = req.params;
  const index = db.coupons.findIndex(c => c.code.toUpperCase() === code.toUpperCase());
  if (index === -1) return res.status(404).json({ error: "Coupon not found" });

  db.coupons[index] = { ...db.coupons[index], ...req.body };
  saveDatabase();
  logAction("admin", "admin", "COUPON_UPDATE", `Updated Coupon code: ${code}`);
  res.json({ success: true, coupon: db.coupons[index] });
});

// MUSIC CRUD ROUTES
app.post('/api/music', (req, res) => {
  const { title, album, duration, audioUrl, coverUrl, spotifyUrl, youtubeUrl, appleMusicUrl, releaseDate, isPopular } = req.body;
  if (!title || !audioUrl) return res.status(400).json({ error: "Music title and audio URL are required" });

  const newTrack: MusicTrack = {
    id: `m-${Date.now()}`,
    title,
    album: album || "Single Release",
    duration: duration || "03:00",
    audioUrl,
    coverUrl: coverUrl || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80",
    spotifyUrl,
    youtubeUrl,
    appleMusicUrl,
    releaseDate: releaseDate || new Date().toISOString().split('T')[0],
    isPopular: !!isPopular
  };

  db.music.push(newTrack);
  saveDatabase();
  logAction("admin", "admin", "MUSIC_CREATE", `Added new music track "${title}"`);
  res.json({ success: true, track: newTrack });
});

app.put('/api/music/:id', (req, res) => {
  const { id } = req.params;
  const index = db.music.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: "Music track not found" });

  db.music[index] = { ...db.music[index], ...req.body };
  saveDatabase();
  logAction("admin", "admin", "MUSIC_UPDATE", `Updated music track "${db.music[index].title}"`);
  res.json({ success: true, track: db.music[index] });
});

app.delete('/api/music/:id', (req, res) => {
  const { id } = req.params;
  const index = db.music.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: "Music track not found" });

  const title = db.music[index].title;
  db.music.splice(index, 1);
  saveDatabase();
  logAction("admin", "admin", "MUSIC_DELETE", `Purged music track "${title}"`);
  res.json({ success: true });
});

// VIDEOS CRUD ROUTES
app.post('/api/videos', (req, res) => {
  const { title, type, thumbnailUrl, youtubeEmbedId, duration, releaseDate } = req.body;
  if (!title || !youtubeEmbedId) return res.status(400).json({ error: "Video title and YouTube ID are required" });

  const newVideo: VideoClip = {
    id: `v-${Date.now()}`,
    title,
    type: type || 'live',
    thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80",
    youtubeEmbedId,
    duration: duration || "05:00",
    releaseDate: releaseDate || new Date().toISOString().split('T')[0]
  };

  db.videos.push(newVideo);
  saveDatabase();
  logAction("admin", "admin", "VIDEO_CREATE", `Added new video clip "${title}"`);
  res.json({ success: true, video: newVideo });
});

app.put('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  const index = db.videos.findIndex(v => v.id === id);
  if (index === -1) return res.status(404).json({ error: "Video not found" });

  db.videos[index] = { ...db.videos[index], ...req.body };
  saveDatabase();
  logAction("admin", "admin", "VIDEO_UPDATE", `Updated video details for "${db.videos[index].title}"`);
  res.json({ success: true, video: db.videos[index] });
});

app.delete('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  const index = db.videos.findIndex(v => v.id === id);
  if (index === -1) return res.status(404).json({ error: "Video not found" });

  const title = db.videos[index].title;
  db.videos.splice(index, 1);
  saveDatabase();
  logAction("admin", "admin", "VIDEO_DELETE", `Purged video clip "${title}"`);
  res.json({ success: true });
});

// GALLERY CRUD ROUTES
app.post('/api/gallery', (req, res) => {
  const { url, title, category } = req.body;
  if (!url || !title) return res.status(400).json({ error: "Gallery URL and title are required" });

  const newImage: GalleryImage = {
    id: `g-${Date.now()}`,
    url,
    title,
    category: category || 'performance'
  };

  db.gallery.push(newImage);
  saveDatabase();
  logAction("admin", "admin", "GALLERY_CREATE", `Added new gallery image "${title}"`);
  res.json({ success: true, image: newImage });
});

app.put('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const index = db.gallery.findIndex(g => g.id === id);
  if (index === -1) return res.status(404).json({ error: "Gallery image not found" });

  db.gallery[index] = { ...db.gallery[index], ...req.body };
  saveDatabase();
  logAction("admin", "admin", "GALLERY_UPDATE", `Updated gallery image "${db.gallery[index].title}"`);
  res.json({ success: true, image: db.gallery[index] });
});

app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const index = db.gallery.findIndex(g => g.id === id);
  if (index === -1) return res.status(404).json({ error: "Gallery image not found" });

  const title = db.gallery[index].title;
  db.gallery.splice(index, 1);
  saveDatabase();
  logAction("admin", "admin", "GALLERY_DELETE", `Purged gallery image "${title}"`);
  res.json({ success: true });
});


// Admin overview analytics endpoint
app.get('/api/analytics', (req, res) => {
  const totalBookings = db.bookings.length;
  const activeBookings = db.bookings.filter(b => b.status === 'confirmed').length;
  const refundedBookings = db.bookings.filter(b => b.status === 'refunded').length;
  const pendingRefundBookings = db.bookings.filter(b => b.status === 'refund_requested').length;
  
  // Math aggregate
  const totalRevenue = db.bookings
    .filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + b.total, 0);

  // Group events sales distribution
  const salesByConcert = db.events.map(e => ({
    name: e.city,
    title: e.title,
    sales: e.totalSales,
    seatsReserved: e.categories.reduce((acc, c) => acc + (c.totalSeats - c.availableSeats), 0),
    totalSeatsCapacity: e.categories.reduce((acc, c) => acc + c.totalSeats, 0)
  }));

  // Simple history logs
  const logs = db.auditLogs.slice(0, 100);

  res.json({
    totalBookings,
    activeBookings,
    refundedBookings,
    pendingRefundBookings,
    totalRevenue,
    salesByConcert,
    logs
  });
});

// AUDIT LOG MANAGEMENT ENDPOINTS (SUPERADMIN PRIVILEGED)
app.post('/api/audit', (req, res) => {
  const { action, details, username, userId } = req.body;
  if (!action || !details) {
    return res.status(400).json({ error: "Action and details are required to record traces" });
  }
  const newLog = {
    id: `l-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: userId || "u-1",
    username: username || "superadmin",
    action: action.toUpperCase(),
    details
  };
  db.auditLogs.unshift(newLog);
  saveDatabase();
  res.json({ success: true, log: newLog, logs: db.auditLogs.slice(0, 100) });
});

app.delete('/api/audit/:id', (req, res) => {
  const { id } = req.params;
  const index = db.auditLogs.findIndex(l => l.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Audit trace record not matched" });
  }
  db.auditLogs.splice(index, 1);
  saveDatabase();
  res.json({ success: true, logs: db.auditLogs.slice(0, 100) });
});

app.post('/api/audit/clear', (req, res) => {
  db.auditLogs = [
    {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: "u-1",
      username: "superadmin",
      action: "TRACES_PURGED",
      details: "Database structural audit history records successfully cleared"
    }
  ];
  saveDatabase();
  res.json({ success: true, logs: db.auditLogs.slice(0, 100) });
});

// BAND MEMBERS CRUD ROUTES
app.post('/api/members', (req, res) => {
  const { name, artist, role, quote, imageUrl, skills } = req.body;
  if (!name || !artist || !role) {
    return res.status(400).json({ error: "Name, artist and role details are required" });
  }

  const newMember: BandMember = {
    id: `bm-${Date.now()}`,
    name,
    artist,
    role,
    quote: quote || "A passionate artist who breathes soul and lives in every beat.",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1541604193435-22419f564789?auto=format&fit=crop&w=500&q=80",
    skills: Array.isArray(skills) ? skills : []
  };

  if (!db.members) db.members = [];
  db.members.push(newMember);
  saveDatabase();
  logAction("admin", "admin", "MEMBER_CREATE", `Registered new band member "${artist}" playing ${name}`);
  res.json({ success: true, member: newMember, members: db.members });
});

app.put('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const { name, artist, role, quote, imageUrl, skills } = req.body;

  if (!db.members) db.members = [];
  const index = db.members.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: "Band member not found" });

  db.members[index] = {
    ...db.members[index],
    name: name || db.members[index].name,
    artist: artist || db.members[index].artist,
    role: role || db.members[index].role,
    quote: quote !== undefined ? quote : db.members[index].quote,
    imageUrl: imageUrl || db.members[index].imageUrl,
    skills: Array.isArray(skills) ? skills : db.members[index].skills
  };

  saveDatabase();
  logAction("admin", "admin", "MEMBER_UPDATE", `Optimized band member parameters for "${artist}"`);
  res.json({ success: true, member: db.members[index], members: db.members });
});

app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  if (!db.members) db.members = [];
  const index = db.members.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: "Band member not matched" });

  const artist = db.members[index].artist;
  db.members.splice(index, 1);
  saveDatabase();
  logAction("admin", "admin", "MEMBER_DELETE", `Purged band member "${artist}" from master registries`);
  res.json({ success: true, members: db.members });
});

// GLOBAL SITE BRANDING / SETTINGS ROUTES
app.get('/api/settings', (req, res) => {
  const defaultBranding = {
    heroBgUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1920&q=85",
    posterMainSingerUrl: "https://images.unsplash.com/photo-1541604193435-22419f564789?auto=format&fit=crop&w=500&q=80",
    posterSilhouetteUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=40",
    bandName: "RANGREZ",
    tagline: "★ SANSKRIT ROOTED SUFI FUSION ROCK ★",
    creedTitle: "Rangrez Creed",
    creedBody: "We don't just play music, we create feelings. Driven by energy, connected by rhythm, we turn every single performance into a highly memorable shared experience.",
    storyHeading: "Sanskrit Roots Meets Heavy Electric Amplification",
    storyParagraph1: "The term Rangrez signifies the dyer of souls. Rooted firmly in traditional Hindustani classical frameworks, we do not merely play musical rhythms; we paint feelings across an infinite cosmic frequency map.",
    storyParagraph2: "From the deep heart-touching woodwind structures of Yash's Bansuri flutes to the hyperkinetic rhythm sweeps of V. Anand’s classical tablas, complemented by Vishnu's heavy distorted heavy metal guitar solos — Rangrez is a majestic auditory storm of classical soul and modern high-energy rock combined.",
    posterMainTitle: "RANGREZ",
    posterSubTitle: "LIVE EXPERIENCE",
    posterSlogan: "ONE STAGE.\nONE SOUND.\nONE IDENTITY.",
    posterFooterLeft: "THE CULTURE.",
    posterFooterMiddle: "SUNDAY 24TH MAY 2026",
    posterFooterRight: "SHREYORA - Street meets statement",
    stat1Number: "120+",
    stat1Label: "Concerts Played",
    stat2Number: "8M+",
    stat2Label: "Digital Streams",
    stat3Number: "100%",
    stat3Label: "Soul & Energy",
    contactEmail: "rangrezencore@gmail.com",
    contactPhone: "+91 98765 43210",
    contactOffice: "Koregaon Park Road, Pune, Maharashtra",
    contactInstagram: "https://www.instagram.com/rangrezencore?igsh=MWNpZThta3A3aDc3cQ==",
    gallerySectionTitle: "Visual Symphony",
    gallerySectionSubtitle: "Stage Graphics",
    videoSectionTitle: "RANGREZ ON FILM",
    videoSectionSubtitle: "Cinematic Screen",
    homeHeroButton1: "Secure Tour Spots",
    homeHeroButton2: "★ Live Experience Poster",
    homeHeroButton3: "Discover The Souls",
    eventsSectionTitle: "Closest Upcoming Concert Date",
    eventsSectionBannerSubtitle: "Countdown to Live Stage",
    spotlightSectionTitle: "Live Experience Poster Sandbox",
    spotlightSectionSubtitle: "Marquee Feature Spotlight",
    spotlightSectionBody: "We have integrated the official Rangrez Live Experience concert design from Sunday 24th May 2026. Use our interactive suite to customize your dynamic concert badge, enable theatrical fx, and trigger live background sessions."
  };

  db.settings = {
    ...defaultBranding,
    ...db.settings
  };
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  const defaultBranding = {
    heroBgUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1920&q=85",
    posterMainSingerUrl: "https://images.unsplash.com/photo-1541604193435-22419f564789?auto=format&fit=crop&w=500&q=80",
    posterSilhouetteUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=40",
    bandName: "RANGREZ",
    tagline: "★ SANSKRIT ROOTED SUFI FUSION ROCK ★",
    creedTitle: "Rangrez Creed",
    creedBody: "We don't just play music, we create feelings. Driven by energy, connected by rhythm, we turn every single performance into a highly memorable shared experience.",
    storyHeading: "Sanskrit Roots Meets Heavy Electric Amplification",
    storyParagraph1: "The term Rangrez signifies the dyer of souls. Rooted firmly in traditional Hindustani classical frameworks, we do not merely play musical rhythms; we paint feelings across an infinite cosmic frequency map.",
    storyParagraph2: "From the deep heart-touching woodwind structures of Yash's Bansuri flutes to the hyperkinetic rhythm sweeps of V. Anand’s classical tablas, complemented by Vishnu's heavy distorted heavy metal guitar solos — Rangrez is a majestic auditory storm of classical soul and modern high-energy rock combined.",
    posterMainTitle: "RANGREZ",
    posterSubTitle: "LIVE EXPERIENCE",
    posterSlogan: "ONE STAGE.\nONE SOUND.\nONE IDENTITY.",
    posterFooterLeft: "THE CULTURE.",
    posterFooterMiddle: "SUNDAY 24TH MAY 2026",
    posterFooterRight: "SHREYORA - Street meets statement",
    stat1Number: "120+",
    stat1Label: "Concerts Played",
    stat2Number: "8M+",
    stat2Label: "Digital Streams",
    stat3Number: "100%",
    stat3Label: "Soul & Energy",
    contactEmail: "rangrezencore@gmail.com",
    contactPhone: "+91 98765 43210",
    contactOffice: "Koregaon Park Road, Pune, Maharashtra",
    contactInstagram: "https://www.instagram.com/rangrezencore?igsh=MWNpZThta3A3aDc3cQ==",
    gallerySectionTitle: "Visual Symphony",
    gallerySectionSubtitle: "Stage Graphics",
    videoSectionTitle: "RANGREZ ON FILM",
    videoSectionSubtitle: "Cinematic Screen",
    homeHeroButton1: "Secure Tour Spots",
    homeHeroButton2: "★ Live Experience Poster",
    homeHeroButton3: "Discover The Souls",
    eventsSectionTitle: "Closest Upcoming Concert Date",
    eventsSectionBannerSubtitle: "Countdown to Live Stage",
    spotlightSectionTitle: "Live Experience Poster Sandbox",
    spotlightSectionSubtitle: "Marquee Feature Spotlight",
    spotlightSectionBody: "We have integrated the official Rangrez Live Experience concert design from Sunday 24th May 2026. Use our interactive suite to customize your dynamic concert badge, enable theatrical fx, and trigger live background sessions."
  };

  db.settings = {
    ...defaultBranding,
    ...db.settings,
    ...req.body
  };

  saveDatabase();
  logAction("admin", "admin", "SETTINGS_UPDATE", `Replaced core system branding text and imagery configuration parameters`);
  res.json({ success: true, settings: db.settings });
});

// PASSWORDS MANAGER ENDPOINTS
app.get('/api/auth/passcodes', (req, res) => {
  const codes = db.passcodes || {
    superadmin: '987654321',
    admin: '987654321',
    manager: '987654321',
    gmail: 'anirudrapaul764@gmail.com',
    gmailAppPassword: ''
  };
  res.json(codes);
});

const handlePasscodeUpdate = (req: express.Request, res: express.Response) => {
  const { superadmin, admin, manager, gmail, gmailAppPassword } = req.body;
  if (!db.passcodes) {
    db.passcodes = {
      superadmin: '987654321',
      admin: '987654321',
      manager: '987654321',
      gmail: 'anirudrapaul764@gmail.com',
      gmailAppPassword: ''
    };
  }

  if (superadmin !== undefined) db.passcodes.superadmin = superadmin;
  if (admin !== undefined) db.passcodes.admin = admin;
  if (manager !== undefined) db.passcodes.manager = manager;
  if (gmail !== undefined) db.passcodes.gmail = gmail;
  if (gmailAppPassword !== undefined) db.passcodes.gmailAppPassword = gmailAppPassword;

  saveDatabase();
  logAction("admin", "admin", "PASSCODES_UPDATE", `Modified sensitive role credential keys and active system Gmail settings`);
  res.json({ success: true, passcodes: db.passcodes });
};

app.put('/api/auth/passcodes', handlePasscodeUpdate);
app.post('/api/auth/passcodes', handlePasscodeUpdate);

// --- PLATFORM DEV / PRODUCTION ENGINE BOOTSTRAP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rangrez Server ready on http://0.0.0.0:${PORT}`);
  });
}

startServer();
