/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Sparkles, Download, Check, ShieldCheck, Play, Pause, RefreshCw, User, Music, Share2, Layers } from 'lucide-react';
import { BRAND_COLORS } from '../lib/brand.js';
import { SystemSettings } from '../types.js';

interface LiveSpotlightProps {
  currentTrack: any;
  isPlayingSound: boolean;
  onPlayPauseToggle: () => void;
  onSelectTrackToPlay: (track: any) => void;
  musicList: any[];
  settings?: SystemSettings;
}

export default function LiveSpotlight({
  currentTrack,
  isPlayingSound,
  onPlayPauseToggle,
  onSelectTrackToPlay,
  musicList,
  settings
}: LiveSpotlightProps) {
  // Poster design states
  const [fanName, setFanName] = useState('Anirudra Paul');
  const [passType, setPassType] = useState<'vip' | 'crew' | 'fan'>('vip');
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [activeTheme, setActiveTheme] = useState<'original' | 'grungy' | 'flicker_neon'>('original');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<string | null>(null);

  const posterRef = useRef<HTMLDivElement>(null);

  const customTaglines = [
    "ONE STAGE. ONE SOUND. ONE IDENTITY.",
    "REAL ENERGY. PURE SUFI ROCK. NO FILTER.",
    "SACRED ECHOES REVERBERATING IN SOUL.",
    "EXPERIENCE THE IMPERIAL RHYTHM ECLIPSE."
  ];

  const passConfig = {
    vip: { name: 'Imperial VIP Fan Pass', color: 'text-[#E32636] border-[#E32636]', stamp: 'VIP BACKSTAGE' },
    crew: { name: 'Sponsor Pit Access', color: 'text-amber-400 border-amber-400', stamp: 'SHREYORA CREW' },
    fan: { name: 'Official Fan Guest Pass', color: 'text-green-400 border-green-400', stamp: 'FAN ENTHUSIAST' }
  };

  const handleDownloadPDF = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    try {
      // Dynamically import libraries to keep initial loading optimized
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = posterRef.current;
      
      // Generate canvas with high pixel ratio for high-quality printing
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 2.5, // Enhances text crispness and image fidelity in generated PDF
        backgroundColor: '#000000',
        logging: false,
        onclone: (clonedDoc) => {
          // Remove/sanitize modern oklch and oklab color formats that cause html2canvas parser to crash in Tailwind v4.
          try {
            // 1. Sanitize standard style tags
            const styleTags = Array.from(clonedDoc.getElementsByTagName('style'));
            for (const tag of styleTags) {
              if (tag.textContent) {
                tag.textContent = tag.textContent
                  .replace(/oklch\([^)]+\)/gi, 'transparent')
                  .replace(/oklab\([^)]+\)/gi, 'transparent');
              }
            }

            // 2. Inline, sanitize, and override external link stylesheets
            const linkTags = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
            for (const linkTag of linkTags) {
              const href = linkTag.href;
              if (href) {
                try {
                  const xhr = new XMLHttpRequest();
                  xhr.open('GET', href, false); // Synchronous request to block execution safely within onclone
                  xhr.send(null);
                  if (xhr.status === 200) {
                    const sanitizedCss = xhr.responseText
                      .replace(/oklch\([^)]+\)/gi, 'transparent')
                      .replace(/oklab\([^)]+\)/gi, 'transparent');
                    
                    const newStyle = clonedDoc.createElement('style');
                    newStyle.textContent = sanitizedCss;
                    if (linkTag.parentNode) {
                      linkTag.parentNode.insertBefore(newStyle, linkTag);
                      linkTag.parentNode.removeChild(linkTag);
                    }
                  }
                } catch (linkErr) {
                  // If synchronous fetch fails (e.g. cross-origin restriction), skip inlining
                  console.warn('Skipped inlining external stylesheet:', href, linkErr);
                }
              }
            }

            // 3. Inline style attributes of all cloned elements
            const allElements = Array.from(clonedDoc.getElementsByTagName('*')) as HTMLElement[];
            for (const el of allElements) {
              if (el.getAttribute && el.getAttribute('style')) {
                const oldStyle = el.getAttribute('style') || '';
                if (oldStyle.includes('oklch') || oldStyle.includes('oklab')) {
                  const newStyle = oldStyle
                    .replace(/oklch\([^)]+\)/gi, 'transparent')
                    .replace(/oklab\([^)]+\)/gi, 'transparent');
                  el.setAttribute('style', newStyle);
                }
              }
            }
          } catch (e) {
            console.error('Error during styles sanitization in html2canvas clone:', e);
          }
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Page size matches exact aspect ratio of the poster element
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2.5, canvas.height / 2.5],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2.5, canvas.height / 2.5);
      
      const fileName = `Rangrez_Live_Poster_${fanName.trim() ? fanName.replace(/\s+/g, '_') : 'Guest'}.pdf`;
      pdf.save(fileName);

      const randomId = `RNG-POST-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedTicket(randomId);
    } catch (error) {
      console.error('Failed to export PDF poster:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Re-usable Shreyora sponsor logo SVG paths to perfectly align with uploaded image style
  const ShreyoraLogo = ({ color = "currentColor", size = "h-8" }: { color?: string; size?: string }) => (
    <div className={`flex items-center gap-1.5 ${size}`}>
      <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15 L78 35 L78 65 L50 85 L22 65 L22 35 Z" stroke={color} strokeWidth="4" />
        <path d="M50 25 L68 40 L68 60 L50 75 L32 60 L32 40 Z" stroke={color} strokeWidth="2" strokeDasharray="2 2" />
        {/* Stylized geometric curves meeting at center */}
        <path d="M50 15 V85" stroke={color} strokeWidth="2" />
        <path d="M22 35 H78" stroke={color} strokeWidth="2" />
        <path d="M22 65 H78" stroke={color} strokeWidth="2" />
        <circle cx="50" cy="50" r="12" fill="#000000" stroke={color} strokeWidth="2" />
        <path d="M46 50 C46 47, 54 47, 54 50 C54 53, 46 53, 46 50 Z" fill={color} />
      </svg>
      <div className="flex flex-col text-left">
        <span className="font-black tracking-[0.2em] uppercase text-[10px] leading-tight text-white">SHREYORA</span>
        <span className="text-[5.5px] uppercase tracking-widest text-[#a1a1aa] leading-none">Street meets statement</span>
      </div>
    </div>
  );

  return (
    <section id="live-spotlight-sec" className="py-12 px-4 md:px-6 max-w-7xl mx-auto text-white relative z-10">
      
      {/* SECTION HEADER */}
      <div className="text-center space-y-3 mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.3em] text-[#E32636] font-mono font-black">
          <Sparkles className="w-4 h-4 animate-pulse text-[#E32636]" />
          {settings?.spotlightSectionSubtitle || "Marquee Feature Spotlight"}
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
          {settings?.spotlightSectionTitle || "Live Experience Poster Sandbox"}
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 max-w-3xl mx-auto whitespace-pre-line">
          {settings?.spotlightSectionBody || "We have integrated the official Rangrez Live Experience concert design from Sunday 24th May 2026. Use our interactive suite to customize your dynamic concert badge, enable theatrical fx, and trigger live background sessions."}
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-[#E32636] to-[#8B0000] mx-auto rounded-full mt-4" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE POSTER SETTINGS */}
        <div className="lg:col-span-5 space-y-6 bg-zinc-950/90 border border-zinc-900 p-6 rounded-3xl backdrop-blur-md shadow-xl">
          
          <div className="border-b border-zinc-900 pb-4">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-[#E32636]">Design Studio</span>
            <h3 className="text-lg font-bold text-zinc-100">Configure Fan Credentials</h3>
            <p className="text-xs text-zinc-500 mt-1">Watermark your details onto the high-fidelity poster blueprint.</p>
          </div>

          {/* Setting 1: Fan Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">Fan Guest Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                maxLength={25}
                value={fanName}
                onChange={(e) => setFanName(e.target.value)}
                placeholder="Insert fan name..."
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#E32636] transition-colors"
              />
            </div>
          </div>

          {/* Setting 2: Pass Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">Access Pass Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {(['vip', 'crew', 'fan'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setPassType(tier)}
                  className={`py-2 px-3 rounded-xl border text-[10px] uppercase font-mono transition-all text-center ${
                    passType === tier
                      ? 'border-[#E32636] bg-[#E32636]/10 text-white font-extrabold'
                      : 'border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tier} Pass
                </button>
              ))}
            </div>
          </div>

          {/* Setting 3: Poster Tagline */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">Middle Slogan Line</label>
            <select
              value={taglineIndex}
              onChange={(e) => setTaglineIndex(Number(e.target.value))}
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#E32636] transition-colors cursor-pointer"
            >
              {customTaglines.map((tag, idx) => (
                <option key={idx} value={idx} className="bg-neutral-950 text-white">
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Setting 4: Color Profile Theme */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">Atmospheric FX Shader</label>
            <div className="grid grid-cols-3 gap-2">
              {(['original', 'grungy', 'flicker_neon'] as const).map(theme => (
                <button
                  key={theme}
                  onClick={() => setActiveTheme(theme)}
                  className={`py-2 px-3 rounded-xl border text-[10px] uppercase font-mono transition-all text-center ${
                    activeTheme === theme
                      ? 'border-[#E32636] bg-zinc-900 text-white font-extrabold'
                      : 'border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {theme.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Concert Audio Loop Controller */}
          <div className="mt-8 bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#E32636] animate-pulse" />
                <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-[#E32636]">Concert Playlist</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500">Enable Session Audio</span>
            </div>
            {currentTrack && (
              <div className="flex items-center justify-between bg-black/60 rounded-xl p-2.5 border border-zinc-800">
                <div className="min-w-0 flex-1 pr-2">
                  <span className="block text-[8px] uppercase font-mono text-[#E32636] tracking-widest">{currentTrack.album}</span>
                  <p className="text-xs font-bold text-white truncate">{currentTrack.title}</p>
                </div>
                <button
                  onClick={onPlayPauseToggle}
                  className="w-8 h-8 rounded-full bg-[#E32636] hover:bg-[#FF4D4D] text-white flex items-center justify-center transition-transform hover:scale-110"
                >
                  {isPlayingSound ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>
              </div>
            )}
            <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
              {musicList.slice(0, 3).map(track => (
                <button
                  key={track.id}
                  onClick={() => onSelectTrackToPlay(track)}
                  className={`text-[9px] uppercase font-mono px-3 py-1.5 rounded-lg border flex-shrink-0 transition-all ${
                    currentTrack?.id === track.id
                      ? 'bg-[#E32636]/10 text-white border-[#E32636] font-bold'
                      : 'bg-transparent border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {track.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Simulate Action Triggers */}
          <div className="pt-4 border-t border-zinc-900 space-y-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E32636] via-[#8B0000] to-red-600 font-extrabold text-xs uppercase tracking-widest text-white hover:scale-101 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E32636]/25 disabled:opacity-50 pointer-events-auto cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  Generating High-Res PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  Download Poster in PDF
                </>
              )}
            </button>

            {generatedTicket && (
              <div className="p-4 bg-green-950/30 border border-green-500/20 rounded-2xl flex items-start gap-3.5 leading-relaxed text-left animate-in zoom-in-95">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 flex-shrink-0 border border-green-500/20">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-green-400 uppercase tracking-wide">Poster Export ID Generated</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Your exclusive digital guest badge code is **{generatedTicket}**. Keep this safe for entry matching!
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE CONCERT POSTER CLONE */}
        <div className="lg:col-span-7 flex justify-center">
          
          {/* POSTER CARD BODY */}
          <div
            ref={posterRef}
            className={`w-full max-w-lg aspect-[3/4] bg-black border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col justify-between transition-all duration-700 ${
              activeTheme === 'grungy' ? 'contrast-120 saturate-120' : 
              activeTheme === 'flicker_neon' ? 'shadow-[#E32636]/15 hover:shadow-[#E32636]/40 shadow-2xl scale-[1.01]' : ''
            }`}
            style={{
              boxShadow: activeTheme === 'flicker_neon' ? '0 10px 40px -5px rgba(227, 38, 54, 0.45)' : undefined
            }}
          >
            {/* NOISE & DUST FX FOR THE THEME */}
            <div className="absolute inset-0 bg-radial-at-t from-transparent via-black/40 to-black z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(227,38,54,0.06),transparent)] z-10 pointer-events-none" />
            
            {/* Floating glowing red embers */}
            <div className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">
              <div className="absolute top-[20%] left-[30%] w-2 h-2 rounded-full bg-red-600/60 blur-[1px] animate-bounce" style={{ animationDuration: '3s' }} />
              <div className="absolute top-[50%] left-[10%] w-3 h-3 rounded-full bg-amber-600/40 blur-[2px] animate-pulse" />
              <div className="absolute top-[35%] right-[20%] w-1.5 h-1.5 rounded-full bg-red-500/70 blur-[1px] animate-bounce" style={{ animationDuration: '5s' }} />
              <div className="absolute bottom-[25%] left-[40%] w-2 h-2 rounded-full bg-red-500/50 blur-[2px]" />
            </div>

            {/* TOP HEADER BLOCK: SOUL VIBE ENERGY & SHREYORA ORIGINAL */}
            <div className="relative z-20 p-5 md:p-7 flex items-center justify-between pointer-events-none">
              <div className="flex flex-col text-left">
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.45em] text-zinc-400 font-mono">
                  SOUL. VIBE. ENERGY.
                </span>
                <span className="text-[7.5px] uppercase tracking-[0.3em] text-[#E32636] font-mono mt-0.5 font-extrabold animate-pulse">
                  ★ Rangrez Original Live ★
                </span>
              </div>
              <ShreyoraLogo color="#ffffff" size="h-10" />
            </div>

            {/* MIDDLE CONTAINER: MASSIVE DISTRESSED "RANGREZ" AND SINGER GRAPHICS */}
            <div className="flex-1 relative flex flex-col justify-between px-5 md:px-7 pointer-events-none">
              
              {/* Massive distressed text */}
              <div className="text-center w-full z-20">
                <h3
                  className={`text-6xl md:text-8xl font-black tracking-widest text-[#E32636] leading-none select-none font-sans filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] ${
                    activeTheme === 'flicker_neon' ? 'animate-pulse text-[#FF4D4D]' : ''
                  }`}
                  style={{
                    fontFamily: '"Impact", "Arial Black", sans-serif',
                    letterSpacing: '0.04em'
                  }}
                >
                  RANGREZ
                </h3>
                <span className="block text-xs md:text-sm uppercase tracking-[0.6em] text-white font-mono font-extrabold mt-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  LIVE EXPERIENCE
                </span>
              </div>

              {/* Lead vocalist imagery layer representation - combining elements to match exact uploaded visual */}
              <div className="absolute inset-x-0 bottom-0 top-[15%] flex items-center justify-center overflow-hidden">
                {/* 1. Artistic Shadow Background silhouette copy */}
                <img
                  src={settings?.posterSilhouetteUrl || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=40"}
                  alt="Backdrop singer silhouette"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="w-48 md:w-60 h-auto object-contain select-none absolute bottom-4 opacity-25 filter grayscale contrast-150 brightness-[0.2] transform -translate-x-12 scale-110 pointer-events-none"
                />

                {/* 2. Main foreground vocalist passionately singing into microphone */}
                <img
                  src={settings?.posterMainSingerUrl || "https://images.unsplash.com/photo-1541604193435-22419f564789?auto=format&fit=crop&w=500&q=80"}
                  alt="Lead fusion vocalist singing with microphone copy"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="w-56 md:w-72 h-auto object-contain select-none absolute bottom-0 z-10 transform scale-102 hover:scale-104 transition-all filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] contrast-110 brightness-95 pointer-events-none"
                />

                {/* Rust / sepia splash shader */}
                <div className="absolute inset-0 bg-radial-at-b from-[#8B0000]/15 via-transparent to-transparent z-15 pointer-events-none" />
              </div>

              {/* Middle Left stamp / Slogan block */}
              <div className="relative z-20 self-start text-left mt-8 max-w-[150px] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <p className="text-[10px] md:text-sm font-black text-white hover:text-zinc-200 transition-colors uppercase leading-[1.3] font-sans border-l-2 border-[#E32636] pl-2">
                  {customTaglines[taglineIndex].split('. ').map((item, id) => (
                    <span key={id} className="block">{item}</span>
                  ))}
                </p>
              </div>

              {/* DYNAMIC WATERMARK FAN BADGE STAMP OVERLAY */}
              {fanName.trim() && (
                <div className="absolute right-4 top-[35%] z-20 transform rotate-12 bg-black/85 border-2 border-dashed border-[#E32636]/65 px-4 py-2.5 rounded-xl flex flex-col items-center justify-center backdrop-blur-md select-none max-w-[200px] shadow-lg">
                  <span className="text-[7.5px] uppercase tracking-widest text-[#E32636] font-mono leading-none">
                    {passConfig[passType].stamp}
                  </span>
                  <span className="text-xs font-black text-zinc-100 uppercase truncate max-w-[160px] tracking-tight leading-tight mt-1">
                    {fanName}
                  </span>
                  <span className="text-[8px] text-zinc-400 font-mono mt-0.5">
                    ID: #{passType === 'vip' ? 'VIP' : passType === 'crew' ? 'CRW' : 'Gst'}-24059
                  </span>
                  <div className="absolute -bottom-1 -right-1">
                    <ShieldCheck className="w-4 h-4 text-green-500 fill-black" />
                  </div>
                </div>
              )}

            </div>

            {/* BOTTOM BAR: RUSTIC BEIGE CARDBOARD PRINT BLOCK */}
            <div
              className="relative z-20 p-4 border-t border-zinc-900 flex items-center justify-between text-black"
              style={{
                backgroundColor: '#c2bba8',
                backgroundImage: 'radial-gradient(circle at 50% 50%, #d8d3c5 20%, #c2bba8 100%)',
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              {/* Event By structure */}
              <div className="flex flex-col text-left">
                <span className="text-[7px] md:text-[8px] uppercase tracking-widest font-mono font-bold text-zinc-700">
                  AN EVENT BY
                </span>
                <span className="text-xs font-black tracking-wider text-neutral-900 font-sans uppercase">
                  THE CULTURE.
                </span>
              </div>

              {/* DATE BLOCK */}
              <div className="flex flex-col text-center border-x border-zinc-500/30 px-6">
                <span className="text-[10px] md:text-sm font-black tracking-tight text-neutral-900 uppercase">
                  SUNDAY
                </span>
                <span className="text-[9px] md:text-xs font-extrabold tracking-widest text-neutral-800 -mt-0.5">
                  24TH MAY 2026
                </span>
              </div>

              {/* SPONSOR */}
              <div className="flex items-center gap-1.5 select-none scale-85 md:scale-90 origin-right">
                {/* Simplified vector representation for print block */}
                <svg className="w-5 h-5 text-neutral-900" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 15 L78 35 L78 65 L50 85 L22 65 L22 35 Z" stroke="currentColor" strokeWidth="6" />
                  <path d="M50 15 V85" stroke="currentColor" strokeWidth="4" />
                  <circle cx="50" cy="50" r="14" fill="#c2bba8" stroke="currentColor" strokeWidth="4" />
                </svg>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold tracking-[0.2em] uppercase text-[9px] leading-tight text-neutral-950">SHREYORA</span>
                  <span className="text-[5.5px] uppercase tracking-widest text-zinc-700 leading-none">Street meets statement</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
