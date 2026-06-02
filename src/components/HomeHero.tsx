/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Event, SystemSettings } from '../types.js';

interface HomeHeroProps {
  onLearnMoreAboutBand: () => void;
  onExploreTourEvents: () => void;
  onViewLivePoster: () => void;
  upcomingEvent: Event | null;
  settings?: SystemSettings;
}

export default function HomeHero({
  onLearnMoreAboutBand,
  onExploreTourEvents,
  onViewLivePoster,
  upcomingEvent,
  settings
}: HomeHeroProps) {
  const activeSettings = {
    heroBgUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1920&q=85",
    bandName: "RANGREZ",
    tagline: "★ SANSKRIT ROOTED SUFI FUSION ROCK ★",
    creedBody: "We don't just play music, we create feelings. Driven by energy, connected by rhythm, we turn every single performance into a highly memorable shared experience.",
    homeHeroButton1: "Secure Tour Spots",
    homeHeroButton2: "★ Live Experience Poster",
    homeHeroButton3: "Discover The Souls",
    ...settings
  };

  return (
    <div className="relative animate-in fade-in duration-500 text-white">
      
      {/* 1. CINEMATIC BACKGROUND HERO BANNER */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Layer background shade mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/85 to-[#0b0a11] z-10" />
        
        {/* Cinematic background illustration image */}
        <img
          src={activeSettings.heroBgUrl}
          alt={`${activeSettings.bandName} live concert background atmosphere`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover absolute inset-0 transform scale-102 filter brightness-[0.7] scroll-parallax"
        />

        {/* Cinematic Golden dust overlay */}
        <div className="absolute inset-0 bg-radial-at-t from-[#8A2BE2]/10 via-transparent to-transparent pointer-events-none z-10" />

        {/* Centered main labels block */}
        <div className="relative z-20 text-center px-6 max-w-4xl space-y-6 animate-in slide-in-from-bottom-12 duration-1000">
          
          <span className="text-xs uppercase tracking-[0.45em] text-[#D4AF37] font-mono font-bold block animate-pulse text-center">
            {activeSettings.tagline}
          </span>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-slate-100 to-[#D4AF37] leading-none select-none text-center uppercase font-display">
            {activeSettings.bandName}
          </h1>

          <p className="text-sm md:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-semibold text-center whitespace-pre-line">
            {activeSettings.creedBody}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <button
              onClick={onExploreTourEvents}
              className="px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:scale-104 text-black text-xs uppercase tracking-widest font-extrabold transition-all shadow-xl shadow-[#D4AF37]/10"
            >
              {activeSettings.homeHeroButton1}
            </button>
            <button
              onClick={onViewLivePoster}
              className="px-8 py-3.5 rounded-xl bg-[#E32636]/15 hover:bg-[#E32636]/25 border border-[#E32636]/40 text-[#f5f5f7] text-xs uppercase tracking-widest font-extrabold transition-all shadow-lg"
            >
              {activeSettings.homeHeroButton2}
            </button>
            <button
              onClick={onLearnMoreAboutBand}
              className="px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-350 uppercase tracking-widest font-semibold transition-all"
            >
              {activeSettings.homeHeroButton3}
            </button>
          </div>

        </div>

        {/* Bottom floating scroll guide */}
        <div className="absolute bottom-10 inset-x-0 mx-auto text-center z-20 animate-bounce select-none">
          <span className="text-[10px] text-zinc-500 tracking-widest uppercase font-mono">STRETCH DOWNWARD</span>
          <div className="w-[1px] h-8 bg-[#D4AF37] mx-auto mt-2" />
        </div>
      </div>

      {/* 2. LIVE UPCOMING CONCERT CALL TO ACTION */}
      {upcomingEvent && (
        <div className="py-12 bg-gradient-to-r from-[#181524] to-[#0f0e13] border-y border-[#8A2BE2]/20 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] flex-shrink-0 animate-pulse">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-[#D4AF37]">Next Live Date Scheduled</span>
                <h3 className="text-lg font-bold text-white leading-tight mt-0.5">{upcomingEvent.title}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{upcomingEvent.venue} ({upcomingEvent.city}, India)</p>
              </div>
            </div>

            <button
              onClick={onExploreTourEvents}
              className="px-6 py-2.5 rounded-xl bg-transparent border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase transition-colors"
            >
              Order Tickets
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
