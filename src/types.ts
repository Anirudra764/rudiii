/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export type TicketClass = 'vip' | 'fanpit' | 'general';

export interface TicketCategory {
  class: TicketClass;
  name: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  benefits: string[];
}

export interface Event {
  id: string;
  title: string;
  tagline: string;
  description: string;
  date: string; // ISO string or human format
  time: string;
  venue: string;
  venueAddress?: string;
  googleMapUrl?: string;
  city: string;
  imageUrl: string;
  status: 'upcoming' | 'soldout' | 'postponed' | 'cancelled';
  categories: TicketCategory[];
  totalSales: number;
}

export interface Seat {
  id: string; // e.g. "A1", "B4"
  row: string; // e.g. "A"
  number: number;
  class: TicketClass;
  isBooked: boolean;
}

export interface bookingItem {
  ticketClass: TicketClass;
  quantity: number;
  pricePerSeat: number;
  selectedSeats: string[]; // e.g. ["A-5", "A-6"]
}

export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  userFullName: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  items: bookingItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'stripe' | 'razorpay' | 'paypal';
  paymentId: string;
  qrCodeData: string;
  status: 'confirmed' | 'cancelled' | 'refund_requested' | 'refunded';
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  isActive: boolean;
  minBookingValue?: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  album: string;
  duration: string;
  audioUrl: string;
  coverUrl: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  appleMusicUrl?: string;
  releaseDate: string;
  isPopular?: boolean;
}

export interface VideoClip {
  id: string;
  title: string;
  type: 'music_video' | 'live' | 'bts';
  thumbnailUrl: string;
  youtubeEmbedId: string;
  duration: string;
  releaseDate: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: 'performance' | 'behind_scenes' | 'studio' | 'portrait';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  ipAddress?: string;
}

export interface BandMember {
  id: string;
  name: string; // e.g. "Vocals & Sitar"
  artist: string; // e.g. "Aadarsh"
  role: string; // e.g. "Vocalist & Sitarist"
  quote: string;
  imageUrl: string;
  skills: string[];
}

export interface SystemSettings {
  heroBgUrl: string;
  posterMainSingerUrl: string;
  posterSilhouetteUrl: string;
  bandName?: string;
  tagline?: string;
  creedTitle?: string;
  creedBody?: string;
  storyHeading?: string;
  storyParagraph1?: string;
  storyParagraph2?: string;
  posterMainTitle?: string;
  posterSubTitle?: string;
  posterSlogan?: string;
  posterFooterLeft?: string;
  posterFooterMiddle?: string;
  posterFooterRight?: string;
  stat1Number?: string;
  stat1Label?: string;
  stat2Number?: string;
  stat2Label?: string;
  stat3Number?: string;
  stat3Label?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactOffice?: string;
  contactInstagram?: string;
  gallerySectionTitle?: string;
  gallerySectionSubtitle?: string;
  videoSectionTitle?: string;
  videoSectionSubtitle?: string;
  homeHeroButton1?: string;
  homeHeroButton2?: string;
  homeHeroButton3?: string;
  eventsSectionTitle?: string;
  eventsSectionBannerSubtitle?: string;
  spotlightSectionTitle?: string;
  spotlightSectionSubtitle?: string;
  spotlightSectionBody?: string;
}

export interface SalesStat {
  date: string;
  revenue: number;
  ticketQuantity: number;
}
