/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User as UserIcon, Ticket, RefreshCw, Calendar, MapPin, 
  HelpCircle, CreditCard, XCircle, AlertCircle, FileSpreadsheet, Eye, Printer, Download 
} from 'lucide-react';
import { User, Booking } from '../types.js';

interface UserDashboardProps {
  currentUser: User;
  bookings: Booking[];
  onCancelRequest: (bookingId: string) => void;
  onRequestRefund: (bookingId: string) => void;
}

export default function UserDashboard({
  currentUser,
  bookings,
  onCancelRequest,
  onRequestRefund
}: UserDashboardProps) {
  const [activeBookingDetail, setActiveBookingDetail] = useState<Booking | null>(null);

  const getStatusColorLabel = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-950/40 text-green-400 border-green-500/20';
      case 'refund_requested':
        return 'bg-amber-950/40 text-amber-400 border-amber-500/20';
      case 'refunded':
        return 'bg-zinc-900/60 text-zinc-400 border-zinc-700/20';
      case 'cancelled':
        return 'bg-red-950/40 text-red-400 border-red-500/20';
      default:
        return 'bg-purple-950/40 text-purple-400 border-purple-500/20';
    }
  };

  const getStatusLabel = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return '● Secured';
      case 'refund_requested': return '● Refund Pending';
      case 'refunded': return '● Fully Refunded';
      case 'cancelled': return '● Cancelled';
      default: return status;
    }
  };

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto text-white relative z-10 space-y-10">
      
      {/* Front Hero Stats layout */}
      <div className="bg-[#181524]/50 border border-[#8A2BE2]/15 backdrop-blur-md p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8A2BE2] flex items-center justify-center text-black font-black text-2xl uppercase">
            {currentUser.username[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black">{currentUser.fullName}</h2>
              <span className="text-[9px] uppercase font-mono tracking-widest bg-purple-900/50 border border-purple-400/20 px-2 py-0.5 rounded text-[#D4AF37]">
                {currentUser.role} ID
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{currentUser.email}</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Fan account registered: {new Date(currentUser.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Dynamic counts metric boxes */}
        <div className="flex gap-4 select-none w-full md:w-auto">
          <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex-1 md:flex-none text-center min-w-28">
            <span className="text-2xl font-black text-[#D4AF37] block font-mono">
              {bookings.filter(b => b.status === 'confirmed').length}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-450 font-mono font-bold">Active Passes</span>
          </div>
          
          <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex-1 md:flex-none text-center min-w-28">
            <span className="text-2xl font-black text-purple-400 block font-mono">
              {bookings.length}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-450 font-mono font-bold">Purchased Total</span>
          </div>
        </div>

      </div>

      {/* TICKET PASSES MANAGEMENT TABLE LIST */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-[#D4AF37]" />
          My Reserved Concert Admissions Passes
        </h3>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-[#181524]/20 border border-white/5 rounded-2xl flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-purple-450 animate-pulse" />
            <h4 className="text-base font-bold text-zinc-100">No Purchased Tickets Yet</h4>
            <p className="text-zinc-400 text-xs">Jump over to the Tour section to secure premium tickets instantly!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map(booking => {
              const totalQuantity = booking.items.reduce((acc, i) => acc + i.quantity, 0);

              return (
                <div
                  key={booking.id}
                  className="bg-[#181524]/60 border border-[#8A2BE2]/10 rounded-2xl p-5 hover:border-[#D4AF37]/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-mono tracking-wider text-[#D4AF37] block mb-1">
                          Concert Admission Code: #{booking.id}
                        </span>
                        <h4 className="text-base font-bold text-white leading-tight">
                          {booking.eventTitle}
                        </h4>
                      </div>
                      
                      <span className={`text-[9px] font-mono border px-2.5 py-0.5 rounded capitalize font-bold tracking-wider ${getStatusColorLabel(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-300 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" /> {booking.eventDate}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" /> {booking.eventVenue}
                      </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-[11px] font-mono flex items-center justify-between">
                      <div>
                        <span className="text-zinc-400 block text-[9px]">Reserved Seats:</span>
                        <span className="text-[#f5f5f7] font-bold">
                          {booking.items.flatMap(i => i.selectedSeats).join(', ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-400 block text-[9px]">Quantity:</span>
                        <span className="text-[#f5f5f7] font-bold">{totalQuantity} seats</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons inside dashboard cards */}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-5">
                    <button
                      onClick={() => setActiveBookingDetail(booking)}
                      className="flex-1 py-2 text-xs rounded-xl bg--transparent border border-white/10 hover:bg-white/5 text-zinc-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Ticket Card
                    </button>

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => onRequestRefund(booking.id)}
                        className="py-2 px-3 text-xs bg-red-950/30 text-red-400 border border-red-500/10 rounded-xl hover:bg-red-500/10 transition-colors"
                        title="Submit refund request to the administrative committee"
                      >
                        Request Cancel
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Pass detailed viewer Modal overlay */}
      {activeBookingDetail && (
        <div className="fixed inset-0 bg-[#000]/95 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#181524] border border-[#D4AF37]/45 max-w-lg w-full rounded-3xl p-6 relative shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-extrabold flex items-center gap-1"><Ticket className="w-4 h-4" /> Admission Code: #{activeBookingDetail.id}</span>
              <span className={`text-[10px] font-mono border px-2.5 py-0.5 rounded capitalize ${getStatusColorLabel(activeBookingDetail.status)}`}>
                {getStatusLabel(activeBookingDetail.status)}
              </span>
            </div>

            {/* Event Info details */}
            <div className="space-y-3 font-mono text-xs text-zinc-300">
              <div>
                <span className="block text-[9px] text-zinc-400">Title Concert</span>
                <span className="text-white font-bold text-sm block mt-0.5">{activeBookingDetail.eventTitle}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="block text-[9px] text-zinc-400">Concert Timing</span>
                  <span className="text-white font-bold block mt-0.5">{activeBookingDetail.eventDate}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-zinc-400">Venue location</span>
                  <span className="text-white font-semibold block mt-0.5">{activeBookingDetail.eventVenue}</span>
                </div>
              </div>
            </div>

            {/* Passes info */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs font-mono grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[9px] text-zinc-400">Assigned Passenger</span>
                <span className="text-white font-bold block mt-0.5 truncate">{activeBookingDetail.userFullName}</span>
              </div>
              <div>
                <span className="block text-[9px] text-zinc-400">Seating row list</span>
                <span className="text-[#D4AF37] font-bold block mt-0.5 uppercase">
                  {activeBookingDetail.items.flatMap(i => i.selectedSeats).join(', ')}
                </span>
              </div>
            </div>

            {/* Dynamic visual QR segment */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div className="text-xs font-mono">
                <span className="block text-[9px] text-zinc-400">Simulated Price</span>
                <span className="text-zinc-100 font-extrabold block text-lg">₹{activeBookingDetail.total}</span>
                {activeBookingDetail.couponCode && <span className="text-green-400 text-[10px] block">Promo Saved: {activeBookingDetail.couponCode}</span>}
              </div>

              {/* Precise Custom QR Pattern Representation */}
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-zinc-200 select-none">
                <div className="w-14 h-14 flex flex-wrap gap-0.5 bg-white">
                  {Array.from({ length: 16 }).map((_, qi) => {
                    const blackFill = [1, 2, 4, 7, 8, 11, 13, 14].includes(qi);
                    return <div key={qi} className={`w-3 h-3 ${blackFill ? 'bg-black' : 'bg-white'}`} />;
                  })}
                </div>
              </div>
            </div>

            {/* Actions list */}
            <div className="flex gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#D4AF37] hover:scale-102 transition-transform text-black uppercase font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-black" />
                Print / PDF Pass
              </button>

              <button
                onClick={() => setActiveBookingDetail(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs uppercase"
              >
                Dismiss Modal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
