/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, ArrowRight, Ticket, Compass, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
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
    heroBgUrl: "/uploads/lead_singer_microphone.jpg",
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
        
        {/* Cinematic background illustration image animates with a slow, ambient Ken Burns zoom and pan */}
        <motion.img
          src={activeSettings.heroBgUrl}
          alt={`${activeSettings.bandName} live concert background atmosphere`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover absolute inset-0 filter brightness-[0.7] select-none"
          animate={{
            scale: [1.02, 1.10, 1.02],
            x: [0, 8, -4, 0],
            y: [0, -4, 4, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Cinematic Golden dust overlay */}
        <div className="absolute inset-0 bg-radial-at-t from-[#8A2BE2]/10 via-transparent to-transparent pointer-events-none z-10" />

        {/* Centered main labels block */}
        <div className="relative z-20 text-center px-6 max-w-4xl space-y-6 animate-in slide-in-from-bottom-12 duration-1000">
          
          <span className="text-xs uppercase tracking-[0.45em] text-[#D4AF37] font-mono font-bold block animate-pulse text-center">
            {activeSettings.tagline}
          </span>

          <motion.h1 
            className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#D4AF37] leading-none select-none text-center uppercase font-display cursor-default relative drop-shadow-[0_4px_30px_rgba(227,38,54,0.35)]"
            initial={{ opacity: 0, scale: 0.95, letterSpacing: "-0.05em" }}
            animate={{ opacity: 1, scale: 1, letterSpacing: "-0.025em" }}
            whileHover={{ scale: 1.03, letterSpacing: "0.01em" }}
            transition={{ 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1], // Custom sophisticated EaseOutExpo
              scale: { duration: 0.4, ease: "easeOut" },
              letterSpacing: { duration: 0.6, ease: "easeOut" }
            }}
            style={{ textShadow: "0 0 45px rgba(227,38,54,0.2)" }}
          >
            {activeSettings.bandName}
          </motion.h1>

          <p className="text-sm md:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-semibold text-center whitespace-pre-line">
            {activeSettings.creedBody}
          </p>

          {/* Enhanced Premium Motion CTA Segment */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-6 pt-10 relative z-30"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: 0.15,
                  staggerChildren: 0.12
                }
              }
            }}
          >
            {/* Primary Action Button: Booking Options */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 25, scale: 0.95 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { type: "spring", stiffness: 100, damping: 15 }
                }
              }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="relative group"
            >
              {/* Pulsing colored glow aura inside the theme's core colors */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4AF37] via-[#E32636] to-[#8A2BE2] rounded-xl blur-lg opacity-40 group-hover:opacity-85 transition duration-500 group-hover:duration-200 animate-pulse" />
              
              <button
                onClick={onExploreTourEvents}
                className="relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E3BC43] hover:to-[#B68C1C] text-black font-mono text-xs uppercase tracking-[0.25em] font-extrabold flex items-center gap-3.5 transition-all duration-300 shadow-2xl group/btn cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-black group-hover/btn:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">{activeSettings.homeHeroButton1}</span>
                <ChevronRight className="w-4 h-4 text-black group-hover/btn:translate-x-1.5 transition-transform duration-300" />
              </button>
            </motion.div>

            {/* Secondary Action/Exploration Button */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 25, scale: 0.95 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { type: "spring", stiffness: 100, damping: 15 }
                }
              }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="relative group"
            >
              <button
                onClick={onLearnMoreAboutBand}
                className="relative px-8 py-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 text-white font-mono text-xs uppercase tracking-[0.25em] font-semibold flex items-center gap-3.5 transition-all duration-300 group/btn2 backdrop-blur-md cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#D4AF37] group-hover/btn2:rotate-45 transition-transform duration-500" />
                <span>{activeSettings.homeHeroButton3}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#8A2BE2] opacity-0 group-hover/btn2:opacity-100 group-hover/btn2:scale-110 transition-all duration-300" />
              </button>
            </motion.div>
          </motion.div>

        </div>

        {/* Bottom floating scroll guide */}
        <motion.div 
          className="absolute bottom-4 inset-x-0 mx-auto flex flex-col items-center justify-center z-20 select-none cursor-pointer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Shimmering Text - Ultra Clean and Tiny */}
          <motion.span 
            className="text-[8px] tracking-[0.4em] font-mono font-medium text-zinc-500 uppercase relative"
            animate={{ opacity: [0.35, 0.85, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            SCROLL TO DISCOVER
          </motion.span>
          
          {/* Premium Mouse Scroll Wheel Pill Indicator - Sleeker, thinner borders */}
          <div className="mt-2.5 relative w-[18px] h-[30px] rounded-full border border-zinc-500/20 flex justify-center p-1 bg-black/40 backdrop-blur-md shadow-[0_0_12px_rgba(255,255,255,0.02)]">
            {/* Smoothly moving indicator bar or dot */}
            <motion.div 
              className="w-1 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.8)]"
              animate={{ 
                y: [0, 10, 0],
                opacity: [1, 0.3, 1]
              }}
              transition={{ 
                duration: 2.2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </div>

          {/* Minimalist laser indicator line */}
          <motion.div 
            className="w-[1px] bg-gradient-to-b from-[#D4AF37]/80 to-transparent mt-2.5"
            animate={{ 
              height: [0, 16, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }}
          />
        </motion.div>
      </div>

      {/* 2. LIVE UPCOMING CONCERT CALL TO ACTION */}
      {upcomingEvent && activeSettings.areTicketsReleased && (
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
