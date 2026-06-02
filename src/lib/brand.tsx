/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Brand Logos and SVG designs extracted from referenced styles.
// Combining traditional circular mandalas (Indian classical) and aggressive sufi-rock lightning bars.
import React from "react";

export const BRAND_COLORS = {
  primaryBg: 'bg-[#000000]', // Pure Black base
  cardBg: 'bg-[#0a0a0a]/90', // Deep black glass cards
  accentGold: '#E32636', // Alizarin Red (primary)
  accentGoldHover: '#FF4D4D', // Light Red
  accentPurple: '#8B0000', // Deep Red accent
  accentRed: '#E32636', // Alizarin Red
  textLight: 'text-[#f5f5f7]',
  textMuted: 'text-[#a1a1aa]'
};

export const LOGO_ITEMS = {
  // Main cinematic logo with traditional mandalas & aggressive rock styling integration
  MainLogo: ({ className = "h-8" }: { className?: string }) => {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        {/* Monogram Symbol */}
        <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-[#8B0000] via-[#E32636] to-[#FF4D4D] rounded-lg shadow-lg rotate-45 border border-white/20">
          <span className="text-white font-extrabold text-sm tracking-tighter -rotate-45">R</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E32636] animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-widest text-[#f5f5f7] font-sans">
            RANG<span className="text-[#E32636]">R</span>EZ
          </span>
          <span className="text-[7px] tracking-[0.35em] text-[#E32636] uppercase font-mono font-bold">
            SOUL • VIBE • ENERGY
          </span>
        </div>
      </div>
    );
  },

  // Icon / Stamp variants used for footer & ticket watermark
  IconLogo: ({ className = "w-12 h-12" }: { className?: string }) => {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="#E32636" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="40" stroke="#8B0000" strokeWidth="1" />
        {/* Abstract Fusion Shreyora & Traditional Sitar/Tabla lines representation */}
        <path d="M50 15V85" stroke="#E32636" strokeWidth="3" strokeLinecap="round" />
        <path d="M25 50H75" stroke="#FF4D4D" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 32L68 68" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M32 68L68 32" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="14" fill="#0a0a0a" stroke="#E32636" strokeWidth="2" />
        <text x="50" y="55" textAnchor="middle" fill="#f5f5f7" fontSize="16" fontWeight="bold" fontFamily="sans-serif">R</text>
      </svg>
    );
  },

  // Unique Monogram symbol
  Monogram: ({ className = "w-16 h-16" }: { className?: string }) => {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* High end corporate brand seal resembling traditional Indian tabla rings & rock amplifiers */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E32636]/50 animate-spin" style={{ animationDuration: '40s' }}></div>
        <div className="absolute inset-2 rounded-full border border-[#8B0000]/40 bg-black/80"></div>
        <div className="relative font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] via-[#f5f5f7] to-[#E32636] tracking-tighter">
          ॐR
        </div>
      </div>
    );
  }
};
