/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Instagram, Mail, Phone, MapPin, Youtube, ExternalLink, Send, 
  Map, ZoomIn, Eye, Sparkles, CheckSquare, MessageSquare, ShieldCheck, Heart, RefreshCw,
  Lock, EyeOff, Shield
} from 'lucide-react';
import Navbar from './components/Navbar.js';
import Visualizer from './components/Visualizer.js';
import AboutSection from './components/AboutSection.js';
import VideosSection from './components/VideosSection.js';
import EventsSection from './components/EventsSection.js';
import BookingSystem from './components/BookingSystem.js';
import UserDashboard from './components/UserDashboard.js';
import AdminDashboard from './components/AdminDashboard.js';
import HomeHero from './components/HomeHero.js';
import LiveSpotlight from './components/LiveSpotlight.js';
import GallerySection from './components/GallerySection.js';
import ContactSection from './components/ContactSection.js';
import { BRAND_COLORS, LOGO_ITEMS } from './lib/brand.js';
import { User, Event, Booking, Coupon, MusicTrack, VideoClip, GalleryImage, AuditLog, UserRole, BandMember, SystemSettings } from './types.js';
import { 
  FALLBACK_EVENTS,
  FALLBACK_COUPONS,
  FALLBACK_MUSIC,
  FALLBACK_VIDEOS,
  FALLBACK_GALLERY,
  FALLBACK_MEMBERS,
  FALLBACK_SETTINGS
} from './fallbackData.js';

