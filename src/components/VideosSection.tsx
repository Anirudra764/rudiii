/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Flame, Film, Music, Eye, Clock, Calendar, X } from 'lucide-react';
import { VideoClip, SystemSettings } from '../types.js';

interface VideosSectionProps {
  videos: VideoClip[];
  settings?: SystemSettings;
}

export default function VideosSection({ videos, settings }: VideosSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'movie' | 'live' | 'bts'>('all');
  const [activeTeatreVideo, setActiveTheatreVideo] = useState<VideoClip | null>(null);

  const filterMapping = {
    all: () => true,
    movie: (v: VideoClip) => v.type === 'music_video',
    live: (v: VideoClip) => v.type === 'live',
    bts: (v: VideoClip) => v.type === 'bts'
  };

  const filtered = videos.filter(v => {
    if (activeFilter === 'movie') return v.type === 'music_video';
    if (activeFilter === 'live') return v.type === 'live';
    if (activeFilter === 'bts') return v.type === 'bts';
    return true;
  });

  return (
    <section id="videos-cinematic-sec" className="py-20 px-6 max-w-7xl mx-auto text-white relative z-10">
      
      {/* Narrative header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-mono font-bold block mb-2">
            {settings?.videoSectionSubtitle || "Cinematic Screen"}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-300 to-[#D4AF37] bg-clip-text text-transparent">
            {settings?.videoSectionTitle || "RANGREZ ON FILM"}
          </h2>
          <div className="w-20 h-[1.5px] bg-[#8A2BE2] mt-3" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              activeFilter === 'all' ? 'border-[#D4AF37] text-[#D4AF37] bg-amber-500/10' : 'border-white/10 text-zinc-400'
            }`}
          >
            All Videos
          </button>
          <button
            onClick={() => setActiveFilter('movie')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              activeFilter === 'movie' ? 'border-[#D4AF37] text-[#D4AF37] bg-amber-500/10' : 'border-white/10 text-zinc-400'
            }`}
          >
            Music Videos
          </button>
          <button
            onClick={() => setActiveFilter('live')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              activeFilter === 'live' ? 'border-[#D4AF37] text-[#D4AF37] bg-amber-500/10' : 'border-white/10 text-zinc-400'
            }`}
          >
            Concert Films
          </button>
          <button
            onClick={() => setActiveFilter('bts')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              activeFilter === 'bts' ? 'border-[#D4AF37] text-[#D4AF37] bg-amber-500/10' : 'border-white/10 text-zinc-400'
            }`}
          >
            Behind the Scenes
          </button>
        </div>
      </div>

      {/* Grid of video thumbnails */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(video => (
          <div
            key={video.id}
            onClick={() => setActiveTheatreVideo(video)}
            className="group bg-[#181524]/40 border border-[#8A2BE2]/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#D4AF37]/30 transition-all shadow-md hover:shadow-[0_10px_30px_rgba(138,43,226,0.1)] flex flex-col h-full"
          >
            
            {/* Visual thumbnail aspect frame with hover zoom and overlay play state */}
            <div className="aspect-video overflow-hidden relative bg-[#000] flex-shrink-0">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Dynamic decorative visual indicators */}
              <div className="absolute top-3 left-3 z-20">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/75 border border-white/10 text-[#D4AF37]">
                  {video.type === 'music_video' ? 'Music Video' : video.type === 'live' ? 'Concert Film' : 'Behind Scenes'}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 z-20 text-[10px] bg-black/60 px-2 py-0.5 rounded font-mono text-zinc-300">
                {video.duration}
              </div>

              {/* Glowing golden playback buttons */}
              <div className="absolute inset-x-0 inset-y-0 w-14 h-14 bg-black/60 backdrop-blur-md rounded-full border border-[#D4AF37]/50 m-auto z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-lg">
                <Play className="w-6 h-6 text-[#D4AF37] fill-current pl-0.5" />
              </div>
            </div>

            {/* Title description card */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm md:text-base font-bold text-zinc-100 tracking-tight group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {video.title}
                </h4>
                <p className="text-zinc-400 text-xs mt-2 line-clamp-2">
                  Featuring high recording fidelity, dual stage visual coverage, and crisp ambient audio of original Indian fusion tracks.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-4 text-[10px] text-zinc-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {video.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {video.releaseDate}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Cinematic widescreen modal theater preview */}
      {activeTeatreVideo && (
        <div 
          id="theater-modal-overlay"
          className="fixed inset-0 bg-[#000]/95 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in"
        >
          <div className="bg-[#100c1e] border border-[#D4AF37]/30 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button
              onClick={() => setActiveTheatreVideo(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 border border-white/10 hover:border-red-400 text-zinc-300 hover:text-white transition-colors"
              title="Close Theater Mode"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Simulated premium HD widescreen visual player */}
            <div className="aspect-video bg-black relative flex items-center justify-center border-b border-purple-900/30">
              {/* Dynamic screen glowing elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#8A2BE2]/10 to-transparent pointer-events-none" />
              
              {activeTeatreVideo.youtubeEmbedId.startsWith('/uploads/') || activeTeatreVideo.youtubeEmbedId.includes('/') || activeTeatreVideo.youtubeEmbedId.includes('.') ? (
                <video
                  src={activeTeatreVideo.youtubeEmbedId}
                  controls
                  autoPlay
                  className="w-full h-full absolute inset-0 object-contain bg-black"
                />
              ) : (
                <iframe
                  title={activeTeatreVideo.title}
                  src={`https://www.youtube.com/embed/${activeTeatreVideo.youtubeEmbedId}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full absolute inset-0 border-0"
                />
              )}
            </div>

            {/* Video metadata controls */}
            <div className="p-6">
              <span className="text-[10px] uppercase tracking-wider bg-purple-900/30 text-[#D4AF37] px-2 py-0.5 rounded font-mono border border-[#D4AF37]/20">
                {activeTeatreVideo.type.replace('_', ' ')}
              </span>
              <h3 className="text-lg md:text-xl font-bold mt-2.5 text-white">
                {activeTeatreVideo.title}
              </h3>

              <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400 mt-2">
                <span>Duration: {activeTeatreVideo.duration}</span>
                <span>•</span>
                <span>Premiered: {activeTeatreVideo.releaseDate}</span>
                <span>•</span>
                <span className="text-[#D4AF37]">Dolby 5.1 Surround Atmos mix</span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed mt-4 bg-white/5 p-4 rounded-xl border border-white/5">
                Note: This is a promotional media piece for official brand showcases. Standard Youtube content embeds are fully supported inside the cinematic iFrame layers. Connect high fidelity stereo, sit back and enjoy the acoustic resonance of Rangrez!
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
