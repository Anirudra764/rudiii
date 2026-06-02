/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Music, Sparkles, Heart, Users, Compass } from 'lucide-react';
import { BandMember, SystemSettings } from '../types.js';

interface AboutSectionProps {
  members?: BandMember[];
  settings?: SystemSettings;
}

export default function AboutSection({ members: propMembers = [], settings: propSettings }: AboutSectionProps) {
  const [activeTab, setActiveTab] = useState<'story' | 'members'>('story');

  const defaultMembers = [
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
  ];

  const members = propMembers && propMembers.length > 0 ? propMembers : defaultMembers;

  const activeSettings = {
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
    ...propSettings
  };

  const milestones = [
    { year: "2019", title: "The Genesis", desc: "Formed in Pune as an experimental sitar and heavy rock music laboratory, playing visual local coffee joints." },
    { year: "2021", title: "Sacred Vibrations EP", desc: "First studio collection released to massive independent acclaim, cross-border Spotify curation list hits." },
    { year: "2023", title: "Indian Indie Award Winners", desc: "Awarded Best Fusion Band and Best Instrumental Composition of the Year for 'The Golden Tabla'." },
    { year: "2025", title: "Global Echoes Tour", desc: "Played 25 sold-out arena shows across major Indian metropolitan cities and international creative spaces." }
  ];

  return (
    <section id="about-band-sec" className="py-20 px-6 max-w-7xl mx-auto text-white relative z-10">
      
      {/* Visual Header */}
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-mono font-bold block mb-2">{activeSettings.creedTitle}</span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-300 to-[#D4AF37] bg-clip-text text-transparent uppercase">
          {activeSettings.tagline}
        </h2>
        <div className="w-24 h-[1.5px] bg-gradient-to-r from-[#D4AF37] via-[#8A2BE2] to-[#E32636] mx-auto mt-4" />
      </div>

      {/* Tabs Menu */}
      <div className="flex justify-center mb-12 border-b border-white/10 pb-[1.5px] max-w-sm mx-auto">
        <button
          onClick={() => setActiveTab('story')}
          className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'story' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          The Story
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'members' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          The Band Members
        </button>
      </div>

      {/* STORY CONTENT TAB */}
      {activeTab === 'story' && (
        <div className="grid md:grid-cols-2 gap-12 items-center animate-in fade-in duration-500">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#D4AF37]">
              {activeSettings.storyHeading}
            </h3>
            
            <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
              {activeSettings.storyParagraph1}
            </p>

            <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
              {activeSettings.storyParagraph2}
            </p>

            {/* Core Band Statement Box */}
            <div className="bg-[#181524]/60 backdrop-blur-md rounded-2xl p-6 border-l-4 border-[#8A2BE2] space-y-2">
              <span className="text-purple-400 font-bold block text-xs tracking-wider uppercase font-mono">{activeSettings.creedTitle}</span>
              <p className="text-sm italic text-zinc-200">
                &ldquo;{activeSettings.creedBody}&rdquo;
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Dynamic replica of the official concert poster */}
            <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-2xl aspect-[3/4] bg-black flex flex-col justify-between p-0 max-w-sm mx-auto">
              {/* Vignette & color atmosphere */}
              <div className="absolute inset-0 bg-radial-at-t from-transparent via-black/40 to-black z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(227,38,54,0.06),transparent)] z-10 pointer-events-none" />

              {/* Poster Main Body (Vocalist & Real Poster Design) */}
              <div className="flex-1 relative flex flex-col justify-between px-0">
                {/* Vocalist artwork containing the real uploaded concert poster image */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <img
                    src="/uploads/1780386988939-IMG_6956.jpg"
                    alt="Rangrez Live Experience Poster"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-15 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Statistics Row beneath the poster */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="text-center bg-zinc-950/80 backdrop-blur-md p-3 rounded-xl border border-zinc-900">
                <span className="block text-xl md:text-2xl font-extrabold text-[#E32636]">{activeSettings.stat1Number}</span>
                <span className="text-[8px] text-zinc-400 uppercase tracking-widest font-mono">{activeSettings.stat1Label}</span>
              </div>
              <div className="text-center bg-zinc-950/80 backdrop-blur-md p-3 rounded-xl border border-zinc-900">
                <span className="block text-xl md:text-2xl font-extrabold text-white">{activeSettings.stat2Number}</span>
                <span className="text-[8px] text-zinc-400 uppercase tracking-widest font-mono">{activeSettings.stat2Label}</span>
              </div>
              <div className="text-center bg-zinc-950/80 backdrop-blur-md p-3 rounded-xl border border-zinc-900">
                <span className="block text-xl md:text-2xl font-extrabold text-[#D4AF37]">{activeSettings.stat3Number}</span>
                <span className="text-[8px] text-zinc-400 uppercase tracking-widest font-mono">{activeSettings.stat3Label}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEMBERS TAB */}
      {activeTab === 'members' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          {members.map((member, i) => (
            <div 
              key={i} 
              className="group bg-black border border-zinc-900 rounded-3xl overflow-hidden hover:border-[#E32636]/50 transition-all duration-500 hover:shadow-[0_12px_35px_rgba(227,38,54,0.18)] flex flex-col h-full relative"
              style={{ minHeight: '530px' }}
            >
              
              {/* BRAND HEADER FLOATER */}
              <div className="p-5 flex items-center justify-between z-20 pointer-events-none relative">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-black text-[#E32636] tracking-[0.2em] font-sans">
                    RANGREZ
                  </span>
                  <span className="text-[7px] text-zinc-400 font-mono tracking-widest mt-0.5">
                    SOUL | VIBE | ENERGY
                  </span>
                </div>
                <div className="w-5 h-5 rounded-full border border-zinc-800/80 flex items-center justify-center text-zinc-500">
                  <Sparkles className="w-2.5 h-2.5 text-[#E32636] animate-pulse" />
                </div>
              </div>

              {/* PHOTO / DOUBLE EXPOSURE DOUBLE IMAGE STAGE */}
              <div className="absolute inset-x-0 top-14 bottom-1/3 flex items-center justify-center overflow-hidden pointer-events-none">
                {/* 1. Backdrop Faded Shadow Image */}
                <img 
                  src={member.imageUrl} 
                  alt={member.artist}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover absolute inset-0 opacity-15 filter grayscale contrast-150 brightness-[0.2] transition-transform duration-700 group-hover:scale-105"
                />

                {/* 2. Foreground Character Blend with gradient mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-radial-at-t from-zinc-900/10 via-transparent to-black" />
                
                <img
                  src={member.imageUrl}
                  alt={member.artist}
                  referrerPolicy="no-referrer"
                  className="w-48 h-full object-cover rounded-2xl filter grayscale contrast-125 brightness-90 shadow-2xl transition-all duration-500 group-hover:scale-103"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)'
                  }}
                />
              </div>

              {/* BOTTOM POSTER BLOCK */}
              <div className="mt-auto relative z-20 p-5 flex flex-col justify-end">
                {/* Artist Big Display Lettering */}
                <div className="text-center w-full z-20">
                  <h4 
                    className="text-3xl font-black text-[#E32636] tracking-wider leading-none select-none"
                    style={{ fontFamily: '"Impact", "Arial Black", sans-serif' }}
                  >
                    {member.artist.toUpperCase()}
                  </h4>
                  <div className="flex items-center justify-center gap-1.5 text-[8.5px] font-bold text-zinc-400 mt-1.5 uppercase tracking-widest">
                    <span>— {member.name.split(' ')[0]}</span>
                    <Music className="w-2.5 h-2.5 text-[#E32636]" />
                    <span>{member.name.split(' ')[1] || 'Session'} —</span>
                  </div>
                </div>

                {/* Profile Bio Statement styled after V. Aanand's poster text */}
                <div className="mt-4 text-center text-[7.5px] leading-relaxed text-zinc-400 space-y-0.5 uppercase tracking-wider font-sans bg-black/60 backdrop-blur-sm p-3 rounded-xl border border-zinc-900/60 transition-colors group-hover:border-[#E32636]/15">
                  <p className="font-extrabold text-[#E32636]/90">
                    A passionate {member.role.toLowerCase()} who breathes soul,
                  </p>
                  <p>and lives in every beat.</p>
                  <p className="text-zinc-300">
                    {member.artist === 'V. Aanand' || member.artist === 'Dhawal' 
                      ? 'His hands tell stories.' 
                      : member.artist === 'Aadarsh' || member.artist === 'Yash'
                      ? 'His melodies move hearts.'
                      : 'His strings ignite the stage.'}
                  </p>
                  <p className="text-[#E32636]/80 font-bold">His energy moves souls.</p>
                  <p>From tradition to tomorrow,</p>
                  <p className="font-extrabold text-white">He keeps the beat alive.</p>
                </div>

                {/* Poster Footer bar */}
                <div className="border-t border-zinc-900/80 pt-3 mt-4 flex items-center justify-between text-[7px] text-zinc-500 uppercase tracking-widest font-mono select-none">
                  <span>Feel the soul</span>
                  <span className="text-[#E32636] animate-pulse">★</span>
                  <span>Share the energy</span>
                </div>
              </div>

              {/* SLIDING INFO OVERLAY PANEL ON HOVER */}
              <div className="absolute inset-0 bg-black/95 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 transform translate-y-2 group-hover:translate-y-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#E32636] font-bold block">Contributor biography</span>
                      <h4 className="text-xl font-bold tracking-tight text-white">{member.artist}</h4>
                      <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-0.5">{member.role}</p>
                    </div>
                    <span className="text-[8px] border border-zinc-800 px-2 py-0.5 rounded text-zinc-500 font-mono">ID: RM-00{i+1}</span>
                  </div>
                  
                  <p className="text-xs italic leading-relaxed text-zinc-300 border-l-2 border-[#E32636] pl-3 py-1 bg-zinc-950/40 pr-2">
                    &ldquo;{member.quote}&rdquo;
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-450 block font-bold">Primary Mastery</span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.skills.map((skill, si) => (
                        <span 
                          key={si}
                          className="text-[9px] px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-900 pt-3 flex items-center justify-between text-[8px] font-mono uppercase text-zinc-500 tracking-wider">
                  <span>Rangrez Member Since 2019</span>
                  <Heart className="w-3.5 h-3.5 text-[#E32636] fill-none" />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}



    </section>
  );
}