export default function App() {
  // Page Tabs
  const [activeTab, setActiveTab] = useState<string>('home');
  
  // Real-time backend states - populated instantly with local resilient fallbacks
  const [events, setEvents] = useState<Event[]>(FALLBACK_EVENTS);
  const [music, setMusic] = useState<MusicTrack[]>(FALLBACK_MUSIC);
  const [videos, setVideos] = useState<VideoClip[]>(FALLBACK_VIDEOS);
  const [gallery, setGallery] = useState<GalleryImage[]>(FALLBACK_GALLERY);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(FALLBACK_COUPONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [members, setMembers] = useState<BandMember[]>(FALLBACK_MEMBERS);
  const [settings, setSettings] = useState<SystemSettings>(FALLBACK_SETTINGS);

  // Loading/API state
  const [isLoading, setIsLoading] = useState(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User>({
    id: "u-4",
    username: "user",
    email: "user@rangrez.com",
    role: "user",
    fullName: "Rangrez Fan Club",
    createdAt: new Date().toISOString()
  });

  // Audio player global states - pre-linked to first fallback track
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(FALLBACK_MUSIC[0] || null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Booking selections
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<Event | null>(null);

  // Authentication Login simulation fields
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('anirudrapaul764@gmail.com'); // Quick autofill value for convenience
  const [loginPassword, setLoginPassword] = useState('987654321');
  const [loginWithEmailTab, setLoginWithEmailTab] = useState<'credentials' | 'simulator'>('credentials');
  const [loginEmailInput, setLoginEmailInput] = useState('anirudrapaul764@gmail.com');
  const [loginPasswordInput, setLoginPasswordInput] = useState('987654321');
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);

  // Custom sandboxing-safe role switcher states
  const [roleSwitchTarget, setRoleSwitchTarget] = useState<UserRole | null>(null);
  const [roleSwitchPasscode, setRoleSwitchPasscode] = useState('');
  const [roleSwitchEmail, setRoleSwitchEmail] = useState('');
  const [isRoleSwitchModalOpen, setIsRoleSwitchModalOpen] = useState(false);

  // Autofill test passwords securely inside the switch simulator
  useEffect(() => {
    const creds: Record<string, string> = {
      superadmin: '987654321',
      admin: '987654321',
      manager: '987654321',
      user: 'user123'
    };
    if (creds[loginUsername]) {
      setLoginPassword(creds[loginUsername]);
    }
  }, [loginUsername]);

  // --- API STATE HYDRATION WITH GRACEFUL OFFLINE FALLBACKS ---
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      
      // Events
      try {
        const eveRes = await fetch('/api/events');
        const ct = eveRes.headers.get("content-type");
        if (eveRes.ok && ct && ct.includes("application/json")) {
          const eveData = await eveRes.json();
          if (Array.isArray(eveData) && eveData.length > 0) {
            setEvents(eveData);
          }
        }
      } catch (e) {
        console.warn("Backend `/api/events` unreachable, keeping static fallback events list.", e);
      }

      // Media (Music, Videos, Gallery, Members, Settings)
      try {
        const medRes = await fetch('/api/media');
        const ct = medRes.headers.get("content-type");
        if (medRes.ok && ct && ct.includes("application/json")) {
          const medData = await medRes.json();
          if (medData) {
            if (Array.isArray(medData.music) && medData.music.length > 0) {
              setMusic(medData.music);
              setCurrentTrack(prev => prev || medData.music[0]);
            }
            if (Array.isArray(medData.videos) && medData.videos.length > 0) {
              setVideos(medData.videos);
            }
            if (Array.isArray(medData.gallery) && medData.gallery.length > 0) {
              setGallery(medData.gallery);
            }
            if (Array.isArray(medData.members) && medData.members.length > 0) {
              setMembers(medData.members);
            }
            if (medData.settings) {
              setSettings(medData.settings);
            }
          }
        }
      } catch (e) {
        console.warn("Backend `/api/media` unreachable, keeping static fallback media assets.", e);
      }

      // Bookings based on user role
      try {
        await refreshBookingsCount(currentUser);
      } catch (e) {
        console.warn("Failed to synchronize user bookings with backend.", e);
      }

      // Coupons list
      try {
        const coupRes = await fetch('/api/coupons');
        const ct = coupRes.headers.get("content-type");
        if (coupRes.ok && ct && ct.includes("application/json")) {
          const coupData = await coupRes.json();
          if (Array.isArray(coupData) && coupData.length > 0) {
            setCoupons(coupData);
          }
        }
      } catch (e) {
        console.warn("Backend `/api/coupons` unreachable, keeping static fallback coupons.", e);
      }

      // Analytics & Audit logs
      try {
        const anaRes = await fetch('/api/analytics');
        const ct = anaRes.headers.get("content-type");
        if (anaRes.ok && ct && ct.includes("application/json")) {
          const anaData = await anaRes.json();
          if (anaData && Array.isArray(anaData.logs)) {
            setAuditLogs(anaData.logs);
          }
        }
      } catch (e) {
        console.warn("Backend `/api/analytics` unreachable.", e);
      }

    } catch (err) {
      console.error("General error in fetchAllData wrapper:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBookingsCount = async (usr: User) => {
    try {
      // If user is superadmin/admin, fetch all bookings. Otherwise fetch target user details.
      const isPrivileged = usr.role !== 'user';
      const endpoint = isPrivileged ? '/api/bookings' : `/api/bookings?userId=${usr.id}`;
      const res = await fetch(endpoint);
      const ct = res.headers.get("content-type");
      if (res.ok && ct && ct.includes("application/json")) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const refreshAuditTrace = async () => {
    try {
      const res = await fetch('/api/analytics');
      const ct = res.headers.get("content-type");
      if (res.ok && ct && ct.includes("application/json")) {
        const data = await res.json();
        setAuditLogs(data.logs);
      }
    } catch {}
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync state loops on identity change
  useEffect(() => {
    refreshBookingsCount(currentUser);
  }, [currentUser]);

  // --- AUDIO PLAYER CALLBACKS ---
  const handleSelectTrackToPlay = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlayingSound(true);
  };

  const handlePlayPauseToggle = () => {
    setIsPlayingSound(!isPlayingSound);
  };

  const handleNextTrack = () => {
    if (!music.length || !currentTrack) return;
    const currentIdx = music.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (currentIdx + 1) * 1 % music.length;
    setCurrentTrack(music[nextIdx]);
  };

  const handlePrevTrack = () => {
    if (!music.length || !currentTrack) return;
    const currentIdx = music.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (currentIdx - 1 + music.length) % music.length;
    setCurrentTrack(music[prevIdx]);
  };

  // --- ADMINISTRATOR CONSOLE CALLBACKS ---
  const refreshMedia = async () => {
    try {
      const medRes = await fetch('/api/media');
      if (medRes.ok) {
        const medData = await medRes.json();
        setMusic(medData.music);
        setVideos(medData.videos);
        setGallery(medData.gallery);
        if (medData.members) setMembers(medData.members);
        if (medData.settings) setSettings(medData.settings);
      }
    } catch {}
  };

  const handleUpdateEventAPI = async (id: string, eventData: any) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const eveRes = await fetch('/api/events');
        if (eveRes.ok) {
          const eveData = await eveRes.json();
          setEvents(eveData);
        }
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...eventData } : e));
    }
  };

  const handleDeleteCouponAPI = async (code: string) => {
    try {
      const res = await fetch(`/api/coupons/${code}`, { method: 'DELETE' });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        setCoupons(coupons.filter(c => c.code !== code));
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setCoupons(prev => prev.filter(c => c.code !== code));
    }
  };

  const handleUpdateCouponAPI = async (code: string, couponData: any) => {
    try {
      const res = await fetch(`/api/coupons/${code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const coupRes = await fetch('/api/coupons');
        if (coupRes.ok) {
          const coupData = await coupRes.json();
          setCoupons(coupData);
        }
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setCoupons(prev => prev.map(c => c.code === code ? { ...c, ...couponData, discountPercent: Number(couponData.discountPercent), maxUses: Number(couponData.maxUses) } : c));
    }
  };

  // Music handlers
  const handleAddMusicAPI = async (musicData: any) => {
    try {
      const res = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(musicData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      const newTrack: MusicTrack = {
        id: `mus-${Date.now()}`,
        title: musicData.title,
        album: musicData.album || "Single/Album",
        duration: musicData.duration || "3:14",
        audioUrl: musicData.audioUrl || "",
        coverUrl: musicData.coverUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format",
        spotifyUrl: musicData.spotifyUrl || "",
        youtubeUrl: musicData.youtubeUrl || "",
        appleMusicUrl: musicData.appleMusicUrl || "",
        releaseDate: musicData.releaseDate || new Date().toISOString().split('T')[0],
        isPopular: !!musicData.isPopular
      };
      setMusic(prev => [...prev, newTrack]);
    }
  };

  const handleUpdateMusicAPI = async (id: string, musicData: any) => {
    try {
      const res = await fetch(`/api/music/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(musicData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setMusic(prev => prev.map(t => t.id === id ? { ...t, ...musicData } : t));
    }
  };

  const handleDeleteMusicAPI = async (id: string) => {
    try {
      const res = await fetch(`/api/music/${id}`, { method: 'DELETE' });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setMusic(prev => prev.filter(t => t.id !== id));
    }
  };

  // Video handlers
  const handleAddVideoAPI = async (videoData: any) => {
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      const newVideo: VideoClip = {
        id: `vid-${Date.now()}`,
        title: videoData.title,
        type: videoData.type || "bts",
        thumbnailUrl: videoData.thumbnailUrl || "",
        youtubeEmbedId: videoData.youtubeEmbedId,
        duration: videoData.duration || "4:02",
        releaseDate: videoData.releaseDate || new Date().toISOString().split('T')[0]
      };
      setVideos(prev => [...prev, newVideo]);
    }
  };

  const handleUpdateVideoAPI = async (id: string, videoData: any) => {
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setVideos(prev => prev.map(v => v.id === id ? { ...v, ...videoData } : v));
    }
  };

  const handleDeleteVideoAPI = async (id: string) => {
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setVideos(prev => prev.filter(v => v.id !== id));
    }
  };

  // Gallery handlers
  const handleAddGalleryAPI = async (galleryData: any) => {
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      const newImage: GalleryImage = {
        id: `gal-${Date.now()}`,
        ...galleryData,
        createdAt: new Date().toISOString()
      };
      setGallery(prev => [newImage, ...prev]);
    }
  };

  const handleUpdateGalleryAPI = async (id: string, galleryData: any) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setGallery(prev => prev.map(img => img.id === id ? { ...img, ...galleryData } : img));
    }
  };

  const handleDeleteGalleryAPI = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setGallery(prev => prev.filter(img => img.id !== id));
    }
  };

  const handleAddAuditLogAPI = async (action: string, details: string) => {
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          details,
          username: currentUser.username,
          userId: currentUser.id
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs);
      }
    } catch {}
  };

  const handleDeleteAuditLogAPI = async (id: string) => {
    try {
      const res = await fetch(`/api/audit/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs);
      }
    } catch {}
  };

  const handleClearAuditLogsAPI = async () => {
    try {
      const res = await fetch('/api/audit/clear', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs);
      }
    } catch {}
  };

  const handleAddMemberAPI = async (memberData: any) => {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      const newMember: BandMember = {
        id: `mem-${Date.now()}`,
        ...memberData
      };
      setMembers(prev => [...prev, newMember]);
    }
  };

  const handleUpdateMemberAPI = async (id: string, memberData: any) => {
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setMembers(prev => prev.map(m => m.id === id ? { ...m, ...memberData } : m));
    }
  };

  const handleDeleteMemberAPI = async (id: string) => {
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleUpdateSettingsAPI = async (settingsData: any) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        await refreshMedia();
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setSettings(prev => ({ ...prev, ...settingsData }));
    }
  };

  const handleAddCouponAPI = async (couponData: any) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        // Refetch list
        const coupRes = await fetch('/api/coupons');
        if (coupRes.ok) {
          const coupData = await coupRes.json();
          setCoupons(coupData);
        }
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      const newCoupon: Coupon = {
        code: couponData.code.toUpperCase().trim(),
        discountPercent: Number(couponData.discountPercent),
        description: couponData.description || `Special promotion discount code`,
        isActive: true,
        minBookingValue: Number(couponData.minBookingValue) || 0
      };
      setCoupons(prev => [...prev, newCoupon]);
    }
  };

  const handleToggleCouponAPI = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const coupRes = await fetch('/api/coupons');
        if (coupRes.ok) {
          const coupData = await coupRes.json();
          setCoupons(coupData);
        }
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setCoupons(prev => prev.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c));
    }
  };

  const handleAddEventAPI = async (eventData: any) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        // Reload Events
        const eveRes = await fetch('/api/events');
        if (eveRes.ok) {
          const eveData = await eveRes.json();
          setEvents(eveData);
        }
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      const newEvent: Event = {
        id: `eve-${Date.now()}`,
        title: eventData.title,
        tagline: eventData.tagline || "Spectacular Indian fusion tour",
        description: eventData.description || "Live performance experience by Rangrez.",
        date: eventData.date,
        time: eventData.time || "19:30",
        venue: eventData.venue || "The Royal Opera",
        venueAddress: eventData.venueAddress || "",
        googleMapUrl: eventData.googleMapUrl || "",
        city: eventData.city || "Mumbai",
        imageUrl: eventData.imageUrl || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format",
        status: eventData.status || "upcoming",
        categories: eventData.categories || [
          { class: "general", name: "Solo Entry", price: 149, availableSeats: 300, totalSeats: 300, benefits: ["Single person admission"] }
        ],
        totalSales: 0
      };
      setEvents(prev => [...prev, newEvent]);
    }
  };

  const handleDeleteEventAPI = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        setEvents(events.filter(e => e.id !== id));
        refreshAuditTrace();
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleApproveRefundAPI = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/approve-refund`, { method: 'POST' });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        // Sync lists
        refreshBookingsCount(currentUser);
        refreshAuditTrace();
        // Update local events metrics
        const eveRes = await fetch('/api/events');
        if (eveRes.ok) {
          const eveData = await eveRes.json();
          setEvents(eveData);
        }
        alert("Simulated transaction approved. Funds reversed & seats restored.");
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'refunded' } : b));
      alert("Local session action: Simulated transaction approved. Funds reversed & seats restored.");
    }
  };

  const handleCancelBookingDirect = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        refreshBookingsCount(currentUser);
        refreshAuditTrace();
        const eveRes = await fetch('/api/events');
        if (eveRes.ok) {
          const eveData = await eveRes.json();
          setEvents(eveData);
        }
        alert("Booking voided directly.");
        return;
      }
      throw new Error("FallbackToClient");
    } catch {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      alert("Local session action: Booking voided directly.");
    }
  };

  const handleToggleInitiateBookingFlow = (eventItem: Event) => {
    setSelectedEventForBooking(eventItem);
    setActiveTab('booking');
  };

  // --- SIMULATED DUAL LOGIN MODAL ---
  const handleSimulatedSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrorMsg(null);
    const usernameToSend = loginWithEmailTab === 'credentials' ? loginEmailInput : loginUsername;
    const passwordToSend = loginWithEmailTab === 'credentials' ? loginPasswordInput : loginPassword;

    if (!usernameToSend) {
      setLoginErrorMsg("Please enter your email address.");
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameToSend, password: passwordToSend })
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setCurrentUser(data.user);
          setIsLoginModalOpen(false);
          setLoginEmailInput('');
          setLoginPasswordInput('');
          refreshBookingsCount(data.user);
          if (data.user.role !== 'user') {
            setActiveTab('admin');
          } else {
            setActiveTab('home');
          }
          return;
        } else {
          setLoginErrorMsg(data.error || "Login simulation error.");
          return;
        }
      }
      throw new Error("FallbackToClient");
    } catch {
      // Fallback to client-side credential verification (e.g. static host Vercel)
      const emailLower = usernameToSend.toLowerCase().trim();
      let matchedRole: UserRole = 'user';
      let fullName = 'Rangrez Fan Club';
      let matchedUsername = 'user';
      
      if (emailLower === 'superadmin' || emailLower === 'superadmin@rangrez.com') {
        matchedRole = 'superadmin';
        fullName = 'Super Admin (Rangrez Tech)';
        matchedUsername = 'superadmin';
      } else if (emailLower === 'admin' || emailLower === 'admin@rangrez.com' || emailLower === 'anirudrapaul764@gmail.com') {
        matchedRole = 'admin';
        fullName = 'Band Manager (Admin)';
        matchedUsername = 'admin';
      } else if (emailLower === 'manager' || emailLower === 'manager@rangrez.com') {
        matchedRole = 'manager';
        fullName = 'Backstage Operations Manager';
        matchedUsername = 'manager';
      }

      // Verify passcodes locally
      if (matchedRole === 'superadmin' && passwordToSend !== '987654321') {
        setLoginErrorMsg("Access Denied: Invalid Superadmin passcode. Try: 987654321");
        return;
      }
      if (matchedRole === 'admin' && passwordToSend !== '987654321') {
        setLoginErrorMsg("Access Denied: Invalid Admin password. Try: 987654321");
        return;
      }
      if (matchedRole === 'manager' && passwordToSend !== '987654321') {
        setLoginErrorMsg("Access Denied: Invalid Manager operational PIN. Try: 987654321");
        return;
      }

      const fallbackUser: User = {
        id: `u-${matchedRole === 'superadmin' ? '1' : matchedRole === 'admin' ? '2' : matchedRole === 'manager' ? '3' : '4'}`,
        username: matchedUsername,
        email: matchedRole === 'admin' ? 'anirudrapaul764@gmail.com' : `${matchedUsername}@rangrez.com`,
        role: matchedRole,
        fullName: fullName,
        createdAt: new Date().toISOString()
      };

      setCurrentUser(fallbackUser);
      setIsLoginModalOpen(false);
      setLoginEmailInput('');
      setLoginPasswordInput('');
      refreshBookingsCount(fallbackUser);
      if (fallbackUser.role !== 'user') {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
      }
    }
  };

  // --- REVIEWER SWITCH ROLE PORTAL CODES ---
  const handleSwitchUserRole = async (targetRole: UserRole) => {
    if (targetRole === 'user') {
      try {
        const res = await fetch('/api/auth/switch-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id, role: targetRole, passcode: "" })
        });
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success) {
            setCurrentUser(data.user);
            refreshBookingsCount(data.user);
            alert(`Session securely reverted to: ${targetRole.toUpperCase()}`);
            return;
          } else {
            alert(data.error || `Failed to authenticate credentials for switching to ${targetRole}`);
            return;
          }
        }
        throw new Error("FallbackToClient");
      } catch {
        const updatedUser = {
          ...currentUser,
          role: targetRole
        };
        setCurrentUser(updatedUser);
        refreshBookingsCount(updatedUser);
        alert(`Session reverted successfully to: ${targetRole.toUpperCase()}`);
      }
      return;
    }

    // Otherwise, open our custom switch role modal manually for credential verification
    setRoleSwitchTarget(targetRole);
    setRoleSwitchPasscode('987654321');
    setRoleSwitchEmail('anirudrapaul764@gmail.com');
    setIsRoleSwitchModalOpen(true);
  };

  const handleCustomRoleSwitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleSwitchTarget) return;

    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUser.id, 
          role: roleSwitchTarget, 
          passcode: roleSwitchPasscode,
          usernameOrEmail: roleSwitchEmail
        })
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setCurrentUser(data.user);
          refreshBookingsCount(data.user);
          setIsRoleSwitchModalOpen(false);
          setRoleSwitchTarget(null);
          alert(`Session securely upgraded! Switched role to: ${roleSwitchTarget.toUpperCase()}`);
          if (roleSwitchTarget !== 'user') {
            setActiveTab('admin');
          } else {
            setActiveTab('home');
          }
          return;
        } else {
          alert(data.error || `Failed to authenticate credentials for switching to ${roleSwitchTarget}`);
          return;
        }
      }
      throw new Error("FallbackToClient");
    } catch {
      // Offline / Serverless static fallback (e.g. Vercel deployment)
      if (roleSwitchTarget !== 'user') {
        if (!roleSwitchEmail) {
          alert("Access Denied: Email or Username is required.");
          return;
        }
        const emailLower = roleSwitchEmail.toLowerCase().trim();
        if (emailLower !== 'anirudrapaul764@gmail.com') {
          alert(`Access Denied: '${roleSwitchEmail}' is not the authorized email. Please use: anirudrapaul764@gmail.com`);
          return;
        }
        if (roleSwitchPasscode !== '987654321') {
          alert("Access Denied: Invalid passcode. Please use: 987654321");
          return;
        }
      }

      // Upgrade local state
      const updatedUser = {
        ...currentUser,
        role: roleSwitchTarget
      };
      setCurrentUser(updatedUser);
      refreshBookingsCount(updatedUser);
      setIsRoleSwitchModalOpen(false);
      setRoleSwitchTarget(null);
      alert(`Session upgraded successfully! Switched role to: ${roleSwitchTarget.toUpperCase()}`);
      if (roleSwitchTarget !== 'user') {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
      }
    }
  };

  const handleBookingSuccessfulCallback = (booking: Booking) => {
    // Reload ticket lists & proceed to personal profile page
    // Ensure lists are refreshed
    refreshBookingsCount(currentUser);
    // Timeout-guided transition to user dashboard section
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 3000);
  };

  const handleRequestBookingCancellationFromUser = async (bookingId: string) => {
    if (confirm("Are you sure you want to request cancellation for this booking? The management team will review and approve Simulated Refunds.")) {
      try {
        const res = await fetch(`/api/bookings/${bookingId}/request-refund`, { method: 'POST' });
        if (res.ok) {
          refreshBookingsCount(currentUser);
          refreshAuditTrace();
          alert("Cancel & refund request submitted to the Backstage committee!");
        }
      } catch {}
    }
  };

  const getNearestUpcomingConcert = (): Event | null => {
    if (!events.length) return null;
    const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted[0];
  };

  return (
    <div className={`min-h-screen ${BRAND_COLORS.primaryBg} font-sans flex flex-col justify-between overflow-x-hidden relative`}>
      
      {/* 3D Motion Particle Canvas Ambient Sound Environment */}
      <Visualizer isPlaying={isPlayingSound} activeTrackId={currentTrack?.id} />

      {/* Decorative Widescreen ambient lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#8A2BE2]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[110px] pointer-events-none z-0" />

      {/* Navigation Header bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchUserRole}
        onLogout={() => setIsLoginModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* PRIMARY VIEWS SWITCH COMPILATION PANEL */}
      <main className="flex-1 w-full pb-32">
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4 text-white">
            <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
            <span className="text-xs font-mono text-zinc-400">Loading Rangrez digital catalog assets...</span>
          </div>
        ) : (
          <>
            {/* 1. HOME VIEW */}
            {activeTab === 'home' && (
              <HomeHero
                onLearnMoreAboutBand={() => setActiveTab('about')}
                onExploreTourEvents={() => setActiveTab('events')}
                onViewLivePoster={() => setActiveTab('spotlight')}
                upcomingEvent={getNearestUpcomingConcert()}
                settings={settings}
              />
            )}

            {/* 2. ABOUT VIEW (BIOGRAPHTIMELINES) */}
            {activeTab === 'about' && <AboutSection members={members} settings={settings} />}

            {/* 4. VIDEOS GRID VIEWS */}
            {activeTab === 'videos' && <VideosSection videos={videos} settings={settings} />}

            {/* 4.5 LIVE EXPERIENCE SPOTLIGHT ARCHIVE */}
            {activeTab === 'spotlight' && (
              <LiveSpotlight
                currentTrack={currentTrack}
                isPlayingSound={isPlayingSound}
                onPlayPauseToggle={handlePlayPauseToggle}
                onSelectTrackToPlay={handleSelectTrackToPlay}
                musicList={music}
                settings={settings}
              />
            )}

            {/* 5. TOUR TOUR LIST */}
            {activeTab === 'events' && (
              <EventsSection
                events={events}
                onSelectEventForBooking={handleToggleInitiateBookingFlow}
                settings={settings}
              />
            )}

            {/* 6. ADVANCED TICKETS RESERVATION CORE ENGINE */}
            {activeTab === 'booking' && selectedEventForBooking && (
              <BookingSystem
                selectedEvent={selectedEventForBooking}
                onBookingSuccess={handleBookingSuccessfulCallback}
                onCancelBookingFlow={() => {
                  setSelectedEventForBooking(null);
                  setActiveTab('events');
                }}
              />
            )}

            {/* 7. USER PROFILE INVOICES DASHBOARD */}
            {activeTab === 'dashboard' && (
              <UserDashboard
                currentUser={currentUser}
                bookings={bookings}
                onCancelRequest={handleRequestBookingCancellationFromUser}
                onRequestRefund={handleRequestBookingCancellationFromUser}
              />
            )}

            {/* 8. ADMINISTRATOR MANAGEMENT CONSOLE PANEL */}
            {activeTab === 'admin' && (
              <AdminDashboard
                currentUser={currentUser}
                events={events}
                bookings={bookings}
                coupons={coupons}
                auditLogs={auditLogs}
                onAddEvent={handleAddEventAPI}
                onUpdateEvent={handleUpdateEventAPI}
                onDeleteEvent={handleDeleteEventAPI}
                onApproveRefund={handleApproveRefundAPI}
                onCancelBookingDirectly={handleCancelBookingDirect}
                onAddCoupon={handleAddCouponAPI}
                onUpdateCoupon={handleUpdateCouponAPI}
                onToggleCoupon={handleToggleCouponAPI}
                onDeleteCoupon={handleDeleteCouponAPI}
                music={music}
                videos={videos}
                gallery={gallery}
                onAddMusic={handleAddMusicAPI}
                onUpdateMusic={handleUpdateMusicAPI}
                onDeleteMusic={handleDeleteMusicAPI}
                onAddVideo={handleAddVideoAPI}
                onUpdateVideo={handleUpdateVideoAPI}
                onDeleteVideo={handleDeleteVideoAPI}
                onAddGallery={handleAddGalleryAPI}
                onUpdateGallery={handleUpdateGalleryAPI}
                onDeleteGallery={handleDeleteGalleryAPI}
                onAddAuditLog={handleAddAuditLogAPI}
                onDeleteAuditLog={handleDeleteAuditLogAPI}
                onClearAuditLogs={handleClearAuditLogsAPI}
                members={members}
                settings={settings}
                onAddMember={handleAddMemberAPI}
                onUpdateMember={handleUpdateMemberAPI}
                onDeleteMember={handleDeleteMemberAPI}
                onUpdateSettings={handleUpdateSettingsAPI}
              />
            )}

            {/* 9. MASONRY PHOTO GALLERY VIEWS */}
            {activeTab === 'gallery' && (
              <GallerySection gallery={gallery} settings={settings} />
            )}

            {/* 10. CONTACT COMPILER INQUIRY */}
            {activeTab === 'contact' && (
              <ContactSection settings={settings} />
            )}
          </>
        )}
      </main>

      {/* FOOTER AREA */}
      <footer className="bg-black/80 border-t border-white/5 py-10 px-6 relative z-10 text-center text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <LOGO_ITEMS.IconLogo className="w-10 h-10 filter brightness-95" />
          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.25em] text-[#D4AF37] font-mono uppercase font-bold block">
               Rangrez Fusion Band © 2026
            </span>
            <p className="max-w-md mx-auto text-[11px] text-zinc-500">
              Rooted In Soul. Driven By Energy. Sitar fusion, heavy classical rock and high-energy vocals of Pune. All rights reserved. Registered under Cultural Shreyora Brands.
            </p>
          </div>
        </div>
      </footer>
      {/* MULTI ROLE SECURE EMAIL AND PASSWORD LOGIN POPUP MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-[#000]/95 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#181524] border border-[#8A2BE2]/40 p-6 rounded-3xl max-w-md w-full space-y-6 text-white text-center shadow-2xl relative">
            
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono text-[#D4AF37] tracking-widest block font-bold">Secure Access System</span>
              <h3 className="text-lg font-bold text-white">Rangrez Identity Portal</h3>
              <p className="text-zinc-400 text-[11px]">
                Sign in using your authorization email/username and secure passcode.
              </p>
            </div>

            {/* ERROR BANNER */}
            {loginErrorMsg && (
              <div className="bg-red-950/40 border border-red-500/30 text-red-200 text-[11px] p-3 rounded-xl text-left flex items-start gap-2 animate-pulse">
                <span className="text-red-400 font-bold block">⚠️</span>
                <span>{loginErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSimulatedSubmitLogin} className="space-y-4">
              
              {/* --- MANUAL EMAIL & PASSWORD INPUTS --- */}
              <div className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#D4AF37]" />
                    Email/Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. superadmin@rangrez.com"
                    value={loginEmailInput}
                    onChange={(e) => {
                      setLoginEmailInput(e.target.value);
                      setLoginErrorMsg(null);
                    }}
                    className="w-full bg-[#100c1e] border border-white/10 focus:border-[#D4AF37] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#D4AF37]" />
                      Secure Passcode
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter secure passcode"
                      value={loginPasswordInput}
                      onChange={(e) => {
                        setLoginPasswordInput(e.target.value);
                        setLoginErrorMsg(null);
                      }}
                      className="w-full bg-[#100c1e] border border-white/10 focus:border-[#D4AF37] focus:outline-none rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white font-mono placeholder-zinc-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8A2BE2] text-black font-extrabold uppercase text-xs tracking-wider font-mono flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Authenticate Credentials
              </button>
            </form>

            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                setLoginErrorMsg(null);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ROLE SWITCH OVERLAY DIALOG */}
      {isRoleSwitchModalOpen && roleSwitchTarget && (
        <div className="fixed inset-0 bg-[#000]/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#181524] border border-[#8A2BE2]/40 p-6 rounded-3xl max-w-sm w-full space-y-6 text-white text-center">
            
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono text-[#D4AF37] tracking-widest block font-bold">RBAC Escalation Shield</span>
              <h3 className="text-lg font-bold text-white">Enter Security Token</h3>
              <p className="text-zinc-400 text-[11px]">
                You are requesting escalation to <span className="text-[#D4AF37] uppercase font-bold">{roleSwitchTarget === 'manager' ? 'Staff Manager' : roleSwitchTarget}</span>.
              </p>
            </div>

            <form onSubmit={handleCustomRoleSwitchSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] text-zinc-400 uppercase font-mono font-bold flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#D4AF37]" />
                  Email/Username Required
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter email or username"
                  value={roleSwitchEmail}
                  onChange={(e) => setRoleSwitchEmail(e.target.value)}
                  className="w-full bg-[#100c1e] border border-white/10 focus:border-[#D4AF37] focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 shadow-inner"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[9px] text-[#D4AF37] uppercase font-mono font-bold block">Security Passcode Required</label>
                <input
                  type="password"
                  required
                  placeholder="Security passcode key"
                  value={roleSwitchPasscode}
                  onChange={(e) => setRoleSwitchPasscode(e.target.value)}
                  className="w-full bg-[#100c1e] border border-white/10 focus:border-[#D4AF37] focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8A2BE2] text-black font-extrabold uppercase text-xs tracking-wider font-mono flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Confirm Escalation
              </button>
            </form>

            <button
              onClick={() => {
                setIsRoleSwitchModalOpen(false);
                setRoleSwitchTarget(null);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
