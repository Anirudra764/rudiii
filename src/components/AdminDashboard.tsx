/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Ticket, Award, Settings, Calendar, ShieldCheck, 
  Trash2, Plus, Percent, RefreshCw, Layers, Check, AlertTriangle, 
  FileSpreadsheet, Key, Music, Video, Image, Save, X, Edit2, Play, 
  ExternalLink, Sparkles, Eye, Disc
} from 'lucide-react';
import { 
  User, Event, Booking, Coupon, AuditLog, 
  MusicTrack, VideoClip, GalleryImage, BandMember, SystemSettings
} from '../types.js';
import { ImageUploadWidget } from './ImageUploadWidget.js';
import { VideoUploadWidget } from './VideoUploadWidget.js';

interface AdminDashboardProps {
  currentUser: User;
  events: Event[];
  bookings: Booking[];
  coupons: Coupon[];
  auditLogs: AuditLog[];
  onAddEvent: (eventData: any) => void;
  onUpdateEvent: (eventId: string, eventData: any) => void;
  onDeleteEvent: (eventId: string) => void;
  onApproveRefund: (bookingId: string) => void;
  onCancelBookingDirectly: (bookingId: string) => void;
  onAddCoupon: (couponData: any) => void;
  onUpdateCoupon: (code: string, couponData: any) => void;
  onToggleCoupon: (code: string) => void;
  onDeleteCoupon: (code: string) => void;
  music: MusicTrack[];
  videos: VideoClip[];
  gallery: GalleryImage[];
  onAddMusic: (musicData: any) => void;
  onUpdateMusic: (id: string, musicData: any) => void;
  onDeleteMusic: (id: string) => void;
  onAddVideo: (videoData: any) => void;
  onUpdateVideo: (id: string, videoData: any) => void;
  onDeleteVideo: (id: string) => void;
  onAddGallery: (galleryData: any) => void;
  onUpdateGallery: (id: string, galleryData: any) => void;
  onDeleteGallery: (id: string) => void;
  onAddAuditLog?: (action: string, details: string) => void;
  onDeleteAuditLog?: (id: string) => void;
  onClearAuditLogs?: () => void;
  members?: BandMember[];
  settings?: SystemSettings;
  onAddMember?: (memberData: any) => void;
  onUpdateMember?: (id: string, memberData: any) => void;
  onDeleteMember?: (id: string) => void;
  onUpdateSettings?: (settingsData: any) => void;
}

