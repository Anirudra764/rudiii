/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Search, Filter, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { Event, SystemSettings } from '../types.js';

interface EventsSectionProps {
  events: Event[];
  onSelectEventForBooking: (event: Event) => void;
  settings?: SystemSettings;
}

export default function EventsSection({ events, onSelectEventForBooking, settings }: EventsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [nearestEvent, setNearestEvent] = useState<Event | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Compute closest upcoming event & update real duration countdown
  useEffect(() => {
    if (!events.length) return;
    const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setNearestEvent(sorted[0]);
  }, [events]);

  useEffect(() => {
    if (!nearestEvent) return;
    const interval = setInterval(() => {
      const targetTime = new Date(`${nearestEvent.date}T${nearestEvent.time}:00`).getTime();
      const diff = targetTime - Date.now();

      if (diff <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nearestEvent]);

  // Filters logic
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.city.toLowerCase().includes(searchQuery.toLowerCase());
    const cleanCityQuery = selectedCity.trim().toLowerCase();
    const matchesCity = cleanCityQuery === 'all' || cleanCityQuery === '' || 
                        e.city.toLowerCase().includes(cleanCityQuery);
    return matchesSearch && matchesCity;
  });

  // Extract list of all cities for filters
  const uniqueCities = Array.from(new Set(events.map(e => e.city)));

  const formatDateLabel = (isoDate: string) => {
    const dateObj = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const dateParts = dateObj.toLocaleDateString('en-US', options).split(' ');
    // Handle formats gracefully
    if (dateParts.length < 2) return { day: "15", month: "JUN" };
    const day = dateObj.getDate().toString();
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    return { day, month, weekday };
  };

  return (
    <section id="tour-concerts-sec" className="py-20 px-6 max-w-7xl mx-auto text-white relative z-10">
      
      {/* Immersive Countdown banner for the closest tour event */}
      {nearestEvent && (
        <div id="countdown-banner-container" className="mb-16 bg-gradient-to-tr from-[#181524]/90 via-[#0f0e13]/95 to-[#8A2BE2]/10 p-6 md:p-8 rounded-3xl border border-[#D4AF37]/35 shadow-2xl relative overflow-hidden backdrop-blur-md">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-[#D4AF37]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="md:col-span-6 space-y-3">
              <span className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                {settings?.eventsSectionTitle || "Closest Upcoming Concert Date"}
              </span>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">{nearestEvent.title}</h3>
              <p className="text-zinc-300 text-xs md:text-sm line-clamp-2 leading-relaxed">
                {nearestEvent.description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs font-mono text-purple-300 pt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {nearestEvent.venue}, {nearestEvent.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {nearestEvent.time} hrs
                </span>
              </div>
            </div>

            {/* Countdown Grid */}
            <div className="md:col-span-6 flex flex-col justify-center items-center gap-4">
              <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider">
                {settings?.eventsSectionBannerSubtitle || "Countdown to Live Stage"}
              </span>
              <div className="flex gap-4 select-none">
                <div className="text-center bg-black/55 border border-white/5 p-3 rounded-xl min-w-16">
                  <span className="block text-xl md:text-3xl font-bold text-[#D4AF37] font-mono">{countdown.days.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono">Days</span>
                </div>
                <div className="text-center bg-black/55 border border-white/5 p-3 rounded-xl min-w-16">
                  <span className="block text-xl md:text-3xl font-bold text-[#D4AF37] font-mono">{countdown.hours.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono">Hours</span>
                </div>
                <div className="text-center bg-black/55 border border-white/5 p-3 rounded-xl min-w-16">
                  <span className="block text-xl md:text-3xl font-bold text-[#D4AF37] font-mono">{countdown.minutes.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono">Mins</span>
                </div>
                <div className="text-center bg-black/55 border border-white/5 p-3 rounded-xl min-w-16">
                  <span className="block text-xl md:text-3xl font-bold text-red-500 font-mono animate-pulse">{countdown.seconds.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono">Secs</span>
                </div>
              </div>

              <button
                onClick={() => onSelectEventForBooking(nearestEvent)}
                className="w-full md:w-auto mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8A2BE2] hover:scale-103 text-black text-xs uppercase tracking-wider font-bold shadow-lg transition-transform flex items-center justify-center gap-2"
              >
                Secure Spots Now
                <ChevronRight className="w-4 h-4 text-black" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SEARCH AND FILTERS GRID */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        {/* Search */}
        <div id="search-box-bar" className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search venue names, city, or event descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181524]/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs placeholder-zinc-400 focus:outline-none focus:border-[#D4AF37] text-white"
          />
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto relative">
          <Filter className="w-4 h-4 text-[#D4AF37] md:block hidden" />
          <div className="relative w-full md:w-56">
            <input
              type="text"
              id="city-filter"
              list="tour-cities-user-search"
              placeholder="Type or search city..."
              value={selectedCity === 'all' ? '' : selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#181524]/80 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs focus:outline-none focus:border-[#D4AF37] text-zinc-200 placeholder-zinc-400 font-sans"
            />
            <datalist id="tour-cities-user-search">
              {uniqueCities.map(city => (
                <option key={city} value={city} />
              ))}
              {/* Other Jharkhand suggestions */}
              <option value="Ranchi" />
              <option value="Jamshedpur" />
              <option value="Dhanbad" />
              <option value="Bokaro Steel City" />
              <option value="Deoghar" />
              <option value="Hazaribagh" />
            </datalist>
            {selectedCity && selectedCity !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCity('all')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#D4AF37] text-[10px] font-mono cursor-pointer transition-colors"
                title="Clear City Filter"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STAGE TOURS GRID LIST */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-[#181524]/20 border border-white/5 rounded-2xl flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8 text-yellow-500 animate-bounce" />
          <h4 className="text-base font-bold text-zinc-100">No Concert Dates Found</h4>
          <p className="text-zinc-400 text-xs">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map(event => {
            const dateDetails = formatDateLabel(event.date);
            const isSoldOut = event.status === 'soldout';

            return (
              <div
                key={event.id}
                className="group bg-[#181524]/40 border border-[#8A2BE2]/15 hover:border-[#D4AF37]/30 transition-all rounded-2xl overflow-hidden p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                
                {/* Left block containing specific calendar stamp and name highlights */}
                <div className="flex items-center gap-5">
                  {/* Calendar Badge Stamp */}
                  <div className="w-16 h-20 bg-black/60 border border-purple-900/40 rounded-xl flex flex-col items-center justify-center text-center p-2 select-none">
                    <span className="block text-[10px] text-zinc-400 font-mono tracking-wider font-semibold uppercase">{dateDetails.weekday}</span>
                    <span className="block text-2xl font-black text-[#D4AF37] font-mono leading-none my-1">{dateDetails.day}</span>
                    <span className="block text-[10px] text-purple-400 font-mono font-bold">{dateDetails.month}</span>
                  </div>

                  {/* Concert Titles and Cities */}
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#D4AF37] block mb-1">
                      {event.city} • Open Air Stage
                    </span>
                    <h4 className="text-base md:text-xl font-bold tracking-tight text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                      {event.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">{event.venue}</p>
                    {event.venueAddress && (
                      <p className="text-[11px] text-zinc-500 mt-0.5 max-w-sm">
                        <span className="text-[#D4AF37] font-bold">📍 Location: </span>{event.venueAddress}
                      </p>
                    )}
                    {event.googleMapUrl && (
                      <a
                        href={event.googleMapUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 mt-1 hover:underline transition-colors w-fit"
                      >
                        🧭 Direct Navigation Map &rarr;
                      </a>
                    )}
                  </div>
                </div>

                {/* Center Content: Ticket status levels summary benefits */}
                <div className="flex flex-wrap items-center gap-4 lg:gap-10">
                  <div className="space-y-1">
                    <span className="block text-[9px] uppercase text-zinc-400 font-mono">Lowest Admission Pass</span>
                    <span className="text-sm font-bold text-green-400">
                      ₹{Math.min(...event.categories.map(c => c.price))} onwards
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[9px] uppercase text-zinc-400 font-mono">Current Status</span>
                    {isSoldOut ? (
                      <span className="text-xs px-2.5 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/20 font-mono bold uppercase tracking-wider">
                        Sold Out
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                        <span className="text-xs font-mono text-zinc-300">Rapidly Selling</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right CTA Booking parameters */}
                <div className="flex-shrink-0">
                  {isSoldOut ? (
                    <button 
                      className="w-full lg:w-36 py-2.5 rounded-xl bg-zinc-800 text-zinc-500 cursor-not-allowed font-bold text-xs uppercase"
                      disabled
                    >
                      Sold Out
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectEventForBooking(event)}
                      className="w-full lg:w-36 py-2.5 rounded-xl bg-transparent border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Book Tickets
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
