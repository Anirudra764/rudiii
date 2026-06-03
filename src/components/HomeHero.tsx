/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ArrowRight, Ticket, Compass, Sparkles, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2, Film, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
    cinematicIntroVideoUrl: "/uploads/rangrez_cinematic_intro.mp4",
    cinematicIntroPosterUrl: "/uploads/poster_complete_band.jpg",
    ...settings
  };

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6.0); // 6 Secs looping sequence
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  // Sync simulated sequencer timer if the physical video fails or is loading
  useEffect(() => {
    let intervalId: any;
    if (videoError || !videoRef.current) {
      if (isPlaying) {
        intervalId = setInterval(() => {
          setCurrentTime(prev => {
            const next = prev + 0.05;
            if (next >= duration) {
              return 0;
            }
            return next;
          });
        }, 50);
      }
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, videoError, duration]);

  // Map timer to scenes dynamically
  useEffect(() => {
    if (currentTime < 1.5) {
      setActiveScene(0); // 0s - 1.5s: Cinematic 3D heavy smoke logo
    } else if (currentTime < 4.2) {
      setActiveScene(1); // 1.5s - 4.2s: Band members red halo aura & Soul Energy
    } else {
      setActiveScene(2); // 4.2s - 6.0s: Creed statement text overlay
    }
  }, [currentTime]);

  const handleTogglePlay = () => {
    if (videoRef.current && !videoError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => setVideoError(true));
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current && !videoError) {
      videoRef.current.currentTime = time;
    }
  };

  const handleFullscreen = () => {
    const elem = document.getElementById('cinematic-video-frame');
    if (elem) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        elem.requestFullscreen().catch(err => {
          console.warn("Fullscreen request declined:", err);
        });
      }
    }
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

      {/* 1.5 MESMERIZING BRAND IMMERSION BOARD */}
      <div className="relative py-24 bg-gradient-to-b from-[#0b0a11] via-[#100c1d] to-[#05040a] z-20 border-t border-white/[0.03] overflow-hidden">
        {/* Subtle glowing fluid gradients in the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#E32636]/10 via-[#8A2BE2]/10 to-transparent rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute -top-10 left-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full filter blur-[90px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          {/* Subtle line decoration */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-4"
          >
            {/* Elegant glowing Sanskrit slogan */}
            <span className="text-[10px] tracking-[0.45em] font-mono font-black text-[#D4AF37] uppercase block">
              ★ THE DYER OF SOULS ★
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase">
              REVOLUTIONIZING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E32636]">SUFI FUSION ROCK</span>
            </h2>
          </motion.div>

          {/* CINEMATIC THEATRICAL VIDEO PLAYER HUB */}
          <div 
            id="cinematic-video-frame" 
            className="my-12 relative w-full aspect-[21/9] rounded-3xl bg-zinc-950 border border-white/10 shadow-[0_0_50px_rgba(227,38,54,0.15)] flex flex-col justify-end overflow-hidden group select-none"
          >
            {/* Widescreen cinema bars masking style */}
            <div className="absolute inset-x-0 top-0 h-4 bg-black/90 z-20 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-4 bg-black/90 z-20 pointer-events-none" />

            {/* Glowing Red & Purple backlights on theatrical edges */}
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#E32636]/10 to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#8A2BE2]/10 to-transparent pointer-events-none z-10" />

            {/* Dynamic Real-time video player source */}
            {!videoError ? (
              <video
                ref={videoRef}
                src={activeSettings.cinematicIntroVideoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover absolute inset-0 z-0"
                onTimeUpdate={handleTimeUpdate}
                onError={() => {
                  console.log("Video source load deferred/unavailable. Initiating ultra-high fidelity simulated cinematic sequencing engine...");
                  setVideoError(true);
                }}
              />
            ) : null}

            {/* HIGH-FIDELITY SIMULATED VISUALIZATION (Framer-Motion backed when physical video is loading or was not yet uploaded) */}
            {videoError && (
              <div className="w-full h-full absolute inset-0 z-0 overflow-hidden bg-[#07050d] flex items-center justify-center">
                {/* Simulated bokeh fireflies */}
                <div className="absolute inset-0 bg-radial-at-b from-[#E32636]/15 via-transparent to-transparent pointer-events-none" />
                
                {/* Scene 0 (0.0s - 1.5s): Crimson metallic heavy-smoke RANGREZ heading */}
                {activeScene === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/40"
                  >
                    {/* Volumetric spotlight background beam effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-full bg-gradient-to-b from-white/10 via-white/2 to-transparent filter blur-md transform -skew-x-12 origin-top" />
                    
                    <motion.h2 
                      className="text-5xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-red-600 via-rose-500 to-red-900 filter drop-shadow-[0_0_35px_rgba(227,38,54,0.7)] uppercase font-display select-none cursor-default"
                      style={{ textShadow: "0 0 40px rgba(227,38,54,0.4)" }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      RANGREZ
                    </motion.h2>
                    <span className="text-[9px] tracking-[0.5em] text-zinc-400 font-mono mt-4 block uppercase">
                      ★ THE DYER OF SOULS ★
                    </span>
                  </motion.div>
                )}

                {/* Scene 1 (1.5s - 4.2s): Band members red neon arc backdrop */}
                {activeScene === 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-black"
                  >
                    {/* Main band image with slow Ken-Burns pan */}
                    <motion.img 
                      src={activeSettings.cinematicIntroPosterUrl}
                      alt="Rangrez live complete band action"
                      className="w-full h-full object-cover opacity-75"
                      animate={{ scale: [1.02, 1.08, 1.02], x: [0, 4, 0] }}
                      transition={{ duration: 2.7, ease: "easeInOut", repeat: Infinity }}
                    />

                    {/* Red lightning vector halos and energy arcs */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {/* Inner red ring halo */}
                      <motion.div 
                        className="w-48 h-48 md:w-80 md:h-80 border-2 border-red-600 rounded-full opacity-60 filter blur-[1px]"
                        animate={{ scale: [0.95, 1.05, 0.95], rotate: 360 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div 
                        className="absolute w-52 h-52 md:w-86 md:h-86 border border-rose-500 rounded-full opacity-40 filter blur-sm"
                        animate={{ scale: [1.05, 0.95, 1.05], rotate: -360 }}
                        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                      />
                    </div>

                    {/* Sidebar float notes: Soul & Energy */}
                    <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
                      <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-xl px-4 py-2 text-left hidden sm:block"
                      >
                        <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase block">ORIGINAL FUSION</span>
                        <h4 className="text-sm font-black text-white uppercase mt-0.5 tracking-tight">SOUL</h4>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-xl px-4 py-2 text-right hidden sm:block"
                      >
                        <span className="text-[9px] font-mono tracking-widest text-red-500 uppercase block font-bold">RAGAS & ACCENTS</span>
                        <h4 className="text-sm font-black text-white uppercase mt-0.5 tracking-tight">ENERGY</h4>
                      </motion.div>
                    </div>

                    {/* Captions subtitles on film screen bottom */}
                    <div className="absolute bottom-6 inset-x-0 text-center z-10 pointer-events-none">
                      <span className="bg-black/80 text-white border border-white/10 rounded-lg px-6 py-1 text-xs md:text-sm font-semibold tracking-wide drop-shadow-lg inline-block uppercase">
                        "WE DON'T JUST PLAY MUSIC, WE CREATE FEELINGS."
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Scene 2 (4.2s - 6.0s): Devotional creed narrative slogan */}
                {activeScene === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-gradient-to-b from-black via-[#10071c] to-black flex flex-col items-center justify-center p-6 text-center"
                  >
                    <Sparkles className="w-8 h-8 text-red-500 opacity-60 mb-3" />
                    <h3 className="text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-rose-400 uppercase tracking-wide leading-tight max-w-3xl">
                      A Transcendental Journey Connecting Sanskrit Frameworks to Live Heavy Amplification
                    </h3>
                    <div className="flex gap-4 items-center justify-center mt-4">
                      <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase block">★★ SUFI FUSION ★★</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase block">★★ RANGREZ MUSIC ★★</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* CONTROLLERS & PLAYBACK OVERLAYS HUD (Displays beautifully on hover) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* TOP HEADER */}
              <div className="flex justify-between items-center bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/[0.03]">
                <div className="flex items-center gap-2">
                  <Film className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-zinc-300 font-bold uppercase tracking-wider">
                    {videoError ? "● RANGREZ CINEMATIC SEQUENCE [SIMULATED]" : "● PLAYING DIGITAL DIRECT VIDEO STREAM"}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5 text-[8px] font-mono uppercase font-black tracking-widest">
                  <Zap className="w-2.5 h-2.5 animate-bounce" /> VEO ENGINE
                </div>
              </div>

              {/* BOTTOM CONTROL GRID */}
              <div className="space-y-3 bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-2xl">
                {/* Slider progress track */}
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-zinc-400 min-w-[28px] text-right">
                    {currentTime.toFixed(1)}s
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 10}
                    step={0.05}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="flex-1 accent-[#E32636] h-1.5 bg-zinc-800 rounded-lg cursor-pointer transition-all hover:bg-zinc-700"
                  />
                  <span className="text-[9px] font-mono text-zinc-400 min-w-[28px]">
                    {duration.toFixed(1)}s
                  </span>
                </div>

                {/* Function Buttons row */}
                <div className="flex items-center justify-between">
                  {/* Left segment */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTogglePlay}
                      className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E32636] to-[#af1f2b] text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-all text-xs border border-white/10 cursor-pointer"
                      title={isPlaying ? "Pause Intro Presentation" : "Play Intro Presentation"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    <button
                      onClick={handleToggleMute}
                      className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
                      title={isMuted ? "Unmute sound outputs" : "Mute sound outputs"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <div className="hidden md:flex flex-col text-left justify-center pl-2">
                      <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest leading-none">NOW PLAYING</span>
                      <h4 className="text-xs font-bold text-white uppercase mt-1 tracking-tight">RANGREZ CINEMATIC BAND INTRO</h4>
                    </div>
                  </div>

                  {/* Right segment */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest hidden lg:inline mr-2">
                      TRANSITIONAL WATERMARK BRANDING [VEO]
                    </span>
                    <button
                      onClick={handleFullscreen}
                      className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
                      title="Toggle Fullscreen Theatre"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core values block columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            {[
              {
                title: "Traditional Roots",
                subtitle: "Sanskrit Frameworks",
                desc: "Every frequency stems from pristine Hindustani classical ragas and centuries-old folk lore, treated with raw, uncompromising acoustic authenticity.",
                color: "#D4AF37"
              },
              {
                title: "Sonic Fire",
                subtitle: "Heavy Amplification",
                desc: "Where the calming resonance of Bansuri flutes collides with massive high-gain guitar amplifiers and double-kick hybrid rhythm rigs.",
                color: "#E32636"
              },
              {
                title: "Deep Devotion",
                subtitle: "The Dyer of Souls",
                desc: "Rangrez translates to dyeing the inner self, transferring raw passion, sonic weight, and transcendental energy directly to the audience.",
                color: "#8A2BE2"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                whileHover={{ y: -6, borderColor: `${item.color}40` }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Glowing corner indicator */}
                <div 
                  className="absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none rounded-bl-full"
                  style={{ background: `radial-gradient(circle at top right, ${item.color}, transparent)` }}
                />
                
                <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
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
