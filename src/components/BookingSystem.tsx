/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Check, Ticket, Users, MapPin, Sparkles, CreditCard, ChevronRight, 
  ChevronLeft, Percent, Loader2, Sparkle, Download, QrCode, Grid 
} from 'lucide-react';
import { Event, TicketCategory, TicketClass, bookingItem, Booking } from '../types.js';
import UpiQrIllustration from './UpiQrIllustration.js';

interface BookingSystemProps {
  selectedEvent: Event;
  onBookingSuccess: (booking: Booking) => void;
  onCancelBookingFlow: () => void;
}

export default function BookingSystem({ 
  selectedEvent, 
  onBookingSuccess, 
  onCancelBookingFlow 
}: BookingSystemProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Class selection, 2: Seat selection, 3: Payment/Coupon, 4: Done Ticket
  
  // Selected Quantities
  const [quantities, setQuantities] = useState<Record<TicketClass, number>>({
    vip: 0,
    fanpit: 0,
    general: 0
  });

  // Selected seat identifiers
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState({ text: '', isError: false });
  const [isCouponValidating, setIsCouponValidating] = useState(false);

  // Payment portal fields
  const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'razorpay' | 'paypal' | 'upi_qr'>('upi_qr');
  const [cardHolder, setCardHolder] = useState('Anirudra Paul');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('999');
  
  // Custom UPI QR Payment Gateway fields
  const [upiUtr, setUpiUtr] = useState('');
  const [uploadedQr, setUploadedQr] = useState<string | null>(null);
  const [upiId, setUpiId] = useState('rangrez.band764@okhdfcbank');
  
  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedQr(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Total quantity calculation
  const totalTicketsSelected = quantities.vip + quantities.fanpit + quantities.general;

  // Derive target pricing
  const vipCategory = selectedEvent.categories.find(c => c.class === 'vip');
  const pitCategory = selectedEvent.categories.find(c => c.class === 'fanpit');
  const genCategory = selectedEvent.categories.find(c => c.class === 'general');

  const vipPrice = vipCategory?.price || 250;
  const pitPrice = pitCategory?.price || 200;
  const genPrice = genCategory?.price || 149;

  const subtotalCost = (quantities.vip * vipPrice) + (quantities.fanpit * pitPrice) + (quantities.general * genPrice);
  const taxCost = Math.round(subtotalCost * 0.18); // 18% standard India GST
  const discountCost = Math.round(subtotalCost * (couponDiscountPercent / 100));
  const finalTotalAmount = Math.max(0, subtotalCost + taxCost - discountCost);

  // Handle seat map reservation grid
  // Precompile seat status: rows A, B, C corresponding to Vip, Pit, Gen
  const rows = [
    { name: 'Row A (Couple Entry + 25% Food Coupon)', prefix: 'VIP', class: 'vip' as TicketClass, color: 'bg-[#D4AF37]', border: 'border-[#D4AF37]' },
    { name: 'Row B (Solo Entry + 20% Food Coupon)', prefix: 'PIT', class: 'fanpit' as TicketClass, color: 'bg-purple-600', border: 'border-purple-600' },
    { name: 'Row C (Solo Only)', prefix: 'GEN', class: 'general' as TicketClass, color: 'bg-zinc-500', border: 'border-zinc-500' }
  ];

  const totalSeatsPerRow = 14;

  const handleSeatClick = (seatCode: string, seatClass: TicketClass) => {
    // Check if the user has actually selected quantities in that specific class first
    const allowedLimit = quantities[seatClass];
    const currentlySelectedInClassCount = selectedSeats.filter(s => {
      if (seatClass === 'vip') return s.startsWith('VIP');
      if (seatClass === 'fanpit') return s.startsWith('PIT');
      return s.startsWith('GEN');
    }).length;

    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatCode));
    } else {
      if (currentlySelectedInClassCount < allowedLimit) {
        setSelectedSeats([...selectedSeats, seatCode]);
      } else {
        alert(`You requested only ${allowedLimit} ${seatClass.toUpperCase()} tickets. Increase quantity in step 1 to choose more!`);
      }
    }
  };

  // Autocomplete seats selection callback for helper bypass
  const handleAutoAssignSeats = () => {
    const seatsToAssign: string[] = [];
    rows.forEach(r => {
      const needed = quantities[r.class];
      for (let i = 1; i <= needed; i++) {
        // Simple sequential non-conflict ids
        seatsToAssign.push(`${r.prefix}-${i + 4}`);
      }
    });
    setSelectedSeats(seatsToAssign);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsCouponValidating(true);
    setCouponMessage({ text: '', isError: false });

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartValue: subtotalCost })
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        setIsCouponApplied(true);
        setCouponDiscountPercent(data.coupon.discountPercent);
        setCouponMessage({ text: `Success! Code applied. Verified ${data.coupon.discountPercent}% OFF!`, isError: false });
      } else {
        setIsCouponApplied(false);
        setCouponDiscountPercent(0);
        setCouponMessage({ text: data.error || data.message || "Invalid coupon structure.", isError: true });
      }
    } catch {
      setCouponMessage({ text: "Error connecting to servers.", isError: true });
    } finally {
      setIsCouponValidating(false);
    }
  };

  // Simulate payment processing loader
  const handlePaymentCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    const itemsToSend: bookingItem[] = [];
    if (quantities.vip > 0) {
      itemsToSend.push({
        ticketClass: 'vip',
        quantity: quantities.vip,
        pricePerSeat: vipPrice,
        selectedSeats: selectedSeats.filter(s => s.startsWith('VIP'))
      });
    }
    if (quantities.fanpit > 0) {
      itemsToSend.push({
        ticketClass: 'fanpit',
        quantity: quantities.fanpit,
        pricePerSeat: pitPrice,
        selectedSeats: selectedSeats.filter(s => s.startsWith('PIT'))
      });
    }
    if (quantities.general > 0) {
      itemsToSend.push({
        ticketClass: 'general',
        quantity: quantities.general,
        pricePerSeat: genPrice,
        selectedSeats: selectedSeats.filter(s => s.startsWith('GEN'))
      });
    }

    // Connect APIs
    try {
      const isUpi = paymentGateway === 'upi_qr';
      if (isUpi && (!upiUtr || upiUtr.trim().length < 8)) {
        alert("Please enter a valid Transaction ID / UPI Ref UTR number (minimum 8 characters) to authenticate scanning test.");
        setIsProcessingPayment(false);
        return;
      }

      const payloadPaymentId = isUpi ? `utr_${upiUtr.trim()}` : undefined;

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          items: itemsToSend,
          paymentMethod: paymentGateway,
          paymentId: payloadPaymentId,
          couponCode: isCouponApplied ? couponCode : undefined,
          fullName: cardHolder,
          email: "customer@rangrez.com" // Testing channel
        })
      });
      const data = await res.json();

      // Delay loader slightly to make the credit card verification experience intensely immersive!
      setTimeout(() => {
        setIsProcessingPayment(false);
        if (res.ok && data.success) {
          setCompletedBooking(data.booking);
          setStep(4);
        } else {
          alert(data.error || "Simulated gateway processing error.");
        }
      }, 1800);

    } catch (err) {
      setIsProcessingPayment(false);
      alert("Error booking tickets.");
    }
  };

  const handleDownloadTicket = () => {
    window.print();
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto text-white relative z-20">

      {/* Progress Wizard Status Header steps bar */}
      {step < 4 && (
        <div className="flex items-center justify-between mb-10 max-w-lg mx-auto select-none bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#D4AF37] text-black font-black' : 'bg-zinc-805 text-zinc-400'}`}>1</span>
            <span className="text-xs text-zinc-300 hidden sm:inline">Classes</span>
          </div>
          <div className="h-[1.5px] bg-zinc-700 flex-1 mx-2" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#D4AF37] text-black font-black' : 'bg-zinc-800 text-zinc-400'}`}>2</span>
            <span className="text-xs text-zinc-300 hidden sm:inline">Seats</span>
          </div>
          <div className="h-[1.5px] bg-zinc-700 flex-1 mx-2" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-[#D4AF37] text-black font-black' : 'bg-zinc-800 text-zinc-400'}`}>3</span>
            <span className="text-xs text-zinc-300 hidden sm:inline">Checkout</span>
          </div>
        </div>
      )}

      {/* STEP 1: SELECT CATEGORIES */}
      {step === 1 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="text-center">
            <span className="text-[#D4AF37] text-xs uppercase font-mono tracking-widest block mb-2 font-bold font-black">Step 01 • Experiences Tiers</span>
            <h2 className="text-3xl font-black text-white">Select Admissions categories</h2>
            <p className="text-zinc-400 text-xs mt-1">Configure your counts. Choose standard entries or value bundles with complimentary food coupons.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Solo Entry Column Card */}
            <div className={`p-6 bg-gradient-to-b from-[#1c182d] to-[#0f0e13]/90 border rounded-2xl flex flex-col justify-between h-full hover:scale-101 transition-all ${quantities.general > 0 ? 'border-zinc-500 shadow-lg shadow-zinc-500/10' : 'border-white/5 shadow-md'}`}>
              <div>
                <span className="text-[10px] bg-zinc-950/40 text-zinc-400 border border-zinc-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold tracking-widest block w-fit mb-3">Solo Entry</span>
                <h3 className="text-lg font-black text-zinc-100">149 Solo Entry</h3>
                <p className="text-3xl font-extrabold text-zinc-400 mt-2 mb-4">₹{genPrice}</p>
                <div className="w-full h-px bg-white/5 mb-4" />
                <ul className="space-y-2 text-xs text-zinc-300 mb-6 text-left">
                  {genCategory?.benefits.map((b, bi) => (
                    <li key={bi} className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> <span>{b}</span></li>
                  )) || (
                    <>
                      <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> <span>Single person admission (Solo Entry)</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> <span>Access to the main high-energy audience field</span></li>
                    </>
                  )}
                </ul>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs text-zinc-400 font-mono">Select Count</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantities({ ...quantities, general: Math.max(0, quantities.general - 1) })}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center font-bold font-mono text-white cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg font-mono w-4 text-center text-white">{quantities.general}</span>
                  <button 
                    onClick={() => setQuantities({ ...quantities, general: quantities.general + 1 })}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center font-bold font-mono text-white cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Solo plus Food Coupon Card */}
            <div className={`p-6 bg-gradient-to-b from-[#1c182d] to-[#0f0e13]/90 border rounded-2xl flex flex-col justify-between h-full hover:scale-101 transition-all ${quantities.fanpit > 0 ? 'border-purple-600 shadow-lg shadow-purple-500/10' : 'border-white/5 shadow-md'}`}>
              <div>
                <span className="text-[10px] bg-purple-950/40 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold tracking-widest block w-fit mb-3">Solo + Food Discount</span>
                <h3 className="text-lg font-black text-zinc-100">200 with 20% off on Food Coupon</h3>
                <p className="text-3xl font-extrabold text-purple-400 mt-2 mb-4">₹{pitPrice}</p>
                <div className="w-full h-px bg-white/5 mb-4" />
                <ul className="space-y-2 text-xs text-zinc-300 mb-6 text-left">
                  {pitCategory?.benefits.map((b, bi) => (
                    <li key={bi} className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> <span>{b}</span></li>
                  )) || (
                    <>
                      <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> <span>Single person admission (Solo Entry)</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> <span>Exclusive 20% discount coupon at all food stalls</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> <span>Priority fast-track entry lane access</span></li>
                    </>
                  )}
                </ul>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs text-zinc-400 font-mono">Select Count</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantities({ ...quantities, fanpit: Math.max(0, quantities.fanpit - 1) })}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center font-bold font-mono text-white cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg font-mono w-4 text-center text-white">{quantities.fanpit}</span>
                  <button 
                    onClick={() => setQuantities({ ...quantities, fanpit: quantities.fanpit + 1 })}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center font-bold font-mono text-white cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Couple plus Food Coupon Column Card */}
            <div className={`p-6 bg-gradient-to-b from-[#1c182d] to-[#0f0e13]/90 border rounded-2xl flex flex-col justify-between h-full hover:scale-101 transition-all ${quantities.vip > 0 ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' : 'border-white/5 shadow-md'}`}>
              <div>
                <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded font-mono uppercase font-bold tracking-widest block w-fit mb-3">Couple + Food Discount</span>
                <h3 className="text-lg font-black text-zinc-100 font-bold">250 with 25% off Food Coupon plus Couple Entry</h3>
                <p className="text-3xl font-extrabold text-[#D4AF37] mt-2 mb-4">₹{vipPrice}</p>
                <div className="w-full h-px bg-white/5 mb-4" />
                <ul className="space-y-2 text-xs text-zinc-300 mb-6 text-left">
                  {vipCategory?.benefits.map((b, bi) => (
                    <li key={bi} className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> <span>{b}</span></li>
                  )) || (
                    <>
                      <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> <span>Couple admission (Valid for 2 entries)</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> <span>Exclusive 25% discount coupon at all food stalls</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> <span>Priority Couple Entrance fast-track admittance</span></li>
                    </>
                  )}
                </ul>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs text-zinc-400 font-mono">Select Count</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantities({ ...quantities, vip: Math.max(0, quantities.vip - 1) })}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center font-bold font-mono text-white cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg font-mono w-4 text-center text-white">{quantities.vip}</span>
                  <button 
                    onClick={() => setQuantities({ ...quantities, vip: quantities.vip + 1 })}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center font-bold font-mono text-white cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-[#181524]/40 p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="text-xs text-zinc-300 font-mono">
              Total Admission Tickets Requested: <span className="text-[#D4AF37] font-bold text-sm pl-1">{totalTicketsSelected} seats</span>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onCancelBookingFlow}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs uppercase"
              >
                Abrupt Cancel
              </button>
              
              <button
                onClick={() => {
                  if (totalTicketsSelected <= 0) {
                    alert("Please select at least one ticket before proceeding.");
                    return;
                  }
                  setStep(2);
                }}
                disabled={totalTicketsSelected <= 0}
                className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-[#D4AF37] disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-extrabold text-xs uppercase hover:scale-103 transition-transform flex items-center justify-center gap-1.5"
              >
                Choose Exact Seats
                <ChevronRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT SEATS GRID */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="text-center">
            <span className="text-[#D4AF37] text-xs uppercase font-mono tracking-widest block mb-2 font-bold">Step 02 • Arena seating layout</span>
            <h2 className="text-3xl font-black text-white">Choose reserved seats</h2>
            <p className="text-zinc-400 text-xs mt-1">Tap seats corresponding to your selected tiers below. VIP (Gold), Pit (Purple), Field (Silver).</p>
          </div>

          <div className="bg-[#181524]/60 border border-[#8A2BE2]/20 backdrop-blur-md rounded-3xl p-6 md:p-8 space-y-10">
            
            {/* Stage illustration representation */}
            <div className="relative w-full max-w-md mx-auto h-12 bg-gradient-to-r from-[#D4AF37] via-[#8A2BE2] to-[#E32636] rounded-b-3xl shadow-lg border-b-2 border-white/20 flex items-center justify-center select-none mb-10">
              <span className="text-xs font-black text-black tracking-[0.4em] uppercase">RANGREZ LIVE SOUND STAGE</span>
              <div className="absolute top-10 w-24 h-[1px] bg-white/20" />
            </div>

            {/* Stadium Grid loop */}
            <div className="space-y-6 max-w-2xl mx-auto overflow-x-auto pb-4">
              {rows.map(r => {
                const limit = quantities[r.class];
                if (limit <= 0) return null; // Only show rows the user bought!

                return (
                  <div key={r.prefix} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-bold px-2">
                      <span className="text-[#D4AF37]">{r.name}</span>
                      <span className="text-zinc-400">{selectedSeats.filter(s => s.startsWith(r.prefix)).length} of {limit} selected</span>
                    </div>

                    <div className="flex gap-2 justify-center min-w-[480px]">
                      {Array.from({ length: totalSeatsPerRow }).map((_, si) => {
                        const seatIndex = si + 1;
                        const seatCode = `${r.prefix}-${seatIndex}`;
                        // Simulate some pre-booked conflicts for extreme realism!
                        const isPreBookedConflict = [2, 7, 12].includes(seatIndex) && r.prefix === 'PIT';
                        const isChosen = selectedSeats.includes(seatCode);

                        return (
                          <button
                            key={seatCode}
                            onClick={() => !isPreBookedConflict && handleSeatClick(seatCode, r.class)}
                            disabled={isPreBookedConflict}
                            className={`w-7 h-7 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center transition-all border ${
                              isPreBookedConflict 
                                ? 'bg-red-900/10 border-red-500/20 text-red-500/40 cursor-not-allowed' 
                                : isChosen
                                  ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg scale-105'
                                  : 'bg-white/5 border-white/10 text-zinc-300 hover:border-[#D4AF37]/50'
                            }`}
                            title={isPreBookedConflict ? "Occupied" : `Seat ${seatCode}`}
                          >
                            {seatIndex}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend guide */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono border-t border-white/5 pt-6">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-white/5 border border-white/10" />
                <span className="text-zinc-400">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-[#D4AF37]" stroke="#D4AF37" />
                <span className="text-zinc-400">Your Selection</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-red-900/10 border border-dashed border-red-500/20 text-red-500/40" />
                <span className="text-zinc-405">Pre-Occupied</span>
              </div>
              <button
                onClick={handleAutoAssignSeats}
                className="text-xs text-purple-400 hover:text-purple-300 border-l border-white/10 pl-6 flex items-center gap-1.5"
                title="Bypass seat selections by autofilling sequential spots"
              >
                <Grid className="w-3.5 h-3.5" /> Auto-allocate Remaining Seats
              </button>
            </div>

          </div>

          <div className="flex items-center justify-between gap-4 mt-8">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs uppercase flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Change Tiers
            </button>
            <button
              onClick={() => {
                if (selectedSeats.length < totalTicketsSelected) {
                  alert(`Please select exactly ${totalTicketsSelected} seats matching your ticket quantities!`);
                  return;
                }
                setStep(3);
              }}
              className="px-8 py-2.5 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs uppercase hover:scale-103 transition-transform flex items-center gap-1.5"
            >
              Set Payment Checkout
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PROMO & SECURE PAYMENT SIMULATOR */}
      {step === 3 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="text-center">
            <span className="text-[#D4AF37] text-xs uppercase font-mono tracking-widest block mb-2 font-bold">Step 03 • Payments Gateway Check</span>
            <h2 className="text-3xl font-black text-white">Finalize secure checkout</h2>
            <p className="text-zinc-400 text-xs mt-1">Provide coupons or complete simulated transactions instantly.</p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form inputs Card */}
            <form onSubmit={handlePaymentCheckout} className="col-span-12 md:col-span-7 bg-[#181524]/60 border border-[#8A2BE2]/10 p-6 rounded-3xl space-y-6 animate-in fade-in">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-2 gap-2">
                <span className="text-xs font-bold text-zinc-100 uppercase tracking-widest font-mono">Select Payment Interface</span>
                <div className="flex flex-wrap gap-1.5">
                  {(['upi_qr', 'stripe', 'razorpay', 'paypal'] as const).map(gateway => (
                    <button
                      key={gateway}
                      type="button"
                      onClick={() => setPaymentGateway(gateway)}
                      className={`text-[10px] uppercase font-mono px-2.5 py-1.5 rounded transition-colors cursor-pointer ${
                        paymentGateway === gateway 
                          ? 'bg-[#8A2BE2] text-white font-bold' 
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                      }`}
                    >
                      {gateway === 'upi_qr' ? '⚡ UPI QR Scan' : gateway}
                    </button>
                  ))}
                </div>
              </div>

              {/* Secure Credit details simulator inputs layout */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase block mb-1">Ticket Bearer / Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter candidate's full name"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-black/40 border border-[#8A2BE2]/20 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {paymentGateway === 'upi_qr' ? (
                  <div className="bg-[#100d1a] border border-[#8A2BE2]/25 p-5 rounded-2xl space-y-5 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                      <QrCode className="w-5 h-5 text-[#D4AF37]" />
                      <div>
                        <span className="text-xs font-bold text-[#D4AF37] block font-mono">BAND UPI ACQUISITION TERMINAL</span>
                        <span className="text-[10px] text-zinc-400 block">Scan to transfer ticket value securely</span>
                      </div>
                    </div>

                    {/* DUAL DISPLAY MOCK QR + CUSTOM UPLOAD QR PORTAL */}
                    <div className="grid sm:grid-cols-12 gap-5 items-center">
                      <div className="col-span-12 sm:col-span-5 flex flex-col items-center justify-center p-1 rounded-2xl max-w-[180px] mx-auto overflow-hidden">
                        {uploadedQr ? (
                          <div className="p-3 bg-white rounded-xl border border-zinc-200 max-w-[150px] mx-auto">
                            <div className="w-28 h-28 flex items-center justify-center overflow-hidden bg-zinc-100 rounded">
                              <img 
                                src={uploadedQr} 
                                alt="Uploaded Custom UPI QR" 
                                className="w-full h-full object-contain" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="text-[8px] text-zinc-500 font-mono font-bold mt-1.5 uppercase tracking-tight text-center block">Scan to Pay</span>
                          </div>
                        ) : (
                          /* Beautiful high-fidelity vector Google Pay UPI QR representation */
                          <UpiQrIllustration />
                        )}
                      </div>

                      <div className="col-span-12 sm:col-span-7 space-y-3 font-mono text-[11px]">
                        <div className="space-y-1 text-zinc-300">
                          <p><span className="text-zinc-500">Merchant Payee ID:</span> <span className="text-zinc-100 font-bold select-all underline text-[#a855f7]">{upiId}</span></p>
                          <p><span className="text-zinc-500">Account:</span> <span className="text-zinc-100">Rangrez Fusion Band Ltd</span></p>
                          <p><span className="text-zinc-500">Secure Billing Value:</span> <span className="text-[#D4AF37] font-extrabold text-xs">₹{finalTotalAmount}</span></p>
                        </div>

                        {/* QR Image customization upload button for testing */}
                        <div className="pt-2 border-t border-white/5">
                          <label className="text-[9px] uppercase tracking-wider text-purple-400 font-bold block mb-1">Testing: Customize your personal QR</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            id="custom-qr-uploader"
                            onChange={handleQrUpload}
                            className="text-[9px] text-zinc-400 cursor-pointer file:cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-[#8A2BE2]/20 file:text-purple-300 hover:file:bg-[#8A2BE2]/30 w-full"
                          />
                          <span className="text-[8px] text-zinc-500 block mt-1 leading-normal">
                            Upload your personal Google Pay QR/PhonePe QR image to substitute the payment screen. Excellent for testing live UPI gateways.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-3 font-mono">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-zinc-300 uppercase tracking-wider font-bold">🎯 Enter 12-digit UPI UTR Transaction ID</label>
                        <span className="text-[9px] text-[#D4AF37] font-black">Mandatory *</span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 614092558231"
                        maxLength={20}
                        value={upiUtr}
                        onChange={(e) => setUpiUtr(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                        className="w-full bg-black/60 border border-[#8A2BE2]/40 focus:border-[#D4AF37] focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white tracking-widest font-mono text-center"
                      />
                      <p className="text-[9px] text-zinc-400 leading-normal font-sans">
                        Execute the UPI transfer using Google Pay/Paytm, scan, then enter the UTR / Ref reference string above to finalize authentication.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] text-zinc-400 font-mono uppercase">Mock Credit Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 focus:border-[#D4AF37] focus:outline-none rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-200"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-mono uppercase">CVV Code</label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 focus:border-[#D4AF37] focus:outline-none rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-200"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Warning Notice */}
              <div className="bg-amber-600/5 rounded-xl border border-amber-500/20 p-4 flex gap-3 items-start">
                <CreditCard className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="text-[10px] leading-relaxed text-zinc-300">
                  <span className="font-bold text-[#D4AF37] block mb-0.5">Sandbox Testing Protection Active</span>
                  Stripe, PayPal, and UPI QR verification simulations are secure. Real transfers require testing audit logs. Submitting creates a real reservation trace inside the database logs instantly.
                </div>
              </div>

              {/* Checkout Progress button state */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8A2BE2] hover:scale-102 transition-transform text-black uppercase tracking-wider font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    Completing secure {paymentGateway.toUpperCase()} payment handshakes...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-black fill-current" />
                    Verify &amp; Generate Interactive Ticket (₹{finalTotalAmount})
                  </>
                )}
              </button>

            </form>

            {/* Right Column: Dynamic Price Summary Calculator card */}
            <div className="col-span-12 md:col-span-5 space-y-6">
              <div className="bg-[#181524]/40 border border-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase font-mono mb-2">Order Price Details</h3>
                
                {/* Bookings rows summary detail */}
                <div className="space-y-2 text-xs text-zinc-300">
                  {quantities.vip > 0 && <div className="flex justify-between"><span>Couple Entry + 25% Food Coupon (x{quantities.vip})</span> <span>₹{quantities.vip * vipPrice}</span></div>}
                  {quantities.fanpit > 0 && <div className="flex justify-between"><span>Solo Entry + 20% Food Coupon (x{quantities.fanpit})</span> <span>₹{quantities.fanpit * pitPrice}</span></div>}
                  {quantities.general > 0 && <div className="flex justify-between"><span>Solo Entry (x{quantities.general})</span> <span>₹{quantities.general * genPrice}</span></div>}
                </div>

                <div className="w-full h-px bg-white/5 my-4" />

                {/* Promo Code Input panel */}
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-400 font-mono uppercase tracking-widest block font-bold">Promo Coupon discount</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Percent className="w-3.5 h-3.5 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. RANGREZ20/GOLDVIP"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={isCouponApplied}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs placeholder-zinc-400 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    {isCouponApplied ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCouponApplied(false);
                          setCouponDiscountPercent(0);
                          setCouponMessage({ text: '', isError: false });
                        }}
                        className="px-3.5 py-2 text-xs bg-red-950/40 text-red-400 rounded-lg font-mono border border-red-500/20"
                      >
                        Reset
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isCouponValidating || !couponCode}
                        className="px-4 py-2 text-xs bg-purple-900 hover:bg-purple-800 rounded-lg font-mono text-zinc-100 disabled:bg-zinc-850"
                      >
                        {isCouponValidating ? '...' : 'Apply'}
                      </button>
                    )}
                  </div>
                  {couponMessage.text && (
                    <span className={`block text-[10px] font-mono ${couponMessage.isError ? 'text-red-400' : 'text-green-400'}`}>
                      {couponMessage.text}
                    </span>
                  )}
                </div>

                <div className="w-full h-px bg-white/5 my-4" />

                {/* Billing details */}
                <div className="space-y-2 text-xs font-mono text-zinc-300">
                  <div className="flex justify-between"><span>Subtotal Order:</span> <span>₹{subtotalCost}</span></div>
                  <div className="flex justify-between"><span>Govt Tax Surcharges (18% GST):</span> <span>₹{taxCost}</span></div>
                  {isCouponApplied && (
                    <div className="flex justify-between text-green-400">
                      <span>Verification Discount:</span> <span>-₹{discountCost}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/5">
                    <span>Total Bill:</span> <span className="text-[#D4AF37]">₹{finalTotalAmount}</span>
                  </div>
                </div>

                <div className="bg-[#181524]/60 p-4 rounded-xl border border-white/5 text-[10px] space-y-1 text-zinc-300">
                  <span className="font-bold text-white block uppercase tracking-wider font-mono">Selected Seats:</span>
                  <div className="flex flex-wrap gap-1 text-zinc-200 font-mono mt-1">
                    {selectedSeats.map(s => (
                      <span key={s} className="bg-white/5 px-2 py-0.5 rounded border border-white/5 text-[9px]">{s}</span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          <div className="flex justify-between gap-4 mt-8 pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs uppercase flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Retap Seats
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS DIGIT TICKET DISPLAY */}
      {step === 4 && completedBooking && (
        <div className="space-y-8 animate-in zoom-in-95 duration-300 max-w-xl mx-auto text-center">
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center animate-bounce mb-3">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-3xl font-black text-[#D4AF37]">Sufi Rock spots secured!</h2>
            <p className="text-zinc-400 text-xs mt-1">
              Check confirmation inbox or manage booked passes inside your dashboard anytime.
            </p>
          </div>

          {/* Core premium visual ticket pass card */}
          <div 
            id="printable-ticket-slip"
            className="bg-[#181524] border-2 border-double border-[#D4AF37]/50 rounded-3xl p-6 relative overflow-hidden text-left shadow-2xl space-y-6"
          >
            
            {/* Background decorative vector circle */}
            <div className="absolute top-1/2 -right-16 w-48 h-48 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header portion */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Ticket className="text-[#D4AF37] w-5 h-5" />
                <span className="text-xs uppercase font-mono tracking-widest text-zinc-100 font-bold">RANGREZ CONCERT ADMISSION</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded">
                SIMULATED SECURE CARD
              </span>
            </div>

            {/* Details details */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono relative z-10">
              <div>
                <span className="block text-[9px] text-zinc-400 uppercase">Concert tour Date</span>
                <span className="text-white font-bold block mt-0.5">{selectedEvent.title}</span>
                <span className="text-purple-400 text-[10px] block mt-0.5">{selectedEvent.date} @ {selectedEvent.time} hrs</span>
              </div>
              
              <div>
                <span className="block text-[9px] text-zinc-400 uppercase">Venue Amphitheatre</span>
                <span className="text-white font-bold block mt-0.5">{selectedEvent.venue}</span>
                <span className="text-zinc-400 text-[10px] block mt-0.5">{selectedEvent.city}, India</span>
                {selectedEvent.venueAddress && (
                  <span className="text-zinc-500 text-[9px] block mt-1 leading-tight line-clamp-1">📍 {selectedEvent.venueAddress}</span>
                )}
                {selectedEvent.googleMapUrl && (
                  <a
                    href={selectedEvent.googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 text-[9px] hover:underline block mt-0.5"
                  >
                    🧭 View Navigation Map &rarr;
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono border-t border-white/5 pt-4 relative z-10">
              <div>
                <span className="block text-[9px] text-zinc-400 uppercase">Purchased Seats list</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSeats.map(s => (
                    <span key={s} className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[9px] font-bold text-zinc-100">{s}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="block text-[9px] text-zinc-400 uppercase">Authorized Passenger</span>
                <span className="text-white font-bold block mt-1">{cardHolder}</span>
                <span className="text-zinc-400 text-[10px] block font-mono">UID: {completedBooking.id}</span>
              </div>
            </div>

            {/* Simulated scan barcode layout & QR mock */}
            <div className="border-t-2 border-dashed border-white/10 pt-6 flex flex-col sm:flex-row gap-6 items-center justify-between relative z-10">
              <div className="text-xs text-zinc-400 space-y-1 w-full sm:w-auto">
                <span className="block text-[9px] uppercase font-mono">Payment total:</span>
                <span className="text-[#D4AF37] font-black text-xl font-mono">₹{finalTotalAmount}</span>
                <span className="block text-[8px] italic text-[#a1a1aa] font-mono">Includes 18% GST surcharges</span>
              </div>

              {/* Precise Vector Custom QR Code Renders */}
              <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-zinc-200">
                <div className="w-16 h-16 flex flex-wrap gap-0.5 bg-white select-none">
                  {/* Procedurally styled grid mapping custom QR lines */}
                  {Array.from({ length: 16 }).map((_, qi) => {
                    const blackFill = [0, 2, 3, 5, 8, 9, 10, 12, 15].includes(qi);
                    return (
                      <div key={qi} className={`w-3.5 h-3.5 ${blackFill ? 'bg-black' : 'bg-white'}`} />
                    );
                  })}
                </div>
                <div className="hidden sm:block text-[9px] font-mono text-zinc-800 leading-tight">
                  <span className="font-extrabold block text-black">RANGREZ SECURE</span>
                  <span>Scan at Entry line</span>
                  <span className="block text-zinc-400 text-[8px] mt-0.5">ID: {completedBooking.id}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleDownloadTicket}
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:scale-103 transition-transform text-black uppercase font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4 text-black" />
              Download PDF / Print Ticket
            </button>

            <button
              onClick={onCancelBookingFlow}
              className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs uppercase"
            >
              Back to Tours list
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