export default function AdminDashboard({
  currentUser,
  events,
  bookings,
  coupons,
  auditLogs,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onApproveRefund,
  onCancelBookingDirectly,
  onAddCoupon,
  onUpdateCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  music,
  videos,
  gallery,
  onAddMusic,
  onUpdateMusic,
  onDeleteMusic,
  onAddVideo,
  onUpdateVideo,
  onDeleteVideo,
  onAddGallery,
  onUpdateGallery,
  onDeleteGallery,
  onAddAuditLog,
  onDeleteAuditLog,
  onClearAuditLogs,
  members = [],
  settings,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onUpdateSettings
}: AdminDashboardProps) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'kpi' | 'scheduler' | 'refunds' | 'coupons' | 'music' | 'videos' | 'gallery' | 'members' | 'branding' | 'auditing' | 'passcodes'>('kpi');
  
  // --- BAND MEMBERS MANAGEMENT CONSOLE STATE ---
  const [editingMember, setEditingMember] = useState<BandMember | null>(null);
  const [newMemberArtist, setNewMemberArtist] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberQuote, setNewMemberQuote] = useState('');
  const [newMemberImageUrl, setNewMemberImageUrl] = useState('');
  const [newMemberSkills, setNewMemberSkills] = useState('');

  // --- SITE BRANDING / SETTINGS STATE CONTROLS ---
  const [heroBgInput, setHeroBgInput] = useState(settings?.heroBgUrl || '');
  const [mainSingerInput, setMainSingerInput] = useState(settings?.posterMainSingerUrl || '');
  const [silhouetteInput, setSilhouetteInput] = useState(settings?.posterSilhouetteUrl || '');

  const [bandNameInput, setBandNameInput] = useState(settings?.bandName || '');
  const [taglineInput, setTaglineInput] = useState(settings?.tagline || '');
  const [creedTitleInput, setCreedTitleInput] = useState(settings?.creedTitle || '');
  const [creedBodyInput, setCreedBodyInput] = useState(settings?.creedBody || '');
  
  const [storyHeadingInput, setStoryHeadingInput] = useState(settings?.storyHeading || '');
  const [storyParagraph1Input, setStoryParagraph1Input] = useState(settings?.storyParagraph1 || '');
  const [storyParagraph2Input, setStoryParagraph2Input] = useState(settings?.storyParagraph2 || '');
  
  const [posterMainTitleInput, setPosterMainTitleInput] = useState(settings?.posterMainTitle || '');
  const [posterSubTitleInput, setPosterSubTitleInput] = useState(settings?.posterSubTitle || '');
  const [posterSloganInput, setPosterSloganInput] = useState(settings?.posterSlogan || '');
  const [posterFooterLeftInput, setPosterFooterLeftInput] = useState(settings?.posterFooterLeft || '');
  const [posterFooterMiddleInput, setPosterFooterMiddleInput] = useState(settings?.posterFooterMiddle || '');
  const [posterFooterRightInput, setPosterFooterRightInput] = useState(settings?.posterFooterRight || '');

  const [stat1NumberInput, setStat1NumberInput] = useState(settings?.stat1Number || '');
  const [stat1LabelInput, setStat1LabelInput] = useState(settings?.stat1Label || '');
  const [stat2NumberInput, setStat2NumberInput] = useState(settings?.stat2Number || '');
  const [stat2LabelInput, setStat2LabelInput] = useState(settings?.stat2Label || '');
  const [stat3NumberInput, setStat3NumberInput] = useState(settings?.stat3Number || '');
  const [stat3LabelInput, setStat3LabelInput] = useState(settings?.stat3Label || '');

  const [contactEmailInput, setContactEmailInput] = useState(settings?.contactEmail || '');
  const [contactPhoneInput, setContactPhoneInput] = useState(settings?.contactPhone || '');
  const [contactOfficeInput, setContactOfficeInput] = useState(settings?.contactOffice || '');
  const [contactInstagramInput, setContactInstagramInput] = useState(settings?.contactInstagram || '');

  const [gallerySectionTitleInput, setGallerySectionTitleInput] = useState(settings?.gallerySectionTitle || '');
  const [gallerySectionSubtitleInput, setGallerySectionSubtitleInput] = useState(settings?.gallerySectionSubtitle || '');
  const [videoSectionTitleInput, setVideoSectionTitleInput] = useState(settings?.videoSectionTitle || '');
  const [videoSectionSubtitleInput, setVideoSectionSubtitleInput] = useState(settings?.videoSectionSubtitle || '');
  const [homeHeroButton1Input, setHomeHeroButton1Input] = useState(settings?.homeHeroButton1 || '');
  const [homeHeroButton2Input, setHomeHeroButton2Input] = useState(settings?.homeHeroButton2 || '');
  const [homeHeroButton3Input, setHomeHeroButton3Input] = useState(settings?.homeHeroButton3 || '');
  const [eventsSectionTitleInput, setEventsSectionTitleInput] = useState(settings?.eventsSectionTitle || '');
  const [eventsSectionBannerSubtitleInput, setEventsSectionBannerSubtitleInput] = useState(settings?.eventsSectionBannerSubtitle || '');
  const [spotlightSectionTitleInput, setSpotlightSectionTitleInput] = useState(settings?.spotlightSectionTitle || '');
  const [spotlightSectionSubtitleInput, setSpotlightSectionSubtitleInput] = useState(settings?.spotlightSectionSubtitle || '');
  const [spotlightSectionBodyInput, setSpotlightSectionBodyInput] = useState(settings?.spotlightSectionBody || '');

  // --- PASSWORDS MANAGEMENT STATES ---
  const [superadminPasscode, setSuperadminPasscode] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [managerPasscode, setManagerPasscode] = useState('');
  const [isPasscodesLoading, setIsPasscodesLoading] = useState(false);
  const [passcodeSuccessMsg, setPasscodeSuccessMsg] = useState('');
  const [passcodeErrorMsg, setPasscodeErrorMsg] = useState('');

  // --- STATE FOR DYNAMIC CUSTOMIZATIONS / MODALS ---
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editingMusic, setEditingMusic] = useState<MusicTrack | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoClip | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryImage | null>(null);

  // --- MANUAL AUDIT MANAGEMENT STATE ---
  const [customAuditAction, setCustomAuditAction] = useState('');
  const [customAuditDetails, setCustomAuditDetails] = useState('');
  const [isAddAuditOpen, setIsAddAuditOpen] = useState(false);

  // --- CONCERT CREATOR & EDITOR STATE ---
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCity, setNewEventCity] = useState('Pune');
  const [newEventVenue, setNewEventVenue] = useState('');
  const [newEventVenueAddress, setNewEventVenueAddress] = useState('');
  const [newEventGoogleMapUrl, setNewEventGoogleMapUrl] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-08-15');
  const [newEventTime, setNewEventTime] = useState('18:30');
  const [newEventPrice, setNewEventPrice] = useState('149');
  const [newEventImageUrl, setNewEventImageUrl] = useState('');

  const [editEventTitle, setEditEventTitle] = useState('');
  const [editEventTagline, setEditEventTagline] = useState('');
  const [editEventDesc, setEditEventDesc] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [editEventTime, setEditEventTime] = useState('');
  const [editEventVenue, setEditEventVenue] = useState('');
  const [editEventVenueAddress, setEditEventVenueAddress] = useState('');
  const [editEventGoogleMapUrl, setEditEventGoogleMapUrl] = useState('');
  const [editEventCity, setEditEventCity] = useState('');
  const [editEventImageUrl, setEditEventImageUrl] = useState('');
  const [editEventStatus, setEditEventStatus] = useState<Event['status']>('upcoming');
  
  // Category specs
  const [editVipPrice, setEditVipPrice] = useState(250);
  const [editVipSeats, setEditVipSeats] = useState(30);
  const [editPitPrice, setEditPitPrice] = useState(200);
  const [editPitSeats, setEditPitSeats] = useState(80);
  const [editGenPrice, setEditGenPrice] = useState(149);
  const [editGenSeats, setEditGenSeats] = useState(300);

  // --- COUPOUN STATE FOR FORMS ---
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState('20');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponMinVal, setNewCouponMinVal] = useState('');

  const [editCouponPercent, setEditCouponPercent] = useState('25');
  const [editCouponDesc, setEditCouponDesc] = useState('');
  const [editCouponMinVal, setEditCouponMinVal] = useState('');

  // --- MUSIC TRACK STATE FOR FORMS ---
  const [isAddMusicOpen, setIsAddMusicOpen] = useState(false);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackAlbum, setTrackAlbum] = useState('');
  const [trackDuration, setTrackDuration] = useState('04:15');
  const [trackAudioUrl, setTrackAudioUrl] = useState('');
  const [trackCoverUrl, setTrackCoverUrl] = useState('');
  const [trackSpotify, setTrackSpotify] = useState('');
  const [trackYoutube, setTrackYoutube] = useState('');
  const [trackApple, setTrackApple] = useState('');
  const [trackRelease, setTrackRelease] = useState('2026-06-01');
  const [trackIsPopular, setTrackIsPopular] = useState(false);

  // --- FEATURED VIDEOS STATE FOR FORMS ---
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [vidTitle, setVidTitle] = useState('');
  const [vidType, setVidType] = useState<VideoClip['type']>('live');
  const [vidThumb, setVidThumb] = useState('');
  const [vidEmbedId, setVidEmbedId] = useState('');
  const [vidDuration, setVidDuration] = useState('05:30');
  const [vidRelease, setVidRelease] = useState('2026-06-01');

  // --- MASONRY GALLERY FILE STATE ---
  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false);
  const [galUrl, setGalUrl] = useState('');
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryImage['category']>('performance');

  // --- STYLISH DYNAMIC NON-BLOCKING CONFIRMATION SYSTEM ---
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionLabel: string;
    actionColor: 'red' | 'green' | 'amber';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    actionLabel: 'Confirm',
    actionColor: 'red',
    onConfirm: () => {}
  });

  const showConfirm = (options: {
    title: string;
    message: string;
    actionLabel?: string;
    actionColor?: 'red' | 'green' | 'amber';
    onConfirm: () => void;
  }) => {
    setConfirmState({
      isOpen: true,
      title: options.title,
      message: options.message,
      actionLabel: options.actionLabel || 'Proceed & Purge',
      actionColor: options.actionColor || 'red',
      onConfirm: () => {
        options.onConfirm();
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Sync core settings state variables when loaded from database
  React.useEffect(() => {
    if (settings) {
      setHeroBgInput(settings.heroBgUrl || '');
      setMainSingerInput(settings.posterMainSingerUrl || '');
      setSilhouetteInput(settings.posterSilhouetteUrl || '');
      setBandNameInput(settings.bandName || 'RANGREZ');
      setTaglineInput(settings.tagline || '★ SANSKRIT ROOTED SUFI FUSION ROCK ★');
      setCreedTitleInput(settings.creedTitle || 'Rangrez Creed');
      setCreedBodyInput(settings.creedBody || "We don't just play music, we create feelings. Driven by energy, connected by rhythm, we turn every single performance into a highly memorable shared experience.");
      setStoryHeadingInput(settings.storyHeading || 'Sanskrit Roots Meets Heavy Electric Amplification');
      setStoryParagraph1Input(settings.storyParagraph1 || "The term Rangrez signifies the dyer of souls. Rooted firmly in traditional Hindustani classical frameworks, we do not merely play musical rhythms; we paint feelings across an infinite cosmic frequency map.");
      setStoryParagraph2Input(settings.storyParagraph2 || "From the deep heart-touching woodwind structures of Yash's Bansuri flutes to the hyperkinetic rhythm sweeps of V. Anand’s classical tablas, complemented by Vishnu's heavy distorted heavy metal guitar solos — Rangrez is a majestic auditory storm of classical soul and modern high-energy rock combined.");
      setPosterMainTitleInput(settings.posterMainTitle || 'RANGREZ');
      setPosterSubTitleInput(settings.posterSubTitle || 'LIVE EXPERIENCE');
      setPosterSloganInput(settings.posterSlogan || "ONE STAGE.\nONE SOUND.\nONE IDENTITY.");
      setPosterFooterLeftInput(settings.posterFooterLeft || 'THE CULTURE.');
      setPosterFooterMiddleInput(settings.posterFooterMiddle || 'SUNDAY 24TH MAY 2026');
      setPosterFooterRightInput(settings.posterFooterRight || 'SHREYORA - Street meets statement');
      setStat1NumberInput(settings.stat1Number || '120+');
      setStat1LabelInput(settings.stat1Label || 'Concerts Played');
      setStat2NumberInput(settings.stat2Number || '8M+');
      setStat2LabelInput(settings.stat2Label || 'Digital Streams');
      setStat3NumberInput(settings.stat3Number || '100%');
      setStat3LabelInput(settings.stat3Label || 'Soul & Energy');
      setContactEmailInput(settings.contactEmail || 'rangrezencore@gmail.com');
      setContactPhoneInput(settings.contactPhone || '+91 98765 43210');
      setContactOfficeInput(settings.contactOffice || 'Koregaon Park Road, Pune, Maharashtra');
      setContactInstagramInput(settings.contactInstagram || 'https://www.instagram.com/rangrezencore?igsh=MWNpZThta3A3aDc3cQ==');
      setGallerySectionTitleInput(settings.gallerySectionTitle || 'Visual Symphony');
      setGallerySectionSubtitleInput(settings.gallerySectionSubtitle || 'Stage Graphics');
      setVideoSectionTitleInput(settings.videoSectionTitle || 'RANGREZ ON FILM');
      setVideoSectionSubtitleInput(settings.videoSectionSubtitle || 'Cinematic Screen');
      setHomeHeroButton1Input(settings.homeHeroButton1 || 'Secure Tour Spots');
      setHomeHeroButton2Input(settings.homeHeroButton2 || '★ Live Experience Poster');
      setHomeHeroButton3Input(settings.homeHeroButton3 || 'Discover The Souls');
      setEventsSectionTitleInput(settings.eventsSectionTitle || 'Closest Upcoming Concert Date');
      setEventsSectionBannerSubtitleInput(settings.eventsSectionBannerSubtitle || 'Countdown to Live Stage');
      setSpotlightSectionTitleInput(settings.spotlightSectionTitle || 'Live Experience Poster Sandbox');
      setSpotlightSectionSubtitleInput(settings.spotlightSectionSubtitle || 'Marquee Feature Spotlight');
      setSpotlightSectionBodyInput(settings.spotlightSectionBody || 'We have integrated the official Rangrez Live Experience concert design from Sunday 24th May 2026. Use our interactive suite to customize your dynamic concert badge, enable theatrical fx, and trigger live background sessions.');
    }
  }, [settings]);

  // Fetch current passcodes for editing
  React.useEffect(() => {
    fetch('/api/auth/passcodes')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSuperadminPasscode(data.superadmin || '');
          setAdminPasscode(data.admin || '');
          setManagerPasscode(data.manager || '');
        }
      })
      .catch(err => console.error("Could not fetch system security passcodes:", err));
  }, []);

  // Everyone opening the Administrative Operations Console has full master level permissions for extreme simulation and sandboxing convenience
  const isSuperadmin = true;
  const isAdminOrSuper = true;

  // Math aggregates
  const activeConfirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const totalSimulatedRevenue = activeConfirmedBookings.reduce((sum, b) => sum + b.total, 0);
  const totalSeatsSold = activeConfirmedBookings.reduce((sum, b) => sum + b.items.reduce((acc, i) => acc + i.quantity, 0), 0);
  const refundQueue = bookings.filter(b => b.status === 'refund_requested');

  // --- MOUNT TRIGGERS ---
  const triggerEditEvent = (ev: Event) => {
    setEditingEvent(ev);
    setEditEventTitle(ev.title);
    setEditEventTagline(ev.tagline || 'Spectacular Indian fusion tour');
    setEditEventDesc(ev.description || '');
    setEditEventDate(ev.date);
    setEditEventTime(ev.time);
    setEditEventVenue(ev.venue);
    setEditEventVenueAddress(ev.venueAddress || '');
    setEditEventGoogleMapUrl(ev.googleMapUrl || '');
    setEditEventCity(ev.city);
    setEditEventImageUrl(ev.imageUrl || '');
    setEditEventStatus(ev.status || 'upcoming');

    const vip = ev.categories.find(c => c.class === 'vip');
    const fanpit = ev.categories.find(c => c.class === 'fanpit');
    const general = ev.categories.find(c => c.class === 'general');

    if (vip) {
      setEditVipPrice(vip.price);
      setEditVipSeats(vip.totalSeats);
    }
    if (fanpit) {
      setEditPitPrice(fanpit.price);
      setEditPitSeats(fanpit.totalSeats);
    }
    if (general) {
      setEditGenPrice(general.price);
      setEditGenSeats(general.totalSeats);
    }
  };

  const resetEditEventForm = () => {
    setEditingEvent(null);
    setEditEventTitle('');
    setEditEventTagline('');
    setEditEventDesc('');
    setEditEventDate('');
    setEditEventTime('');
    setEditEventVenue('');
    setEditEventVenueAddress('');
    setEditEventGoogleMapUrl('');
    setEditEventCity('');
    setEditEventImageUrl('');
    setEditEventStatus('upcoming');
    setEditVipPrice(250);
    setEditVipSeats(30);
    setEditPitPrice(200);
    setEditPitSeats(80);
    setEditGenPrice(149);
    setEditGenSeats(300);
  };

  const handleUpdateEventSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    // Preserve booked counts
    const updatedCategories = editingEvent.categories.map(c => {
      if (c.class === 'vip') {
        const sold = c.totalSeats - c.availableSeats;
        return {
          ...c,
          price: Number(editVipPrice),
          totalSeats: Number(editVipSeats),
          availableSeats: Math.max(0, Number(editVipSeats) - sold)
        };
      }
      if (c.class === 'fanpit') {
        const sold = c.totalSeats - c.availableSeats;
        return {
          ...c,
          price: Number(editPitPrice),
          totalSeats: Number(editPitSeats),
          availableSeats: Math.max(0, Number(editPitSeats) - sold)
        };
      }
      if (c.class === 'general') {
        const sold = c.totalSeats - c.availableSeats;
        return {
          ...c,
          price: Number(editGenPrice),
          totalSeats: Number(editGenSeats),
          availableSeats: Math.max(0, Number(editGenSeats) - sold)
        };
      }
      return c;
    });

    onUpdateEvent(editingEvent.id, {
      title: editEventTitle,
      tagline: editEventTagline,
      description: editEventDesc,
      date: editEventDate,
      time: editEventTime,
      venue: editEventVenue,
      venueAddress: editEventVenueAddress,
      googleMapUrl: editEventGoogleMapUrl,
      city: editEventCity,
      imageUrl: editEventImageUrl,
      status: editEventStatus,
      categories: updatedCategories
    });

    resetEditEventForm();
    alert("Event parameters updated successfully in live site database.");
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventVenue) {
      alert("Please provide a title and venue details.");
      return;
    }

    onAddEvent({
      title: newEventTitle,
      tagline: "Spectacular Indian fusion tour",
      description: "Witness direct classical instrumental sitar rock with high intensity lasers and surround dynamic atmospheric reverb systems.",
      date: newEventDate,
      time: newEventTime,
      venue: newEventVenue,
      venueAddress: newEventVenueAddress,
      googleMapUrl: newEventGoogleMapUrl,
      city: newEventCity,
      imageUrl: newEventImageUrl || undefined,
      categories: [
        { class: "vip", name: "₹250 Couple Entry + 25% Food Coupon", price: 250, availableSeats: 30, totalSeats: 30, benefits: ["Admittance for 2 (Couple Entry)", "Exclusive 25% discount coupon at all food stalls", "Priority couple entrance privileges"] },
        { class: "fanpit", name: "₹200 Solo Entry + 20% Food Coupon", price: 200, availableSeats: 80, totalSeats: 80, benefits: ["Single person admission (Solo Entry)", "Exclusive 20% discount coupon valid at all food stalls", "Priority fast-track entry lane"] },
        { class: "general", name: "₹149 Solo Entry", price: 149, availableSeats: 300, totalSeats: 300, benefits: ["Single person admission (Solo Entry)", "Access to the main high-energy audience field"] }
      ]
    });

    // Reset Form
    setNewEventTitle('');
    setNewEventVenue('');
    setNewEventVenueAddress('');
    setNewEventGoogleMapUrl('');
    setNewEventImageUrl('');
    alert("New tour concert date added successfully!");
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    onAddCoupon({
      code: newCouponCode.toUpperCase(),
      discountPercent: Number(newCouponPercent),
      description: newCouponDesc || `${newCouponPercent}% discount promo`,
      minBookingValue: newCouponMinVal ? Number(newCouponMinVal) : undefined,
      isActive: true
    });

    setNewCouponCode('');
    setNewCouponPercent('20');
    setNewCouponDesc('');
    setNewCouponMinVal('');
    alert(`Coupon code ${newCouponCode.toUpperCase()} configured.`);
  };

  const triggerEditCoupon = (c: Coupon) => {
    setEditingCoupon(c);
    setEditCouponPercent(String(c.discountPercent));
    setEditCouponDesc(c.description);
    setEditCouponMinVal(c.minBookingValue ? String(c.minBookingValue) : '');
  };

  const handleUpdateCouponSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    onUpdateCoupon(editingCoupon.code, {
      discountPercent: Number(editCouponPercent),
      description: editCouponDesc,
      minBookingValue: editCouponMinVal ? Number(editCouponMinVal) : undefined
    });

    setEditingCoupon(null);
    alert(`Properties for voucher code "${editingCoupon.code}" saved.`);
  };

  const triggerEditMusic = (t: MusicTrack) => {
    setEditingMusic(t);
    setTrackTitle(t.title);
    setTrackAlbum(t.album);
    setTrackDuration(t.duration);
    setTrackAudioUrl(t.audioUrl);
    setTrackCoverUrl(t.coverUrl);
    setTrackSpotify(t.spotifyUrl || '');
    setTrackYoutube(t.youtubeUrl || '');
    setTrackApple(t.appleMusicUrl || '');
    setTrackRelease(t.releaseDate);
    setTrackIsPopular(!!t.isPopular);
  };

  const resetMusicForm = () => {
    setEditingMusic(null);
    setIsAddMusicOpen(false);
    setTrackTitle('');
    setTrackAlbum('');
    setTrackDuration('03:00');
    setTrackAudioUrl('');
    setTrackCoverUrl('');
    setTrackSpotify('');
    setTrackYoutube('');
    setTrackApple('');
    setTrackRelease(new Date().toISOString().split('T')[0]);
    setTrackIsPopular(false);
  };

  const handleMusicFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle || !trackAudioUrl) {
      alert("Please provide the song title and an active stream URL.");
      return;
    }

    const payload = {
      title: trackTitle,
      album: trackAlbum || "Digital Release",
      duration: trackDuration,
      audioUrl: trackAudioUrl,
      coverUrl: trackCoverUrl || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80",
      spotifyUrl: trackSpotify || undefined,
      youtubeUrl: trackYoutube || undefined,
      appleMusicUrl: trackApple || undefined,
      releaseDate: trackRelease,
      isPopular: trackIsPopular
    };

    if (editingMusic) {
      onUpdateMusic(editingMusic.id, payload);
      alert("Audio single metadata modifications committed.");
    } else {
      onAddMusic(payload);
      alert("New audio stream linked into the Live Spotlight music playlist.");
    }
    resetMusicForm();
  };

  const triggerEditVideo = (v: VideoClip) => {
    setEditingVideo(v);
    setVidTitle(v.title);
    setVidType(v.type);
    setVidThumb(v.thumbnailUrl);
    setVidEmbedId(v.youtubeEmbedId);
    setVidDuration(v.duration);
    setVidRelease(v.releaseDate);
  };

  const resetVideoForm = () => {
    setEditingVideo(null);
    setIsAddVideoOpen(false);
    setVidTitle('');
    setVidType('live');
    setVidThumb('');
    setVidEmbedId('');
    setVidDuration('05:00');
    setVidRelease(new Date().toISOString().split('T')[0]);
  };

  const handleVideoFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle || !vidEmbedId) {
      alert("Please provide the video title and YouTube embed ID.");
      return;
    }

    const payload = {
      title: vidTitle,
      type: vidType,
      thumbnailUrl: vidThumb || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80",
      youtubeEmbedId: vidEmbedId,
      duration: vidDuration,
      releaseDate: vidRelease
    };

    if (editingVideo) {
      onUpdateVideo(editingVideo.id, payload);
      alert("Spotlight clip settings optimized.");
    } else {
      onAddVideo(payload);
      alert("New cinematic showreel uploaded successfully.");
    }
    resetVideoForm();
  };

  const triggerEditGallery = (g: GalleryImage) => {
    setEditingGallery(g);
    setGalTitle(g.title);
    setGalUrl(g.url);
    setGalCategory(g.category);
  };

  const resetGalleryForm = () => {
    setEditingGallery(null);
    setIsAddGalleryOpen(false);
    setGalTitle('');
    setGalUrl('');
    setGalCategory('performance');
  };

  const handleGalleryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle || !galUrl) {
      alert("Please provide a portrait/performing title and image URL.");
      return;
    }

    const payload = {
      title: galTitle,
      url: galUrl,
      category: galCategory
    };

    if (editingGallery) {
      onUpdateGallery(editingGallery.id, payload);
      alert("Photo grid attributes adjusted.");
    } else {
      onAddGallery(payload);
      alert("New behind-the-scenes snapshot added into image gallery.");
    }
    resetGalleryForm();
  };

  const handleAuditFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAuditAction || !customAuditDetails) {
      alert("Please enter both action category and trace details.");
      return;
    }
    if (onAddAuditLog) {
      onAddAuditLog(customAuditAction, customAuditDetails);
    }
    setCustomAuditAction('');
    setCustomAuditDetails('');
    setIsAddAuditOpen(false);
    alert("New custom audit report injected successfully.");
  };

  interface AdminSubTab {
    id: string;
    label: string;
    icon: any;
    badge?: number;
  }

  const subTabs: AdminSubTab[] = [
    { id: 'kpi', label: 'Sales report', icon: FileSpreadsheet },
    { id: 'scheduler', label: `Tour Events (${events.length})`, icon: Calendar },
    { id: 'refunds', label: 'Refund queue', icon: RefreshCw, badge: refundQueue.length },
    { id: 'coupons', label: `Promo Coupons (${coupons.length})`, icon: Percent },
    { id: 'music', label: `Spotlight Audio (${music.length})`, icon: Music },
    { id: 'videos', label: `Cinema Reels (${videos.length})`, icon: Video },
    { id: 'gallery', label: `Photo Gallery (${gallery.length})`, icon: Image },
    { id: 'members', label: `Band Members (${members.length})`, icon: Users },
    { id: 'branding', label: 'Site Branding', icon: Sparkles },
    { id: 'passcodes', label: 'Manage Passwords', icon: Key },
    ...(isSuperadmin ? [{ id: 'auditing', label: 'Audit logs', icon: ShieldCheck }] : [])
  ];

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto text-white relative z-10 space-y-10">
      
      {/* Overview identity header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-mono font-bold block mb-1 font-sans">Administrative operations Console</span>
          <h2 className="text-3xl font-black text-white flex items-center gap-2 font-display tracking-tight">
            <ShieldCheck className="w-8 h-8 text-[#D4AF37] animate-pulse" />
            Rangrez Operations Console
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono bg-purple-900/40 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full">
            Authorized: <span className="font-bold text-white capitalize">{currentUser.role}</span>
          </span>
        </div>
      </div>

      {/* Primary tab switcher */}
      <div className="flex flex-wrap gap-2.5 p-2 bg-neutral-950/40 backdrop-blur-xl border border-white/5 rounded-2xl relative z-20">
        {subTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeAdminSubTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveAdminSubTab(tab.id as any)}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all text-xs font-sans font-medium tracking-wide relative overflow-hidden ${
                isActive
                  ? 'border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/10 font-bold shadow-[0_0_20px_rgba(227,38,54,0.12)]'
                  : 'border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TabIcon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'rotate-3 scale-110 text-[#D4AF37]' : ''}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-[#E32636] text-white rounded-full text-[9px] px-1.5 py-0.5 flex items-center justify-center font-bold font-mono min-w-[18px]">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 border-t-[3px] border-[#D4AF37] pointer-events-none rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeAdminSubTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="min-h-[400px]"
        >
          {/* SUB TAB 1: SALES REPORTING KPI VISUALS */}
          {activeAdminSubTab === 'kpi' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Key meters metric boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#181524]/40 border border-[#8A2BE2]/15 p-5 rounded-2xl">
              <span className="block text-[10px] uppercase text-zinc-400 font-mono">Gross Revenues Ticket Sales</span>
              <span className="text-2xl md:text-3xl font-black text-[#D4AF37] font-mono block mt-1">₹{totalSimulatedRevenue}</span>
              <span className="text-[9px] text-green-400 font-mono block mt-0.5">● Dynamic aggregate</span>
            </div>

            <div className="bg-[#181524]/40 border border-[#8A2BE2]/15 p-5 rounded-2xl">
              <span className="block text-[10px] uppercase text-zinc-400 font-mono">Seats Reserved total</span>
              <span className="text-2xl md:text-3xl font-black text-purple-400 font-mono block mt-1">{totalSeatsSold} seats</span>
              <span className="text-[9px] text-zinc-400 font-mono block mt-0.5">Across all metropolitan tours</span>
            </div>

            <div className="bg-[#181524]/40 border border-[#8A2BE2]/15 p-5 rounded-2xl">
              <span className="block text-[10px] uppercase text-zinc-400 font-mono">Active Booking Invoices</span>
              <span className="text-2xl md:text-3xl font-black text-white font-mono block mt-1">{activeConfirmedBookings.length} bookings</span>
              <span className="text-[9px] text-green-400 font-mono block mt-0.5">100% simulated clearance</span>
            </div>

            <div className="bg-[#181524]/40 border border-[#8A2BE2]/15 p-5 rounded-2xl">
              <span className="block text-[10px] uppercase text-zinc-400 font-mono">Refund Rate</span>
              <span className="text-2xl md:text-3xl font-black text-red-400 font-mono block mt-1">
                {bookings.length ? Math.round((bookings.filter(b => b.status === "refunded").length / bookings.length) * 100) : 0}%
              </span>
              <span className="text-[9px] text-zinc-400 font-mono block mt-0.5 font-mono">Voided sales ratio</span>
            </div>

          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Native SVG responsive revenue curve chart */}
            <div className="lg:col-span-8 bg-[#181524]/50 border border-white/5 p-6 rounded-3xl space-y-4">
              <div>
                <h4 className="text-sm font-bold tracking-wider uppercase font-mono text-[#D4AF37]">Dynamic Revenue Progression chart</h4>
                <p className="text-[11px] text-zinc-400">Tracks performance and demand indicators based on real active bookings.</p>
              </div>

              {/* Scalable SVG graph */}
              <div className="relative h-64 w-full">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid background lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                  {/* Filled area curve path */}
                  <path 
                    d="M 0 90 Q 20 70 40 55 T 80 40 L 100 20 L 100 100 L 0 100 Z"
                    fill="url(#chartGrad)"
                  />
                  {/* Glowing main path stroke */}
                  <path
                    d="M 0 90 Q 20 70 40 55 T 80 40 L 100 20"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Legend indicators */}
                <div className="absolute bottom-1 right-2 flex items-center gap-2 text-[10px] font-mono text-zinc-400 bg-[#000]/60 px-2 py-1 rounded border border-white/5">
                  <span className="w-2.5 h-2.5 bg-[#D4AF37] rounded" /> Initial tour surge
                </div>
              </div>
            </div>

            {/* Concerts Booking sales breakdown list */}
            <div className="lg:col-span-4 bg-[#181524]/50 border border-white/5 p-6 rounded-3xl space-y-4">
              <div>
                <h4 className="text-sm font-bold tracking-wider uppercase font-mono text-purple-400">Venue demand meters</h4>
                <p className="text-[11px] text-zinc-400">Total collection generated per city.</p>
              </div>

              <div className="space-y-4">
                {events.map(event => {
                  const reservationsPercent = 100 - Math.round((event.categories.reduce((acc, c) => acc + c.availableSeats, 0) / event.categories.reduce((acc, c) => acc + c.totalSeats, 0)) * 100);

                  return (
                    <div key={event.id} className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between items-center text-zinc-200">
                        <span className="font-bold">{event.city}</span>
                        <span className="text-[#D4AF37]">₹{event.totalSales}</span>
                      </div>
                      
                      {/* Bar progression meter */}
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden w-full">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#8A2BE2] to-[#D4AF37] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(10, Math.min(100, reservationsPercent))}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-zinc-500">
                        <span>{reservationsPercent}% reserved</span>
                        <span>Capacity: {event.categories.reduce((acc, c) => acc + c.totalSeats, 0)} spots</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB TAB 2: TOUR SCHEDULER MANAGER */}
      {activeAdminSubTab === 'scheduler' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Create new concert Scheduler Form */}
            {isAdminOrSuper ? (
              <form onSubmit={handleCreateEventSubmit} className="col-span-12 lg:col-span-4 bg-[#181524]/60 border border-[#8A2BE2]/10 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono pb-2 border-b border-white/10 flex items-center gap-1.5 font-sans">
                  <Plus className="w-4 h-4" /> Add concert Release
                </h3>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Concert Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune Unplugged Fusion Arena"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] text-zinc-450 font-mono uppercase font-bold text-amber-500">Tour City</label>
                    <input
                      type="text"
                      list="tour-cities-new"
                      placeholder="e.g. Ranchi"
                      value={newEventCity}
                      onChange={(e) => setNewEventCity(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none text-white font-sans"
                    />
                    <datalist id="tour-cities-new">
                      {/* Jharkhand Cities */}
                      <option value="Ranchi">Ranchi (Jharkhand)</option>
                      <option value="Jamshedpur">Jamshedpur (Jharkhand)</option>
                      <option value="Dhanbad">Dhanbad (Jharkhand)</option>
                      <option value="Bokaro Steel City">Bokaro Steel City (Jharkhand)</option>
                      <option value="Deoghar">Deoghar (Jharkhand)</option>
                      <option value="Hazaribagh">Hazaribagh (Jharkhand)</option>
                      <option value="Giridih">Giridih (Jharkhand)</option>
                      <option value="Ramgarh">Ramgarh (Jharkhand)</option>
                      <option value="Phusro">Phusro (Jharkhand)</option>
                      <option value="Medininagar">Medininagar (Jharkhand)</option>
                      <option value="Chaibasa">Chaibasa (Jharkhand)</option>
                      <option value="Dumka">Dumka (Jharkhand)</option>
                      <option value="Sahibganj">Sahibganj (Jharkhand)</option>
                      <option value="Jhumri Telaiya">Jhumri Telaiya (Jharkhand)</option>
                      <option value="Chatra">Chatra (Jharkhand)</option>
                      <option value="Simdega">Simdega (Jharkhand)</option>
                      <option value="Gumla">Gumla (Jharkhand)</option>
                      <option value="Khunti">Khunti (Jharkhand)</option>
                      <option value="Latehar">Latehar (Jharkhand)</option>
                      <option value="Saraikela">Saraikela (Jharkhand)</option>
                      <option value="Jamtara">Jamtara (Jharkhand)</option>
                      <option value="Pakur">Pakur (Jharkhand)</option>
                      <option value="Godda">Godda (Jharkhand)</option>
                      {/* Other major cities */}
                      <option value="Pune">Pune</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Kolkata">Kolkata</option>
                    </datalist>
                  </div>

                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] text-zinc-455 font-mono uppercase">General Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newEventPrice}
                      onChange={(e) => setNewEventPrice(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#8A2BE2]"
                    />
                  </div>
                </div>

                <div className="space-y-1 font-sans">
                  <label className="text-[10px] text-zinc-450 font-mono uppercase">Venue details</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Palms Stadium Box"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none text-white"
                  />
                </div>

                <div className="space-y-1 font-sans">
                  <label className="text-[10px] text-zinc-450 font-mono uppercase text-amber-500 font-bold block">Proper Location / Detailed Address (Jharkhand/Local convenience)</label>
                  <textarea
                    placeholder="e.g. Sports Complex Rd, Hotwar, Ranchi, Jharkhand 834009"
                    value={newEventVenueAddress}
                    onChange={(e) => setNewEventVenueAddress(e.target.value)}
                    rows={2}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-[#D4AF37] focus:outline-none text-white"
                  />
                </div>

                <div className="space-y-1 font-sans">
                  <label className="text-[10px] text-zinc-450 font-mono uppercase text-blue-400 font-semibold block">Google Maps / Directions URL</label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/?q=..."
                    value={newEventGoogleMapUrl}
                    onChange={(e) => setNewEventGoogleMapUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-450 font-mono uppercase">Date</label>
                    <input
                      type="date"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-455 font-mono uppercase">Start Time</label>
                    <input
                      type="time"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200"
                    />
                  </div>
                </div>

                <div className="space-y-1 font-sans">
                  <ImageUploadWidget
                    id="new-event-image-upload"
                    value={newEventImageUrl}
                    onChange={(url) => setNewEventImageUrl(url)}
                    label="Cover Image Poster"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8A2BE2] text-black font-extrabold uppercase text-xs tracking-wider font-mono hover:scale-[1.01] transition-transform font-sans"
                >
                  Schedule Release
                </button>
              </form>
            ) : (
              <div className="col-span-12 lg:col-span-4 bg-yellow-950/10 border border-yellow-500/20 rounded-3xl p-6 text-center space-y-2 font-sans">
                <AlertTriangle className="w-8 h-8 text-[#D4AF37] mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-white">Scheduling privileges voided</h4>
                <p className="text-zinc-400 text-xs text-center">Only Admin and Superadmin accounts carry permissions to schedule tour events.</p>
              </div>
            )}

            {/* List scheduler view with edit/delete controls */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono font-sans mb-1">Current Live Tour schedule</h3>
              <p className="text-zinc-400 text-xs font-sans">Click on the edit tool to fine-tune date info, poster images, prices, capacities, and taglines.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {events.map(e => (
                  <div key={e.id} className="bg-[#181524]/40 border border-white/5 p-4 rounded-xl flex flex-col justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] text-[#D4AF37] uppercase font-mono font-bold tracking-wider">{e.city} • {e.date}</span>
                        <span className={`text-[8px] uppercase font-mono px-2 py-0.5 rounded font-bold border ${
                          e.status === 'upcoming' ? 'bg-green-950/40 text-green-400 border-green-500/20' :
                          e.status === 'soldout' ? 'bg-purple-950/40 text-purple-400 border-purple-500/20' :
                          e.status === 'postponed' ? 'bg-yellow-950/40 text-yellow-500/20' : 'bg-red-950/40 text-rose-500/20'
                        }`}>
                          {e.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-100 truncate">{e.title}</h4>
                      <p className="text-xs text-zinc-400 truncate font-mono mt-0.5">{e.venue}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-[10px] font-bold text-green-400 font-mono">₹{e.totalSales} Sales Total</span>
                      
                      <div className="flex items-center gap-1">
                        {isAdminOrSuper && (
                          <>
                            <button
                              onClick={() => triggerEditEvent(e)}
                              className="p-1.5 text-[#D4AF37] hover:bg-amber-500/10 rounded-lg transition-colors"
                              title="Edit complete event details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                showConfirm({
                                  title: "Permanently Terminate Concert?",
                                  message: `You are about to completely cancel and delete the tour date "${e.title}" in ${e.city}. This will purge the event from active bookings and release slots.`,
                                  actionLabel: "Deep Purge Concert",
                                  actionColor: "red",
                                  onConfirm: () => onDeleteEvent(e.id)
                                });
                              }}
                              className="p-1.5 text-[#E32636] hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Purge event from records"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* DYNAMIC FIELD CONFIGURATION MODAL FOR EVENTS */}
          {editingEvent && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto font-sans">
              <form onSubmit={handleUpdateEventSave} className="bg-[#120f1d] border border-[#8A2BE2]/25 rounded-2xl w-full max-w-2xl p-6 space-y-4 my-8 animate-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-[#D4AF37] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Customize Tour Details: &ldquo;{editingEvent.title}&rdquo;
                  </h3>
                  <button type="button" onClick={resetEditEventForm} className="text-zinc-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Concert Title</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none text-white"
                      value={editEventTitle}
                      onChange={(e) => setEditEventTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Promotional Tagline</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none text-white"
                      value={editEventTagline}
                      onChange={(e) => setEditEventTagline(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Event Narrative Description</label>
                  <textarea
                    rows={2}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                    value={editEventDesc}
                    onChange={(e) => setEditEventDesc(e.target.value)}
                  />
                </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase font-bold text-amber-500">Tour City</label>
                    <input
                      type="text"
                      list="tour-cities-edit"
                      placeholder="e.g. Ranchi"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      value={editEventCity}
                      onChange={(e) => setEditEventCity(e.target.value)}
                    />
                    <datalist id="tour-cities-edit">
                      {/* Jharkhand Cities */}
                      <option value="Ranchi">Ranchi (Jharkhand)</option>
                      <option value="Jamshedpur">Jamshedpur (Jharkhand)</option>
                      <option value="Dhanbad">Dhanbad (Jharkhand)</option>
                      <option value="Bokaro Steel City">Bokaro Steel City (Jharkhand)</option>
                      <option value="Deoghar">Deoghar (Jharkhand)</option>
                      <option value="Hazaribagh">Hazaribagh (Jharkhand)</option>
                      <option value="Giridih">Giridih (Jharkhand)</option>
                      <option value="Ramgarh">Ramgarh (Jharkhand)</option>
                      <option value="Phusro">Phusro (Jharkhand)</option>
                      <option value="Medininagar">Medininagar (Jharkhand)</option>
                      <option value="Chaibasa">Chaibasa (Jharkhand)</option>
                      <option value="Dumka">Dumka (Jharkhand)</option>
                      <option value="Sahibganj">Sahibganj (Jharkhand)</option>
                      <option value="Jhumri Telaiya">Jhumri Telaiya (Jharkhand)</option>
                      <option value="Chatra">Chatra (Jharkhand)</option>
                      <option value="Simdega">Simdega (Jharkhand)</option>
                      <option value="Gumla">Gumla (Jharkhand)</option>
                      <option value="Khunti">Khunti (Jharkhand)</option>
                      <option value="Latehar">Latehar (Jharkhand)</option>
                      <option value="Saraikela">Saraikela (Jharkhand)</option>
                      <option value="Jamtara">Jamtara (Jharkhand)</option>
                      <option value="Pakur">Pakur (Jharkhand)</option>
                      <option value="Godda">Godda (Jharkhand)</option>
                      {/* Other cities */}
                      <option value="Pune">Pune</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Kolkata">Kolkata</option>
                    </datalist>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Venue Arena</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      value={editEventVenue}
                      onChange={(e) => setEditEventVenue(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Concert Date</label>
                    <input
                      type="date"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      value={editEventDate}
                      onChange={(e) => setEditEventDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Start Time</label>
                    <input
                      type="time"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      value={editEventTime}
                      onChange={(e) => setEditEventTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase text-amber-505 font-bold block">Proper Location / Detailed Address (Ranchi/Local convenience)</label>
                    <textarea
                      placeholder="e.g. Sports Complex Rd, Hotwar, Ranchi, Jharkhand 834009"
                      value={editEventVenueAddress}
                      onChange={(e) => setEditEventVenueAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase text-blue-410 font-semibold block">Google Maps / Directions URL</label>
                    <input
                      type="url"
                      placeholder="https://maps.google.com/?q=..."
                      value={editEventGoogleMapUrl}
                      onChange={(e) => setEditEventGoogleMapUrl(e.target.value)}
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <ImageUploadWidget
                      id="edit-event-image-upload"
                      value={editEventImageUrl}
                      onChange={(url) => setEditEventImageUrl(url)}
                      label="Cover Image Poster"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase font-bold">Current Tour Status</label>
                    <select
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-zinc-200 cursor-pointer"
                      value={editEventStatus}
                      onChange={(e) => setEditEventStatus(e.target.value as Event['status'])}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="soldout">Sold Out</option>
                      <option value="postponed">Postponed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 space-y-2">
                  <h4 className="text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold">Seat Categories & Pricing Tiers</h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {/* VIP tier */}
                    <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-2">
                      <span className="block text-[10px] uppercase font-mono text-purple-300">Couple VIP Tier</span>
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 font-mono">Price (₹)</label>
                        <input
                          type="number"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          value={editVipPrice}
                          onChange={(e) => setEditVipPrice(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 font-mono">Total Spots</label>
                        <input
                          type="number"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          value={editVipSeats}
                          onChange={(e) => setEditVipSeats(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    {/* Pit tier */}
                    <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-2">
                      <span className="block text-[10px] uppercase font-mono text-purple-300">Rhythm Pit (Solo)</span>
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 font-mono">Price (₹)</label>
                        <input
                          type="number"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          value={editPitPrice}
                          onChange={(e) => setEditPitPrice(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 font-mono">Total Spots</label>
                        <input
                          type="number"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          value={editPitSeats}
                          onChange={(e) => setEditPitSeats(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    {/* General tier */}
                    <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-2">
                      <span className="block text-[10px] uppercase font-mono text-purple-300">Sound Field (General)</span>
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 font-mono">Price (₹)</label>
                        <input
                          type="number"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          value={editGenPrice}
                          onChange={(e) => setEditGenPrice(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 font-mono">Total Spots</label>
                        <input
                          type="number"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          value={editGenSeats}
                          onChange={(e) => setEditGenSeats(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/15 pt-4">
                  <button
                    type="button"
                    onClick={resetEditEventForm}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-300 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 hover:brightness-110 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* SUB TAB 3: REFUND CASE WORKFLOW */}
      {activeAdminSubTab === 'refunds' && (
        <div className="space-y-8 animate-in fade-in duration-300 text-xs font-sans">
          <div>
            <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono mb-1">Tickets cancellations & refund workflow</h3>
            <p className="text-[11px] text-zinc-400">Accepting refund approvals automatically releases seats back into pool, voids ticket validations, and aggregates audit tracks.</p>
          </div>

          {refundQueue.length === 0 ? (
            <div className="text-center py-20 bg-[#181524]/20 border border-white/5 rounded-2xl flex flex-col items-center gap-3">
              <Check className="w-10 h-10 text-green-400" />
              <h4 className="text-base font-bold text-zinc-100">Cancellations Queue cleared</h4>
              <p className="text-zinc-400 text-xs">No active fan refund requests flagged for review right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {refundQueue.map(booking => (
                <div 
                  key={booking.id} 
                  className="bg-[#181524]/50 border border-[#E32636]/20 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono text-[#D4AF37] font-extrabold">Booking Code: #{booking.id}</span>
                      <span className="text-[8px] bg-red-500/10 border border-[#E32636]/40 text-rose-400 font-mono px-2 py-0.5 rounded font-bold uppercase">Refund Requested</span>
                    </div>

                    <h4 className="text-sm font-bold text-white uppercase">{booking.eventTitle}</h4>
                    <p className="text-zinc-300 text-xs">
                      Passenger: <span className="font-semibold text-zinc-100">{booking.userFullName}</span> ({booking.userEmail})
                    </p>
                    <div className="text-zinc-400 font-mono text-[10px] flex items-center gap-4">
                      <span>Gateway: {booking.paymentMethod.toUpperCase()}</span>
                      <span>Paid total: ₹{booking.total}</span>
                      <span> seats count: {booking.items.flatMap(i => i.selectedSeats).join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        showConfirm({
                          title: "Approve Full Cash Refund?",
                          message: `Approve voiding ticket #${booking.id} for passenger ${booking.userFullName}. This will issue a simulated refund of ₹${booking.total} back to their payment method.`,
                          actionLabel: "Approve & Refund",
                          actionColor: "green",
                          onConfirm: () => onApproveRefund(booking.id)
                        });
                      }}
                      className="px-4 py-2 bg-green-900 border border-green-500/20 hover:bg-green-800 rounded-xl text-green-300 font-bold tracking-wider font-mono cursor-pointer"
                    >
                      Approve Full Refund
                    </button>
                    <button
                      onClick={() => {
                        showConfirm({
                          title: "Void Ticket Without Cash?",
                          message: `Reject the refund application and forcefully cancel ticket #${booking.id} directly without dispatching funds.`,
                          actionLabel: "Void without Cash",
                          actionColor: "amber",
                          onConfirm: () => onCancelBookingDirectly(booking.id)
                        });
                      }}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
                    >
                      Void Without Cash
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* SUB TAB 4: AMBIENT PROMO COUPONS MANAGER */}
      {activeAdminSubTab === 'coupons' && (
        <div className="space-y-8 animate-in fade-in duration-300 text-xs font-sans">
          
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* New Promo code compiler */}
            <form onSubmit={handleCreateCouponSubmit} className="col-span-12 lg:col-span-4 bg-[#181524]/60 border border-[#8A2BE2]/10 p-5 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono mb-2 pb-2 border-b border-white/10">Configure coupon discounts</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-mono uppercase">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER30"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono focus:border-[#D4AF37] focus:outline-none text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Percent Off</label>
                  <input
                    type="number"
                    min="5"
                    max="90"
                    required
                    placeholder="e.g. 25"
                    value={newCouponPercent}
                    onChange={(e) => setNewCouponPercent(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Min Order (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={newCouponMinVal}
                    onChange={(e) => setNewCouponMinVal(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-mono uppercase">Short Description Description</label>
                <input
                  type="text"
                  placeholder="e.g. Official tour discount promo"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-[#D4AF37] to-[#8A2BE2] text-black font-extrabold uppercase text-xs tracking-wider rounded-lg font-mono flex items-center justify-center gap-1 hover:brightness-110"
              >
                <Plus className="w-3.5 h-3.5" /> Register Coupon
              </button>
            </form>

            {/* Coupons table lists toggles */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono">Recognized campaign coupons</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {coupons.map(coupon => (
                  <div key={coupon.code} className="bg-[#181524]/40 border border-white/5 p-4 rounded-xl flex flex-col justify-between h-40">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white font-mono text-sm tracking-wider">{coupon.code}</span>
                          <span className="text-[10px] bg-green-950/40 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-mono font-bold">{coupon.discountPercent}% OFF</span>
                        </div>
                        <button
                          onClick={() => onToggleCoupon(coupon.code)}
                          className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase border rounded transition-colors ${
                            coupon.isActive 
                              ? 'bg-green-950/30 text-green-400 border-green-500/20 hover:text-red-400' 
                              : 'bg-zinc-800 text-zinc-500 border-transparent hover:text-green-500'
                          }`}
                        >
                          {coupon.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                      <p className="text-zinc-400 text-[11px] mt-2 leading-relaxed">{coupon.description}</p>
                      {coupon.minBookingValue && (
                        <p className="text-[#D4AF37] text-[9px] font-mono mt-1">🏷️ Min Experience Value: ₹{coupon.minBookingValue}</p>
                      )}
                    </div>

                    <div className="flex justify-end gap-1.5 border-t border-white/5 pt-3">
                      <button
                        onClick={() => triggerEditCoupon(coupon)}
                        className="p-1 px-3 bg-white/5 text-amber-400 border border-white/10 hover:bg-amber-600/10 rounded flex items-center gap-1 text-[10px]"
                        title="Edit code settings"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          showConfirm({
                            title: "Permanently Delete Coupon?",
                            message: `Do you want to permanently delete custom coupon code "${coupon.code}"? Users won't be able to apply this promotion anymore.`,
                            actionLabel: "Remove Coupon",
                            actionColor: "red",
                            onConfirm: () => onDeleteCoupon(coupon.code)
                          });
                        }}
                        className="p-1 px-2.5 bg-red-955 hover:bg-red-900 border border-transparent hover:border-red-500/20 text-[#E32636] hover:text-red-200 rounded flex items-center gap-1 text-[10px]"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* DYNAMIC FIELD CONFIGURATION MODAL FOR COUPONS */}
          {editingCoupon && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
              <form onSubmit={handleUpdateCouponSave} className="bg-[#120f1d] border border-amber-500/20 rounded-2xl w-full max-w-md p-6 space-y-4 my-8 animate-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-[#D4AF37] flex items-center gap-2">
                    <Percent className="w-5 h-5 text-amber-400" />
                    Modify Voucher: {editingCoupon.code}
                  </h3>
                  <button type="button" onClick={() => setEditingCoupon(null)} className="text-zinc-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Discount Percent</label>
                    <input
                      type="number"
                      min="5"
                      max="90"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white"
                      value={editCouponPercent}
                      onChange={(e) => setEditCouponPercent(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Minimum Value (₹)</label>
                    <input
                      type="number"
                      placeholder="Optional"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white"
                      value={editCouponMinVal}
                      onChange={(e) => setEditCouponMinVal(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Short Description Description</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white"
                    value={editCouponDesc}
                    onChange={(e) => setEditCouponDesc(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-white/15 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingCoupon(null)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Coupon
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* SUB TAB 5: MUSIC GIG AUDIO STREAM MANAGER */}
      {activeAdminSubTab === 'music' && (
        <div className="space-y-8 animate-in fade-in duration-300 font-sans">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono">Spotlight Audio Track Customizations</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Customize sound files, covers, durations, metadata, and Spotify/YouTube coordinates for the site footer media bar.</p>
            </div>
            <button
              onClick={() => {
                setEditingMusic(null);
                setTrackTitle('');
                setTrackAlbum('');
                setTrackDuration('04:15');
                setTrackAudioUrl('');
                setTrackCoverUrl('');
                setTrackSpotify('');
                setTrackYoutube('');
                setTrackApple('');
                setIsAddMusicOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-purple-700/80 hover:bg-purple-600 border border-purple-500/20 text-white font-extrabold text-xs flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
            >
              <Music className="w-3.5 h-3.5" /> Link New Audio Single
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {music.map(track => (
              <div key={track.id} className="bg-[#181524]/60 border border-white/5 p-4 rounded-2xl flex flex-col justify-between gap-4 relative overflow-hidden group">
                <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                  {track.isPopular && (
                    <span className="text-[8px] uppercase tracking-wider bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-0.5">
                      <Sparkles className="w-2 h-2" /> Pop Choice
                    </span>
                  )}
                </div>

                <div className="flex gap-4">
                  <img 
                    src={track.coverUrl} 
                    alt={track.title} 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 shadow-lg flex-shrink-0" 
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{track.title}</h4>
                    <p className="text-xs text-zinc-400 truncate">{track.album || 'Single Release'}</p>
                    <p className="text-[10px] text-[#D4AF37] font-mono mt-1">⌚ Duration: {track.duration} | 📅 {track.releaseDate}</p>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 font-mono space-y-0.5 bg-black/20 p-2 rounded-lg truncate">
                  <span className="block truncate">📻 Stream File: {track.audioUrl}</span>
                </div>

                <div className="flex justify-end gap-1.5 border-t border-white/5 pt-3">
                  <button
                    onClick={() => triggerEditMusic(track)}
                    className="p-1 px-3 bg-white/5 hover:bg-amber-600/10 text-amber-400 border border-white/10 rounded flex items-center gap-1 text-[10px]"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Info
                  </button>
                  <button
                    onClick={() => {
                      showConfirm({
                        title: "Permanently Purge Audio Track?",
                        message: `Do you want to permanently delete "${track.title}" from local streaming media playlists?`,
                        actionLabel: "Purge Track",
                        actionColor: "red",
                        onConfirm: () => onDeleteMusic(track.id)
                      });
                    }}
                    className="p-1 px-3 bg-transparent hover:bg-red-950/40 text-red-400 hover:text-red-300 rounded flex items-center gap-1 text-[10px]"
                  >
                    <Trash2 className="w-3 h-3" /> Purge
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DYNAMIC FORMS MODAL FOR MUSIC CREATION / UPDATION */}
          {(isAddMusicOpen || editingMusic) && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
              <form onSubmit={handleMusicFormSubmit} className="bg-[#120f1d] border border-[#8A2BE2]/25 rounded-2xl w-full max-w-lg p-6 space-y-4 my-8 animate-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-[#D4AF37] flex items-center gap-2">
                    <Disc className="w-5 h-5 text-purple-400 animate-spin" />
                    {editingMusic ? `Optimize Track: "${trackTitle}"` : "Link New Audio Single"}
                  </h3>
                  <button type="button" onClick={resetMusicForm} className="text-zinc-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Song Title</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white"
                      value={trackTitle}
                      onChange={(e) => setTrackTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Album Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white"
                      value={trackAlbum}
                      onChange={(e) => setTrackAlbum(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Song Duration</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      value={trackDuration}
                      onChange={(e) => setTrackDuration(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Release Date</label>
                    <input
                      type="date"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-200"
                      value={trackRelease}
                      onChange={(e) => setTrackRelease(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 flex items-center md:pt-4">
                    <input
                      type="checkbox"
                      id="trackPopularTag"
                      className="w-4 h-4 text-purple-600 bg-black/40 border-white/10 rounded cursor-pointer"
                      checked={trackIsPopular}
                      onChange={(e) => setTrackIsPopular(e.target.checked)}
                    />
                    <label htmlFor="trackPopularTag" className="ml-2 text-xs text-zinc-300 uppercase font-mono cursor-pointer">Popular choice</label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Audio Stream Stream URL (.mp3)</label>
                  <input
                    type="url"
                    className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    value={trackAudioUrl}
                    onChange={(e) => setTrackAudioUrl(e.target.value)}
                    placeholder="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <ImageUploadWidget
                    id="music-cover-image-upload"
                    value={trackCoverUrl}
                    onChange={(url) => setTrackCoverUrl(url)}
                    label="Cover Image Picture"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="border-t border-white/5 pt-3 space-y-2">
                  <h4 className="text-[10px] uppercase font-mono text-purple-400 font-bold">Third Party App Links</h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-mono">Spotify Link</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-white/5 rounded-xl px-2 py-1.5 text-xs text-white"
                        value={trackSpotify}
                        onChange={(e) => setTrackSpotify(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-mono">YouTube Link</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-white/5 rounded-xl px-2 py-1.5 text-xs text-white"
                        value={trackYoutube}
                        onChange={(e) => setTrackYoutube(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-mono">Apple Music Link</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-white/5 rounded-xl px-2 py-1.5 text-xs text-white"
                        value={trackApple}
                        onChange={(e) => setTrackApple(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={resetMusicForm}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-300 text-xs text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Audio Track
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* SUB TAB 6: SPOTLIGHT FEATURED VIDEO REELS */}
      {activeAdminSubTab === 'videos' && (
        <div className="space-y-8 animate-in fade-in duration-300 font-sans">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono">Featured Cinema video Clip list</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Customize YouTube video links, stream categories (live/bts/music_video), durations, and splash cards shown live.</p>
            </div>
            <button
              onClick={() => {
                setEditingVideo(null);
                setVidTitle('');
                setVidType('live');
                setVidThumb('');
                setVidEmbedId('');
                setVidDuration('05:30');
                setIsAddVideoOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-purple-700/80 hover:bg-purple-600 border border-purple-500/20 text-white font-extrabold text-xs flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" /> Link Featured video
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(vid => (
              <div key={vid.id} className="bg-[#181524]/60 border border-white/5 p-4 rounded-2xl flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-black">
                    <img 
                      src={vid.thumbnailUrl} 
                      alt={vid.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-10 h-10 text-white fill-white/25 border border-white/30 rounded-full p-2" />
                    </div>
                    <span className="absolute bottom-2 right-2 text-[9px] font-mono bg-black/80 px-2 py-0.5 rounded text-zinc-300">
                      {vid.duration}
                    </span>
                    <span className="absolute top-2 left-2 text-[8px] uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-bold">
                      {vid.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{vid.title}</h4>
                    <p className="text-[10px] text-[#D4AF37] font-mono mt-0.5">🎥 YouTube ID: {vid.youtubeEmbedId} | 📅 {vid.releaseDate}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 border-t border-white/5 pt-3">
                  <button
                    onClick={() => triggerEditVideo(vid)}
                    className="p-1 px-3 bg-white/5 hover:bg-amber-600/10 text-amber-400 border border-white/10 rounded flex items-center gap-1 text-[10px]"
                  >
                    <Edit2 className="w-3 h-3" /> Edit info
                  </button>
                  <button
                    onClick={() => {
                      showConfirm({
                        title: "Completely Delete Spotlight Video?",
                        message: `Do you wish to completely drop the spotlight broadcast clip "${vid.title}" from active video feeds?`,
                        actionLabel: "Drop Video Clip",
                        actionColor: "red",
                        onConfirm: () => onDeleteVideo(vid.id)
                      });
                    }}
                    className="p-1 px-3 bg-transparent hover:bg-red-950/40 text-red-100 hover:text-red-200 rounded flex items-center gap-1 text-[10px]"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DYNAMIC FORMS MODAL FOR VIDEO REELS */}
          {(isAddVideoOpen || editingVideo) && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
              <form onSubmit={handleVideoFormSubmit} className="bg-[#120f1d] border border-[#8A2BE2]/25 rounded-2xl w-full max-w-lg p-6 space-y-4 my-8 animate-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-[#D4AF37] flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-400" />
                    {editingVideo ? `Editing Spotlight Video: "${vidTitle}"` : "Configure Featured Video Clip"}
                  </h3>
                  <button type="button" onClick={resetVideoForm} className="text-zinc-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Video Title</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white"
                    value={vidTitle}
                    onChange={(e) => setVidTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Video Class Type</label>
                    <select
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-200 cursor-pointer text-white"
                      value={vidType}
                      onChange={(e) => setVidType(e.target.value as VideoClip['type'])}
                    >
                      <option value="live">Live Performance Film</option>
                      <option value="music_video">Cinematic Music Video</option>
                      <option value="bts">Behind the Scenes documentary</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <VideoUploadWidget
                      id="video-resource-upload"
                      value={vidEmbedId}
                      onChange={(url) => setVidEmbedId(url)}
                      onDurationLoaded={(duration) => setVidDuration(duration)}
                      label="Video Resource (Upload File or YouTube ID)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Readable Duration</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      value={vidDuration}
                      onChange={(e) => setVidDuration(e.target.value)}
                      placeholder="e.g. 05:12"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Release Date</label>
                    <input
                      type="date"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-200"
                      value={vidRelease}
                      onChange={(e) => setVidRelease(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <ImageUploadWidget
                    id="video-thumbnail-upload"
                    value={vidThumb}
                    onChange={(url) => setVidThumb(url)}
                    label="Thumbnail Splash Image"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={resetVideoForm}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-300 text-xs text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Video Reel
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* SUB TAB 7: PHOTO MASONRY GALLERY */}
      {activeAdminSubTab === 'gallery' && (
        <div className="space-y-8 animate-in fade-in duration-300 font-sans">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono">Masonry gallery item database</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Manage landscape, concert, gear, portrait and recording studio snaps.</p>
            </div>
            <button
              onClick={() => {
                setEditingGallery(null);
                setGalTitle('');
                setGalUrl('');
                setGalCategory('performance');
                setIsAddGalleryOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-purple-700/80 hover:bg-purple-600 border border-purple-500/20 text-white font-extrabold text-xs flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
            >
              <Image className="w-3.5 h-3.5" /> Link Gallery Image
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map(img => (
              <div key={img.id} className="bg-[#181524]/60 border border-white/5 rounded-2xl flex flex-col justify-between overflow-hidden group">
                <div className="relative aspect-square overflow-hidden bg-black/45 border-b border-white/5">
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                  <span className="absolute top-2 left-2 text-[8px] uppercase tracking-wider bg-black/80 text-amber-400 border border-white/10 px-2 py-0.5 rounded font-mono font-bold">
                    {img.category}
                  </span>
                </div>

                <div className="p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-zinc-200 line-clamp-1">{img.title}</h4>
                  
                  <div className="flex justify-end gap-1 border-t border-white/5 pt-2">
                    <button
                      onClick={() => triggerEditGallery(img)}
                      className="p-1 px-2.5 bg-white/5 hover:bg-amber-600/10 text-amber-400 border border-white/10 rounded text-[9px] flex items-center gap-0.5"
                    >
                      <Edit2 className="w-2.5 h-2.5" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        showConfirm({
                          title: "Remove Highlight Gallery Image?",
                          message: `Do you want to permanently remove "${img.title}" from the visual highlights gallery?`,
                          actionLabel: "Purge Image",
                          actionColor: "red",
                          onConfirm: () => onDeleteGallery(img.id)
                        });
                      }}
                      className="p-1 px-2 hover:bg-red-950/40 text-red-400 hover:text-red-300 rounded text-[9px] flex items-center gap-0.5"
                    >
                      <Trash2 className="w-2.5 h-2.5" /> Purge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DYNAMIC FORMS MODAL FOR GALLERY IMAGES */}
          {(isAddGalleryOpen || editingGallery) && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
              <form onSubmit={handleGalleryFormSubmit} className="bg-[#120f1d] border border-[#8A2BE2]/25 rounded-2xl w-full max-w-sm p-6 space-y-4 my-8 animate-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-[#D4AF37] flex items-center gap-2">
                    <Image className="w-5 h-5 text-purple-400" />
                    {editingGallery ? `Editing Snapshot: "${galTitle}"` : "Add Showcase Experience Image"}
                  </h3>
                  <button type="button" onClick={resetGalleryForm} className="text-zinc-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Image Title / Description</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white"
                    value={galTitle}
                    onChange={(e) => setGalTitle(e.target.value)}
                    placeholder="e.g. Traditional Handcarved Sitar close-up"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Visual Category Focus</label>
                  <select
                    className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-200 cursor-pointer text-white"
                    value={galCategory}
                    onChange={(e) => setGalCategory(e.target.value as GalleryImage['category'])}
                  >
                    <option value="performance">Live Concert Performance</option>
                    <option value="behind_scenes">Behind the Scenes snaps</option>
                    <option value="studio">Studio production gear / tracking</option>
                    <option value="portrait">Band Member Closeup portrait</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <ImageUploadWidget
                    id="gallery-source-image-upload"
                    value={galUrl}
                    onChange={(url) => setGalUrl(url)}
                    label="Source Image Picture"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={resetGalleryForm}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[#ffffff] text-xs text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Showcase Photo
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* SUB TAB: BAND MEMBERS CRUD MANAGER */}
      {activeAdminSubTab === 'members' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono">Rangrez Band Members Registry</h3>
              <p className="text-[11px] text-zinc-400 mt-1 font-sans">Enables live updates to artist bios, roles, portfolio quotes, skills, and portraits seen in the About band section.</p>
            </div>
            <button
              onClick={() => {
                setEditingMember(null);
                setNewMemberArtist('');
                setNewMemberName('Band Member');
                setNewMemberRole('');
                setNewMemberQuote('');
                setNewMemberImageUrl('');
                setNewMemberSkills('');
                (window as any).isAddMemberOpen = true;
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-mono text-[11px] font-extrabold rounded-xl flex items-center gap-2 hover:brightness-110 shadow-lg shadow-amber-500/10 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add New Band Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div 
                key={member.id} 
                className="bg-black/50 border border-white/5 hover:border-[#D4AF37]/30 rounded-2xl p-5 hover:bg-zinc-950/40 transition-all flex flex-col gap-4 relative overflow-hidden group"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                    <img 
                      src={member.imageUrl} 
                      alt={member.artist} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-white truncate">{member.artist}</h4>
                      <span className="text-[9px] bg-amber-500/10 border border-amber-500/25 text-[#D4AF37] px-1.5 py-0.5 rounded font-mono">
                        {member.name || "Member"}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 font-sans truncate">{member.role}</p>
                    <p className="text-[10px] text-[#A0522D] mt-1 font-mono font-bold truncate">Skills: {member.skills.join(', ')}</p>
                  </div>
                </div>

                <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5 flex-1 flex flex-col justify-end">
                  <p className="text-[11px] text-zinc-300 italic font-sans leading-relaxed line-clamp-3">
                    "{member.quote}"
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3 mt-1">
                  <button
                    onClick={() => {
                      setEditingMember(member);
                      setNewMemberArtist(member.artist);
                      setNewMemberName(member.name || 'Band Member');
                      setNewMemberRole(member.role);
                      setNewMemberQuote(member.quote);
                      setNewMemberImageUrl(member.imageUrl);
                      setNewMemberSkills(member.skills.join(', '));
                      (window as any).isAddMemberOpen = true;
                    }}
                    className="p-1 px-2.5 bg-white/5 hover:bg-amber-600/10 text-amber-400 border border-white/10 rounded-xl text-[10px] flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      showConfirm({
                        title: "Purge Band Member Registration?",
                        message: `Are you sure you want to permanently delete ${member.artist} from the band's official roster?`,
                        actionLabel: "Purge Member",
                        actionColor: "red",
                        onConfirm: () => {
                          if (onDeleteMember) onDeleteMember(member.id);
                        }
                      });
                    }}
                    className="p-1 px-2.5 hover:bg-red-950/40 text-red-400 hover:text-red-300 rounded-xl text-[10px] flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Purge
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DYNAMIC FORM MODAL FOR BAND MEMBERS */}
          {((window as any).isAddMemberOpen || editingMember) && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-[#120f1d] border border-[#D4AF37]/25 rounded-2xl w-full max-w-sm p-6 space-y-4 my-8 animate-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-[#D4AF37] flex items-center gap-2 font-mono">
                    <Users className="w-5 h-5 text-amber-400" />
                    {editingMember ? `Editing Profile: "${newMemberArtist}"` : "Add New Band Member"}
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => {
                      (window as any).isAddMemberOpen = false;
                      setEditingMember(null);
                    }} 
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Artist Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white"
                      value={newMemberArtist}
                      onChange={(e) => setNewMemberArtist(e.target.value)}
                      placeholder="e.g. Aadarsh"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Label / Instrument Title</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="e.g. Vocals & Sitar"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Role / Subtitle</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      placeholder="e.g. Vocalist & Sitarist"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Artist Inspiration Quote</label>
                    <textarea
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white h-20 resize-none"
                      value={newMemberQuote}
                      onChange={(e) => setNewMemberQuote(e.target.value)}
                      placeholder="Breathes soul and lives in..."
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Artistic Skills (comma separated)</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white"
                      value={newMemberSkills}
                      onChange={(e) => setNewMemberSkills(e.target.value)}
                      placeholder="e.g. Spiritual Vocals, Arranging, Sitar"
                    />
                  </div>

                  <div className="space-y-1">
                    <ImageUploadWidget
                      id="member-avatar-upload"
                      value={newMemberImageUrl}
                      onChange={(url) => setNewMemberImageUrl(url)}
                      label="Portrait Image (Ratio 1:1 recommended)"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      (window as any).isAddMemberOpen = false;
                      setEditingMember(null);
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-400 text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!newMemberArtist || !newMemberName || !newMemberRole) return;
                      const skillsArr = newMemberSkills ? newMemberSkills.split(',').map(s => s.trim()).filter(Boolean) : [];
                      const payload = {
                        name: newMemberName,
                        artist: newMemberArtist,
                        role: newMemberRole,
                        quote: newMemberQuote,
                        imageUrl: newMemberImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
                        skills: skillsArr
                      };
                      if (editingMember) {
                        if (onUpdateMember) onUpdateMember(editingMember.id, payload);
                      } else {
                        if (onAddMember) onAddMember(payload);
                      }
                      (window as any).isAddMemberOpen = false;
                      setEditingMember(null);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Profile
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB TAB: CORE SITE BRANDING & IMAGERY */}
      {activeAdminSubTab === 'branding' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono">Site-wide Image Customizer</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-sans">Every graphic element on this portal can be customized instantly. Upload or select beautiful Unsplash, absolute, or drag-and-drop links below.</p>
          </div>

          <div className="bg-[#120f1d]/40 rounded-2xl border border-white/5 p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Hero Parallax Cinematic Banner */}
              <div className="space-y-3 bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono flex items-center gap-2 border-b border-white/5 pb-2">
                    🌌 Cinematic Hero Background
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-1 font-sans">Displays across the entire opening welcome section with gorgeous parallax darkness.</p>
                  <div className="my-3 aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-white/10 relative">
                    <img src={heroBgInput} alt="Hero cinematic backdrop" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"; }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <ImageUploadWidget
                    id="hero-bg-config"
                    value={heroBgInput}
                    onChange={(url) => setHeroBgInput(url)}
                    label="Image Source / URL"
                  />
                </div>
              </div>

              {/* 2. Poster Lead Vocalist */}
              <div className="space-y-3 bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono flex items-center gap-2 border-b border-white/5 pb-2">
                    🎤 Lead Singer Frontpiece
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-1 font-sans">Foreground artist element placed inside the concert posters / experience spotlights templates.</p>
                  <div className="my-3 aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-white/10 relative">
                    <img src={mainSingerInput} alt="Hero foreground singer" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1541604193435-22419f564789"; }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <ImageUploadWidget
                    id="front-vocal-config"
                    value={mainSingerInput}
                    onChange={(url) => setMainSingerInput(url)}
                    label="Image Source / URL"
                  />
                </div>
              </div>

              {/* 3. Poster Atmosphere Silhouette */}
              <div className="space-y-3 bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono flex items-center gap-2 border-b border-white/5 pb-2">
                    👤 Backdrop Artist Silhouette
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-1 font-sans">Secondary silhouette contrast element that blends deeply behind the main singer on flyers.</p>
                  <div className="my-3 aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-white/10 relative">
                    <img src={silhouetteInput} alt="Hero backend singer silhouette" className="w-full h-full object-cover shadow-inner" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7"; }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <ImageUploadWidget
                    id="silh-image-config"
                    value={silhouetteInput}
                    onChange={(url) => setSilhouetteInput(url)}
                    label="Image Source / URL"
                  />
                </div>
              </div>

            </div>

            {/* NEW EXTENDED BRAND TEXT EDITORS */}
            <div className="border-t border-white/5 pt-6 space-y-6">
              
              <div className="border-b border-white/5 pb-2">
                <h4 className="text-xs font-bold text-[#D4AF37] font-mono uppercase">1. General Brand Core Copy</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Band Name Header</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={bandNameInput}
                    onChange={(e) => setBandNameInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Slogan / Subtitle Tagline</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={taglineInput}
                    onChange={(e) => setTaglineInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Creed Statement Box Title</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={creedTitleInput}
                    onChange={(e) => setCreedTitleInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Creed Main Description Paragraph</label>
                  <textarea
                    rows={2}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={creedBodyInput}
                    onChange={(e) => setCreedBodyInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 border-b pb-2">
                <h4 className="text-xs font-bold text-[#D4AF37] font-mono uppercase">2. Detailed Story Narrative Texts</h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Story Heading Title</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={storyHeadingInput}
                    onChange={(e) => setStoryHeadingInput(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Story Paragraph 1 (Sanskrit Roots)</label>
                    <textarea
                      rows={4}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      value={storyParagraph1Input}
                      onChange={(e) => setStoryParagraph1Input(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase">Story Paragraph 2 (Hindustani Soul)</label>
                    <textarea
                      rows={4}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      value={storyParagraph2Input}
                      onChange={(e) => setStoryParagraph2Input(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 border-b pb-2">
                <h4 className="text-xs font-bold text-[#D4AF37] font-mono uppercase">3. Showcase Event Poster Typography & Footer Texts</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Poster Title Banner</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={posterMainTitleInput}
                    onChange={(e) => setPosterMainTitleInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Poster Subtitle Banner</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={posterSubTitleInput}
                    onChange={(e) => setPosterSubTitleInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Poster Side Slogan (Multi-line)</label>
                  <textarea
                    rows={2}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-sans focus:border-[#D4AF37] focus:outline-none"
                    value={posterSloganInput}
                    onChange={(e) => setPosterSloganInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Poster Event Organizer Label</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={posterFooterLeftInput}
                    onChange={(e) => setPosterFooterLeftInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Poster Date Footer</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={posterFooterMiddleInput}
                    onChange={(e) => setPosterFooterMiddleInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Poster Sponsor Label</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={posterFooterRightInput}
                    onChange={(e) => setPosterFooterRightInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 border-b pb-2">
                <h4 className="text-xs font-bold text-[#D4AF37] font-mono uppercase">4. Dynamic Statistics Counts</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/35 p-3 rounded-xl border border-white/5 space-y-2">
                  <span className="text-[9px] text-[#E32636] font-mono font-bold block">STATISTICS SLOT 1</span>
                  <input
                    type="text"
                    placeholder="Value (e.g. 120+)"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={stat1NumberInput}
                    onChange={(e) => setStat1NumberInput(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Description (e.g. Concerts Played)"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={stat1LabelInput}
                    onChange={(e) => setStat1LabelInput(e.target.value)}
                  />
                </div>

                <div className="bg-black/35 p-3 rounded-xl border border-white/5 space-y-2">
                  <span className="text-[9px] text-white font-mono font-bold block">STATISTICS SLOT 2</span>
                  <input
                    type="text"
                    placeholder="Value (e.g. 8M+)"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={stat2NumberInput}
                    onChange={(e) => setStat2NumberInput(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Description (e.g. Digital Streams)"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={stat2LabelInput}
                    onChange={(e) => setStat2LabelInput(e.target.value)}
                  />
                </div>

                <div className="bg-black/35 p-3 rounded-xl border border-white/5 space-y-2">
                  <span className="text-[9px] text-[#D4AF37] font-mono font-bold block">STATISTICS SLOT 3</span>
                  <input
                    type="text"
                    placeholder="Value (e.g. 100%)"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={stat3NumberInput}
                    onChange={(e) => setStat3NumberInput(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Description (e.g. Soul & Energy)"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={stat3LabelInput}
                    onChange={(e) => setStat3LabelInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 border-b pb-2">
                <h4 className="text-xs font-bold text-[#D4AF37] font-mono uppercase">5. Contact Channels & Handles</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Booking Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={contactEmailInput}
                    onChange={(e) => setContactEmailInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Inquiry Phone Line</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={contactPhoneInput}
                    onChange={(e) => setContactPhoneInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">HQ Office Geolocation Address</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={contactOfficeInput}
                    onChange={(e) => setContactOfficeInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase">Instagram Username Alias</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={contactInstagramInput}
                    onChange={(e) => setContactInstagramInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Section 6: Copy Content of other Sections */}
              <div className="border-t border-white/5 pt-4 border-b pb-2">
                <h4 className="text-xs font-bold text-[#D4AF37] font-mono uppercase">6. Section-Specific Text & Buttons (Every Page)</h4>
              </div>

              {/* Home Buttons */}
              <div className="space-y-4">
                <h5 className="text-[11px] font-bold text-zinc-400 font-mono uppercase">Home Hero Call-to-Action Buttons</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-mono uppercase">Button 1 Label (Primary Action)</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      value={homeHeroButton1Input}
                      onChange={(e) => setHomeHeroButton1Input(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-mono uppercase">Button 2 Label (Secondary Action)</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      value={homeHeroButton2Input}
                      onChange={(e) => setHomeHeroButton2Input(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-mono uppercase">Button 3 Label (Info / Bio Link)</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      value={homeHeroButton3Input}
                      onChange={(e) => setHomeHeroButton3Input(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Gallery & Videos Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <h5 className="text-[11px] font-bold text-zinc-400 font-mono uppercase">Gallery Tab Customization</h5>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Gallery Section Title</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        value={gallerySectionTitleInput}
                        onChange={(e) => setGallerySectionTitleInput(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Gallery Section Subtitle / Tag</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        value={gallerySectionSubtitleInput}
                        onChange={(e) => setGallerySectionSubtitleInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[11px] font-bold text-zinc-400 font-mono uppercase">Videos Tab Customization</h5>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Videos Section Title</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        value={videoSectionTitleInput}
                        onChange={(e) => setVideoSectionTitleInput(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Videos Section Subtitle / Tag</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        value={videoSectionSubtitleInput}
                        onChange={(e) => setVideoSectionSubtitleInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Spotlight Experience Sandbox & Events Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-4">
                <div className="space-y-4">
                  <h5 className="text-[11px] font-bold text-zinc-400 font-mono uppercase">Spotlight Tab Customization</h5>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Spotlight Section Title</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        value={spotlightSectionTitleInput}
                        onChange={(e) => setSpotlightSectionTitleInput(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Spotlight Section Subtitle / Tag</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        value={spotlightSectionSubtitleInput}
                        onChange={(e) => setSpotlightSectionSubtitleInput(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Spotlight Section Description Body</label>
                      <textarea
                        rows={3}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        value={spotlightSectionBodyInput}
                        onChange={(e) => setSpotlightSectionBodyInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[11px] font-bold text-zinc-400 font-mono uppercase">Concerts & Countdown Customization</h5>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Closest Upcoming Header Title</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        value={eventsSectionTitleInput}
                        onChange={(e) => setEventsSectionTitleInput(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-550 font-mono uppercase">Countdown Header Label</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        value={eventsSectionBannerSubtitleInput}
                        onChange={(e) => setEventsSectionBannerSubtitleInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center bg-black/50 p-4 rounded-xl border border-white/10">
              <span className="text-[11px] text-zinc-450 font-sans">
                Submitting updates applies all brand transformations across all screens.
              </span>
              <button
                type="button"
                onClick={async () => {
                  if (onUpdateSettings) {
                    onUpdateSettings({
                      heroBgUrl: heroBgInput || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
                      posterMainSingerUrl: mainSingerInput || "https://images.unsplash.com/photo-1541604193435-22419f564789",
                      posterSilhouetteUrl: silhouetteInput || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
                      bandName: bandNameInput,
                      tagline: taglineInput,
                      creedTitle: creedTitleInput,
                      creedBody: creedBodyInput,
                      storyHeading: storyHeadingInput,
                      storyParagraph1: storyParagraph1Input,
                      storyParagraph2: storyParagraph2Input,
                      posterMainTitle: posterMainTitleInput,
                      posterSubTitle: posterSubTitleInput,
                      posterSlogan: posterSloganInput,
                      posterFooterLeft: posterFooterLeftInput,
                      posterFooterMiddle: posterFooterMiddleInput,
                      posterFooterRight: posterFooterRightInput,
                      stat1Number: stat1NumberInput,
                      stat1Label: stat1LabelInput,
                      stat2Number: stat2NumberInput,
                      stat2Label: stat2LabelInput,
                      stat3Number: stat3NumberInput,
                      stat3Label: stat3LabelInput,
                      contactEmail: contactEmailInput,
                      contactPhone: contactPhoneInput,
                      contactOffice: contactOfficeInput,
                      contactInstagram: contactInstagramInput,
                      gallerySectionTitle: gallerySectionTitleInput,
                      gallerySectionSubtitle: gallerySectionSubtitleInput,
                      videoSectionTitle: videoSectionTitleInput,
                      videoSectionSubtitle: videoSectionSubtitleInput,
                      homeHeroButton1: homeHeroButton1Input,
                      homeHeroButton2: homeHeroButton2Input,
                      homeHeroButton3: homeHeroButton3Input,
                      eventsSectionTitle: eventsSectionTitleInput,
                      eventsSectionBannerSubtitle: eventsSectionBannerSubtitleInput,
                      spotlightSectionTitle: spotlightSectionTitleInput,
                      spotlightSectionSubtitle: spotlightSectionSubtitleInput,
                      spotlightSectionBody: spotlightSectionBodyInput
                    });
                    if (onAddAuditLog) {
                      onAddAuditLog('UPDATE_BRANDING_METRICS', 'Customized and updated unified brand copy fields and statistics via Administrative Console.');
                    }
                    alert("Site Branding & copy settings written successfully!");
                  }
                }}
                className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#bfa032] text-black font-extrabold rounded-xl transition-all text-xs flex items-center gap-2 hover:brightness-110 shadow-lg select-all"
              >
                <Save className="w-4 h-4" /> Save Branding & copy Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUB TAB: SECURITY PASSCODES MANAGEMENT */}
      {activeAdminSubTab === 'passcodes' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono">Administrative Role Passcodes</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-sans">
              Update the active passcodes required to switch between administrative privileges. Saving will update the global security system immediately.
            </p>
          </div>

          <div className="bg-[#120f1d]/40 rounded-2xl border border-white/5 p-6 max-w-xl mx-auto space-y-6">
            {passcodeSuccessMsg && (
              <div className="bg-green-950/40 border border-green-500/20 p-4 rounded-xl text-xs text-green-300 text-center">
                {passcodeSuccessMsg}
              </div>
            )}
            {passcodeErrorMsg && (
              <div className="bg-red-950/40 border border-red-500/20 p-4 rounded-xl text-xs text-red-300 text-center">
                {passcodeErrorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-mono uppercase block mb-1">Superadmin Role Password</label>
                <input
                  type="password"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase tracking-widest font-mono focus:border-[#D4AF37] focus:outline-none"
                  value={superadminPasscode}
                  onChange={(e) => setSuperadminPasscode(e.target.value)}
                  placeholder="SUPERADMIN PASSCODE"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-mono uppercase block mb-1">Admin Role Password</label>
                <input
                  type="password"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase tracking-widest font-mono focus:border-[#D4AF37] focus:outline-none"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="ADMIN PASSCODE"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#D4AF37] font-mono uppercase block mb-1">Manager Role Password</label>
                <input
                  type="password"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase tracking-widest font-mono focus:border-[#D4AF37] focus:outline-none"
                  value={managerPasscode}
                  onChange={(e) => setManagerPasscode(e.target.value)}
                  placeholder="MANAGER PASSCODE"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                type="button"
                disabled={isPasscodesLoading}
                onClick={async () => {
                  setIsPasscodesLoading(true);
                  setPasscodeSuccessMsg('');
                  setPasscodeErrorMsg('');
                  try {
                    const res = await fetch('/api/auth/passcodes', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        superadmin: superadminPasscode,
                        admin: adminPasscode,
                        manager: managerPasscode
                      })
                    });
                    const r = await res.json();
                    if (res.ok) {
                      setPasscodeSuccessMsg('✓ System security credentials and role passcodes rewritten successfully.');
                      if (onAddAuditLog) {
                        onAddAuditLog('CHANGE_ROLE_PASSWORDS', 'Superadmin modified administrative access passcodes and cryptographic key roles.');
                      }
                    } else {
                      setPasscodeErrorMsg(r.error || 'Failed to rewrite passcodes.');
                    }
                  } catch (err: any) {
                    setPasscodeErrorMsg(err.message || 'Error occurred.');
                  } finally {
                    setIsPasscodesLoading(false);
                  }
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:brightness-110 text-white font-extrabold rounded-xl text-xs transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {isPasscodesLoading ? 'Rewriting passwords...' : 'Rewrite System Passwords'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 8: SYSTEM SECURITY AUDIT LOGS */}
      {activeAdminSubTab === 'auditing' && isSuperadmin && (
        <div className="space-y-4 animate-in fade-in duration-300 text-xs font-mono">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono">System Audit Log streams</h3>
              <p className="text-[11px] text-zinc-400 mt-1 font-sans">Under RBAC directives, all database inserts, state modifications and user registrations record continuous trails.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setCustomAuditAction('MANUAL_AUDIT_ENTRY');
                  setCustomAuditDetails('');
                  setIsAddAuditOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-[10px] uppercase font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Inject Custom Trace Log
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmState({
                    isOpen: true,
                    title: "Clear Audit Logs Database",
                    message: "Are you absolutely sure you want to purge all system historical audit trail registries? This operation is irreversible and will only leave one system purge confirmation entry.",
                    actionLabel: "Purge Logs",
                    actionColor: "red",
                    onConfirm: () => {
                      if (onClearAuditLogs) onClearAuditLogs();
                      setConfirmState(prev => ({ ...prev, isOpen: false }));
                      alert("Audit logs pruned successfully.");
                    }
                  });
                }}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950 text-red-400 font-extrabold text-[10px] uppercase font-mono flex items-center gap-1.5 cursor-pointer border border-red-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear database logs
              </button>
            </div>
          </div>

          <div className="bg-black/45 border border-white/5 rounded-2xl p-4 overflow-y-auto max-h-[420px] space-y-2">
            {auditLogs.length === 0 ? (
              <div className="py-8 text-center text-zinc-550 italic font-sans text-xs">
                No system log records remain in storage. Use manual injection controls above.
              </div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="p-2.5 border-b border-white/5 hover:bg-white/5 rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between text-zinc-300 gap-2">
                  <div className="space-y-1 animate-in fade-in duration-200">
                    <div className="flex items-center flex-wrap gap-2 font-mono">
                      <span className="text-purple-400 text-[10px] bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/10">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#f5f5f7] leading-relaxed">{log.details}</p>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center text-[10px] text-zinc-500 font-mono">
                    <span>Actor: {log.username} ({log.userId})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmState({
                          isOpen: true,
                          title: "Delete specific audit entry",
                          message: `Are you sure you want to discard this specific log entry detail "${log.action}" timestamped at ${new Date(log.timestamp).toLocaleTimeString()}?`,
                          actionLabel: "Purge Entry",
                          actionColor: "red",
                          onConfirm: () => {
                            if (onDeleteAuditLog) onDeleteAuditLog(log.id);
                            setConfirmState(prev => ({ ...prev, isOpen: false }));
                            alert("Single audit trace record deleted successfully.");
                          }
                        });
                      }}
                      className="p-1 cursor-pointer text-zinc-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded transition-colors"
                      title="Purge specific trace entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* MANUAL AUDIT LOG ENTRY POPUP DIALOG */}
          {isAddAuditOpen && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
              <form onSubmit={handleAuditFormSubmit} className="bg-[#120f1d] border border-[#8A2BE2]/25 rounded-2xl w-full max-w-sm p-6 space-y-4 my-8 animate-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-[#D4AF37] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                    Inject Custom Audit Record
                  </h3>
                  <button type="button" onClick={() => setIsAddAuditOpen(false)} className="text-zinc-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase block mb-1">Log Action Category</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:border-[#D4AF37] focus:outline-none"
                    value={customAuditAction}
                    onChange={(e) => setCustomAuditAction(e.target.value)}
                    placeholder="e.g. MANUAL_OVERRIDE"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase block mb-1">Detailed Log Description</label>
                  <textarea
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    value={customAuditDetails}
                    onChange={(e) => setCustomAuditDetails(e.target.value)}
                    placeholder="Provide full description of why this manual audit change was injected by superadmin."
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddAuditOpen(false)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-350 text-xs transition-colors hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-650 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110 transition-all font-sans"
                  >
                    <Save className="w-3.5 h-3.5" /> Inject Log Entry
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}
        </motion.div>
      </AnimatePresence>

      {/* PROFESSIONAL CONFIRMATION DIALOG MODAL */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="bg-[#120f1d] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full flex-shrink-0 ${
                confirmState.actionColor === 'red' ? 'bg-red-950/50 text-red-400 border border-red-500/20' :
                confirmState.actionColor === 'green' ? 'bg-green-950/50 text-green-400 border border-green-500/20' :
                'bg-yellow-950/50 text-yellow-400 border border-yellow-500/20'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1 select-none">
                <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                  {confirmState.title}
                </h4>
                <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                  {confirmState.message}
                </p>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-zinc-400">
              ⚡ Action validation is secure and irreversible. Live database records will update immediately.
            </div>

            <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-zinc-250 transition-colors"
                id="admin-confirm-cancel-btn"
              >
                Cancel Action
              </button>
              <button
                type="button"
                onClick={confirmState.onConfirm}
                className={`px-4 py-2 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.01] ${
                  confirmState.actionColor === 'red' ? 'bg-gradient-to-r from-[#E32636] to-red-600 hover:brightness-110 shadow-lg shadow-red-950/50' :
                  confirmState.actionColor === 'green' ? 'bg-gradient-to-r from-emerald-400 to-green-600 hover:brightness-110 shadow-lg shadow-green-950/50' :
                  'bg-[#D4AF37] hover:bg-[#b08d23] shadow-lg shadow-yellow-950/50'
                }`}
                id="admin-confirm-execute-btn"
              >
                {confirmState.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
